import { z } from 'zod'

export const getGamesBySlotInput = z.object({
  year: z.number(),
  slotId: z.number(),
})

export const getGamesByYearInput = z.object({
  year: z.number(),
})

export const ensureSpecialGamesForYearInput = getGamesByYearInput

export const getGamesByAuthorInput = z.object({
  id: z.number(),
})

export const getGamesByYearAndAuthorInput = z.object({
  year: z.number(),
  id: z.number(),
})

export const getGameByIdInput = z.object({
  id: z.number(),
})

export const gameDataInput = z.object({
  charInstructions: z.string(),
  description: z.string(),
  estimatedLength: z.string(),
  full: z.boolean().optional(),
  gameContactEmail: z.string(),
  genre: z.string(),
  gmNames: z.string().nullable().optional(),
  lateFinish: z.boolean().nullable().optional(),
  lateStart: z.string().nullable().optional(),
  message: z.string(),
  name: z.string(),
  playerMax: z.number(),
  playerMin: z.number(),
  playerPreference: z.string(),
  playersContactGm: z.boolean(),
  returningPlayers: z.string(),
  roomId: z.number().nullable().optional(),
  setting: z.string(),
  shortName: z.string().nullable().optional(),
  slotConflicts: z.string(),
  slotId: z.number().nullable().optional(),
  slotPreference: z.number(),
  teenFriendly: z.boolean(),
  type: z.string(),
  year: z.number(),
  authorId: z.number().nullable().optional(),
})

export const createGameInput = gameDataInput

export const updateGameInput = z.object({
  id: z.number(),
  data: gameDataInput.partial(),
})

export const deleteGameInput = z.object({
  id: z.number(),
})

export type GetGamesBySlotInput = z.infer<typeof getGamesBySlotInput>
export type GetGamesByYearInput = z.infer<typeof getGamesByYearInput>
export type EnsureSpecialGamesForYearInput = z.infer<typeof ensureSpecialGamesForYearInput>
export type GetGamesByAuthorInput = z.infer<typeof getGamesByAuthorInput>
export type GetGamesByYearAndAuthorInput = z.infer<typeof getGamesByYearAndAuthorInput>
export type GetGameByIdInput = z.infer<typeof getGameByIdInput>
export type CreateGameInput = z.infer<typeof createGameInput>
export type UpdateGameInput = z.infer<typeof updateGameInput>
export type DeleteGameInput = z.infer<typeof deleteGameInput>
