/* eslint-disable @typescript-eslint/naming-convention */
// based in large part on https://github.com/vercel/next.js/blob/canary/examples/with-stripe-typescript/pages/api/payment_intents/index.ts

import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from './constants'

import { stripeSecretKey } from '../constants'
import { formatAmountForStripe } from '../utils'

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-04-10',
})

type OrderInfoCreate = {
  action: 'create'
  amount: number // Amount in USD
  metadata: any
}

type OrderInfoUpdate = {
  action: 'update'
  payment_intent_id: string
  amount: number // Amount in USD
  metadata: any
}

type OrderInfoCancel = {
  action: 'cancel'
  payment_intent_id: string
  metadata: any
}

const validateAmount = (amount: number, res: NextApiResponse) => {
  if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
    res.status(500).json({ statusCode: 400, message: 'Invalid amount.' })
    return false
  }
  return true
}

export const paymentIntentHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const { action } = req.body
  switch (action) {
    case 'create': {
      const { amount, metadata }: OrderInfoCreate = req.body

      if (!validateAmount(amount, res)) return
      try {
        // Create PaymentIntent from body params.
        const params: Stripe.PaymentIntentCreateParams = {
          amount: formatAmountForStripe(amount, CURRENCY),
          currency: CURRENCY,
          description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata,
        }
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params)

        res.status(200).json(paymentIntent)
      } catch (err) {
        console.log('paymentIntent:', err)
        const errorMessage = err instanceof Error ? err.message : 'Internal server error'
        res.status(500).json({ statusCode: 500, message: errorMessage })
      }
      break
    }
    case 'update': {
      const { amount, payment_intent_id, metadata }: OrderInfoUpdate = req.body

      if (!validateAmount(amount, res)) return
      try {
        const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
        // If PaymentIntent has been created, just update the amount.
        if (currentIntent) {
          const updatedIntent = await stripe.paymentIntents.update(payment_intent_id, {
            amount: formatAmountForStripe(amount, CURRENCY),
            metadata,
          })
          res.status(200).json(updatedIntent)
        }
      } catch (e) {
        if ((e as any).code !== 'resource_missing') {
          const errorMessage = e instanceof Error ? e.message : 'Internal server error'
          res.status(500).json({ statusCode: 500, message: errorMessage })
        }
      }
      break
    }
    case 'cancel': {
      const { payment_intent_id }: OrderInfoCancel = req.body
      try {
        const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
        if (currentIntent) {
          const cancelableStatuses = [
            'requires_action',
            'requires_capture',
            'requires_confirmation',
            'requires_payment_method',
          ]
          let result
          if (cancelableStatuses.includes(currentIntent.status)) {
            result = await stripe.paymentIntents.cancel(payment_intent_id, {
              cancellation_reason: 'abandoned',
            })
          }
          res.status(200).json(result ?? { reason: `cannot cancel, status is ${currentIntent.status}` })
        }
      } catch (e) {
        if ((e as any).code !== 'resource_missing') {
          const errorMessage = e instanceof Error ? e.message : 'Internal server error'
          res.status(500).json({ statusCode: 500, message: errorMessage })
        }
      }
      break
    }
    default:
      break
  }
}
