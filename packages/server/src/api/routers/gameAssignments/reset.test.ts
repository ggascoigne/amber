import { describe, expect, test, vi } from 'vitest'

import { resetGameAssignments } from './reset'

import type { TransactionClient } from '../../inRlsTransaction'

const createResetGameAssignmentsTx = ({ deletedCount = 0 }: { deletedCount?: number } = {}) => {
  const gameAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: deletedCount })

  const tx = {
    gameAssignment: {
      deleteMany: gameAssignmentDeleteMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameAssignmentDeleteMany,
  }
}

describe('resetGameAssignments', () => {
  test('deletes only scheduled assignments for the requested year', async () => {
    const fixture = createResetGameAssignmentsTx({ deletedCount: 4 })

    const result = await resetGameAssignments({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
    })

    expect(fixture.gameAssignmentDeleteMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        gm: { gte: 0 },
      },
    })
    expect(result).toEqual({
      deleted: 4,
    })
  })
})
