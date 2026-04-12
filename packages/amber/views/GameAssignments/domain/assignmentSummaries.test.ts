import { describe, expect, test } from 'vitest'

import {
  buildAssignedSlotCountsByMemberId,
  buildAssignmentCountsByGameId,
  buildChoicesByMemberSlot,
  buildGameAssignmentSummaryRows,
  buildGameInterestSummaryRows,
  buildMemberAssignmentCountsByMemberId,
  buildMemberAssignmentSummaryRows,
  buildMemberChoiceSummaryRows,
} from './assignmentSummaries'
import { buildAssignment, buildChoice, buildGame, buildMembership, buildSubmission } from './testHelpers'

import { PlayerPreference } from '../../../utils/selectValues'

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
