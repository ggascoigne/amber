import type { TRPCError } from '@trpc/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { syncLegacyGameRoomId } from './legacyRoomSync'
import { removeGameRoomAssignment } from './removeGameRoomAssignment'

import type { TransactionClient } from '../../inRlsTransaction'

vi.mock('./legacyRoomSync', () => ({
  syncLegacyGameRoomId: vi.fn().mockResolvedValue(undefined),
}))

const syncLegacyGameRoomIdMock = vi.mocked(syncLegacyGameRoomId)

const createRemoveGameRoomAssignmentTx = ({
  assignment = { id: BigInt(9), gameId: 77, year: 2026 },
}: {
  assignment?: { id: bigint; gameId: number; year: number } | null
} = {}) => {
  const gameRoomAssignmentFindUnique = vi.fn().mockResolvedValue(assignment)
  const gameRoomAssignmentDelete = vi.fn().mockResolvedValue(undefined)

  const tx = {
    gameRoomAssignment: {
      findUnique: gameRoomAssignmentFindUnique,
      delete: gameRoomAssignmentDelete,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameRoomAssignmentFindUnique,
    gameRoomAssignmentDelete,
  }
}

describe('removeGameRoomAssignment', () => {
  beforeEach(() => {
    syncLegacyGameRoomIdMock.mockClear()
  })

  test('rejects unknown room assignment ids', async () => {
    const fixture = createRemoveGameRoomAssignmentTx({
      assignment: null,
    })

    await expect(
      removeGameRoomAssignment({
        tx: fixture.tx,
        input: {
          id: BigInt(9),
        },
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Room assignment not found',
    } satisfies Partial<TRPCError>)

    expect(fixture.gameRoomAssignmentDelete).not.toHaveBeenCalled()
    expect(syncLegacyGameRoomIdMock).not.toHaveBeenCalled()
  })

  test('deletes the assignment and resyncs the legacy game room id', async () => {
    const fixture = createRemoveGameRoomAssignmentTx()

    const result = await removeGameRoomAssignment({
      tx: fixture.tx,
      input: {
        id: BigInt(9),
      },
    })

    expect(fixture.gameRoomAssignmentFindUnique).toHaveBeenCalledWith({
      where: {
        id: BigInt(9),
      },
      select: {
        id: true,
        gameId: true,
        year: true,
      },
    })
    expect(fixture.gameRoomAssignmentDelete).toHaveBeenCalledWith({
      where: {
        id: BigInt(9),
      },
    })
    expect(syncLegacyGameRoomIdMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      gameId: 77,
      year: 2026,
    })
    expect(result).toEqual({
      deletedRoomAssignmentId: BigInt(9),
    })
  })
})
