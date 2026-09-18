import { getPriorityLabel, getPrioritySortValue } from './labels'
import type { DashboardAssignment, DashboardChoice, GameInterestRow, InterestChoicesByGameId } from './types'

import type { GameCategoryByGameId } from '../../../utils/gameCategory'
import { isAnyGameCategory, isNoGameCategory } from '../../../utils/gameCategory'

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

export const buildMemberIdsBySlotIdForGameCategory = ({
  choices,
  attendingMemberIdSet,
  gameCategoryByGameId,
  category,
}: {
  choices: Array<DashboardChoice>
  attendingMemberIdSet: Set<number>
  gameCategoryByGameId: GameCategoryByGameId
  category: 'any_game'
}) => {
  const memberIdsBySlotId = new Map<number, Set<number>>()

  choices.forEach((choice) => {
    if (!attendingMemberIdSet.has(choice.memberId) || gameCategoryByGameId.get(choice.gameId ?? 0) !== category) return

    const memberIds = memberIdsBySlotId.get(choice.slotId) ?? new Set<number>()
    memberIds.add(choice.memberId)
    memberIdsBySlotId.set(choice.slotId, memberIds)
  })

  return memberIdsBySlotId
}

export const buildGmMemberIdsBySlotId = (assignments: Array<DashboardAssignment>) => {
  const memberIdsBySlotId = new Map<number, Set<number>>()

  assignments.forEach((assignment) => {
    const slotId = assignment.game?.slotId ?? 0
    if (assignment.gm <= 0 || slotId <= 0) return

    const memberIds = memberIdsBySlotId.get(slotId) ?? new Set<number>()
    memberIds.add(assignment.memberId)
    memberIdsBySlotId.set(slotId, memberIds)
  })

  return memberIdsBySlotId
}

export const buildFocusedInterestChoicesByGameId = ({
  choicesByGameId,
  anyGameMemberIdsBySlotId,
  gmMemberIdsBySlotId,
  gameCategoryByGameId,
  includeRanksThreeAndFour = false,
}: {
  choicesByGameId: InterestChoicesByGameId
  anyGameMemberIdsBySlotId: Map<number, Set<number>>
  gmMemberIdsBySlotId: Map<number, Set<number>>
  gameCategoryByGameId: GameCategoryByGameId
  includeRanksThreeAndFour?: boolean
}) => {
  const focusedChoicesByGameId: InterestChoicesByGameId = new Map()

  choicesByGameId.forEach((choices, gameId) => {
    choices.forEach((choice) => {
      const isIncludedRank =
        choice.rank === 1 || choice.rank === 2 || (includeRanksThreeAndFour && choice.rank >= 3 && choice.rank <= 4)
      if (!isIncludedRank) {
        return
      }
      if (isAnyGameCategory(gameCategoryByGameId.get(choice.gameId ?? 0))) return
      if (anyGameMemberIdsBySlotId.get(choice.slotId)?.has(choice.memberId)) return
      if (gmMemberIdsBySlotId.get(choice.slotId)?.has(choice.memberId)) return

      const focusedChoices = focusedChoicesByGameId.get(gameId) ?? []
      focusedChoices.push(choice)
      focusedChoicesByGameId.set(gameId, focusedChoices)
    })
  })

  return focusedChoicesByGameId
}

export const buildFocusedInterestCountsByGameId = ({
  choicesByGameId,
  anyGameMemberIdsBySlotId,
  gmMemberIdsBySlotId,
  gameCategoryByGameId,
  includeRanksThreeAndFour = false,
}: {
  choicesByGameId: InterestChoicesByGameId
  anyGameMemberIdsBySlotId: Map<number, Set<number>>
  gmMemberIdsBySlotId: Map<number, Set<number>>
  gameCategoryByGameId: GameCategoryByGameId
  includeRanksThreeAndFour?: boolean
}) =>
  buildInterestCountsByGameId(
    buildFocusedInterestChoicesByGameId({
      choicesByGameId,
      anyGameMemberIdsBySlotId,
      gmMemberIdsBySlotId,
      gameCategoryByGameId,
      includeRanksThreeAndFour,
    }),
  )

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
