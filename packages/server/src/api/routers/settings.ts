import { createTRPCRouter, publicProcedure } from '../trpc'

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) =>
    ctx.db.setting.findMany({
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
      },
    }),
  ),
})
