import { getPriorityLabel, getPrioritySortValue } from './labels'
import type { DashboardChoice, GameInterestRow, InterestChoicesByGameId } from './types'

import { isAnyGameCategory, isNoGameCategory } from '../../../utils'
import type { GameCategoryByGameId } from '../../../utils'

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
