import { describe, expect, test } from 'vitest'

import type {
  DashboardAssignment,
  DashboardChoice,
  DashboardGame,
  DashboardMembership,
  DashboardSubmission,
} from './utils'
import {
  buildAssignmentCountsByGameId,
  buildGameAssignmentAddPayload,
  buildUpdatedChoiceRowGameSelection,
  buildChoiceUpsertsFromUpdates,
  buildGameAssignmentEditorRows,
  buildGameAssignmentPayloadFromUpdates,
  buildGameAssignmentSummaryRows,
  buildGameInterestSummaryRows,
  buildAssignmentUpdatePayload,
  buildAssignedSlotCountsByMemberId,
  buildMemberAssignmentPayloadFromUpdates,
  buildMemberAssignmentEditorRows,
  buildChoiceEditorStateForMember,
  buildChoicesByMemberSlot,
  buildInterestChoicesByGameId,
  buildInterestCountsByGameId,
  buildInterestRowsForGame,
  buildMemberAssignmentSummaryRows,
  buildMemberChoiceSummaryRows,
  buildMemberAssignmentCountsByMemberId,
  buildMoveSelectOptions,
  buildSlotAssignmentScope,
  buildUpdatedGameAssignmentRowMemberSelection,
  buildUpdatedMemberAssignmentRowGameSelection,
  canEditChoiceRowGameSelection,
} from './utils'

import type { Configuration, GameCategoryByGameId } from '../../utils'
import { PlayerPreference } from '../../utils/selectValues'

const buildGame = ({
  id,
  playerMin,
  playerMax,
  slotId = 1,
  category = 'user',
  name = `Game ${id}`,
  playerPreference = '',
}: {
  id: number
  playerMin: number
  playerMax: number
  slotId?: number | null
  category?: string
  name?: string
  playerPreference?: string
}) => ({ id, name, playerMin, playerMax, slotId, category, playerPreference }) as DashboardGame

const buildAssignment = ({
  memberId,
  gameId,
  gm,
  slotId,
  year = 2026,
  category = 'user',
}: {
  memberId: number
  gameId: number
  gm: number
  slotId?: number
  year?: number
  category?: string
}) =>
  ({
    memberId,
    gameId,
    gm,
    year,
    game: {
      id: gameId,
      message: '',
      name: `Game ${gameId}`,
      playerMax: 4,
      playerMin: 2,
      playerPreference: '',
      returningPlayers: '',
      slotId: slotId ?? null,
      category,
      year,
    } as DashboardGame,
    membership: {
      id: memberId,
      user: {
        fullName: `Member ${memberId}`,
      },
    },
  }) as DashboardAssignment

const buildChoice = ({
  memberId,
  slotId,
  gameId,
  rank,
  returningPlayer = false,
  fullName = `Member ${memberId}`,
}: {
  memberId: number
  slotId: number
  gameId: number
  rank: number
  returningPlayer?: boolean
  fullName?: string | null
}) =>
  ({
    memberId,
    slotId,
    gameId,
    rank,
    returningPlayer,
    membership: {
      user: {
        fullName,
      },
    },
  }) as DashboardChoice

const buildConfiguration = (numberOfSlots: number) => ({ numberOfSlots }) as Configuration

const buildMembership = ({
  id,
  attending = true,
  fullName = `Member ${id}`,
}: {
  id: number
  attending?: boolean
  fullName?: string | null
}) =>
  ({
    id,
    attending,
    user: {
      fullName,
    },
  }) as DashboardMembership

const buildSubmission = ({ memberId, message = '' }: { memberId: number; message?: string }) =>
  ({
    memberId,
    message,
  }) as DashboardSubmission

