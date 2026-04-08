import type {
  GameAssignmentDashboardData,
  UpdateGameAssignmentsInput,
  UpsertGameChoiceBySlotInput,
} from '@amber/client'
import type { TableEditOption, TableEditRowUpdate } from '@amber/ui/components/Table'

import type { Configuration, GameCategoryByGameId } from '../../utils'
import { isAnyGameCategory, isNoGameCategory, isUserGameCategory } from '../../utils'
import { PlayerPreference } from '../../utils/selectValues'
import { rankString } from '../GameSignup/GameChoiceSelector'

export type DashboardAssignment = GameAssignmentDashboardData['assignments'][number]
export type DashboardChoice = GameAssignmentDashboardData['choices'][number]
export type DashboardGame = GameAssignmentDashboardData['games'][number]
export type DashboardMembership = GameAssignmentDashboardData['memberships'][number]
export type DashboardSubmission = GameAssignmentDashboardData['submissions'][number]
export type AssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]
export type ChoiceUpsert = UpsertGameChoiceBySlotInput

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

export type GameInterestSummaryRow = GameAssignmentSummaryRow & {
  overallInterest: number
}

export type MemberAssignmentSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
  counts: MemberAssignmentCounts
}

export type MemberAssignmentEditorRow = {
  rowId: string
  memberId: number
  slotId: number
  slotLabel: string
  gameId: number | null
  gameName: string
  gm: number
  priorityLabel: string
  prioritySortValue: number
}

export type GameAssignmentEditorRow = {
  rowId: string
  memberId: number | null
  gameId: number
  slotId: number
  gm: number
  moveToGameId: number
  priorityLabel: string
  prioritySortValue: number
  counts: MemberAssignmentCounts
}

export type MemberChoiceSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
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

export type MemberChoiceEditorState = {
  choiceRows: Array<MemberChoiceRow>
  gmGameIdBySlotId: Map<number, number>
  previousRowIdByRowId: Map<string, string>
}

export type ChoicesByMemberSlot = Map<number, Map<number, Array<DashboardChoice>>>
export type InterestChoicesByGameId = Map<number, Array<DashboardChoice>>
export type GameInterestRow = {
  rowId: string
  memberName: string
  priorityLabel: string
  prioritySortValue: number
  rank: number | null
}

export type SlotAssignmentScope = {
  filteredSlotGames: Array<DashboardGame>
  slotGameIdSet: Set<number>
  scheduledAssignments: Array<DashboardAssignment>
}

export type MemberAssignmentCounts = {
  gmOrFirst: number
  second: number
  third: number
  fourth: number
  other: number
}

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

export const buildEmptyMemberAssignmentCounts = (): MemberAssignmentCounts => ({
  gmOrFirst: 0,
  second: 0,
  third: 0,
  fourth: 0,
  other: 0,
})

const buildAssignmentKey = (assignment: { memberId: number; gameId: number; gm: number; year: number }) =>
  `${assignment.memberId}-${assignment.gameId}-${assignment.gm}-${assignment.year}`

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

export const buildInterestChoicesByGameId = ({
  choices,
  attendingMemberIdSet,
  gameCategoryByGameId,
  slotGameIdSet,
  slotGameIdsBySlotId,
}: {
  choices: Array<DashboardChoice>
  attendingMemberIdSet: Set<number>
  gameCategoryByGameId: GameCategoryByGameId
  slotGameIdSet: Set<number>
  slotGameIdsBySlotId: Map<number, Array<number>>
}): InterestChoicesByGameId => {
  const choicesByGameId: InterestChoicesByGameId = new Map()

  choices.forEach((choice) => {
    if (!attendingMemberIdSet.has(choice.memberId) || !choice.gameId) {
      return
    }

    const choiceCategory = gameCategoryByGameId.get(choice.gameId)
    if (isNoGameCategory(choiceCategory)) {
      return
    }

    if (isAnyGameCategory(choiceCategory)) {
      const gameIds = slotGameIdsBySlotId.get(choice.slotId) ?? []
      gameIds.forEach((gameId) => {
        const gameChoices = choicesByGameId.get(gameId) ?? []
        gameChoices.push(choice)
        choicesByGameId.set(gameId, gameChoices)
      })
      return
    }

    if (!slotGameIdSet.has(choice.gameId)) {
      return
    }

    const gameChoices = choicesByGameId.get(choice.gameId) ?? []
    gameChoices.push(choice)
    choicesByGameId.set(choice.gameId, gameChoices)
  })

  return choicesByGameId
}

