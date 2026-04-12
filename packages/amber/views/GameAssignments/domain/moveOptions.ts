import type { TableEditOption } from '@amber/ui/components/Table'

import { hasValidSlotId } from './assignmentScope'
import { getChoiceForGame } from './assignmentSummaries'
import { formatGameName, getGameLabel, getPriorityLabel, getPrioritySortValue } from './labels'
import type { ChoicesByMemberSlot, DashboardGame, MoveOption } from './types'

import { isAnyGameCategory, isNoGameCategory, isUserGameCategory } from '../../../utils'

export const buildMoveOptions = ({
  games,
  assignmentCountsByGameId,
  choicesByMemberSlot,
  memberId,
  slotId,
}: {
  games: Array<DashboardGame>
  assignmentCountsByGameId: Map<number, { overrun: number; shortfall: number; spaces: number }>
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

    return {
      gameId: game.id,
      name: formatGameName(game),
      category: game.category,
      priorityLabel,
      overrunLabel: String(overrun),
      shortfallLabel: String(shortfall),
      prioritySortValue,
      spacesLabel: String(spaces),
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

export { getGameLabel }
