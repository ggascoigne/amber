import type { TableEditOption, TableEditRowUpdate } from '@amber/ui/components/Table/editing/types'
import type { RowData } from '@amber/ui/components/Table/tableTypes'

import { getChoiceForGame, buildEmptyMemberAssignmentCounts } from './assignmentSummaries'
import { buildAssignmentKeyFromInput } from './keys'
import { formatGameName, getPriorityLabel, getPrioritySortValue } from './labels'
import type {
  AssignmentUpdate,
  ChoicesByMemberSlot,
  DashboardAssignment,
  DashboardGame,
  DashboardMembership,
  GameAssignmentEditorRow,
  MemberAssignmentCounts,
  MemberAssignmentEditorRow,
} from './types'

import type { GameCategoryByGameId } from '../../../utils/gameCategory'

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

export const buildMemberSelectOptionsForGame = ({
  memberships,
  choicesByMemberSlot,
  gameCategoryByGameId,
  gmMemberIdsBySlotId,
  assignments,
  gameId,
  slotId,
}: {
  memberships: Array<DashboardMembership>
  choicesByMemberSlot: ChoicesByMemberSlot
  gameCategoryByGameId: GameCategoryByGameId
  gmMemberIdsBySlotId: Map<number, Set<number>>
  assignments: Array<DashboardAssignment>
  gameId: number
  slotId: number
}): Array<TableEditOption> => {
  const gmMemberIds = gmMemberIdsBySlotId.get(slotId) ?? new Set<number>()
  const assignedGameNamesByMemberId = new Map<number, Array<string>>()

  assignments.forEach((assignment) => {
    if (assignment.game?.slotId !== slotId) return
    const gameNames = assignedGameNamesByMemberId.get(assignment.memberId) ?? []
    gameNames.push(formatGameName(assignment.game))
    assignedGameNamesByMemberId.set(assignment.memberId, gameNames)
  })

  const options = memberships
    .filter((membership) => membership.attending && !gmMemberIds.has(membership.id))
    .map((membership) => {
      const choices = choicesByMemberSlot.get(membership.id)?.get(slotId) ?? []
      const directChoice = choices.find((choice) => choice.gameId === gameId)
      const anyGameChoice = choices.find((choice) => gameCategoryByGameId.get(choice.gameId ?? 0) === 'any_game')
      const choice = directChoice ?? anyGameChoice
      const isAnyGameChoice = choice === anyGameChoice && anyGameChoice !== undefined
      const priorityLabel = choice
        ? `${getPriorityLabel(choice.rank, choice.returningPlayer)}${isAnyGameChoice ? ' (Any Game)' : ''}`
        : ''

      return {
        value: membership.id,
        label: membership.user.fullName ?? 'Unknown member',
        priorityLabel,
        assignedToLabel: (assignedGameNamesByMemberId.get(membership.id) ?? []).join(', '),
        prioritySortValue: choice
          ? getPrioritySortValue(choice.rank, choice.returningPlayer)
          : Number.POSITIVE_INFINITY,
      }
    })
    .sort((left, right) => {
      if (left.prioritySortValue !== right.prioritySortValue) return left.prioritySortValue - right.prioritySortValue
      return left.label.localeCompare(right.label)
    })

  return [
    {
      label: 'Headers',
      value: '__header__',
      disabled: true,
      isHeader: true,
      columns: [
        { value: 'Member' },
        { value: 'Priority', width: 120, align: 'right' },
        { value: 'Assigned To', width: 180 },
      ],
    },
    ...options.map(({ assignedToLabel, priorityLabel, prioritySortValue: _prioritySortValue, ...option }) => ({
      ...option,
      columns: [
        { value: option.label },
        { value: priorityLabel, width: 120, align: 'right' as const },
        { value: assignedToLabel, width: 180 },
      ],
    })),
  ]
}

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

export const buildAssignmentUpdatePayload = <TData extends RowData>({
  updates,
  buildOriginalAssignment,
  buildUpdatedAssignment,
}: {
  updates: Array<TableEditRowUpdate<TData>>
  buildOriginalAssignment: (row: TData) => AssignmentUpdate | null
  buildUpdatedAssignment: (row: TData) => AssignmentUpdate | null
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
  assignments,
  year,
}: {
  assignment: GameAssignmentEditorRow
  assignments: Array<DashboardAssignment>
  year: number
}) => {
  if (!assignment.memberId) {
    return { adds: [], removes: [] }
  }

  const removes = assignments
    .filter(
      (existingAssignment) =>
        existingAssignment.memberId === assignment.memberId &&
        existingAssignment.gameId !== assignment.moveToGameId &&
        existingAssignment.game?.slotId === assignment.slotId,
    )
    .map(({ memberId, gameId, gm }) => ({ memberId, gameId, gm, year }))

  return {
    adds: [
      {
        memberId: assignment.memberId,
        gameId: assignment.moveToGameId,
        gm: assignment.gm,
        year,
      },
    ],
    removes,
  }
}
