import type { DashboardGame } from './types'

import { isAnyGameCategory, isNoGameCategory } from '../../../utils'
import { rankString } from '../../../utils/gameChoiceRank'
import { PlayerPreference } from '../../../utils/selectValues'

export const getPriorityLabel = (rank: number | null, returningPlayer = false) => {
  const label = rankString(rank) ?? 'Other'
  return returningPlayer ? `${label} *` : label
}

export const getPrioritySortValue = (rank: number | null, returningPlayer = false) => {
  if (rank === null || rank === undefined) return Number.POSITIVE_INFINITY
  return returningPlayer ? rank - 0.5 : rank
}

export const isReturningPlayersOnly = (game: DashboardGame | null | undefined) =>
  game?.playerPreference === PlayerPreference.RetOnly

export const formatGameName = (game: DashboardGame | null | undefined, fallbackLabel = 'Unknown game') => {
  if (!game) return fallbackLabel
  const label = game.name ?? fallbackLabel
  return isReturningPlayersOnly(game) ? `${label} *` : label
}

export const getGameLabel = (
  gameId: number | null | undefined,
  gameById: Map<number, DashboardGame>,
  fallbackLabel = 'Unknown game',
) => {
  if (gameId === null || gameId === undefined) return 'No Selection'

  const game = gameById.get(gameId)
  if (isNoGameCategory(game?.category)) return 'No Game'
  if (isAnyGameCategory(game?.category)) return 'Any Game'
  return formatGameName(game, fallbackLabel)
}
