import type { GameAssignmentDashboardData } from '@amber/client'

export type CancellationImpactGame = {
  gameId: number
  gameName: string
  isAffectedByCancellation: boolean
  playerCount: number
  playerMax: number
  playerMin: number
  slotId: number | null
}

const compareGames = (left: CancellationImpactGame, right: CancellationImpactGame) => {
  const leftSlotId = left.slotId ?? Number.MAX_SAFE_INTEGER
  const rightSlotId = right.slotId ?? Number.MAX_SAFE_INTEGER
  return leftSlotId === rightSlotId ? left.gameName.localeCompare(right.gameName) : leftSlotId - rightSlotId
}

export const buildCancellationImpact = ({
  data,
  memberId,
}: {
  data: GameAssignmentDashboardData
  memberId: number | null
}) => {
  const playerCountsByGameId = new Map<number, number>()
  const affectedGameIdSet = new Set<number>()

  data.assignments.forEach((assignment) => {
    if (assignment.gm === 0 && assignment.memberId === memberId) {
      affectedGameIdSet.add(assignment.gameId)
    }
    if (assignment.gm !== 0 || assignment.memberId === memberId) return
    playerCountsByGameId.set(assignment.gameId, (playerCountsByGameId.get(assignment.gameId) ?? 0) + 1)
  })

  const games = data.games
    .filter((game) => game.category === 'user')
    .map<CancellationImpactGame>((game) => ({
      gameId: game.id,
      gameName: game.name,
      isAffectedByCancellation: affectedGameIdSet.has(game.id),
      playerCount: playerCountsByGameId.get(game.id) ?? 0,
      playerMax: game.playerMax,
      playerMin: game.playerMin,
      slotId: game.slotId,
    }))
    .sort(compareGames)

  return {
    belowMinimumGames: games.filter((game) => game.slotId !== null && game.playerCount < game.playerMin),
    atMinimumGames: games.filter((game) => game.playerCount === game.playerMin),
  }
}
