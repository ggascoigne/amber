import type { TableEditRowUpdate } from '@amber/ui/components/Table'

import { getChoiceForGame, buildEmptyMemberAssignmentCounts } from './assignmentSummaries'
import { buildAssignmentKeyFromInput } from './keys'
import { formatGameName, getPriorityLabel, getPrioritySortValue } from './labels'
import type {
  AssignmentUpdate,
  ChoicesByMemberSlot,
  DashboardAssignment,
  DashboardGame,
  GameAssignmentEditorRow,
  MemberAssignmentCounts,
  MemberAssignmentEditorRow,
} from './types'

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
