import { z } from 'zod'

import {
  cancelPaymentIntent,
  createPaymentIntent,
  getStripeConfig,
  updatePaymentIntent,
} from '../services/payments/paymentIntents'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const paymentsRouter = createTRPCRouter({
  getConfig: publicProcedure.query(() => getStripeConfig()),

  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        metadata: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(({ input }) => createPaymentIntent(input.amount, input.metadata)),

  updatePaymentIntent: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        metadata: z.record(z.string(), z.any()).optional(),
        paymentIntentId: z.string().min(1),
      }),
    )
    .mutation(({ input }) => updatePaymentIntent(input.paymentIntentId, input.amount, input.metadata)),

  cancelPaymentIntent: protectedProcedure
    .input(
      z.object({
        paymentIntentId: z.string().min(1),
      }),
    )
    .mutation(({ input }) => cancelPaymentIntent(input.paymentIntentId)),
})
