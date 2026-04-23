/* eslint-disable @typescript-eslint/naming-convention */
import { env } from '@amber/environment'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { sendPaymentConfirmation } from './paymentConfirmation'
import type { UserPaymentDetails } from './types'

import { authenticatedCaller } from '../../ssr'

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

const readRequestBuffer = async (req: NextApiRequest) => {
  const chunks: Array<Buffer> = []

  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

const validateCharge = (charge: Stripe.Charge, paymentInfo: UserPaymentDetails[]) => {
  const { amount, amount_captured, currency, outcome, metadata } = charge
  const errors = []

  if (!metadata.userId) {
    errors.push('missing metadata.userId')
  }
  if (!metadata.year) {
    errors.push('missing metadata.year')
  }
  if (!metadata.payments) {
    errors.push('missing metadata.payments')
  }
  if (amount !== amount_captured) {
    errors.push(`amount !== amount_captured, ${amount} !== ${amount_captured}`)
  }
  if (currency !== 'usd') {
    errors.push(`unexpected currency, ${currency} !== usd`)
  }
  const total = 100 * paymentInfo.reduce((prev, curr) => prev + curr.total, 0)

  if (total !== amount) {
    errors.push(`amount !== calculated total, ${amount} !== ${total}`)
  }
  if (outcome?.network_status !== 'approved_by_network') {
    errors.push(`unexpected outcome.network_status, ${outcome?.network_status}`)
  }
  if (outcome?.seller_message !== 'Payment complete.') {
    errors.push(`unexpected outcome.seller_message, ${outcome?.seller_message}`)
  }

  return errors.length > 0 ? errors : null
}

const toTransaction = (
  charge: Stripe.Charge,
  targetUserId: number,
  itemAmount: number,
  notes: string,
  extra: Record<string, unknown>,
) => {
  const {
    id,
    amount_captured,
    currency,
    metadata: { userId, year },
    outcome,
    payment_intent,
  } = charge
  return {
    amount: itemAmount,
    data: {
      ...extra,
      amount_captured,
      chargeId: id,
      currency,
      outcome,
      payment_intent,
    },
    notes,
    origin: parseInt(userId!, 10),
    stripe: true,
    userId: targetUserId,
    year: parseInt(year!, 10),
  }
}

const createErrorPaymentTransactionRecord = async (charge: Stripe.Charge, error: string[]) => {
  const {
    amount,
    metadata: { userId },
  } = charge

  const transaction = toTransaction(charge, parseInt(userId!, 10), amount, 'Payment Received with Stripe Error', {
    amount_adjusted: Math.round(amount / 100),
    error,
  })
  return authenticatedCaller(userId).transactions.createTransaction(transaction)
}

const createPaymentTransactionRecord = async (charge: Stripe.Charge, payment: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, payment.userId, payment.total, 'Payment Received', {
    amount,
    type: 'user payment',
  })
  return authenticatedCaller(payment.userId).transactions.createTransaction(transaction)
}

const createDonationTransactionRecord = async (charge: Stripe.Charge, payment: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, payment.userId, 0 - payment.donation, 'Donation', {
    amount,
    type: 'donation payment',
  })
  return authenticatedCaller(payment.userId).transactions.createTransaction(transaction)
}

const handleSuccessfulCharge = async (charge: Stripe.Charge) => {
  const {
    amount,
    metadata: { userId, year, payments },
  } = charge

  const paymentInfo: UserPaymentDetails[] = JSON.parse(payments!)
  const error = validateCharge(charge, paymentInfo)

  await authenticatedCaller(userId).stripe.createStripe({ data: charge })

  if (error) {
    await createErrorPaymentTransactionRecord(charge, error)
    return undefined
  }

  const transactionPromises = paymentInfo.flatMap((payment) =>
    payment.donation > 0
      ? [createPaymentTransactionRecord(charge, payment), createDonationTransactionRecord(charge, payment)]
      : [createPaymentTransactionRecord(charge, payment)],
  )

  await Promise.allSettled(transactionPromises).then(async (results) => {
    const failureCount = results.filter((transactionResult) => transactionResult.status !== 'fulfilled').length
    if (failureCount) {
      console.warn('Creation of some transactions failed', results)
    }

    await sendPaymentConfirmation({
      amount,
      paymentInfo,
      userId: parseInt(userId!, 10),
      year: parseInt(year!, 10),
    })
  })

  return undefined
}

export const stripeWebhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const rawSignature = req.headers['stripe-signature']
  const signature = Array.isArray(rawSignature) ? rawSignature[0] : rawSignature

  if (!signature) {
    res.status(400).send('Webhook Error: Missing stripe-signature header')
    return
  }

  const buf = await readRequestBuffer(req)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, signature, env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (error instanceof Error) {
      console.log(error)
    }
    console.log(`❌ Error message: ${errorMessage}`)
    res.status(400).send(`Webhook Error: ${errorMessage}`)
    return
  }

  console.log('✅ Success:', event.id)

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`)
  } else if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge
    console.log(`💵 Charge id: ${charge.id}`)
    const error = await handleSuccessfulCharge(charge)
    if (error) {
      console.log(`❌ Error message: ${JSON.stringify(error)}`)
      res.status(400).send(`Webhook Error: ${JSON.stringify(error)}`)
      return
    }
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
}
