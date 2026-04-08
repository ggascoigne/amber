import { describe, expect, test, vi } from 'vitest'

import { setInitialGameAssignments } from './setInitial'

import type { TransactionClient } from '../../inRlsTransaction'

const createSetInitialGameAssignmentsTx = ({
  assignments = [],
  choices = [],
  createdCount = 0,
  games = [],
}: {
  assignments?: Array<{ gameId: number; gm: number; memberId: number }>
  choices?: Array<{ gameId: number; memberId: number; slotId: number }>
  createdCount?: number
  games?: Array<{ category: string; id: number; slotId: number | null }>
} = {}) => {
  const gameFindMany = vi.fn().mockResolvedValue(games)
  const gameAssignmentFindMany = vi.fn().mockResolvedValue(assignments)
  const gameChoiceFindMany = vi.fn().mockResolvedValue(choices)
  const gameAssignmentCreateMany = vi.fn().mockResolvedValue({ count: createdCount })

  const tx = {
    game: {
      findMany: gameFindMany,
    },
    gameAssignment: {
      findMany: gameAssignmentFindMany,
      createMany: gameAssignmentCreateMany,
    },
    gameChoice: {
      findMany: gameChoiceFindMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindMany,
    gameAssignmentFindMany,
    gameChoiceFindMany,
    gameAssignmentCreateMany,
  }
}

describe('setInitialGameAssignments', () => {
  test('loads the existing planner inputs and creates the computed assignments with duplicate skipping', async () => {
    const fixture = createSetInitialGameAssignmentsTx({
      createdCount: 1,
      games: [{ id: 11, slotId: 2, category: 'user' }],
      choices: [{ memberId: 41, gameId: 11, slotId: 2 }],
    })

    const result = await setInitialGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
    })

    expect(fixture.gameFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        id: true,
        slotId: true,
        category: true,
      },
    })
    expect(fixture.gameAssignmentFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      select: {
        memberId: true,
        gameId: true,
        gm: true,
      },
    })
    expect(fixture.gameChoiceFindMany).toHaveBeenCalledWith({
      where: { year: 2026, rank: 1, gameId: { not: null } },
      select: {
        memberId: true,
        gameId: true,
        slotId: true,
      },
    })
    expect(fixture.gameAssignmentCreateMany).toHaveBeenCalledWith({
      data: [{ memberId: 41, gameId: 11, gm: 0, year: 2026 }],
      skipDuplicates: true,
    })
    expect(result).toEqual({
      created: 1,
    })
  })

  test('skips createMany when the planner produces no initial assignments', async () => {
    const fixture = createSetInitialGameAssignmentsTx({
      games: [{ id: 11, slotId: 2, category: 'user' }],
      choices: [{ memberId: 41, gameId: 11, slotId: 2 }],
      assignments: [{ memberId: 41, gameId: 11, gm: 0 }],
    })

    const result = await setInitialGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
    })

    expect(fixture.gameAssignmentCreateMany).not.toHaveBeenCalled()
    expect(result).toEqual({
      created: 0,
    })
  })
})
