/* eslint-disable @typescript-eslint/naming-convention */
import { env } from '@amber/environment'
import { authenticatedCaller } from '@amber/server/src/api/ssr'
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { sendEmailConfirmation } from './sendEmailConfirmation'
import { UserPaymentDetails } from './types'

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

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
  extra: Record<string, any>,
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
    notes,
    origin: parseInt(userId!, 10),
    stripe: true,
    userId: targetUserId,
    year: parseInt(year!, 10),
    data: {
      ...extra,
      chargeId: id,
      amount_captured,
      currency,
      outcome,
      payment_intent,
    },
  }
}

const createErrorPaymentTransactionRecord = async (charge: Stripe.Charge, error: string[]) => {
  const {
    amount,
    metadata: { userId },
  } = charge

  const transaction = toTransaction(charge, parseInt(userId!, 10), amount, 'Payment Received with Stripe Error', {
    error,
    amount_adjusted: Math.round(amount / 100),
  })
  return authenticatedCaller(userId).transactions.createTransaction(transaction)
}

const createPaymentTransactionRecord = async (charge: Stripe.Charge, p: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, p.userId, p.total, 'Payment Received', { type: 'user payment', amount })
  return authenticatedCaller(p.userId).transactions.createTransaction(transaction)
}

const createDonationTransactionRecord = async (charge: Stripe.Charge, p: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, p.userId, 0 - p.donation, 'Donation', { type: 'donation payment', amount })
  return authenticatedCaller(p.userId).transactions.createTransaction(transaction)
}

const handleSuccess = async (charge: Stripe.Charge) => {
  const {
    amount,
    metadata: { userId, year, payments },
  } = charge

  const paymentInfo: UserPaymentDetails[] = JSON.parse(payments!)

  const error = validateCharge(charge, paymentInfo)

  await authenticatedCaller(userId).stripe.createStripe({ data: charge })

  if (error) {
    // something went wrong so just record the bare payment - this will need manual fixing based on some unexpected issue
    await createErrorPaymentTransactionRecord(charge, error)
  } else {
    const result = paymentInfo.flatMap((p) =>
      p.donation > 0
        ? [createPaymentTransactionRecord(charge, p), createDonationTransactionRecord(charge, p)]
        : [createPaymentTransactionRecord(charge, p)],
    )
    await Promise.allSettled(result).then(async (res) => {
      const failureCount = res.filter((r) => r.status !== 'fulfilled').length
      if (failureCount) {
        console.warn('Creation of some transactions failed', res)
      }
      await sendEmailConfirmation({
        userId: parseInt(userId!, 10),
        year: parseInt(year!, 10),
        amount,
        paymentInfo,
      })
    })
  }
  return undefined
}

export const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, env.STRIPE_WEBHOOK_SECRET!)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      // On error, log and return the error message.
      if (err instanceof Error) console.log(err)
      console.log(`❌ Error message: ${errorMessage}`)
      res.status(400).send(`Webhook Error: ${errorMessage}`)
      return
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id)

    // Cast event data to Stripe object.
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`)
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`)
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge
      console.log(`💵 Charge id: ${charge.id}`)
      const error = await handleSuccess(charge)
      if (error) {
        console.log(`❌ Error message: ${JSON.stringify(error)}`)
        res.status(400).send(`Webhook Error: ${JSON.stringify(error)}`)
        return
      }
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`)
    }
    // Return a response to acknowledge receipt of the event.
    res.json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
