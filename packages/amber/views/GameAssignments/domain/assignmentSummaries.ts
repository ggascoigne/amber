import { isScheduledAssignment } from './assignmentScope'
import { formatGameName } from './labels'
import type {
  DashboardSubmission,
  AssignmentCounts,
  ChoicesByMemberSlot,
  DashboardAssignment,
  DashboardChoice,
  DashboardGame,
  DashboardMembership,
  GameAssignmentSummaryRow,
  GameInterestSummaryRow,
  MemberAssignmentCounts,
  MemberAssignmentSummaryRow,
  MemberChoiceSummaryRow,
} from './types'

export const buildEmptyMemberAssignmentCounts = (): MemberAssignmentCounts => ({
  gmOrFirst: 0,
  second: 0,
  third: 0,
  fourth: 0,
  other: 0,
})

export const buildAssignmentCountsByGameId = (
  games: Array<DashboardGame>,
  assignments: Array<DashboardAssignment>,
): Map<number, AssignmentCounts> => {
  const assignmentTotals = new Map<number, number>()
  const playerSeatTotals = new Map<number, number>()

  assignments.forEach((assignment) => {
    if (!isScheduledAssignment(assignment)) return

    assignmentTotals.set(assignment.gameId, (assignmentTotals.get(assignment.gameId) ?? 0) + 1)

    if (assignment.gm === 0) {
      playerSeatTotals.set(assignment.gameId, (playerSeatTotals.get(assignment.gameId) ?? 0) + 1)
    }
  })

  const counts = new Map<number, AssignmentCounts>()
  games.forEach((game) => {
    const assignedCount = assignmentTotals.get(game.id) ?? 0
    const seatedPlayers = playerSeatTotals.get(game.id) ?? 0
    const overrun = Math.max(0, seatedPlayers - game.playerMax)
    const shortfall = game.playerMin - seatedPlayers
    const spaces = Math.max(0, game.playerMax - seatedPlayers)

    counts.set(game.id, { assignedCount, overrun, shortfall, spaces })
  })

  return counts
}

export const buildAssignmentsByGameId = (assignments: Array<DashboardAssignment>) => {
  const assignmentsByGameId = new Map<number, Array<DashboardAssignment>>()

  assignments.forEach((assignment) => {
    const list = assignmentsByGameId.get(assignment.gameId) ?? []
    list.push(assignment)
    assignmentsByGameId.set(assignment.gameId, list)
  })

  return assignmentsByGameId
}

export const buildAssignmentsByMemberId = (assignments: Array<DashboardAssignment>) => {
  const assignmentsByMemberId = new Map<number, Array<DashboardAssignment>>()

  assignments.forEach((assignment) => {
    const list = assignmentsByMemberId.get(assignment.memberId) ?? []
    list.push(assignment)
    assignmentsByMemberId.set(assignment.memberId, list)
  })

  return assignmentsByMemberId
}

export const buildAssignedSlotCountsByMemberId = (assignments: Array<DashboardAssignment>) => {
  const slotIdsByMemberId = new Map<number, Set<number>>()

  assignments.forEach((assignment) => {
    if (!isScheduledAssignment(assignment)) return

    const slotId = assignment.game?.slotId
    if (!slotId || slotId <= 0) return

    const slotIds = slotIdsByMemberId.get(assignment.memberId) ?? new Set<number>()
    slotIds.add(slotId)
    slotIdsByMemberId.set(assignment.memberId, slotIds)
  })

  const countsByMemberId = new Map<number, number>()
  slotIdsByMemberId.forEach((slotIds, memberId) => {
    countsByMemberId.set(memberId, slotIds.size)
  })

  return countsByMemberId
}

export const buildChoicesByMemberSlot = (choices: Array<DashboardChoice>): ChoicesByMemberSlot => {
  const choicesByMemberSlot: ChoicesByMemberSlot = new Map()

  choices.forEach((choice) => {
    const memberMap = choicesByMemberSlot.get(choice.memberId) ?? new Map<number, Array<DashboardChoice>>()
    const slotChoices = memberMap.get(choice.slotId) ?? []
    slotChoices.push(choice)
    memberMap.set(choice.slotId, slotChoices)
    choicesByMemberSlot.set(choice.memberId, memberMap)
  })

  return choicesByMemberSlot
}

export const buildChoicesByMemberId = (choices: Array<DashboardChoice>) => {
  const choicesByMemberId = new Map<number, Array<DashboardChoice>>()

  choices.forEach((choice) => {
    const list = choicesByMemberId.get(choice.memberId) ?? []
    list.push(choice)
    choicesByMemberId.set(choice.memberId, list)
  })

  return choicesByMemberId
}

export const buildSubmissionsByMemberId = (submissions: Array<DashboardSubmission>) => {
  const submissionsByMemberId = new Map<number, DashboardSubmission>()

  submissions.forEach((submission) => {
    submissionsByMemberId.set(submission.memberId, submission)
  })

  return submissionsByMemberId
}

export const getChoiceForGame = (
  choicesByMemberSlot: ChoicesByMemberSlot,
  memberId: number | null,
  slotId: number,
  gameId: number | null,
) => {
  if (!memberId || !gameId) return null

  const slotChoices = choicesByMemberSlot.get(memberId)?.get(slotId) ?? []
  return slotChoices.find((choice) => choice.gameId === gameId) ?? null
}