export const buildInterestCountsByGameId = (choicesByGameId: InterestChoicesByGameId) => {
  const countsByGameId = new Map<number, number>()

  choicesByGameId.forEach((choices, gameId) => {
    const interestedMemberIds = new Set<number>()
    choices.forEach((choice) => {
      if (choice.rank === 0) {
        return
      }
      interestedMemberIds.add(choice.memberId)
    })
    countsByGameId.set(gameId, interestedMemberIds.size)
  })

  return countsByGameId
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

export const getPriorityLabel = (rank: number | null, returningPlayer = false) => {
  const label = rankString(rank) ?? 'Other'
  return returningPlayer ? `${label} *` : label
}

export const getPrioritySortValue = (rank: number | null, returningPlayer = false) => {
  if (rank === null || rank === undefined) return Number.POSITIVE_INFINITY
  return returningPlayer ? rank - 0.5 : rank
}

export const buildInterestRowsForGame = ({
  gameId,
  choices,
  gameCategoryByGameId,
}: {
  gameId: number
  choices: Array<DashboardChoice>
  gameCategoryByGameId: GameCategoryByGameId
}): Array<GameInterestRow> => {
  const rowsByMemberId = new Map<number, GameInterestRow>()

  choices.forEach((choice) => {
    const { memberId, rank, membership, returningPlayer } = choice
    const prioritySortValue = getPrioritySortValue(rank, returningPlayer)
    const existingRow = rowsByMemberId.get(memberId)
    if (existingRow && existingRow.prioritySortValue <= prioritySortValue) {
      return
    }

    const priorityLabel = isAnyGameCategory(gameCategoryByGameId.get(choice.gameId ?? 0))
      ? `${getPriorityLabel(rank, returningPlayer)} (Any Game)`
      : getPriorityLabel(rank, returningPlayer)

    rowsByMemberId.set(memberId, {
      rowId: `choice-${gameId}-${memberId}`,
      memberName: membership.user.fullName ?? 'Unknown member',
      priorityLabel,
      prioritySortValue,
      rank,
    })
  })

  return Array.from(rowsByMemberId.values()).sort((left, right) => {
    if (left.prioritySortValue !== right.prioritySortValue) {
      return left.prioritySortValue - right.prioritySortValue
    }
    return left.memberName.localeCompare(right.memberName)
  })
}

export const isReturningPlayersOnly = (game: DashboardGame | null | undefined) =>
  game?.playerPreference === PlayerPreference.RetOnly

export const formatGameName = (game: DashboardGame | null | undefined, fallbackLabel = 'Unknown game') => {
  if (!game) return fallbackLabel
  const label = game.name ?? fallbackLabel
  return isReturningPlayersOnly(game) ? `${label} *` : label
}

export const buildMemberAssignmentEditorRows = ({
  memberId,
  assignments,
  choicesByMemberSlot,
  gameById,
  numberOfSlots,
  slotFilterId,
}: {
  memberId: number
  assignments: Array<DashboardAssignment>
  choicesByMemberSlot: ChoicesByMemberSlot
  gameById: Map<number, DashboardGame>
  numberOfSlots: number
  slotFilterId: number | null
}): Array<MemberAssignmentEditorRow> => {
  const assignmentBySlot = new Map<number, DashboardAssignment>()
  assignments.forEach((assignment) => {
    const assignmentSlotId = assignment.game?.slotId
    if (!assignmentSlotId) return
    assignmentBySlot.set(assignmentSlotId, assignment)
  })

  const slotIdsToShow =
    slotFilterId === null
      ? Array.from({ length: numberOfSlots }, (_unusedValue: undefined, slotIndex: number) => slotIndex + 1)
      : [slotFilterId]

  return slotIdsToShow.map((slotId) => {
    const assignment = assignmentBySlot.get(slotId)
    const gameId = assignment?.gameId ?? null
    const gameName = assignment?.gameId ? formatGameName(gameById.get(assignment.gameId)) : ''
    const gm = assignment?.gm ?? 0
    const choice = assignment ? getChoiceForGame(choicesByMemberSlot, memberId, slotId, assignment.gameId) : null

    return {
      rowId: `member-${memberId}-slot-${slotId}`,
      memberId,
      slotId,
      slotLabel: `Slot ${slotId}`,
      gameId,
      gameName,
      gm,
      priorityLabel: assignment ? getPriorityLabel(choice?.rank ?? null, choice?.returningPlayer ?? false) : '',
      prioritySortValue: assignment
        ? getPrioritySortValue(choice?.rank ?? null, choice?.returningPlayer ?? false)
        : Number.POSITIVE_INFINITY,
    }
  })
}

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

export const buildGameAssignmentEditorRows = ({
  assignments,
  choicesByMemberSlot,
  memberAssignmentCountsByMemberId,
  fallbackSlotId,
}: {
  assignments: Array<DashboardAssignment>
  choicesByMemberSlot: ChoicesByMemberSlot
  memberAssignmentCountsByMemberId: Map<number, MemberAssignmentCounts>
  fallbackSlotId: number
}): Array<GameAssignmentEditorRow> =>
  assignments.map((assignment) => {
    const { memberId, gameId, gm } = assignment
    const slotId = assignment.game?.slotId ?? fallbackSlotId
    const choice = getChoiceForGame(choicesByMemberSlot, memberId, slotId, gameId)
    const rank = choice?.rank ?? null
    const returningPlayer = choice?.returningPlayer ?? false

    return {
      rowId: `${memberId}-${gameId}-${gm}`,
      memberId,
      gameId,
      slotId,
      gm,
      moveToGameId: gameId,
      priorityLabel: getPriorityLabel(rank, returningPlayer),
      prioritySortValue: getPrioritySortValue(rank, returningPlayer),
      counts: memberAssignmentCountsByMemberId.get(memberId) ?? buildEmptyMemberAssignmentCounts(),
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
  const anyGameOption = games.find((game) => isAnyGameCategory(game.category))
  const moveToGames = anyGameOption ? [...slotGames, anyGameOption] : slotGames

  const options = moveToGames.map((game) => {
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
        if (left.category === 'any_game') return 1
        if (right.category === 'any_game') return -1
      }
      return left.name.localeCompare(right.name)
    })
    .map(({ category: _category, rank: _rank, prioritySortValue: _prioritySortValue, ...option }) => option)
}

export const buildMoveSelectOptions = (options: Array<MoveOption>): Array<TableEditOption> => [
  {
    label: 'Headers',
    value: '__header__',
    isHeader: true,
    columns: [
      { value: 'Game' },
      { value: 'Priority', width: 90, align: 'right' as const },
      { value: 'Overrun', width: 85, align: 'right' as const },
      { value: 'Shortfall', width: 90, align: 'right' as const },
      { value: 'Spaces', width: 90, align: 'right' as const },
    ],
  },
  ...options.map((option) => ({
    value: option.gameId,
    label: option.name,
    columns: [
      { value: option.name },
      { value: option.priorityLabel, width: 90 },
      { value: option.overrunLabel, width: 85, align: 'right' as const },
      { value: option.shortfallLabel, width: 90, align: 'right' as const },
      { value: option.spacesLabel, width: 90, align: 'right' as const },
    ],
  })),
]

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

const isFirstChoiceRank = (rank: number) => rank === 0 || rank === 1

export const canEditChoiceRowGameSelection = ({
  previousGameId,
  gameCategoryByGameId,
}: {
  previousGameId: number | null
  gameCategoryByGameId: GameCategoryByGameId
}) => {
  if (previousGameId === null) return false

  const previousGameCategory = gameCategoryByGameId.get(previousGameId)
  return !isNoGameCategory(previousGameCategory) && !isAnyGameCategory(previousGameCategory)
}

export const buildUpdatedChoiceRowGameSelection = ({
  choiceRow,
  gameId,
  gmGameId,
}: {
  choiceRow: MemberChoiceRow
  gameId: number | null
  gmGameId: number | null
}): MemberChoiceRow => {
  if (!isFirstChoiceRank(choiceRow.rank)) {
    return {
      ...choiceRow,
      gameId,
    }
  }

  const nextRank = gameId !== null && gmGameId !== null && gameId === gmGameId ? 0 : 1

  return {
    ...choiceRow,
    gameId,
    rank: nextRank,
    rankLabel: getPriorityLabel(nextRank, choiceRow.returningPlayer),
  }
}

export const buildUpdatedMemberAssignmentRowGameSelection = ({
  assignmentRow,
  gameId,
  gameById,
  choicesByMemberSlot,
}: {
  assignmentRow: MemberAssignmentEditorRow
  gameId: number | null
  gameById: Map<number, DashboardGame>
  choicesByMemberSlot: ChoicesByMemberSlot
}): MemberAssignmentEditorRow => {
  const game = gameId ? gameById.get(gameId) : null
  const choice =
    gameId === null ? null : getChoiceForGame(choicesByMemberSlot, assignmentRow.memberId, assignmentRow.slotId, gameId)

  return {
    ...assignmentRow,
    gameId,
    gameName: game ? formatGameName(game) : '',
    priorityLabel: gameId ? getPriorityLabel(choice?.rank ?? null, choice?.returningPlayer ?? false) : '',
    prioritySortValue: gameId
      ? getPrioritySortValue(choice?.rank ?? null, choice?.returningPlayer ?? false)
      : Number.POSITIVE_INFINITY,
  }
}

export const buildUpdatedGameAssignmentRowMemberSelection = ({
  assignmentRow,
  memberId,
  choicesByMemberSlot,
  memberAssignmentCountsByMemberId,
}: {
  assignmentRow: GameAssignmentEditorRow
  memberId: number | null
  choicesByMemberSlot: ChoicesByMemberSlot
  memberAssignmentCountsByMemberId: Map<number, MemberAssignmentCounts>
}): GameAssignmentEditorRow => {
  const choice =
    memberId === null
      ? null
      : getChoiceForGame(choicesByMemberSlot, memberId, assignmentRow.slotId, assignmentRow.gameId)
  const rank = choice?.rank ?? null
  const returningPlayer = choice?.returningPlayer ?? false

  return {
    ...assignmentRow,
    memberId,
    priorityLabel: getPriorityLabel(rank, returningPlayer),
    prioritySortValue: getPrioritySortValue(rank, returningPlayer),
    counts:
      memberId === null
        ? buildEmptyMemberAssignmentCounts()
        : (memberAssignmentCountsByMemberId.get(memberId) ?? buildEmptyMemberAssignmentCounts()),
  }
}

export const buildGameChoiceOptionsForRow = ({
  games,
  slotId,
  rank,
  gmGameId,
}: {
  games: Array<DashboardGame>
  slotId: number
  rank: number
  gmGameId?: number | null
}) => {
  const slotGames = games.filter(
    (game) =>
      hasValidSlotId(game) &&
      game.slotId === slotId &&
      isUserGameCategory(game.category) &&
      (isFirstChoiceRank(rank) || !gmGameId || game.id !== gmGameId),
  )
  const noGameOption = games.find((game) => game.slotId === slotId && isNoGameCategory(game.category))
  const anyGameOption = games.find((game) => isAnyGameCategory(game.category))

  const userOptions = slotGames
    .slice()
    .sort((leftGame, rightGame) => {
      const leftIsGmGame = gmGameId === leftGame.id
      const rightIsGmGame = gmGameId === rightGame.id
      if (leftIsGmGame !== rightIsGmGame) {
        return leftIsGmGame ? -1 : 1
      }
      return formatGameName(leftGame).localeCompare(formatGameName(rightGame))
    })
    .map((game) => {
      const isGmGame = gmGameId === game.id
      return {
        value: game.id,
        label: formatGameName(game),
        fontWeight: isGmGame ? 700 : undefined,
      }
    })

  const specialOptions = [
    noGameOption ? { value: noGameOption.id, label: 'No Game' } : null,
    anyGameOption ? { value: anyGameOption.id, label: 'Any Game' } : null,
  ].filter((option): option is { value: number; label: string } => !!option)

  return [...userOptions, ...specialOptions]
}

export const buildChoiceRowsForMember = ({
  memberId,
  choices,
  configuration,
  gmGameIdBySlotId,
  slotIds,
}: {
  memberId: number
  choices: Array<DashboardChoice>
  configuration: Configuration
  gmGameIdBySlotId?: Map<number, number>
  slotIds?: Array<number>
}): Array<MemberChoiceRow> => {
  const rows: Array<MemberChoiceRow> = []
  const slotsToShow =
    slotIds ??
    Array.from({ length: configuration.numberOfSlots }, (_unusedValue: undefined, slotIndex: number) => slotIndex + 1)

  slotsToShow.forEach((slotId) => {
    const slotChoices = choices.filter((choice) => choice.slotId === slotId)
    const gmGameId = gmGameIdBySlotId?.get(slotId) ?? null
    const rankOneChoice = slotChoices.find((choice) => choice.rank === 1)
    const rankZeroChoice = slotChoices.find((choice) => choice.rank === 0)
    const firstChoice =
      [rankOneChoice, rankZeroChoice].find((choice) => (choice?.gameId ?? null) !== null) ??
      rankOneChoice ??
      rankZeroChoice
    const firstChoiceGameId = firstChoice?.gameId ?? null
    const isGmFirstChoice = firstChoiceGameId !== null && gmGameId !== null && firstChoiceGameId === gmGameId
    const firstRank = isGmFirstChoice ? 0 : 1
    const ranks = [firstRank, 2, 3, 4]

    ranks.forEach((rank) => {
      const choice =
        rank === firstRank
          ? (firstChoice ?? slotChoices.find((entry) => entry.rank === rank))
          : slotChoices.find((entry) => entry.rank === rank)
      const fallbackGameId = rank === 0 && firstRank === 0 ? gmGameId : null
      rows.push({
        rowId: `member-${memberId}-slot-${slotId}-rank-${rank}`,
        memberId,
        slotId,
        slotLabel: `Slot ${slotId}`,
        rank,
        rankLabel: getPriorityLabel(rank, choice?.returningPlayer ?? false),
        gameId: choice?.gameId ?? fallbackGameId,
        returningPlayer: choice?.returningPlayer ?? false,
      })
    })
  })

  return rows
}

export const buildChoiceEditorStateForMember = ({
  memberId,
  assignments,
  choices,
  configuration,
  gameCategoryByGameId,
  slotGameIdSet,
  slotFilterId,
}: {
  memberId: number
  assignments: Array<DashboardAssignment>
  choices: Array<DashboardChoice>
  configuration: Configuration
  gameCategoryByGameId: GameCategoryByGameId
  slotGameIdSet: Set<number>
  slotFilterId: number | null
}): MemberChoiceEditorState => {
  const gmGameIdBySlotId = new Map<number, number>()

  assignments.forEach((assignment) => {
    if (assignment.memberId !== memberId || assignment.gm === 0) return
    const assignmentGame = assignment.game
    const assignmentGameSlotId = assignmentGame?.slotId ?? 0

    if (!assignmentGame || assignmentGameSlotId <= 0 || !isUserGameCategory(assignmentGame.category)) return
    if (gmGameIdBySlotId.has(assignmentGameSlotId)) return

    gmGameIdBySlotId.set(assignmentGameSlotId, assignment.gameId)
  })

  const filteredChoices = choices.filter((choice) => {
    if (!choice.gameId) return true

    const category = gameCategoryByGameId.get(choice.gameId)
    if (isNoGameCategory(category) || isAnyGameCategory(category)) return true

    return slotGameIdSet.has(choice.gameId)
  })

  const choiceRows = buildChoiceRowsForMember({
    memberId,
    choices: filteredChoices,
    configuration,
    gmGameIdBySlotId,
    slotIds: slotFilterId ? [slotFilterId] : undefined,
  })

  const slotRowsBySlotId = choiceRows.reduce((rowsBySlotId: Map<number, Array<MemberChoiceRow>>, choiceRow) => {
    const slotRows = rowsBySlotId.get(choiceRow.slotId) ?? []
    slotRows.push(choiceRow)
    rowsBySlotId.set(choiceRow.slotId, slotRows)
    return rowsBySlotId
  }, new Map<number, Array<MemberChoiceRow>>())

  const previousRowIdByRowId = Array.from(slotRowsBySlotId.values()).reduce((result: Map<string, string>, slotRows) => {
    slotRows.forEach((slotRow, rowIndex) => {
      if (rowIndex <= 0) return

      const previousRow = slotRows[rowIndex - 1]
      result.set(slotRow.rowId, previousRow.rowId)
    })
    return result
  }, new Map<string, string>())

  return {
    choiceRows,
    gmGameIdBySlotId,
    previousRowIdByRowId,
  }
}

export const buildChoiceKey = (choice: { memberId: number; slotId: number; rank: number; year: number }) =>
  `${choice.memberId}-${choice.slotId}-${choice.rank}-${choice.year}`

export const buildChoiceUpsertsFromUpdates = ({
  updates,
  year,
}: {
  updates: Array<TableEditRowUpdate<MemberChoiceRow>>
  year: number
}): Array<ChoiceUpsert> =>
  updates.flatMap((update) => {
    const { memberId, slotId, rank, gameId, returningPlayer } = update.updated
    const upserts: Array<ChoiceUpsert> = [
      {
        memberId,
        year,
        slotId,
        rank,
        gameId,
        returningPlayer,
      },
    ]

    if (update.original.rank !== rank) {
      upserts.push({
        memberId,
        year,
        slotId,
        rank: update.original.rank,
        gameId: null,
        returningPlayer: update.original.returningPlayer,
      })
    }

    return upserts
  })

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

export const buildAssignmentUpdatePayload = <RowData>({
  updates,
  buildOriginalAssignment,
  buildUpdatedAssignment,
}: {
  updates: Array<TableEditRowUpdate<RowData>>
  buildOriginalAssignment: (row: RowData) => AssignmentUpdate | null
  buildUpdatedAssignment: (row: RowData) => AssignmentUpdate | null
}) => {
  const adds: Array<AssignmentUpdate> = []
  const removes: Array<AssignmentUpdate> = []

  updates.forEach((update) => {
    const originalAssignment = buildOriginalAssignment(update.original)
    const updatedAssignment = buildUpdatedAssignment(update.updated)

    if (!originalAssignment && !updatedAssignment) {
      return
    }

    if (
      originalAssignment &&
      updatedAssignment &&
      buildAssignmentKeyFromInput(originalAssignment) === buildAssignmentKeyFromInput(updatedAssignment)
    ) {
      return
    }

    if (originalAssignment) {
      removes.push(originalAssignment)
    }

    if (updatedAssignment) {
      adds.push(updatedAssignment)
    }
  })

  return { adds, removes }
}

export const buildMemberAssignmentPayloadFromUpdates = ({
  updates,
  year,
}: {
  updates: Array<TableEditRowUpdate<MemberAssignmentEditorRow>>
  year: number
}) =>
  buildAssignmentUpdatePayload({
    updates,
    buildOriginalAssignment: ({ memberId, gameId, gm }) =>
      gameId
        ? {
            memberId,
            gameId,
            gm,
            year,
          }
        : null,
    buildUpdatedAssignment: ({ memberId, gameId, gm }) =>
      gameId
        ? {
            memberId,
            gameId,
            gm,
            year,
          }
        : null,
  })

export const buildGameAssignmentPayloadFromUpdates = ({
  updates,
  year,
}: {
  updates: Array<TableEditRowUpdate<GameAssignmentEditorRow>>
  year: number
}) =>
  buildAssignmentUpdatePayload({
    updates,
    buildOriginalAssignment: ({ memberId, gameId, gm }) =>
      memberId
        ? {
            memberId,
            gameId,
            gm,
            year,
          }
        : null,
    buildUpdatedAssignment: ({ memberId, moveToGameId, gm }) =>
      memberId && moveToGameId
        ? {
            memberId,
            gameId: moveToGameId,
            gm,
            year,
          }
        : null,
  })

export const buildGameAssignmentAddPayload = ({
  assignment,
  year,
}: {
  assignment: GameAssignmentEditorRow
  year: number
}) => ({
  adds: assignment.memberId
    ? [
        {
          memberId: assignment.memberId,
          gameId: assignment.moveToGameId,
          gm: assignment.gm,
          year,
        },
      ]
    : [],
  removes: [],
})
