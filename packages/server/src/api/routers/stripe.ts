import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const stripeRouter = createTRPCRouter({
  getStripe: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.stripe.findMany({
        select: {
          id: true,
          data: true,
        },
      }),
    ),
  ),

  createStripe: protectedProcedure
    .input(
      z.object({
        data: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        await tx.stripe.create({
          data: {
            data: input.data,
          },
        })
        return { clientMutationId: null }
      }),
    ),
})
