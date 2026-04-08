import { describe, expect, test, vi } from 'vitest'

import { updateGameAssignments } from './update'

import type { TransactionClient } from '../../inRlsTransaction'

const createUpdateGameAssignmentsTx = ({
  createdCount = 0,
  deletedCount = 0,
}: {
  createdCount?: number
  deletedCount?: number
} = {}) => {
  const gameAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: deletedCount })
  const gameAssignmentCreateMany = vi.fn().mockResolvedValue({ count: createdCount })

  const tx = {
    gameAssignment: {
      deleteMany: gameAssignmentDeleteMany,
      createMany: gameAssignmentCreateMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameAssignmentDeleteMany,
    gameAssignmentCreateMany,
  }
}

describe('updateGameAssignments helper', () => {
  test('skips persistence when there are no adds or removes', async () => {
    const fixture = createUpdateGameAssignmentsTx()

    const result = await updateGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
        adds: [],
        removes: [],
      },
    })

    expect(fixture.gameAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(fixture.gameAssignmentCreateMany).not.toHaveBeenCalled()
    expect(result).toEqual({
      deleted: 0,
      created: 0,
    })
  })

  test('deletes requested assignments using the top-level year and skips createMany when there are no adds', async () => {
    const fixture = createUpdateGameAssignmentsTx({ deletedCount: 2 })

    const result = await updateGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
        adds: [],
        removes: [
          { memberId: 1, gameId: 11, gm: 0, year: 1999 },
          { memberId: 2, gameId: 12, gm: 1, year: 1999 },
        ],
      },
    })

    expect(fixture.gameAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { memberId: 1, gameId: 11, gm: 0, year: 2026 },
          { memberId: 2, gameId: 12, gm: 1, year: 2026 },
        ],
      },
    })
    expect(fixture.gameAssignmentCreateMany).not.toHaveBeenCalled()
    expect(result).toEqual({
      deleted: 2,
      created: 0,
    })
  })

  test('creates requested assignments using the top-level year and skips deleteMany when there are no removes', async () => {
    const fixture = createUpdateGameAssignmentsTx({ createdCount: 3 })

    const result = await updateGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
        adds: [
          { memberId: 3, gameId: 21, gm: 0, year: 1999 },
          { memberId: 4, gameId: 22, gm: 2, year: 1999 },
          { memberId: 5, gameId: 23, gm: -1, year: 1999 },
        ],
        removes: [],
      },
    })

    expect(fixture.gameAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(fixture.gameAssignmentCreateMany).toHaveBeenCalledWith({
      data: [
        { memberId: 3, gameId: 21, gm: 0, year: 2026 },
        { memberId: 4, gameId: 22, gm: 2, year: 2026 },
        { memberId: 5, gameId: 23, gm: -1, year: 2026 },
      ],
      skipDuplicates: true,
    })
    expect(result).toEqual({
      deleted: 0,
      created: 3,
    })
  })
})
