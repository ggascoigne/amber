import type { TableEditRowUpdate } from '@amber/ui/components/Table'

import { getPriorityLabel } from './labels'
import type {
  ChoiceUpsert,
  DashboardAssignment,
  DashboardChoice,
  MemberChoiceEditorState,
  MemberChoiceRow,
} from './types'

import type { Configuration, GameCategoryByGameId } from '../../../utils'
import { isAnyGameCategory, isNoGameCategory, isUserGameCategory } from '../../../utils'

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
