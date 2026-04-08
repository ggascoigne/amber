type AssignmentSummaryGame = {
  category: string
  id: number
  name: string
  playerMax: number
  playerMin: number
  slotId: number | null
}

type AssignmentSummaryMembership = {
  id: number
  user: {
    fullName: string | null
  }
}

type AssignmentSummaryAssignment = {
  game: AssignmentSummaryGame
  gameId: number
  gm: number
  memberId: number
  membership: {
    user: {
      fullName: string | null
    }
  }
}

type ScheduledCounts = {
  gmCount: number
  playerCount: number
}

type MissingAssignmentSummary = {
  memberId: number
  memberName: string
  missingSlots: Array<number>
}

type AnyGameAssignmentSummary = {
  assignmentRole: 'GM' | 'Player'
  gameName: string
  memberId: number
  memberName: string
}

type NoGameRoleMismatchSummary = {
  gameId: number
  gameName: string
  gmCount: number
  playerCount: number
  slotId: number
}

type CapacityIssueSummary = {
  gameId: number
  gameName: string
  playerCount: number
  playerMax: number
  playerMin: number
  slotId: number | null
}

type GameAssignmentSummary = {
  anyGameAssignments: Array<AnyGameAssignmentSummary>
  belowMinimumGames: Array<CapacityIssueSummary>
  missingAssignments: Array<MissingAssignmentSummary>
  noGameRoleMismatches: Array<NoGameRoleMismatchSummary>
  overCapGames: Array<CapacityIssueSummary>
}

const unknownMemberName = 'Unknown member'

const getMemberName = (fullName: string | null) => fullName ?? unknownMemberName

const compareCapacityIssues = (left: CapacityIssueSummary, right: CapacityIssueSummary) => {
  const leftSlotId = left.slotId ?? Number.MAX_SAFE_INTEGER
  const rightSlotId = right.slotId ?? Number.MAX_SAFE_INTEGER

  if (leftSlotId !== rightSlotId) {
    return leftSlotId - rightSlotId
  }

  return left.gameName.localeCompare(right.gameName)
}

const buildAssignedSlotIdsByMemberId = (assignments: Array<AssignmentSummaryAssignment>) => {
  const assignedSlotIdsByMemberId = new Map<number, Set<number>>()

  assignments.forEach((assignment) => {
    const slotId = assignment.game.slotId ?? 0
    if (slotId <= 0) {
      return
    }

    const assignedSlotIds = assignedSlotIdsByMemberId.get(assignment.memberId) ?? new Set<number>()
    assignedSlotIds.add(slotId)
    assignedSlotIdsByMemberId.set(assignment.memberId, assignedSlotIds)
  })

  return assignedSlotIdsByMemberId
}

const buildScheduledCountsByGameId = (assignments: Array<AssignmentSummaryAssignment>) => {
  const scheduledCountsByGameId = new Map<number, ScheduledCounts>()

  assignments.forEach((assignment) => {
    const scheduledCounts = scheduledCountsByGameId.get(assignment.gameId) ?? { gmCount: 0, playerCount: 0 }

    if (assignment.gm === 0) {
      scheduledCounts.playerCount += 1
    } else {
      scheduledCounts.gmCount += 1
    }

    scheduledCountsByGameId.set(assignment.gameId, scheduledCounts)
  })

  return scheduledCountsByGameId
}

const buildCapacityIssues = ({
  games,
  predicate,
  scheduledCountsByGameId,
}: {
  games: Array<AssignmentSummaryGame>
  predicate: (capacityIssue: CapacityIssueSummary) => boolean
  scheduledCountsByGameId: Map<number, ScheduledCounts>
}) =>
  games
    .filter((game) => game.category === 'user')
    .map((game) => {
      const scheduledCounts = scheduledCountsByGameId.get(game.id) ?? { gmCount: 0, playerCount: 0 }

      return {
        gameId: game.id,
        gameName: game.name,
        playerCount: scheduledCounts.playerCount,
        playerMax: game.playerMax,
        playerMin: game.playerMin,
        slotId: game.slotId,
      }
    })
    .filter(predicate)
    .sort(compareCapacityIssues)

export const buildGameAssignmentSummary = ({
  assignments,
  games,
  memberships,
  slots,
}: {
  assignments: Array<AssignmentSummaryAssignment>
  games: Array<AssignmentSummaryGame>
  memberships: Array<AssignmentSummaryMembership>
  slots: Array<{ id: number }>
}): GameAssignmentSummary => {
  const slotIds = slots.map((slot) => slot.id)
  const assignedSlotIdsByMemberId = buildAssignedSlotIdsByMemberId(assignments)
  const scheduledCountsByGameId = buildScheduledCountsByGameId(assignments)

  const missingAssignments = memberships
    .map((membership) => {
      const assignedSlotIds = assignedSlotIdsByMemberId.get(membership.id) ?? new Set<number>()
      const missingSlots = slotIds.filter((slotId) => !assignedSlotIds.has(slotId))

      return {
        memberId: membership.id,
        memberName: getMemberName(membership.user.fullName),
        missingSlots,
      }
    })
    .filter((entry) => entry.missingSlots.length > 0)

  const anyGameAssignments = assignments
    .filter((assignment) => assignment.game.category === 'any_game')
    .map<AnyGameAssignmentSummary>((assignment) => ({
      assignmentRole: assignment.gm === 0 ? 'Player' : 'GM',
      gameName: assignment.game.name,
      memberId: assignment.memberId,
      memberName: getMemberName(assignment.membership.user.fullName),
    }))
    .sort((left, right) => left.memberName.localeCompare(right.memberName))

  const noGameRoleMismatches = games
    .filter(
      (game) => game.category === 'no_game' && (game.slotId ?? 0) > 0 && game.name.trim().toLowerCase() !== 'no game',
    )
    .map((game) => {
      const scheduledCounts = scheduledCountsByGameId.get(game.id) ?? { gmCount: 0, playerCount: 0 }

      return {
        gameId: game.id,
        gameName: game.name,
        gmCount: scheduledCounts.gmCount,
        playerCount: scheduledCounts.playerCount,
        slotId: game.slotId as number,
      }
    })
    .filter((entry) => (entry.gmCount === 0 && entry.playerCount > 0) || (entry.gmCount > 0 && entry.playerCount === 0))
    .sort((left, right) => left.slotId - right.slotId)

  const belowMinimumGames = buildCapacityIssues({
    games,
    predicate: (entry) => entry.playerCount < entry.playerMin,
    scheduledCountsByGameId,
  })

  const overCapGames = buildCapacityIssues({
    games,
    predicate: (entry) => entry.playerCount > entry.playerMax,
    scheduledCountsByGameId,
  })

  return {
    anyGameAssignments,
    belowMinimumGames,
    missingAssignments,
    noGameRoleMismatches,
    overCapGames,
  }
}
