import { describe, expect, test, vi } from 'vitest'

import { getGameAssignmentSummary } from './summaryData'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameAssignmentSummaryTx = () => {
  const slots = [{ id: 1 }, { id: 2 }]
  const memberships = [
    {
      id: 41,
      user: {
        fullName: 'Alex Morgan',
      },
    },
  ]
  const games = [
    {
      id: 11,
      name: 'Goblin Market',
      slotId: 1,
      category: 'user',
      playerMin: 1,
      playerMax: 4,
    },
    {
      id: 12,
      name: 'Any Game',
      slotId: null,
      category: 'any_game',
      playerMin: 0,
      playerMax: 99,
    },
  ]
  const assignments = [
    {
      memberId: 41,
      gameId: 11,
      gm: 0,
      membership: {
        user: {
          fullName: 'Alex Morgan',
        },
      },
      game: {
        id: 11,
        name: 'Goblin Market',
        slotId: 1,
        category: 'user',
        playerMin: 1,
        playerMax: 4,
      },
    },
    {
      memberId: 41,
      gameId: 12,
      gm: 0,
      membership: {
        user: {
          fullName: 'Alex Morgan',
        },
      },
      game: {
        id: 12,
        name: 'Any Game',
        slotId: null,
        category: 'any_game',
        playerMin: 0,
        playerMax: 99,
      },
    },
  ]

  const slotFindMany = vi.fn().mockResolvedValue(slots)
  const membershipFindMany = vi.fn().mockResolvedValue(memberships)
  const gameFindMany = vi.fn().mockResolvedValue(games)
  const gameAssignmentFindMany = vi.fn().mockResolvedValue(assignments)

  const tx = {
    slot: {
      findMany: slotFindMany,
    },
    membership: {
      findMany: membershipFindMany,
    },
    game: {
      findMany: gameFindMany,
    },
    gameAssignment: {
      findMany: gameAssignmentFindMany,
    },
  } as unknown as TransactionClient

  return {
    assignments,
    gameAssignmentFindMany,
    gameFindMany,
    games,
    membershipFindMany,
    memberships,
    slotFindMany,
    slots,
    tx,
  }
}

describe('getGameAssignmentSummary', () => {
  test('loads the existing summary datasets and returns the built summary', async () => {
    const fixture = createGameAssignmentSummaryTx()

    const result = await getGameAssignmentSummary({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
    })

    expect(fixture.slotFindMany).toHaveBeenCalledWith({
      select: { id: true },
      orderBy: [{ id: 'asc' }],
    })
    expect(fixture.membershipFindMany).toHaveBeenCalledWith({
      where: { year: 2026, attending: true },
      select: {
        id: true,
        user: {
          select: {
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        {
          user: {
            lastName: 'asc',
          },
        },
        {
          user: {
            firstName: 'asc',
          },
        },
      ],
    })
    expect(fixture.gameFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        id: true,
        name: true,
        slotId: true,
        category: true,
        playerMin: true,
        playerMax: true,
      },
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenCalledWith({
      where: { year: 2026, gm: { gte: 0 } },
      select: {
        memberId: true,
        gameId: true,
        gm: true,
        membership: {
          select: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        game: {
          select: {
            id: true,
            name: true,
            slotId: true,
            category: true,
            playerMin: true,
            playerMax: true,
          },
        },
      },
    })
    expect(result).toEqual({
      anyGameAssignments: [
        {
          assignmentRole: 'Player',
          gameName: 'Any Game',
          memberId: 41,
          memberName: 'Alex Morgan',
        },
      ],
      belowMinimumGames: [],
      missingAssignments: [
        {
          memberId: 41,
          memberName: 'Alex Morgan',
          missingSlots: [2],
        },
      ],
      noGameRoleMismatches: [],
      overCapGames: [],
    })
  })
})
