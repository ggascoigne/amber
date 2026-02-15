import type { Game } from '@amber/client'

export type GameCategory = Game['category']
export type GameCategoryByGameId = Map<number, GameCategory>

export const isUserGameCategory = (category: GameCategory | null | undefined) => category === 'user'

export const isNoGameCategory = (category: GameCategory | null | undefined) => category === 'no_game'

export const isAnyGameCategory = (category: GameCategory | null | undefined) => category === 'any_game'

export const buildGameCategoryByGameId = (games: Array<Pick<Game, 'id' | 'category'>>): GameCategoryByGameId =>
  new Map(games.map((game) => [game.id, game.category]))

export const getGameCategoryByGameId = (
  gameCategoryByGameId: GameCategoryByGameId,
  gameId: number | null | undefined,
): GameCategory | null => {
  if (gameId === null || gameId === undefined) return null
  return gameCategoryByGameId.get(gameId) ?? null
}

export const isNoGameId = (gameCategoryByGameId: GameCategoryByGameId, gameId: number | null | undefined) =>
  isNoGameCategory(getGameCategoryByGameId(gameCategoryByGameId, gameId))

export const isAnyGameId = (gameCategoryByGameId: GameCategoryByGameId, gameId: number | null | undefined) =>
  isAnyGameCategory(getGameCategoryByGameId(gameCategoryByGameId, gameId))
