import type { DashboardAssignment, DashboardGame, SlotAssignmentScope } from './types'

import { isAnyGameCategory, isUserGameCategory } from '../../../utils'

export const hasValidSlotId = (game: DashboardGame) => (game.slotId ?? 0) > 0

export const filterGamesWithSlots = (games: Array<DashboardGame>) => games.filter(hasValidSlotId)

export const filterGamesWithSlotsOrAny = (games: Array<DashboardGame>) =>
  games.filter((game) => hasValidSlotId(game) || isAnyGameCategory(game.category))

export const isScheduledAssignment = (assignment: DashboardAssignment) => assignment.gm >= 0

export const buildSlotAssignmentScope = ({
  games,
  assignments,
  slotFilterId,
  includeAnyGame = false,
  userGamesOnly = false,
}: {
  games: Array<DashboardGame>
  assignments: Array<DashboardAssignment>
  slotFilterId: number | null
  includeAnyGame?: boolean
  userGamesOnly?: boolean
}): SlotAssignmentScope => {
  const filteredSlotGames = games.filter((game) => {
    const anyGame = isAnyGameCategory(game.category)
    const validSlotGame = hasValidSlotId(game)

    if (userGamesOnly) {
      if (!validSlotGame || !isUserGameCategory(game.category)) {
        return false
      }
    } else if (!validSlotGame && !(includeAnyGame && anyGame)) {
      return false
    }

    if (slotFilterId === null) {
      return true
    }

    return game.slotId === slotFilterId || (includeAnyGame && anyGame)
  })

  const slotGameIdSet = new Set(filteredSlotGames.map((game) => game.id))
  const scheduledAssignments = assignments.filter(
    (assignment) => isScheduledAssignment(assignment) && slotGameIdSet.has(assignment.gameId),
  )

  return {
    filteredSlotGames,
    slotGameIdSet,
    scheduledAssignments,
  }
}
