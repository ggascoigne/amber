import { describe, expect, test } from 'vitest'

import { buildAssignmentCountsByGameId, buildChoicesByMemberSlot } from './assignmentSummaries'
import { buildGameChoiceOptionsForRow, buildMoveOptions, buildMoveSelectOptions, getGameLabel } from './moveOptions'
import { buildAssignment, buildChoice, buildGame } from './testHelpers'

describe('buildMoveOptions', () => {
  test('sorts move options by priority and pushes special categories to the end of equal-priority groups', () => {
    const games = [
      buildGame({ id: 101, slotId: 1, playerMin: 2, playerMax: 4, name: 'Alpha' }),
      buildGame({ id: 102, slotId: 1, playerMin: 2, playerMax: 4, name: 'Bravo' }),
      buildGame({ id: 103, slotId: 1, playerMin: 0, playerMax: 99, name: 'No Game', category: 'no_game' }),
      buildGame({ id: 900, slotId: null, playerMin: 0, playerMax: 99, name: 'Any Game', category: 'any_game' }),
    ]

    const options = buildMoveOptions({
      games,
      assignmentCountsByGameId: buildAssignmentCountsByGameId(games, [
        buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 1 }),
      ]),
      choicesByMemberSlot: buildChoicesByMemberSlot([buildChoice({ memberId: 50, slotId: 1, gameId: 102, rank: 1 })]),
      memberId: 50,
      slotId: 1,
    })

    expect(options.map((option) => option.gameId)).toEqual([102, 101, 900, 103])
  })
})

describe('buildMoveSelectOptions', () => {
  test('prepends the shared header row and formats option columns for the move selector', () => {
    expect(
      buildMoveSelectOptions([
        {
          gameId: 11,
          name: 'Mystery Manor',
          priorityLabel: '2nd',
          overrunLabel: '1',
          shortfallLabel: '0',
          spacesLabel: '3',
          spaces: 3,
        },
      ]),
    ).toEqual([
      {
        label: 'Headers',
        value: '__header__',
        isHeader: true,
        columns: [
          { value: 'Game' },
          { value: 'Priority', width: 90, align: 'right' },
          { value: 'Overrun', width: 85, align: 'right' },
          { value: 'Shortfall', width: 90, align: 'right' },
          { value: 'Spaces', width: 90, align: 'right' },
        ],
      },
      {
        value: 11,
        label: 'Mystery Manor',
        columns: [
          { value: 'Mystery Manor' },
          { value: '2nd', width: 90 },
          { value: '1', width: 85, align: 'right' },
          { value: '0', width: 90, align: 'right' },
          { value: '3', width: 90, align: 'right' },
        ],
      },
    ])
  })
})

describe('game choice options and labels', () => {
  test('keeps the gm game pinned first for first-choice rows and excludes it from later rows', () => {
    const games = [
      buildGame({ id: 101, slotId: 1, playerMin: 2, playerMax: 4, name: 'Bravo' }),
      buildGame({ id: 102, slotId: 1, playerMin: 2, playerMax: 4, name: 'Alpha' }),
      buildGame({ id: 103, slotId: 1, playerMin: 0, playerMax: 99, name: 'No Game', category: 'no_game' }),
      buildGame({ id: 900, slotId: null, playerMin: 0, playerMax: 99, name: 'Any Game', category: 'any_game' }),
    ]

    expect(
      buildGameChoiceOptionsForRow({
        games,
        slotId: 1,
        rank: 1,
        gmGameId: 101,
      }).map((option) => option.value),
    ).toEqual([101, 102, 103, 900])

    expect(
      buildGameChoiceOptionsForRow({
        games,
        slotId: 1,
        rank: 2,
        gmGameId: 101,
      }).map((option) => option.value),
    ).toEqual([102, 103, 900])
  })

  test('formats game labels for normal and special game ids', () => {
    const gameById = new Map([
      [101, buildGame({ id: 101, slotId: 1, playerMin: 2, playerMax: 4, name: 'Main Event' })],
      [103, buildGame({ id: 103, slotId: 1, playerMin: 0, playerMax: 99, name: 'No Game', category: 'no_game' })],
      [900, buildGame({ id: 900, slotId: null, playerMin: 0, playerMax: 99, name: 'Any Game', category: 'any_game' })],
    ])

    expect(getGameLabel(null, gameById)).toBe('No Selection')
    expect(getGameLabel(103, gameById)).toBe('No Game')
    expect(getGameLabel(900, gameById)).toBe('Any Game')
    expect(getGameLabel(101, gameById)).toBe('Main Event')
  })
})
