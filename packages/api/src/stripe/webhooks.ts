/* eslint-disable @typescript-eslint/naming-convention */
import {
  CreateTransactionMutation,
  CreateTransactionDocument,
  CreateTransactionMutationVariables,
  CreateStripeMutation,
  CreateStripeMutationVariables,
  CreateStripeDocument,
} from '@amber/client'
import { QueryRunner, makeQueryRunner } from 'database/shared/postgraphileQueryRunner'
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { sendEmailConfirmation } from './sendEmailConfirmation'
import { UserPaymentDetails } from './types'

import { stripeSecretKey, stripeWebhookSecret } from '../constants'

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-04-10',
})

const validateCharge = (charge: Stripe.Charge, paymentInfo: UserPaymentDetails[]) => {
  const { amount, amount_captured, currency, outcome } = charge
  const errors = []

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

const createErrorPaymentTransactionRecord = async (query: QueryRunner, charge: Stripe.Charge, error: string[]) => {
  const {
    amount,
    metadata: { userId },
  } = charge

  const transaction = toTransaction(charge, parseInt(userId!, 10), amount, 'Payment Received with Stripe Error', {
    error,
    amount_adjusted: Math.round(amount / 100),
  })
  return query<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, {
    input: {
      transaction,
    },
  })
}

const createPaymentTransactionRecord = async (query: QueryRunner, charge: Stripe.Charge, p: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, p.userId, p.total, 'Payment Received', { type: 'user payment', amount })
  return query<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, {
    input: {
      transaction,
    },
  })
}

const createDonationTransactionRecord = async (query: QueryRunner, charge: Stripe.Charge, p: UserPaymentDetails) => {
  const { amount } = charge
  const transaction = toTransaction(charge, p.userId, 0 - p.donation, 'Donation', { type: 'donation payment', amount })
  return query<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, {
    input: {
      transaction,
    },
  })
}

const handleSuccess = async (charge: Stripe.Charge) => {
  const {
    amount,
    metadata: { userId, year, payments },
  } = charge

  const paymentInfo: UserPaymentDetails[] = JSON.parse(payments!)

  const { query, release } = await makeQueryRunner()

  const error = validateCharge(charge, paymentInfo)

  await query<CreateStripeMutation, CreateStripeMutationVariables>(CreateStripeDocument, {
    input: {
      stripe: { data: charge },
    },
  })

  if (error) {
    // something went wrong so just record the bare payment - this will need manual fixing based on some unexpected issue
    await createErrorPaymentTransactionRecord(query, charge, error)
  } else {
    const result = paymentInfo.flatMap((p) =>
      p.donation > 0
        ? [createPaymentTransactionRecord(query, charge, p), createDonationTransactionRecord(query, charge, p)]
        : [createPaymentTransactionRecord(query, charge, p)],
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
  release()
  return undefined
}

export const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, stripeWebhookSecret!)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err)
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