describe('buildAssignmentCountsByGameId', () => {
  test('discounts gm assignments from overrun shortfall and spaces', () => {
    const games = [buildGame({ id: 1, playerMin: 2, playerMax: 2 }), buildGame({ id: 2, playerMin: 1, playerMax: 3 })]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 4, gameId: 1, gm: 1 }),
      buildAssignment({ memberId: 5, gameId: 1, gm: 2 }),
      buildAssignment({ memberId: 6, gameId: 1, gm: -1 }),
      buildAssignment({ memberId: 7, gameId: 2, gm: 1 }),
    ]

    const countsByGameId = buildAssignmentCountsByGameId(games, assignments)

    expect(countsByGameId.get(1)).toEqual({
      assignedCount: 5,
      overrun: 1,
      shortfall: -1,
      spaces: 0,
    })
    expect(countsByGameId.get(2)).toEqual({
      assignedCount: 1,
      overrun: 0,
      shortfall: 1,
      spaces: 3,
    })
  })
})

describe('buildGameAssignmentSummaryRows', () => {
  test('reuses assignment counts and preserves the existing fallback formatting defaults', () => {
    const games = [
      buildGame({
        id: 1,
        name: 'Returning Players Only',
        playerMin: 2,
        playerMax: 4,
        playerPreference: PlayerPreference.RetOnly,
      }),
      buildGame({ id: 2, playerMin: 1, playerMax: 3 }),
    ]

    const summaryRows = buildGameAssignmentSummaryRows(
      games,
      new Map([
        [
          1,
          {
            assignedCount: 5,
            overrun: 2,
            shortfall: -2,
            spaces: 0,
          },
        ],
      ]),
    )

    expect(summaryRows).toEqual([
      {
        gameId: 1,
        slotId: 1,
        name: 'Returning Players Only *',
        playerMin: 2,
        playerMax: 4,
        assignedCount: 5,
        overrun: 2,
        shortfall: -2,
        spaces: 0,
      },
      {
        gameId: 2,
        slotId: 1,
        name: 'Game 2',
        playerMin: 1,
        playerMax: 3,
        assignedCount: 0,
        overrun: 0,
        shortfall: 1,
        spaces: 3,
      },
    ])
  })
})

describe('buildGameAssignmentEditorRows', () => {
  test('builds expanded game assignment rows while preserving slot fallback, priority labels, and count defaults', () => {
    const choicesByMemberSlot = buildChoicesByMemberSlot([
      buildChoice({ memberId: 1, slotId: 2, gameId: 101, rank: 1, returningPlayer: true }),
    ])

    expect(
      buildGameAssignmentEditorRows({
        assignments: [
          buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 2 }),
          buildAssignment({ memberId: 2, gameId: 202, gm: 1 }),
        ],
        choicesByMemberSlot,
        memberAssignmentCountsByMemberId: new Map([
          [
            1,
            {
              gmOrFirst: 1,
              second: 0,
              third: 0,
              fourth: 0,
              other: 0,
            },
          ],
        ]),
        fallbackSlotId: 3,
      }),
    ).toEqual([
      {
        rowId: '1-101-0',
        memberId: 1,
        gameId: 101,
        slotId: 2,
        gm: 0,
        moveToGameId: 101,
        priorityLabel: '1st *',
        prioritySortValue: 0.5,
        counts: {
          gmOrFirst: 1,
          second: 0,
          third: 0,
          fourth: 0,
          other: 0,
        },
      },
      {
        rowId: '2-202-1',
        memberId: 2,
        gameId: 202,
        slotId: 3,
        gm: 1,
        moveToGameId: 202,
        priorityLabel: 'Other',
        prioritySortValue: Number.POSITIVE_INFINITY,
        counts: {
          gmOrFirst: 0,
          second: 0,
          third: 0,
          fourth: 0,
          other: 0,
        },
      },
    ])
  })
})

describe('buildGameInterestSummaryRows', () => {
  test('adds overall interest counts onto shared game summary rows and falls back to zero when absent', () => {
    const games = [
      buildGame({
        id: 1,
        name: 'Returning Players Only',
        playerMin: 2,
        playerMax: 4,
        playerPreference: PlayerPreference.RetOnly,
      }),
      buildGame({ id: 2, playerMin: 1, playerMax: 3 }),
    ]

    const summaryRows = buildGameInterestSummaryRows({
      games,
      assignmentCountsByGameId: new Map([
        [
          1,
          {
            assignedCount: 5,
            overrun: 2,
            shortfall: -2,
            spaces: 0,
          },
        ],
      ]),
      interestCountsByGameId: new Map([[2, 7]]),
    })

    expect(summaryRows).toEqual([
      {
        gameId: 1,
        slotId: 1,
        name: 'Returning Players Only *',
        playerMin: 2,
        playerMax: 4,
        assignedCount: 5,
        overrun: 2,
        shortfall: -2,
        spaces: 0,
        overallInterest: 0,
      },
      {
        gameId: 2,
        slotId: 1,
        name: 'Game 2',
        playerMin: 1,
        playerMax: 3,
        assignedCount: 0,
        overrun: 0,
        shortfall: 1,
        spaces: 3,
        overallInterest: 7,
      },
    ])
  })
})

