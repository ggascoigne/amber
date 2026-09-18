import { describe, expect, test } from 'vitest'

import {
  buildChoiceEditorStateForMember,
  buildChoiceUpsertsFromUpdates,
  buildUpdatedChoiceRowGameSelection,
  canEditChoiceRowGameSelection,
} from './memberChoices'
import { getGameLabel } from './moveOptions'
import { buildAssignment, buildChoice, buildConfiguration, buildGame } from './testHelpers'

import type { GameCategoryByGameId } from '../../../utils/gameCategory'

describe('buildChoiceEditorStateForMember', () => {
  test('builds slot-scoped choice rows while preserving gm-first fallback and previous-row links', () => {
    const editorState = buildChoiceEditorStateForMember({
      memberId: 1,
      assignments: [
        buildAssignment({ memberId: 1, gameId: 101, gm: 1, slotId: 1 }),
        buildAssignment({ memberId: 1, gameId: 102, gm: 2, slotId: 1 }),
        buildAssignment({ memberId: 1, gameId: 201, gm: 1, slotId: 2 }),
        buildAssignment({ memberId: 1, gameId: 901, gm: 1, slotId: 1, category: 'no_game' }),
        buildAssignment({ memberId: 1, gameId: 999, gm: 0, slotId: 1 }),
        buildAssignment({ memberId: 2, gameId: 301, gm: 1, slotId: 3 }),
      ],
      choices: [
        buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 1 }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 102, rank: 2 }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 3 }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 901, rank: 4 }),
        buildChoice({ memberId: 1, slotId: 2, gameId: 201, rank: 1 }),
      ],
      configuration: buildConfiguration(2),
      gameCategoryByGameId: new Map([
        [101, 'user'],
        [102, 'user'],
        [201, 'user'],
        [900, 'any_game'],
        [901, 'no_game'],
      ]),
      gameById: new Map([
        [101, buildGame({ id: 101, slotId: 1, playerMin: 2, playerMax: 4 })],
        [102, buildGame({ id: 102, slotId: 1, playerMin: 2, playerMax: 4 })],
        [201, buildGame({ id: 201, slotId: 2, playerMin: 2, playerMax: 4 })],
        [900, buildGame({ id: 900, slotId: null, playerMin: 0, playerMax: 99, category: 'any_game' })],
        [901, buildGame({ id: 901, slotId: 1, playerMin: 0, playerMax: 99, category: 'no_game' })],
      ]),
      slotGameIdSet: new Set([101]),
      slotFilterId: 1,
    })

    expect(editorState.gmGameIdBySlotId).toEqual(
      new Map([
        [1, 101],
        [2, 201],
      ]),
    )
    expect(
      editorState.choiceRows.map((choiceRow) => ({
        rowId: choiceRow.rowId,
        slotId: choiceRow.slotId,
        rank: choiceRow.rank,
        gameId: choiceRow.gameId,
      })),
    ).toEqual([
      { rowId: 'member-1-slot-1-rank-0', slotId: 1, rank: 0, gameId: 101 },
      { rowId: 'member-1-slot-1-rank-2', slotId: 1, rank: 2, gameId: null },
      { rowId: 'member-1-slot-1-rank-3', slotId: 1, rank: 3, gameId: 900 },
    ])
    expect(editorState.previousRowIdByRowId).toEqual(
      new Map([
        ['member-1-slot-1-rank-2', 'member-1-slot-1-rank-0'],
        ['member-1-slot-1-rank-3', 'member-1-slot-1-rank-2'],
      ]),
    )
  })
})

describe('cancelled choices', () => {
  test('keeps a choice for a game moved to the cancelled slot', () => {
    const editorState = buildChoiceEditorStateForMember({
      memberId: 1,
      assignments: [],
      choices: [
        {
          ...buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 1 }),
          game: buildGame({ id: 101, slotId: null, playerMin: 2, playerMax: 4, name: 'Cancelled Event' }),
        },
      ],
      configuration: buildConfiguration(1),
      gameCategoryByGameId: new Map([[101, 'user']]),
      gameById: new Map(),
      slotGameIdSet: new Set(),
      slotFilterId: null,
    })

    expect(editorState.choiceRows[0].gameId).toBe(101)
    expect(editorState.choiceRows[0].game?.name).toBe('Cancelled Event')
    expect(
      getGameLabel(editorState.choiceRows[0].gameId, new Map(), 'Unknown game', editorState.choiceRows[0].game),
    ).toBe('Cancelled Event (cancelled)')
  })
})

