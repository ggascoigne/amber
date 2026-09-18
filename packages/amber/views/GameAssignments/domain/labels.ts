import type { DashboardGame } from './types'

import { isAnyGameCategory, isNoGameCategory } from '../../../utils/gameCategory'
import { rankString } from '../../../utils/gameChoiceRank'
import { PlayerPreference } from '../../../utils/selectValues'

type GameLabelGame = Pick<DashboardGame, 'name' | 'slotId' | 'category'> &
  Partial<Pick<DashboardGame, 'playerPreference'>>

export const getPriorityLabel = (rank: number | null, returningPlayer = false) => {
  const label = rankString(rank) ?? 'Other'
  return returningPlayer ? `${label} *` : label
}

export const getPrioritySortValue = (rank: number | null, returningPlayer = false) => {
  if (rank === null || rank === undefined) return Number.POSITIVE_INFINITY
  return returningPlayer ? rank - 0.5 : rank
}

export const isReturningPlayersOnly = (game: GameLabelGame | null | undefined) =>
  game?.playerPreference === PlayerPreference.RetOnly

export const formatGameName = (game: GameLabelGame | null | undefined, fallbackLabel = 'Unknown game') => {
  if (!game) return fallbackLabel
  const label = game.name ?? fallbackLabel
  return isReturningPlayersOnly(game) ? `${label} *` : label
}

export const getGameLabel = (
  gameId: number | null | undefined,
  gameById: Map<number, DashboardGame>,
  fallbackLabel = 'Unknown game',
  choiceGame?: GameLabelGame | null,
) => {
  if (gameId === null || gameId === undefined) return 'No Selection'

  const game = gameById.get(gameId) ?? choiceGame
  if (isNoGameCategory(game?.category)) return 'No Game'
  if (isAnyGameCategory(game?.category)) return 'Any Game'
  const gameName = formatGameName(game, fallbackLabel)
  return (game?.slotId ?? 0) <= 0 ? `${gameName} (cancelled)` : gameName
}