describe('buildSlotAssignmentScope', () => {
  test('includes slot-matched games plus any-game entries when requested', () => {
    const games = [
      buildGame({ id: 1, playerMin: 2, playerMax: 4, slotId: 1, category: 'user' }),
      buildGame({ id: 2, playerMin: 2, playerMax: 4, slotId: 2, category: 'user' }),
      buildGame({ id: 3, playerMin: 0, playerMax: 4, slotId: 2, category: 'no_game' }),
      buildGame({ id: 4, playerMin: 0, playerMax: 99, slotId: null, category: 'any_game' }),
    ]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 2, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 3, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 4, gm: 1 }),
      buildAssignment({ memberId: 4, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 5, gameId: 2, gm: -1 }),
    ]

    const scope = buildSlotAssignmentScope({
      games,
      assignments,
      slotFilterId: 2,
      includeAnyGame: true,
    })

    expect(scope.filteredSlotGames.map((game) => game.id)).toEqual([2, 3, 4])
    expect(Array.from(scope.slotGameIdSet)).toEqual([2, 3, 4])
    expect(scope.scheduledAssignments.map((assignment) => assignment.memberId)).toEqual([1, 2, 3])
  })

  test('can restrict the scope to scheduled user games only', () => {
    const games = [
      buildGame({ id: 1, playerMin: 2, playerMax: 4, slotId: 1, category: 'user' }),
      buildGame({ id: 2, playerMin: 2, playerMax: 4, slotId: 1, category: 'no_game' }),
      buildGame({ id: 3, playerMin: 2, playerMax: 4, slotId: null, category: 'any_game' }),
      buildGame({ id: 4, playerMin: 2, playerMax: 4, slotId: 2, category: 'user' }),
    ]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 2, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 3, gm: 0 }),
      buildAssignment({ memberId: 4, gameId: 4, gm: 1 }),
      buildAssignment({ memberId: 5, gameId: 4, gm: -1 }),
    ]

    const scope = buildSlotAssignmentScope({
      games,
      assignments,
      slotFilterId: null,
      userGamesOnly: true,
    })

    expect(scope.filteredSlotGames.map((game) => game.id)).toEqual([1, 4])
    expect(Array.from(scope.slotGameIdSet)).toEqual([1, 4])
    expect(scope.scheduledAssignments.map((assignment) => assignment.memberId)).toEqual([1, 4])
  })
})

describe('buildInterestChoicesByGameId', () => {
  test('expands any-game choices onto in-scope games while filtering out unattending, no-game, and out-of-scope entries', () => {
    const choicesByGameId = buildInterestChoicesByGameId({
      choices: [
        buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1 }),
        buildChoice({ memberId: 3, slotId: 1, gameId: 101, rank: 1 }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 901, rank: 4 }),
        buildChoice({ memberId: 1, slotId: 2, gameId: 102, rank: 3 }),
      ],
      attendingMemberIdSet: new Set([1, 2]),
      gameCategoryByGameId: new Map([
        [101, 'user'],
        [102, 'user'],
        [900, 'any_game'],
        [901, 'no_game'],
      ]),
      slotGameIdSet: new Set([101]),
      slotGameIdsBySlotId: new Map([[1, [101, 103]]]),
    })

    expect(Array.from(choicesByGameId.entries())).toEqual([
      [
        101,
        [
          buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 }),
          buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1 }),
        ],
      ],
      [103, [buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2 })]],
    ])
  })
})

