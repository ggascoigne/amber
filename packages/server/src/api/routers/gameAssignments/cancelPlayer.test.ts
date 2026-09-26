import { describe, expect, test, vi } from 'vitest'

import { cancelPlayer } from './cancelPlayer'

import type { TransactionClient } from '../../inRlsTransaction'

const createCancelPlayerTx = () => {
  const membershipFindFirst = vi.fn().mockResolvedValue({ id: 42 })
  const membershipUpdate = vi.fn().mockResolvedValue({ id: 42 })
  const slotFindMany = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }])
  const gameFindMany = vi.fn().mockResolvedValue([
    { id: 101, slotId: 1 },
    { id: 102, slotId: 2 },
  ])
  const gameAssignmentFindMany = vi
    .fn()
    .mockResolvedValueOnce([{ gameId: 201, game: { category: 'user', slotId: 1 } }])
    .mockResolvedValueOnce([
      {
        game: { id: 201, name: 'Goblin Market', slotId: 1 },
        membership: { user: { email: 'gm@example.com', fullName: 'Gwen GM' } },
      },
    ])
  const gameAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: 3 })
  const gameAssignmentCreateMany = vi.fn().mockResolvedValue({ count: 2 })
  const tx = {
    membership: { findFirst: membershipFindFirst, update: membershipUpdate },
    slot: { findMany: slotFindMany },
    game: { findMany: gameFindMany },
    gameAssignment: {
      findMany: gameAssignmentFindMany,
      deleteMany: gameAssignmentDeleteMany,
      createMany: gameAssignmentCreateMany,
    },
  } as unknown as TransactionClient

  return { gameAssignmentCreateMany, gameAssignmentDeleteMany, gameAssignmentFindMany, membershipUpdate, tx }
}

describe('cancelPlayer', () => {
  test('replaces every assignment with the per-slot No Game records and marks the membership not attending', async () => {
    const fixture = createCancelPlayerTx()

    await expect(cancelPlayer({ tx: fixture.tx, input: { memberId: 42, year: 2026 } })).resolves.toEqual({
      assignedNoGameSlots: 2,
      affectedGameMasters: [{ email: 'gm@example.com', gameName: 'Goblin Market', gmName: 'Gwen GM', slotId: 1 }],
    })

    expect(fixture.gameAssignmentDeleteMany).toHaveBeenCalledWith({ where: { memberId: 42, year: 2026 } })
    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(1, {
      where: { memberId: 42, year: 2026, gm: 0 },
      select: { gameId: true, game: { select: { category: true, slotId: true } } },
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenNthCalledWith(2, {
      where: { year: 2026, gm: { gt: 0 }, gameId: { in: [201] } },
      select: {
        game: { select: { id: true, name: true, slotId: true } },
        membership: { select: { user: { select: { email: true, fullName: true } } } },
      },
    })
    expect(fixture.gameAssignmentCreateMany).toHaveBeenCalledWith({
      data: [
        { memberId: 42, gameId: 101, gm: 0, year: 2026 },
        { memberId: 42, gameId: 102, gm: 0, year: 2026 },
      ],
    })
    expect(fixture.membershipUpdate).toHaveBeenCalledWith({ where: { id: 42 }, data: { attending: false } })
  })
})
