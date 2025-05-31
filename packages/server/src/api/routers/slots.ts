import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const slotsRouter = createTRPCRouter({
  getSlots: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.slot.findMany({
        select: {
          id: true,
          slot: true,
          day: true,
          length: true,
          time: true,
        },
      }),
    ),
  ),
})