describe('buildInterestCountsByGameId', () => {
  test('counts unique interested members per game and ignores gm-first rank rows', () => {
    const countsByGameId = buildInterestCountsByGameId(
      new Map([
        [
          101,
          [
            buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 2 }),
            buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 3 }),
            buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 0 }),
            buildChoice({ memberId: 3, slotId: 1, gameId: 101, rank: 4 }),
          ],
        ],
      ]),
    )

    expect(countsByGameId).toEqual(new Map([[101, 2]]))
  })
})

describe('buildInterestRowsForGame', () => {
  test('keeps the best priority per member, annotates any-game choices, and preserves fallback member names', () => {
    const interestRows = buildInterestRowsForGame({
      gameId: 101,
      choices: [
        buildChoice({ memberId: 1, slotId: 1, gameId: 900, rank: 2, fullName: 'Ada' }),
        buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 4, fullName: 'Ada' }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 101, rank: 1, returningPlayer: true, fullName: null }),
        buildChoice({ memberId: 2, slotId: 1, gameId: 900, rank: 3, fullName: null }),
      ],
      gameCategoryByGameId: new Map([
        [101, 'user'],
        [900, 'any_game'],
      ]),
    })

    expect(interestRows).toEqual([
      {
        rowId: 'choice-101-2',
        memberName: 'Unknown member',
        priorityLabel: '1st *',
        prioritySortValue: 0.5,
        rank: 1,
      },
      {
        rowId: 'choice-101-1',
        memberName: 'Ada',
        priorityLabel: '2nd (Any Game)',
        prioritySortValue: 2,
        rank: 2,
      },
    ])
  })
})

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
      { rowId: 'member-1-slot-1-rank-4', slotId: 1, rank: 4, gameId: 901 },
    ])
    expect(editorState.previousRowIdByRowId).toEqual(
      new Map([
        ['member-1-slot-1-rank-2', 'member-1-slot-1-rank-0'],
        ['member-1-slot-1-rank-3', 'member-1-slot-1-rank-2'],
        ['member-1-slot-1-rank-4', 'member-1-slot-1-rank-3'],
      ]),
    )
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
        gameCategoryByGameId: new Map([[101, 'user']]),
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

describe('buildUpdatedMemberAssignmentRowGameSelection', () => {
  test('updates a member assignment row with the selected game label and preserved choice priority details', () => {
    expect(
      buildUpdatedMemberAssignmentRowGameSelection({
        assignmentRow: {
          rowId: 'member-1-slot-1',
          memberId: 1,
          slotId: 1,
          slotLabel: 'Slot 1',
          gameId: 101,
          gameName: 'Old Game',
          gm: 0,
          priorityLabel: 'Other',
          prioritySortValue: Number.POSITIVE_INFINITY,
        },
        gameId: 202,
        gameById: new Map([
          [
            202,
            buildGame({
              id: 202,
              playerMin: 2,
              playerMax: 4,
              name: 'Returning Players Only',
              playerPreference: PlayerPreference.RetOnly,
            }),
          ],
        ]),
        choicesByMemberSlot: buildChoicesByMemberSlot([
          buildChoice({ memberId: 1, slotId: 1, gameId: 202, rank: 2, returningPlayer: true }),
        ]),
      }),
    ).toEqual({
      rowId: 'member-1-slot-1',
      memberId: 1,
      slotId: 1,
      slotLabel: 'Slot 1',
      gameId: 202,
      gameName: 'Returning Players Only *',
      gm: 0,
      priorityLabel: '2nd *',
      prioritySortValue: 1.5,
    })
  })

  test('clears the member assignment row metadata when the selection is removed', () => {
    expect(
      buildUpdatedMemberAssignmentRowGameSelection({
        assignmentRow: {
          rowId: 'member-1-slot-1',
          memberId: 1,
          slotId: 1,
          slotLabel: 'Slot 1',
          gameId: 101,
          gameName: 'Old Game',
          gm: 1,
          priorityLabel: 'GM',
          prioritySortValue: 0,
        },
        gameId: null,
        gameById: new Map(),
        choicesByMemberSlot: new Map(),
      }),
    ).toEqual({
      rowId: 'member-1-slot-1',
      memberId: 1,
      slotId: 1,
      slotLabel: 'Slot 1',
      gameId: null,
      gameName: '',
      gm: 1,
      priorityLabel: '',
      prioritySortValue: Number.POSITIVE_INFINITY,
    })
  })
})

