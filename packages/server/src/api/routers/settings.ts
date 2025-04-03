import { Prisma } from '@prisma/client'
import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

type TransactionClient = Prisma.TransactionClient

export const getSettingsInternal = async (db: TransactionClient) =>
  db.setting.findMany({
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
    },
  })

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getSettingsInternal(tx))),

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
          clientMutationId: input.id,
          deletedSettingNodeId: deletedSetting.id,
        }
      })
    }),

  updateSettingById: protectedProcedure
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
