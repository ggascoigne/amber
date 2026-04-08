import { z } from 'zod'

export const gameRoomAccessibilityInput = z.enum(['accessible', 'some_stairs', 'many_stairs'])

export const getGameRoomAndGamesInput = z.object({
  year: z.number().optional(),
})

export const gameRoomDataInput = z.object({
  description: z.string(),
  size: z.number(),
  type: z.string(),
  enabled: z.boolean().optional(),
  updated: z.boolean().optional(),
  accessibility: gameRoomAccessibilityInput.optional(),
})

export const createGameRoomInput = gameRoomDataInput

export const updateGameRoomInput = z.object({
  id: z.number(),
  data: gameRoomDataInput.partial(),
})

export const deleteGameRoomInput = z.object({
  id: z.number(),
})

export type GameRoomAccessibility = z.infer<typeof gameRoomAccessibilityInput>
export type GetGameRoomAndGamesInput = z.infer<typeof getGameRoomAndGamesInput>
export type CreateGameRoomInput = z.infer<typeof createGameRoomInput>
export type UpdateGameRoomInput = z.infer<typeof updateGameRoomInput>
export type DeleteGameRoomInput = z.infer<typeof deleteGameRoomInput>
