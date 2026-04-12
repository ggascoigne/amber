import { describe, expect, test } from 'vitest'

import { buildChoicesByMemberSlot } from './assignmentSummaries'
import {
  buildAssignmentUpdatePayload,
  buildGameAssignmentAddPayload,
  buildGameAssignmentEditorRows,
  buildGameAssignmentPayloadFromUpdates,
  buildMemberAssignmentEditorRows,
  buildMemberAssignmentPayloadFromUpdates,
  buildUpdatedGameAssignmentRowMemberSelection,
  buildUpdatedMemberAssignmentRowGameSelection,
} from './memberAssignments'
import { buildAssignment, buildChoice, buildGame } from './testHelpers'

import { PlayerPreference } from '../../../utils/selectValues'

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