describe('buildUpdatedGameAssignmentRowMemberSelection', () => {
  test('updates a game assignment row with the selected member priority and assignment counts', () => {
    expect(
      buildUpdatedGameAssignmentRowMemberSelection({
        assignmentRow: {
          rowId: 'new-1',
          memberId: null,
          gameId: 101,
          slotId: 2,
          gm: 0,
          moveToGameId: 101,
          priorityLabel: 'Other',
          prioritySortValue: Number.POSITIVE_INFINITY,
          counts: {
            gmOrFirst: 0,
            second: 0,
            third: 0,
            fourth: 0,
            other: 0,
          },
        },
        memberId: 3,
        choicesByMemberSlot: buildChoicesByMemberSlot([
          buildChoice({ memberId: 3, slotId: 2, gameId: 101, rank: 1, returningPlayer: true }),
        ]),
        memberAssignmentCountsByMemberId: new Map([
          [
            3,
            {
              gmOrFirst: 1,
              second: 1,
              third: 0,
              fourth: 0,
              other: 0,
            },
          ],
        ]),
      }),
    ).toEqual({
      rowId: 'new-1',
      memberId: 3,
      gameId: 101,
      slotId: 2,
      gm: 0,
      moveToGameId: 101,
      priorityLabel: '1st *',
      prioritySortValue: 0.5,
      counts: {
        gmOrFirst: 1,
        second: 1,
        third: 0,
        fourth: 0,
        other: 0,
      },
    })
  })

  test('resets counts to empty when the selected member is cleared', () => {
    expect(
      buildUpdatedGameAssignmentRowMemberSelection({
        assignmentRow: {
          rowId: 'new-1',
          memberId: 3,
          gameId: 101,
          slotId: 2,
          gm: 0,
          moveToGameId: 101,
          priorityLabel: '1st *',
          prioritySortValue: 0.5,
          counts: {
            gmOrFirst: 1,
            second: 1,
            third: 0,
            fourth: 0,
            other: 0,
          },
        },
        memberId: null,
        choicesByMemberSlot: new Map(),
        memberAssignmentCountsByMemberId: new Map(),
      }),
    ).toEqual({
      rowId: 'new-1',
      memberId: null,
      gameId: 101,
      slotId: 2,
      gm: 0,
      moveToGameId: 101,
      priorityLabel: 'Other',
      prioritySortValue: Number.POSITIVE_INFINITY,
      counts: {
        gmOrFirst: 0,
        second: 0,
        third: 0,
        fourth: 0,
        other: 0,
      },
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

describe('buildMemberAssignmentPayloadFromUpdates', () => {
  test('removes cleared member assignments while preserving the original gm slot', () => {
    const payload = buildMemberAssignmentPayloadFromUpdates({
      updates: [
        {
          rowId: 'member-1-slot-2',
          original: {
            rowId: 'member-1-slot-2',
            memberId: 1,
            slotId: 2,
            slotLabel: 'Slot 2',
            gameId: 101,
            gameName: 'Game 101',
            gm: 1,
            priorityLabel: 'GM',
            prioritySortValue: 0,
          },
          updated: {
            rowId: 'member-1-slot-2',
            memberId: 1,
            slotId: 2,
            slotLabel: 'Slot 2',
            gameId: null,
            gameName: '',
            gm: 1,
            priorityLabel: '',
            prioritySortValue: Number.POSITIVE_INFINITY,
          },
          changes: {},
        },
      ],
      year: 2026,
    })

    expect(payload).toEqual({
      adds: [],
      removes: [{ memberId: 1, gameId: 101, gm: 1, year: 2026 }],
    })
  })
})

describe('buildGameAssignmentPayloadFromUpdates', () => {
  test('moves an assignment when the member or destination game changes', () => {
    const payload = buildGameAssignmentPayloadFromUpdates({
      updates: [
        {
          rowId: '1-101-0',
          original: {
            rowId: '1-101-0',
            memberId: 1,
            gameId: 101,
            slotId: 1,
            gm: 0,
            moveToGameId: 101,
            priorityLabel: '1st',
            prioritySortValue: 1,
            counts: {
              gmOrFirst: 1,
              second: 0,
              third: 0,
              fourth: 0,
              other: 0,
            },
          },
          updated: {
            rowId: '1-101-0',
            memberId: 2,
            gameId: 101,
            slotId: 1,
            gm: 0,
            moveToGameId: 202,
            priorityLabel: '2nd',
            prioritySortValue: 2,
            counts: {
              gmOrFirst: 0,
              second: 1,
              third: 0,
              fourth: 0,
              other: 0,
            },
          },
          changes: {},
        },
      ],
      year: 2026,
    })

    expect(payload).toEqual({
      adds: [{ memberId: 2, gameId: 202, gm: 0, year: 2026 }],
      removes: [{ memberId: 1, gameId: 101, gm: 0, year: 2026 }],
    })
  })
})

describe('buildGameAssignmentAddPayload', () => {
  test('adds only fully specified new game assignments', () => {
    expect(
      buildGameAssignmentAddPayload({
        assignment: {
          rowId: 'new-1',
          memberId: 3,
          gameId: 101,
          slotId: 1,
          gm: 0,
          moveToGameId: 202,
          priorityLabel: 'Other',
          prioritySortValue: Number.POSITIVE_INFINITY,
          counts: {
            gmOrFirst: 0,
            second: 0,
            third: 0,
            fourth: 0,
            other: 0,
          },
        },
        year: 2026,
      }),
    ).toEqual({
      adds: [{ memberId: 3, gameId: 202, gm: 0, year: 2026 }],
      removes: [],
    })

    expect(
      buildGameAssignmentAddPayload({
        assignment: {
          rowId: 'new-2',
          memberId: null,
          gameId: 101,
          slotId: 1,
          gm: 0,
          moveToGameId: 101,
          priorityLabel: 'Other',
          prioritySortValue: Number.POSITIVE_INFINITY,
          counts: {
            gmOrFirst: 0,
            second: 0,
            third: 0,
            fourth: 0,
            other: 0,
          },
        },
        year: 2026,
      }),
    ).toEqual({
      adds: [],
      removes: [],
    })
  })
})

describe('buildMemberChoiceSummaryRows', () => {
  test('flags missing choices or submissions while preserving note markers and assignment totals', () => {
    const assignedSlotCountsByMemberId = buildAssignedSlotCountsByMemberId([
      buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 1 }),
      buildAssignment({ memberId: 1, gameId: 102, gm: 0, slotId: 2 }),
      buildAssignment({ memberId: 2, gameId: 201, gm: 0, slotId: 1 }),
    ])

    const summaryRows = buildMemberChoiceSummaryRows({
      memberships: [
        buildMembership({ id: 1, fullName: 'Ada' }),
        buildMembership({ id: 2, fullName: null }),
        buildMembership({ id: 3, attending: false }),
      ],
      choicesByMemberId: new Map([
        [
          1,
          [
            buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 1 }),
            buildChoice({ memberId: 1, slotId: 2, gameId: 102, rank: 2 }),
          ],
        ],
        [2, [buildChoice({ memberId: 2, slotId: 1, gameId: 201, rank: 1 })]],
      ]),
      submissionsByMemberId: new Map([
        [1, buildSubmission({ memberId: 1, message: 'Needs late slot' })],
        [3, buildSubmission({ memberId: 3, message: 'Ignored because not attending' })],
      ]),
      assignedSlotCountsByMemberId,
      numberOfSlots: 2,
    })

    expect(summaryRows).toEqual([
      {
        memberId: 1,
        memberName: 'Ada *',
        assignments: 2,
        requiresAttention: false,
      },
      {
        memberId: 2,
        memberName: 'Unknown member',
        assignments: 1,
        requiresAttention: true,
      },
    ])
  })
})

describe('buildMemberAssignmentSummaryRows', () => {
  test('marks note-bearing members, preserves assignment-priority counts, and flags unexpected assignment totals', () => {
    const summaryRows = buildMemberAssignmentSummaryRows({
      memberships: [
        buildMembership({ id: 1, fullName: 'Ada' }),
        buildMembership({ id: 2, fullName: null }),
        buildMembership({ id: 3, attending: false }),
      ],
      submissionsByMemberId: new Map([[1, buildSubmission({ memberId: 1, message: 'Can do late night only' })]]),
      assignedSlotCountsByMemberId: new Map([
        [1, 2],
        [2, 1],
      ]),
      memberAssignmentCountsByMemberId: new Map([
        [
          1,
          {
            gmOrFirst: 1,
            second: 1,
            third: 0,
            fourth: 0,
            other: 0,
          },
        ],
      ]),
      expectedAssignmentCount: 2,
    })

    expect(summaryRows).toEqual([
      {
        memberId: 1,
        memberName: 'Ada *',
        assignments: 2,
        requiresAttention: false,
        counts: {
          gmOrFirst: 1,
          second: 1,
          third: 0,
          fourth: 0,
          other: 0,
        },
      },
      {
        memberId: 2,
        memberName: 'Unknown member',
        assignments: 1,
        requiresAttention: true,
        counts: {
          gmOrFirst: 0,
          second: 0,
          third: 0,
          fourth: 0,
          other: 0,
        },
      },
    ])
  })
})

describe('buildMemberAssignmentEditorRows', () => {
  test('builds slot rows from scheduled assignments while preserving slot filtering, priority labels, and empty-slot fallbacks', () => {
    const choicesByMemberSlot = buildChoicesByMemberSlot([
      buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 2, returningPlayer: true }),
    ])

    expect(
      buildMemberAssignmentEditorRows({
        memberId: 1,
        assignments: [
          buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 1 }),
          buildAssignment({ memberId: 1, gameId: 999, gm: 1, slotId: 2 }),
        ],
        choicesByMemberSlot,
        gameById: new Map([[101, buildGame({ id: 101, playerMin: 2, playerMax: 4, name: 'Late Night Mystery' })]]),
        numberOfSlots: 3,
        slotFilterId: null,
      }),
    ).toEqual([
      {
        rowId: 'member-1-slot-1',
        memberId: 1,
        slotId: 1,
        slotLabel: 'Slot 1',
        gameId: 101,
        gameName: 'Late Night Mystery',
        gm: 0,
        priorityLabel: '2nd *',
        prioritySortValue: 1.5,
      },
      {
        rowId: 'member-1-slot-2',
        memberId: 1,
        slotId: 2,
        slotLabel: 'Slot 2',
        gameId: 999,
        gameName: 'Unknown game',
        gm: 1,
        priorityLabel: 'Other',
        prioritySortValue: Number.POSITIVE_INFINITY,
      },
      {
        rowId: 'member-1-slot-3',
        memberId: 1,
        slotId: 3,
        slotLabel: 'Slot 3',
        gameId: null,
        gameName: '',
        gm: 0,
        priorityLabel: '',
        prioritySortValue: Number.POSITIVE_INFINITY,
      },
    ])

    expect(
      buildMemberAssignmentEditorRows({
        memberId: 1,
        assignments: [buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 1 })],
        choicesByMemberSlot,
        gameById: new Map([[101, buildGame({ id: 101, playerMin: 2, playerMax: 4, name: 'Late Night Mystery' })]]),
        numberOfSlots: 3,
        slotFilterId: 1,
      }),
    ).toEqual([
      {
        rowId: 'member-1-slot-1',
        memberId: 1,
        slotId: 1,
        slotLabel: 'Slot 1',
        gameId: 101,
        gameName: 'Late Night Mystery',
        gm: 0,
        priorityLabel: '2nd *',
        prioritySortValue: 1.5,
      },
    ])
  })
})

