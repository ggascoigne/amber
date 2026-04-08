import { z } from 'zod'

export const paymentIntentMetadataInput = z.record(z.string(), z.unknown())

export const paymentIntentDataInput = z.object({
  amount: z.number(),
  metadata: paymentIntentMetadataInput.optional(),
})

export const createPaymentIntentInput = paymentIntentDataInput

export const updatePaymentIntentInput = paymentIntentDataInput.extend({
  paymentIntentId: z.string().min(1),
})

export const cancelPaymentIntentInput = z.object({
  paymentIntentId: z.string().min(1),
})

export type PaymentIntentMetadataInput = z.infer<typeof paymentIntentMetadataInput>
export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentInput>
export type UpdatePaymentIntentInput = z.infer<typeof updatePaymentIntentInput>
export type CancelPaymentIntentInput = z.infer<typeof cancelPaymentIntentInput>