describe('canEditChoiceRowGameSelection', () => {
  test('blocks editing when the previous choice row is empty or ends in a special game', () => {
    const gameCategoryByGameId: GameCategoryByGameId = new Map([
      [101, 'user'],
      [900, 'any_game'],
      [901, 'no_game'],
    ])

    expect(canEditChoiceRowGameSelection({ previousGameId: null, gameCategoryByGameId })).toBe(false)
    expect(canEditChoiceRowGameSelection({ previousGameId: 900, gameCategoryByGameId })).toBe(false)
    expect(canEditChoiceRowGameSelection({ previousGameId: 901, gameCategoryByGameId })).toBe(false)
  })

  test('allows editing when the previous choice row has a regular game selected', () => {
    expect(
      canEditChoiceRowGameSelection({
        previousGameId: 101,
        gameCategoryByGameId: new Map<number, 'user'>([[101, 'user']]),
      }),
    ).toBe(true)
  })
})

describe('buildUpdatedChoiceRowGameSelection', () => {
  test('promotes first-choice rows to GM rank when the selected game matches the gm game', () => {
    expect(
      buildUpdatedChoiceRowGameSelection({
        choiceRow: {
          rowId: 'member-1-slot-1-rank-1',
          memberId: 1,
          slotId: 1,
          slotLabel: 'Slot 1',
          rank: 1,
          rankLabel: '1st *',
          gameId: 101,
          returningPlayer: true,
        },
        gameId: 201,
        gmGameId: 201,
      }),
    ).toEqual({
      rowId: 'member-1-slot-1-rank-1',
      memberId: 1,
      slotId: 1,
      slotLabel: 'Slot 1',
      rank: 0,
      rankLabel: 'GM *',
      gameId: 201,
      returningPlayer: true,
    })
  })

  test('keeps later-ranked rows on the same rank while updating the selected game', () => {
    expect(
      buildUpdatedChoiceRowGameSelection({
        choiceRow: {
          rowId: 'member-1-slot-1-rank-3',
          memberId: 1,
          slotId: 1,
          slotLabel: 'Slot 1',
          rank: 3,
          rankLabel: '3rd',
          gameId: 101,
          returningPlayer: false,
        },
        gameId: 202,
        gmGameId: 201,
      }),
    ).toEqual({
      rowId: 'member-1-slot-1-rank-3',
      memberId: 1,
      slotId: 1,
      slotLabel: 'Slot 1',
      rank: 3,
      rankLabel: '3rd',
      gameId: 202,
      returningPlayer: false,
    })
  })
})

describe('buildChoiceUpsertsFromUpdates', () => {
  test('adds a clearing upsert when a choice moves to a different rank', () => {
    const upserts = buildChoiceUpsertsFromUpdates({
      updates: [
        {
          rowId: 'member-1-slot-2-rank-1',
          original: {
            rowId: 'member-1-slot-2-rank-1',
            memberId: 1,
            slotId: 2,
            slotLabel: 'Slot 2',
            rank: 1,
            rankLabel: '1st',
            gameId: 101,
            returningPlayer: false,
          },
          updated: {
            rowId: 'member-1-slot-2-rank-1',
            memberId: 1,
            slotId: 2,
            slotLabel: 'Slot 2',
            rank: 0,
            rankLabel: 'GM',
            gameId: 101,
            returningPlayer: true,
          },
          changes: {},
        },
      ],
      year: 2026,
    })

    expect(upserts).toEqual([
      {
        memberId: 1,
        year: 2026,
        slotId: 2,
        rank: 0,
        gameId: 101,
        returningPlayer: true,
      },
      {
        memberId: 1,
        year: 2026,
        slotId: 2,
        rank: 1,
        gameId: null,
        returningPlayer: false,
      },
    ])
  })

  test('keeps a single upsert when the choice rank is unchanged', () => {
    const upserts = buildChoiceUpsertsFromUpdates({
      updates: [
        {
          rowId: 'member-2-slot-1-rank-3',
          original: {
            rowId: 'member-2-slot-1-rank-3',
            memberId: 2,
            slotId: 1,
            slotLabel: 'Slot 1',
            rank: 3,
            rankLabel: '3rd',
            gameId: 202,
            returningPlayer: false,
          },
          updated: {
            rowId: 'member-2-slot-1-rank-3',
            memberId: 2,
            slotId: 1,
            slotLabel: 'Slot 1',
            rank: 3,
            rankLabel: '3rd',
            gameId: 203,
            returningPlayer: true,
          },
          changes: {},
        },
      ],
      year: 2026,
    })

    expect(upserts).toEqual([
      {
        memberId: 2,
        year: 2026,
        slotId: 1,
        rank: 3,
        gameId: 203,
        returningPlayer: true,
      },
    ])
  })
})
