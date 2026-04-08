import { describe, expect, test, vi } from 'vitest'

import { getGameAssignmentDashboardData } from './dashboard'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameAssignmentDashboardTx = () => {
  const games = [
    {
      id: 11,
      name: 'Goblin Market',
      slotId: 2,
      category: 'user',
      playerMin: 4,
      playerMax: 6,
      playerPreference: 'veterans',
      message: 'Bring dice',
      returningPlayers: 'yes',
      year: 2026,
    },
  ]
  const assignments = [
    {
      memberId: 41,
      gameId: 11,
      gm: 0,
      year: 2026,
      membership: {
        id: 41,
        user: {
          fullName: 'Alex Morgan',
        },
      },
      game: {
        id: 11,
        name: 'Goblin Market',
        slotId: 2,
        category: 'user',
      },
    },
  ]
  const choices = [
    {
      id: 101,
      memberId: 41,
      gameId: 11,
      rank: 1,
      slotId: 2,
      year: 2026,
      returningPlayer: false,
      membership: {
        id: 41,
        user: {
          fullName: 'Alex Morgan',
        },
      },
      game: {
        id: 11,
        name: 'Goblin Market',
        slotId: 2,
        category: 'user',
      },
    },
  ]
  const submissions = [
    {
      id: 201,
      memberId: 41,
      year: 2026,
      message: 'Happy to GM if needed',
      membership: {
        id: 41,
        user: {
          fullName: 'Alex Morgan',
        },
      },
    },
  ]
  const memberships = [
    {
      id: 41,
      userId: 7,
      year: 2026,
      attending: true,
      user: {
        fullName: 'Alex Morgan',
      },
    },
  ]

  const gameFindMany = vi.fn().mockResolvedValue(games)
  const gameAssignmentFindMany = vi.fn().mockResolvedValue(assignments)
  const gameChoiceFindMany = vi.fn().mockResolvedValue(choices)
  const gameSubmissionFindMany = vi.fn().mockResolvedValue(submissions)
  const membershipFindMany = vi.fn().mockResolvedValue(memberships)

  const tx = {
    game: {
      findMany: gameFindMany,
    },
    gameAssignment: {
      findMany: gameAssignmentFindMany,
    },
    gameChoice: {
      findMany: gameChoiceFindMany,
    },
    gameSubmission: {
      findMany: gameSubmissionFindMany,
    },
    membership: {
      findMany: membershipFindMany,
    },
  } as unknown as TransactionClient

  return {
    assignments,
    choices,
    gameAssignmentFindMany,
    gameChoiceFindMany,
    gameFindMany,
    games,
    membershipFindMany,
    memberships,
    submissions,
    gameSubmissionFindMany,
    tx,
  }
}

describe('getGameAssignmentDashboardData', () => {
  test('loads the dashboard datasets with the existing year filters, selects, and ordering', async () => {
    const fixture = createGameAssignmentDashboardTx()

    const result = await getGameAssignmentDashboardData({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
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
        playerPreference: true,
        message: true,
        returningPlayers: true,
        year: true,
      },
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        memberId: true,
        gameId: true,
        gm: true,
        year: true,
        membership: {
          select: {
            id: true,
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
          },
        },
      },
    })
    expect(fixture.gameChoiceFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        id: true,
        memberId: true,
        gameId: true,
        rank: true,
        slotId: true,
        year: true,
        returningPlayer: true,
        membership: {
          select: {
            id: true,
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
          },
        },
      },
    })
    expect(fixture.gameSubmissionFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        id: true,
        memberId: true,
        year: true,
        message: true,
        membership: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })
    expect(fixture.membershipFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        id: true,
        userId: true,
        year: true,
        attending: true,
        user: {
          select: {
            fullName: true,
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
    expect(result).toEqual({
      games: fixture.games,
      assignments: fixture.assignments,
      choices: fixture.choices,
      submissions: fixture.submissions,
      memberships: fixture.memberships,
    })
  })
})
