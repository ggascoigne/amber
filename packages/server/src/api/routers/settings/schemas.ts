import { z } from 'zod'

export const settingDataInput = z.object({
  code: z.string(),
  type: z.string(),
  value: z.string(),
})

export const createSettingInput = settingDataInput

export const deleteSettingInput = z.object({
  id: z.number(),
})

export const updateSettingInput = settingDataInput.partial().extend({
  id: z.number(),
})

export type CreateSettingInput = z.infer<typeof createSettingInput>
export type DeleteSettingInput = z.infer<typeof deleteSettingInput>
export type UpdateSettingInput = z.infer<typeof updateSettingInput>
