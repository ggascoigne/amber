import { describe, expect, test } from 'vitest'

import { buildGameAssignmentSummary } from './summary'

describe('game assignment summary helper', () => {
  test('builds the dashboard summary buckets from scheduled assignments', () => {
    const summary = buildGameAssignmentSummary({
      assignments: [
        {
          game: {
            category: 'any_game',
            id: 1,
            name: 'Any Adventure',
            playerMax: 4,
            playerMin: 0,
            slotId: 1,
          },
          gameId: 1,
          gm: 2,
          memberId: 20,
          membership: {
            user: {
              fullName: 'Bob Example',
            },
          },
        },
        {
          game: {
            category: 'any_game',
            id: 1,
            name: 'Any Adventure',
            playerMax: 4,
            playerMin: 0,
            slotId: 1,
          },
          gameId: 1,
          gm: 0,
          memberId: 10,
          membership: {
            user: {
              fullName: 'Alice Example',
            },
          },
        },
        {
          game: {
            category: 'no_game',
            id: 2,
            name: 'Volunteer Host',
            playerMax: 0,
            playerMin: 0,
            slotId: 2,
          },
          gameId: 2,
          gm: 1,
          memberId: 10,
          membership: {
            user: {
              fullName: 'Alice Example',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 3,
            name: 'Mystery Manor',
            playerMax: 4,
            playerMin: 2,
            slotId: 2,
          },
          gameId: 3,
          gm: 0,
          memberId: 10,
          membership: {
            user: {
              fullName: 'Alice Example',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 4,
            name: 'Zebra Quest',
            playerMax: 1,
            playerMin: 1,
            slotId: 3,
          },
          gameId: 4,
          gm: 0,
          memberId: 20,
          membership: {
            user: {
              fullName: 'Bob Example',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 4,
            name: 'Zebra Quest',
            playerMax: 1,
            playerMin: 1,
            slotId: 3,
          },
          gameId: 4,
          gm: 0,
          memberId: 30,
          membership: {
            user: {
              fullName: null,
            },
          },
        },
      ],
      games: [
        {
          category: 'any_game',
          id: 1,
          name: 'Any Adventure',
          playerMax: 4,
          playerMin: 0,
          slotId: 1,
        },
        {
          category: 'no_game',
          id: 2,
          name: 'Volunteer Host',
          playerMax: 0,
          playerMin: 0,
          slotId: 2,
        },
        {
          category: 'user',
          id: 3,
          name: 'Mystery Manor',
          playerMax: 4,
          playerMin: 2,
          slotId: 2,
        },
        {
          category: 'user',
          id: 4,
          name: 'Zebra Quest',
          playerMax: 1,
          playerMin: 1,
          slotId: 3,
        },
        {
          category: 'no_game',
          id: 5,
          name: 'No Game',
          playerMax: 0,
          playerMin: 0,
          slotId: 1,
        },
      ],
      memberships: [
        {
          id: 10,
          user: {
            fullName: 'Alice Example',
          },
        },
        {
          id: 20,
          user: {
            fullName: 'Bob Example',
          },
        },
        {
          id: 30,
          user: {
            fullName: null,
          },
        },
      ],
      slots: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })

    expect(summary).toEqual({
      anyGameAssignments: [
        {
          assignmentRole: 'Player',
          gameName: 'Any Adventure',
          memberId: 10,
          memberName: 'Alice Example',
        },
        {
          assignmentRole: 'GM',
          gameName: 'Any Adventure',
          memberId: 20,
          memberName: 'Bob Example',
        },
      ],
      belowMinimumGames: [
        {
          gameId: 3,
          gameName: 'Mystery Manor',
          playerCount: 1,
          playerMax: 4,
          playerMin: 2,
          slotId: 2,
        },
      ],
      missingAssignments: [
        {
          memberId: 10,
          memberName: 'Alice Example',
          missingSlots: [3],
        },
        {
          memberId: 20,
          memberName: 'Bob Example',
          missingSlots: [2],
        },
        {
          memberId: 30,
          memberName: 'Unknown member',
          missingSlots: [1, 2],
        },
      ],
      noGameRoleMismatches: [
        {
          gameId: 2,
          gameName: 'Volunteer Host',
          gmCount: 1,
          playerCount: 0,
          slotId: 2,
        },
      ],
      overCapGames: [
        {
          gameId: 4,
          gameName: 'Zebra Quest',
          playerCount: 2,
          playerMax: 1,
          playerMin: 1,
          slotId: 3,
        },
      ],
    })
  })

  test('sorts capacity issues by slot then game name and omits fully scheduled members', () => {
    const summary = buildGameAssignmentSummary({
      assignments: [
        {
          game: {
            category: 'user',
            id: 11,
            name: 'Gamma',
            playerMax: 1,
            playerMin: 2,
            slotId: 2,
          },
          gameId: 11,
          gm: 0,
          memberId: 1,
          membership: {
            user: {
              fullName: 'Complete Member',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 12,
            name: 'Alpha',
            playerMax: 1,
            playerMin: 2,
            slotId: null,
          },
          gameId: 12,
          gm: 0,
          memberId: 1,
          membership: {
            user: {
              fullName: 'Complete Member',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 14,
            name: 'Delta',
            playerMax: 4,
            playerMin: 1,
            slotId: 1,
          },
          gameId: 14,
          gm: 0,
          memberId: 1,
          membership: {
            user: {
              fullName: 'Complete Member',
            },
          },
        },
        {
          game: {
            category: 'user',
            id: 13,
            name: 'Beta',
            playerMax: 1,
            playerMin: 2,
            slotId: 1,
          },
          gameId: 13,
          gm: 0,
          memberId: 2,
          membership: {
            user: {
              fullName: 'Partial Member',
            },
          },
        },
      ],
      games: [
        {
          category: 'user',
          id: 12,
          name: 'Alpha',
          playerMax: 1,
          playerMin: 2,
          slotId: null,
        },
        {
          category: 'user',
          id: 11,
          name: 'Gamma',
          playerMax: 1,
          playerMin: 2,
          slotId: 2,
        },
        {
          category: 'user',
          id: 13,
          name: 'Beta',
          playerMax: 1,
          playerMin: 2,
          slotId: 1,
        },
        {
          category: 'user',
          id: 14,
          name: 'Delta',
          playerMax: 4,
          playerMin: 1,
          slotId: 1,
        },
      ],
      memberships: [
        {
          id: 1,
          user: {
            fullName: 'Complete Member',
          },
        },
        {
          id: 2,
          user: {
            fullName: 'Partial Member',
          },
        },
      ],
      slots: [{ id: 1 }, { id: 2 }],
    })

    expect(summary.missingAssignments).toEqual([
      {
        memberId: 2,
        memberName: 'Partial Member',
        missingSlots: [2],
      },
    ])

    expect(summary.belowMinimumGames).toEqual([
      {
        gameId: 13,
        gameName: 'Beta',
        playerCount: 1,
        playerMax: 1,
        playerMin: 2,
        slotId: 1,
      },
      {
        gameId: 11,
        gameName: 'Gamma',
        playerCount: 1,
        playerMax: 1,
        playerMin: 2,
        slotId: 2,
      },
      {
        gameId: 12,
        gameName: 'Alpha',
        playerCount: 1,
        playerMax: 1,
        playerMin: 2,
        slotId: null,
      },
    ])
  })
})