describe('buildMemberAssignmentCountsByMemberId', () => {
  test('groups scheduled assignments into the expected priority buckets per member', () => {
    const choicesByMemberSlot = buildChoicesByMemberSlot([
      buildChoice({ memberId: 1, slotId: 1, gameId: 101, rank: 1 }),
      buildChoice({ memberId: 1, slotId: 2, gameId: 102, rank: 2 }),
      buildChoice({ memberId: 1, slotId: 3, gameId: 103, rank: 4 }),
      buildChoice({ memberId: 2, slotId: 1, gameId: 201, rank: 0 }),
      buildChoice({ memberId: 2, slotId: 2, gameId: 202, rank: 3 }),
    ])

    const countsByMemberId = buildMemberAssignmentCountsByMemberId(
      [
        buildAssignment({ memberId: 1, gameId: 101, gm: 0, slotId: 1 }),
        buildAssignment({ memberId: 1, gameId: 102, gm: 0, slotId: 2 }),
        buildAssignment({ memberId: 1, gameId: 103, gm: 0, slotId: 3 }),
        buildAssignment({ memberId: 1, gameId: 104, gm: 0, slotId: 4 }),
        buildAssignment({ memberId: 2, gameId: 201, gm: 1, slotId: 1 }),
        buildAssignment({ memberId: 2, gameId: 202, gm: 0, slotId: 2 }),
        buildAssignment({ memberId: 2, gameId: 203, gm: -1, slotId: 3 }),
      ],
      choicesByMemberSlot,
    )

    expect(countsByMemberId.get(1)).toEqual({
      gmOrFirst: 1,
      second: 1,
      third: 0,
      fourth: 1,
      other: 1,
    })
    expect(countsByMemberId.get(2)).toEqual({
      gmOrFirst: 1,
      second: 0,
      third: 1,
      fourth: 0,
      other: 0,
    })
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

describe('buildAssignmentUpdatePayload', () => {
  test('ignores unchanged edits after projecting the original and updated assignments', () => {
    const payload = buildAssignmentUpdatePayload({
      updates: [
        {
          rowId: 'row-1',
          original: { memberId: 10, gameId: 20, gm: 0, year: 2026, ignoredValue: 'before' },
          updated: { memberId: 10, gameId: 20, gm: 0, year: 2026, ignoredValue: 'after' },
          changes: {},
        },
      ],
      buildOriginalAssignment: ({ memberId, gameId, gm, year }) => ({ memberId, gameId, gm, year }),
      buildUpdatedAssignment: ({ memberId, gameId, gm, year }) => ({ memberId, gameId, gm, year }),
    })

    expect(payload).toEqual({
      adds: [],
      removes: [],
    })
  })

  test('supports remove-only edits when the updated row maps to no assignment', () => {
    const payload = buildAssignmentUpdatePayload({
      updates: [
        {
          rowId: 'row-1',
          original: { memberId: 10, gameId: 20, gm: 1, year: 2026, nextGameId: 20 },
          updated: { memberId: 10, gameId: 20, gm: 1, year: 2026, nextGameId: null },
          changes: {},
        },
      ],
      buildOriginalAssignment: ({ memberId, gameId, gm, year }) => ({ memberId, gameId, gm, year }),
      buildUpdatedAssignment: ({ memberId, gm, nextGameId, year }) =>
        nextGameId ? { memberId, gameId: nextGameId, gm, year } : null,
    })

    expect(payload).toEqual({
      adds: [],
      removes: [{ memberId: 10, gameId: 20, gm: 1, year: 2026 }],
    })
  })

  test('builds remove-and-add edits when the projected assignment changes member or game', () => {
    const payload = buildAssignmentUpdatePayload({
      updates: [
        {
          rowId: 'row-1',
          original: { memberId: 10, gameId: 20, gm: 0, year: 2026, nextGameId: 22 },
          updated: { memberId: 12, gameId: 20, gm: 0, year: 2026, nextGameId: 22 },
          changes: {},
        },
      ],
      buildOriginalAssignment: ({ memberId, gameId, gm, year }) => ({ memberId, gameId, gm, year }),
      buildUpdatedAssignment: ({ memberId, gm, nextGameId, year }) =>
        nextGameId ? { memberId, gameId: nextGameId, gm, year } : null,
    })

    expect(payload).toEqual({
      adds: [{ memberId: 12, gameId: 22, gm: 0, year: 2026 }],
      removes: [{ memberId: 10, gameId: 20, gm: 0, year: 2026 }],
    })
  })
})
