import { describe, expect, test, vi } from 'vitest'

import { createGameAssignmentRecord, deleteGameAssignmentRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameAssignmentsMutationsTx = () => {
  const gameAssignmentCreate = vi.fn().mockResolvedValue({
    memberId: 12,
    gameId: 34,
    gm: 1,
    year: 2026,
  })
  const gameAssignmentDelete = vi.fn().mockResolvedValue({
    memberId: 13,
    gameId: 55,
    gm: -1,
    year: 2027,
  })

  const tx = {
    gameAssignment: {
      create: gameAssignmentCreate,
      delete: gameAssignmentDelete,
    },
  } as unknown as TransactionClient

  return {
    gameAssignmentCreate,
    gameAssignmentDelete,
    tx,
  }
}

describe('game assignment mutation helpers', () => {
  test('creates game assignments with the existing direct create payload and wrapped response shape', async () => {
    const fixture = createGameAssignmentsMutationsTx()

    const result = await createGameAssignmentRecord({
      tx: fixture.tx,
      input: {
        memberId: 12,
        gameId: 34,
        gm: 1,
        year: 2026,
      },
    })

    expect(fixture.gameAssignmentCreate).toHaveBeenCalledWith({
      data: {
        memberId: 12,
        gameId: 34,
        gm: 1,
        year: 2026,
      },
    })
    expect(result).toEqual({
      gameAssignment: {
        memberId: 12,
        gameId: 34,
        gm: 1,
        year: 2026,
      },
    })
  })

  test('deletes game assignments by the existing compound key and preserves the empty response object', async () => {
    const fixture = createGameAssignmentsMutationsTx()

    const result = await deleteGameAssignmentRecord({
      tx: fixture.tx,
      input: {
        memberId: 13,
        gameId: 55,
        gm: -1,
        year: 2027,
      },
    })

    expect(fixture.gameAssignmentDelete).toHaveBeenCalledWith({
      where: {
        memberId_gameId_gm_year: {
          memberId: 13,
          gameId: 55,
          gm: -1,
          year: 2027,
        },
      },
    })
    expect(result).toEqual({})
  })
})
