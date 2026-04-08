import { z } from 'zod'

export const createStripeInput = z.object({
  data: z.any(),
})

export type CreateStripeInput = z.infer<typeof createStripeInput>
