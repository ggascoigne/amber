import { env } from '@amber/environment'
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

import type { PaymentIntentRecord } from './types'

const CURRENCY = 'usd'
const MIN_AMOUNT = 10.0
const MAX_AMOUNT = 1000.0
const cancelableStatuses: Array<Stripe.PaymentIntent.Status> = [
  'requires_action',
  'requires_capture',
  'requires_confirmation',
  'requires_payment_method',
]

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const formatAmountForStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}

const normalizeMetadata = (metadata: Record<string, unknown> | undefined) =>
  metadata
    ? Object.fromEntries(
        Object.entries(metadata)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [
            key,
            typeof value === 'string'
              ? value
              : typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint'
                ? String(value)
                : JSON.stringify(value),
          ]),
      )
    : undefined

const toPaymentIntentRecord = (paymentIntent: Stripe.PaymentIntent): PaymentIntentRecord => ({
  amount: paymentIntent.amount,
  clientSecret: paymentIntent.client_secret,
  currency: paymentIntent.currency,
  id: paymentIntent.id,
  status: paymentIntent.status,
})

const validateAmount = (amount: number) => {
  if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid amount.' })
  }
}

const mapStripeError = (error: unknown, fallbackMessage: string) => {
  const code = typeof error === 'object' && error && 'code' in error ? error.code : undefined
  const message = error instanceof Error ? error.message : fallbackMessage

  if (code === 'resource_missing') {
    return new TRPCError({ code: 'NOT_FOUND', message })
  }

  return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message })
}

export const getStripeConfig = () => ({
  baseUrl: env.APP_BASE_URL ?? (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : ''),
  publishableKey: env.STRIPE_PUBLISHABLE_KEY ?? '',
})

export const createPaymentIntent = async (amount: number, metadata?: Record<string, unknown>) => {
  validateAmount(amount)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, CURRENCY),
      automatic_payment_methods: {
        enabled: true,
      },
      currency: CURRENCY,
      description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
      metadata: normalizeMetadata(metadata),
    })

    return toPaymentIntentRecord(paymentIntent)
  } catch (error) {
    throw mapStripeError(error, 'Internal server error')
  }
}

export const updatePaymentIntent = async (
  paymentIntentId: string,
  amount: number,
  metadata?: Record<string, unknown>,
) => {
  validateAmount(amount)

  try {
    await stripe.paymentIntents.retrieve(paymentIntentId)
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
      amount: formatAmountForStripe(amount, CURRENCY),
      metadata: normalizeMetadata(metadata),
    })

    return toPaymentIntentRecord(paymentIntent)
  } catch (error) {
    throw mapStripeError(error, 'Internal server error')
  }
}

export const cancelPaymentIntent = async (paymentIntentId: string) => {
  try {
    const currentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!cancelableStatuses.includes(currentIntent.status)) {
      return {
        cancelled: false,
        reason: `cannot cancel, status is ${currentIntent.status}`,
      }
    }

    await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'abandoned',
    })

    return {
      cancelled: true,
      reason: null,
    }
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'resource_missing') {
      return {
        cancelled: false,
        reason: 'payment intent not found',
      }
    }

    throw mapStripeError(error, 'Internal server error')
  }
}
