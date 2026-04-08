import { z } from 'zod'

export const getGameChoicesInput = z.object({
  year: z.number(),
  memberId: z.number(),
})

export const getGameChoicesByYearInput = z.object({
  year: z.number(),
})

export const readGameChoiceInput = z.object({
  id: z.number(),
})

export const createGameChoicesInput = z.object({
  memberId: z.number(),
  year: z.number(),
  noSlots: z.number(),
})

export const createGameSubmissionInput = z.object({
  memberId: z.number(),
  message: z.string(),
  year: z.number(),
})

export const updateGameSubmissionDataInput = z.object({
  memberId: z.number().optional(),
  message: z.string().optional(),
  year: z.number().optional(),
})

export const updateGameSubmissionInput = z.object({
  id: z.number(),
  data: updateGameSubmissionDataInput,
})

export const createGameChoiceInput = z.object({
  gameId: z.number().optional(),
  memberId: z.number(),
  rank: z.number(),
  returningPlayer: z.boolean(),
  slotId: z.number(),
  year: z.number(),
})

export const updateGameChoiceDataInput = z.object({
  gameId: z.number().nullable(),
  memberId: z.number(),
  rank: z.number(),
  returningPlayer: z.boolean(),
  slotId: z.number(),
  year: z.number(),
})

export const updateGameChoiceInput = z.object({
  id: z.number(),
  data: updateGameChoiceDataInput,
})

export const upsertGameChoiceBySlotInput = z.object({
  memberId: z.number(),
  year: z.number(),
  slotId: z.number(),
  rank: z.number(),
  gameId: z.number().nullable(),
  returningPlayer: z.boolean(),
})

export type GetGameChoicesInput = z.infer<typeof getGameChoicesInput>
export type GetGameChoicesByYearInput = z.infer<typeof getGameChoicesByYearInput>
export type ReadGameChoiceInput = z.infer<typeof readGameChoiceInput>
export type CreateGameChoicesInput = z.infer<typeof createGameChoicesInput>
export type CreateGameSubmissionInput = z.infer<typeof createGameSubmissionInput>
export type UpdateGameSubmissionInput = z.infer<typeof updateGameSubmissionInput>
export type CreateGameChoiceInput = z.infer<typeof createGameChoiceInput>
export type UpdateGameChoiceInput = z.infer<typeof updateGameChoiceInput>
export type UpsertGameChoiceBySlotInput = z.infer<typeof upsertGameChoiceBySlotInput>
