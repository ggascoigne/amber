import type { GameAssignmentDashboardData } from '@amber/client'

import type { Configuration } from '../../utils'
import { isAnyGameCategory, isNoGameCategory, isUserGameCategory } from '../../utils'
import { PlayerPreference } from '../../utils/selectValues'
import { orderChoices, rankString } from '../GameSignup/GameChoiceSelector'

export type DashboardAssignment = GameAssignmentDashboardData['assignments'][number]
export type DashboardChoice = GameAssignmentDashboardData['choices'][number]
export type DashboardGame = GameAssignmentDashboardData['games'][number]
export type DashboardMembership = GameAssignmentDashboardData['memberships'][number]
export type DashboardSubmission = GameAssignmentDashboardData['submissions'][number]

export type AssignmentCounts = {
  assignedCount: number
  overrun: number
  shortfall: number
  spaces: number
}

export type GameAssignmentSummaryRow = {
  gameId: number
  slotId: number
  name: string
  playerMin: number
  playerMax: number
  assignedCount: number
  overrun: number
  shortfall: number
  spaces: number
}

export type MemberAssignmentSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
  counts: {
    gmOrFirst: number
    second: number
    third: number
    fourth: number
    other: number
  }
}

export type MoveOption = {
  gameId: number
  name: string
  priorityLabel: string
  overrunLabel: string
  shortfallLabel: string
  spacesLabel: string
  spaces: number
}

export type MemberChoiceRow = {
  rowId: string
  memberId: number
  slotId: number
  slotLabel: string
  rank: number
  rankLabel: string
  gameId: number | null
  returningPlayer: boolean
}

export type ChoicesByMemberSlot = Map<number, Map<number, Array<DashboardChoice>>>

export const hasValidSlotId = (game: DashboardGame) => (game.slotId ?? 0) > 0

export const filterGamesWithSlots = (games: Array<DashboardGame>) => games.filter(hasValidSlotId)

const buildAssignmentKey = (assignment: { memberId: number; gameId: number; gm: number; year: number }) =>
  `${assignment.memberId}-${assignment.gameId}-${assignment.gm}-${assignment.year}`

export const isScheduledAssignment = (assignment: DashboardAssignment) => assignment.gm >= 0

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

export const buildMoveOptions = ({
  games,
  assignmentCountsByGameId,
  choicesByMemberSlot,
  memberId,
  slotId,
}: {
  games: Array<DashboardGame>
  assignmentCountsByGameId: Map<number, AssignmentCounts>
  choicesByMemberSlot: ChoicesByMemberSlot
  memberId: number | null
  slotId: number
}): Array<MoveOption> => {
  const slotGames = games.filter(
    (game) =>
      hasValidSlotId(game) &&
      game.slotId === slotId &&
      (isUserGameCategory(game.category) || isNoGameCategory(game.category)),
  )

  const options = slotGames.map((game) => {
    const choice = getChoiceForGame(choicesByMemberSlot, memberId, slotId, game.id)
    const rank = choice?.rank ?? null
    const returningPlayer = choice?.returningPlayer ?? false
    const priorityLabel = rank === null || rank === undefined ? '' : getPriorityLabel(rank, returningPlayer)
    const prioritySortValue = getPrioritySortValue(rank, returningPlayer)
    const counts = assignmentCountsByGameId.get(game.id)
    const overrun = counts ? counts.overrun : 0
    const shortfall = counts ? counts.shortfall : game.playerMin
    const spaces = counts ? counts.spaces : Math.max(0, game.playerMax)
    const overrunLabel = String(overrun)
    const shortfallLabel = String(shortfall)
    const spacesLabel = String(spaces)

    return {
      gameId: game.id,
      name: formatGameName(game),
      category: game.category,
      priorityLabel,
      overrunLabel,
      shortfallLabel,
      prioritySortValue,
      spacesLabel,
      spaces,
      rank,
    }
  })

  return options
    .sort((left, right) => {
      if (left.prioritySortValue !== right.prioritySortValue) {
        return left.prioritySortValue - right.prioritySortValue
      }
      if (left.category !== right.category) {
        if (left.category === 'no_game') return 1
        if (right.category === 'no_game') return -1
      }
      return left.name.localeCompare(right.name)
    })
    .map(({ category: _category, rank: _rank, prioritySortValue: _prioritySortValue, ...option }) => option)
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

export const buildGameChoiceOptions = (games: Array<DashboardGame>, slotId: number) => {
  const slotGames = games.filter(
    (game) => hasValidSlotId(game) && game.slotId === slotId && isUserGameCategory(game.category),
  )
  const noGameOption = games.find((game) => game.slotId === slotId && isNoGameCategory(game.category))
  const anyGameOption = games.find((game) => isAnyGameCategory(game.category))

  const options = slotGames.map((game) => ({
    value: game.id,
    label: formatGameName(game),
  }))

  const specialOptions = [
    noGameOption ? { value: noGameOption.id, label: 'No Game' } : null,
    anyGameOption ? { value: anyGameOption.id, label: 'Any Game' } : null,
  ].filter((option): option is { value: number; label: string } => !!option)

  return [...specialOptions, ...options]
}

export const buildChoiceRowsForMember = ({
  memberId,
  choices,
  configuration,
  gameCategoryByGameId,
  slotIds,
}: {
  memberId: number
  choices: Array<DashboardChoice>
  configuration: Configuration
  gameCategoryByGameId: Map<number, DashboardGame['category']>
  slotIds?: Array<number>
}): Array<MemberChoiceRow> => {
  const rows: Array<MemberChoiceRow> = []
  const slotsToShow =
    slotIds ??
    Array.from({ length: configuration.numberOfSlots }, (_unusedValue: undefined, slotIndex: number) => slotIndex + 1)

  slotsToShow.forEach((slotId) => {
    const slotChoices = choices.filter((choice) => choice.slotId === slotId)
    const ordered = orderChoices(slotChoices)
    const gmChoice = ordered[0]
    const hasGmChoice =
      !!gmChoice?.gameId &&
      !isNoGameCategory(gameCategoryByGameId.get(gmChoice.gameId)) &&
      !isAnyGameCategory(gameCategoryByGameId.get(gmChoice.gameId))
    const ranks = hasGmChoice ? [0, 2, 3, 4] : [1, 2, 3, 4]

    ranks.forEach((rank) => {
      const choice = slotChoices.find((entry) => entry.rank === rank)
      rows.push({
        rowId: `member-${memberId}-slot-${slotId}-rank-${rank}`,
        memberId,
        slotId,
        slotLabel: `Slot ${slotId}`,
        rank,
        rankLabel: getPriorityLabel(rank, choice?.returningPlayer ?? false),
        gameId: choice?.gameId ?? null,
        returningPlayer: choice?.returningPlayer ?? false,
      })
    })
  })

  return rows
}

export const buildChoiceKey = (choice: { memberId: number; slotId: number; rank: number; year: number }) =>
  `${choice.memberId}-${choice.slotId}-${choice.rank}-${choice.year}`

export const buildAssignmentKeyFromInput = (assignment: {
  memberId: number
  gameId: number
  gm: number
  year: number
}) => buildAssignmentKey(assignment)

export const buildAssignmentKeyFromRecord = (assignment: DashboardAssignment) =>
  buildAssignmentKey({
    memberId: assignment.memberId,
    gameId: assignment.gameId,
    gm: assignment.gm,
    year: assignment.year,
  })
