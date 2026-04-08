import { z } from 'zod'

export const getLookupValuesInput = z.object({
  realm: z.string(),
})

export const getSingleLookupValueInput = z.object({
  realm: z.string(),
  code: z.string(),
})

export const createLookupInput = z.object({
  realm: z.string(),
})

export const updateLookupInput = z.object({
  id: z.number(),
  realm: z.string().optional(),
})

export const deleteLookupInput = z.object({
  id: z.number(),
})

export const createLookupValueInput = z.object({
  lookupId: z.number(),
  code: z.string(),
  sequencer: z.number(),
  value: z.string(),
})

export const updateLookupValueInput = z.object({
  id: z.number(),
  code: z.string().optional(),
  sequencer: z.number().optional(),
  value: z.string().optional(),
})

export const deleteLookupValueInput = z.object({
  id: z.number(),
})

export type GetLookupValuesInput = z.infer<typeof getLookupValuesInput>
export type GetSingleLookupValueInput = z.infer<typeof getSingleLookupValueInput>
export type CreateLookupInput = z.infer<typeof createLookupInput>
export type UpdateLookupInput = z.infer<typeof updateLookupInput>
export type DeleteLookupInput = z.infer<typeof deleteLookupInput>
export type CreateLookupValueInput = z.infer<typeof createLookupValueInput>
export type UpdateLookupValueInput = z.infer<typeof updateLookupValueInput>
export type DeleteLookupValueInput = z.infer<typeof deleteLookupValueInput>
