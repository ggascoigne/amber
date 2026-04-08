import { describe, expect, test, vi } from 'vitest'

import { getGameAssignmentSchedule } from './schedule'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameAssignmentScheduleTx = () => {
  const schedule = [
    {
      memberId: 41,
      gameId: 11,
      gm: 0,
      year: 2026,
      game: {
        room: {
          description: 'Ballroom A',
        },
        gameAssignment: [
          {
            gameId: 11,
            gm: 0,
            memberId: 41,
            year: 2026,
            membership: {
              user: {
                email: 'alex@example.com',
                fullName: 'Alex Morgan',
              },
            },
          },
        ],
      },
    },
  ]

  const gameAssignmentFindMany = vi.fn().mockResolvedValue(schedule)

  const tx = {
    gameAssignment: {
      findMany: gameAssignmentFindMany,
    },
  } as unknown as TransactionClient

  return {
    gameAssignmentFindMany,
    schedule,
    tx,
  }
}

describe('getGameAssignmentSchedule', () => {
  test('loads scheduled assignments for a member with the existing nested includes', async () => {
    const fixture = createGameAssignmentScheduleTx()

    const result = await getGameAssignmentSchedule({
      tx: fixture.tx,
      input: {
        memberId: 41,
      },
    })

    expect(fixture.gameAssignmentFindMany).toHaveBeenCalledWith({
      where: {
        memberId: 41,
        gm: { gte: 0 },
      },
      include: {
        game: {
          include: {
            room: {
              select: {
                description: true,
              },
            },
            gameAssignment: {
              where: { gm: { gte: 0 } },
              select: {
                gameId: true,
                gm: true,
                memberId: true,
                year: true,
                membership: {
                  select: {
                    user: {
                      select: {
                        email: true,
                        fullName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    expect(result).toEqual(fixture.schedule)
  })
})
