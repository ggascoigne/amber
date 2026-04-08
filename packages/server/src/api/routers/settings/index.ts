import { createSettingRecord, deleteSettingRecord, updateSettingRecord } from './mutations'
import { getSettings } from './queries'
import { createSettingInput, deleteSettingInput, updateSettingInput } from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const settingsRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getSettings({ tx }))),

  createSetting: protectedProcedure.input(createSettingInput).mutation(async ({ input, ctx }) => {
    inRlsTransaction(ctx, async (tx) => createSettingRecord({ tx, input }))
  }),

  deleteSetting: protectedProcedure.input(deleteSettingInput).mutation(async ({ input, ctx }) => {
    inRlsTransaction(ctx, async (tx) => deleteSettingRecord({ tx, input }))
  }),

  updateSetting: protectedProcedure.input(updateSettingInput).mutation(async ({ input, ctx }) => {
    inRlsTransaction(ctx, async (tx) => updateSettingRecord({ tx, input }))
  }),
})
