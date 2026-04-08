import { cancelPaymentIntentInput, createPaymentIntentInput, updatePaymentIntentInput } from './schemas'

import {
  cancelPaymentIntent,
  createPaymentIntent,
  getStripeConfig,
  updatePaymentIntent,
} from '../../services/payments/paymentIntents'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc'

export const paymentsRouter = createTRPCRouter({
  getConfig: publicProcedure.query(() => getStripeConfig()),

  createPaymentIntent: protectedProcedure
    .input(createPaymentIntentInput)
    .mutation(({ input }) => createPaymentIntent(input.amount, input.metadata)),

  updatePaymentIntent: protectedProcedure
    .input(updatePaymentIntentInput)
    .mutation(({ input }) => updatePaymentIntent(input.paymentIntentId, input.amount, input.metadata)),

  cancelPaymentIntent: protectedProcedure
    .input(cancelPaymentIntentInput)
    .mutation(({ input }) => cancelPaymentIntent(input.paymentIntentId)),
})