export const getChoiceRankForGame = (
  choicesByMemberSlot: ChoicesByMemberSlot,
  memberId: number | null,
  slotId: number,
  gameId: number | null,
) => getChoiceForGame(choicesByMemberSlot, memberId, slotId, gameId)?.rank ?? null

export const buildMemberAssignmentCountsByMemberId = (
  assignments: Array<DashboardAssignment>,
  choicesByMemberSlot: ChoicesByMemberSlot,
) => {
  const countsByMemberId = new Map<number, MemberAssignmentCounts>()

  assignments.forEach((assignment) => {
    if (!isScheduledAssignment(assignment)) {
      return
    }

    const counts = countsByMemberId.get(assignment.memberId) ?? buildEmptyMemberAssignmentCounts()
    const rank = getChoiceRankForGame(
      choicesByMemberSlot,
      assignment.memberId,
      assignment.game?.slotId ?? 0,
      assignment.gameId,
    )

    if (rank === 0 || rank === 1) {
      counts.gmOrFirst += 1
    } else if (rank === 2) {
      counts.second += 1
    } else if (rank === 3) {
      counts.third += 1
    } else if (rank === 4) {
      counts.fourth += 1
    } else {
      counts.other += 1
    }

    countsByMemberId.set(assignment.memberId, counts)
  })

  return countsByMemberId
}

export const buildMemberChoiceSummaryRows = ({
  memberships,
  choicesByMemberId,
  submissionsByMemberId,
  assignedSlotCountsByMemberId,
  numberOfSlots,
}: {
  memberships: Array<DashboardMembership>
  choicesByMemberId: Map<number, Array<DashboardChoice>>
  submissionsByMemberId: Map<number, DashboardSubmission>
  assignedSlotCountsByMemberId: Map<number, number>
  numberOfSlots: number
}): Array<MemberChoiceSummaryRow> =>
  memberships
    .filter((membership) => membership.attending)
    .map((membership) => {
      const memberChoices = choicesByMemberId.get(membership.id) ?? []
      const slotIdsWithChoices = new Set(memberChoices.map((choice) => choice.slotId))
      const submission = submissionsByMemberId.get(membership.id)
      const hasSubmissionEntry = Boolean(submission)
      const hasNotes = Boolean(submission?.message?.trim())

      return {
        memberId: membership.id,
        memberName: `${membership.user.fullName ?? 'Unknown member'}${hasNotes ? ' *' : ''}`,
        assignments: assignedSlotCountsByMemberId.get(membership.id) ?? 0,
        requiresAttention: slotIdsWithChoices.size < numberOfSlots || !hasSubmissionEntry,
      }
    })

export const buildMemberAssignmentSummaryRows = ({
  memberships,
  submissionsByMemberId,
  assignedSlotCountsByMemberId,
  memberAssignmentCountsByMemberId,
  expectedAssignmentCount,
}: {
  memberships: Array<DashboardMembership>
  submissionsByMemberId: Map<number, DashboardSubmission>
  assignedSlotCountsByMemberId: Map<number, number>
  memberAssignmentCountsByMemberId: Map<number, MemberAssignmentCounts>
  expectedAssignmentCount: number
}): Array<MemberAssignmentSummaryRow> =>
  memberships
    .filter((membership) => membership.attending)
    .map((membership) => {
      const submission = submissionsByMemberId.get(membership.id)
      const hasNotes = Boolean(submission?.message?.trim())
      const assignmentCount = assignedSlotCountsByMemberId.get(membership.id) ?? 0

      return {
        memberId: membership.id,
        memberName: `${membership.user.fullName ?? 'Unknown member'}${hasNotes ? ' *' : ''}`,
        assignments: assignmentCount,
        requiresAttention: assignmentCount !== expectedAssignmentCount,
        counts: memberAssignmentCountsByMemberId.get(membership.id) ?? buildEmptyMemberAssignmentCounts(),
      }
    })

export const buildGameAssignmentSummaryRows = (
  games: Array<DashboardGame>,
  assignmentCountsByGameId: Map<number, AssignmentCounts>,
): Array<GameAssignmentSummaryRow> =>
  games.map((game) => {
    const counts = assignmentCountsByGameId.get(game.id)

    return {
      gameId: game.id,
      slotId: game.slotId ?? 0,
      name: formatGameName(game),
      playerMin: game.playerMin,
      playerMax: game.playerMax,
      assignedCount: counts?.assignedCount ?? 0,
      overrun: counts?.overrun ?? 0,
      shortfall: counts?.shortfall ?? game.playerMin,
      spaces: counts?.spaces ?? Math.max(0, game.playerMax),
    }
  })

export const buildGameInterestSummaryRows = ({
  games,
  assignmentCountsByGameId,
  interestCountsByGameId,
}: {
  games: Array<DashboardGame>
  assignmentCountsByGameId: Map<number, AssignmentCounts>
  interestCountsByGameId: Map<number, number>
}): Array<GameInterestSummaryRow> =>
  buildGameAssignmentSummaryRows(games, assignmentCountsByGameId).map((row) => ({
    ...row,
    overallInterest: interestCountsByGameId.get(row.gameId) ?? 0,
  }))
