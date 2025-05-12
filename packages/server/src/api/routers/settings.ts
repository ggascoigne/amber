import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.setting.findMany({
        select: {
          id: true,
          code: true,
          type: true,
          value: true,
        },
      }),
    ),
  ),

  createSetting: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        type: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      inRlsTransaction(ctx, async (tx) => {
        const setting = await tx.setting.create({
          data: {
            code: input.code,
            type: input.type,
            value: input.value,
          },
        })
        return { setting }
      })
    }),

  deleteSetting: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      inRlsTransaction(ctx, async (tx) => {
        const deletedSetting = await tx.setting.delete({
          where: { id: input.id },
        })
        return {
          deletedSettingId: deletedSetting.id,
        }
      })
    }),

  updateSetting: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        type: z.string().optional(),
        value: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      inRlsTransaction(ctx, async (tx) => {
        const updatedSetting = await tx.setting.update({
          where: { id: input.id },
          data: {
            code: input.code,
            type: input.type,
            value: input.value,
          },
        })
        return { setting: updatedSetting }
      })
    }),
})
