import type { TRPCError } from '@trpc/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { assignGameRoom } from './assignGameRoom'
import { syncLegacyGameRoomId } from './legacyRoomSync'

import type { TransactionClient } from '../../inRlsTransaction'

vi.mock('./legacyRoomSync', () => ({
  syncLegacyGameRoomId: vi.fn().mockResolvedValue(undefined),
}))

const syncLegacyGameRoomIdMock = vi.mocked(syncLegacyGameRoomId)

const createAssignGameRoomTx = ({
  game = { id: 10, year: 2026, slotId: 3 },
  room = { id: 20 },
  roomAvailability = null,
  occupiedRoom = null,
  displacedAssignments = [],
  upsertResult = { id: BigInt(1), gameId: 10, roomId: 20, slotId: 3, year: 2026, isOverride: false },
}: {
  game?: { id: number; year: number; slotId: number | null } | null
  room?: { id: number } | null
  roomAvailability?: { isAvailable: boolean } | null
  occupiedRoom?: { id: bigint } | null
  displacedAssignments?: Array<{ gameId: number }>
  upsertResult?: { id: bigint; gameId: number; roomId: number; slotId: number; year: number; isOverride: boolean }
} = {}) => {
  const gameFindUnique = vi.fn().mockResolvedValue(game)
  const roomFindUnique = vi.fn().mockResolvedValue(room)
  const roomSlotAvailabilityFindUnique = vi.fn().mockResolvedValue(roomAvailability)
  const gameRoomAssignmentFindFirst = vi.fn().mockResolvedValue(occupiedRoom)
  const gameRoomAssignmentFindMany = vi.fn().mockResolvedValue(displacedAssignments)
  const gameRoomAssignmentDeleteMany = vi.fn().mockResolvedValue({ count: displacedAssignments.length })
  const gameRoomAssignmentUpsert = vi.fn().mockResolvedValue(upsertResult)

  const tx = {
    game: {
      findUnique: gameFindUnique,
    },
    room: {
      findUnique: roomFindUnique,
    },
    roomSlotAvailability: {
      findUnique: roomSlotAvailabilityFindUnique,
    },
    gameRoomAssignment: {
      findFirst: gameRoomAssignmentFindFirst,
      findMany: gameRoomAssignmentFindMany,
      deleteMany: gameRoomAssignmentDeleteMany,
      upsert: gameRoomAssignmentUpsert,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindUnique,
    roomFindUnique,
    roomSlotAvailabilityFindUnique,
    gameRoomAssignmentFindFirst,
    gameRoomAssignmentFindMany,
    gameRoomAssignmentDeleteMany,
    gameRoomAssignmentUpsert,
    upsertResult,
  }
}

describe('assignGameRoom', () => {
  beforeEach(() => {
    syncLegacyGameRoomIdMock.mockClear()
  })

  test('rejects assignments whose slot or year does not match the game', async () => {
    const fixture = createAssignGameRoomTx({
      game: { id: 10, year: 2026, slotId: 4 },
    })

    await expect(
      assignGameRoom({
        tx: fixture.tx,
        assignedByUserId: 55,
        input: {
          gameId: 10,
          roomId: 20,
          slotId: 3,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Room assignment input did not match game year/slot',
    } satisfies Partial<TRPCError>)

    expect(fixture.gameRoomAssignmentUpsert).not.toHaveBeenCalled()
    expect(syncLegacyGameRoomIdMock).not.toHaveBeenCalled()
  })

  test('rejects missing rooms before mutating assignments', async () => {
    const fixture = createAssignGameRoomTx({
      room: null,
    })

    await expect(
      assignGameRoom({
        tx: fixture.tx,
        assignedByUserId: 55,
        input: {
          gameId: 10,
          roomId: 20,
          slotId: 3,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Room not found',
    } satisfies Partial<TRPCError>)

    expect(fixture.gameRoomAssignmentUpsert).not.toHaveBeenCalled()
    expect(syncLegacyGameRoomIdMock).not.toHaveBeenCalled()
  })

  test('displaces conflicting default assignments and syncs every affected game', async () => {
    const fixture = createAssignGameRoomTx({
      occupiedRoom: { id: BigInt(999) },
      displacedAssignments: [{ gameId: 77 }, { gameId: 88 }],
    })

    const result = await assignGameRoom({
      tx: fixture.tx,
      assignedByUserId: 55,
      input: {
        gameId: 10,
        roomId: 20,
        slotId: 3,
        year: 2026,
        assignmentReason: 'manual override cleanup',
      },
    })

    expect(fixture.roomSlotAvailabilityFindUnique).toHaveBeenCalledWith({
      where: {
        roomId_slotId_year: {
          roomId: 20,
          slotId: 3,
          year: 2026,
        },
      },
      select: {
        isAvailable: true,
      },
    })
    expect(fixture.gameRoomAssignmentFindMany).toHaveBeenCalledWith({
      where: {
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        gameId: {
          not: 10,
        },
      },
      select: {
        gameId: true,
      },
    })
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenNthCalledWith(1, {
      where: {
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        gameId: {
          not: 10,
        },
      },
    })
    expect(fixture.gameRoomAssignmentDeleteMany).toHaveBeenNthCalledWith(2, {
      where: {
        gameId: 10,
        slotId: 3,
        year: 2026,
        isOverride: false,
        roomId: {
          not: 20,
        },
      },
    })
    expect(fixture.gameRoomAssignmentUpsert).toHaveBeenCalledWith({
      where: {
        gameId_roomId_slotId_year_isOverride: {
          gameId: 10,
          roomId: 20,
          slotId: 3,
          year: 2026,
          isOverride: false,
        },
      },
      update: {
        source: 'manual',
        assignmentReason: 'manual override cleanup',
        assignedByUserId: 55,
      },
      create: {
        gameId: 10,
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: false,
        source: 'manual',
        assignmentReason: 'manual override cleanup',
        assignedByUserId: 55,
      },
    })
    expect(syncLegacyGameRoomIdMock).toHaveBeenNthCalledWith(1, {
      tx: fixture.tx,
      gameId: 10,
      year: 2026,
    })
    expect(syncLegacyGameRoomIdMock).toHaveBeenNthCalledWith(2, {
      tx: fixture.tx,
      gameId: 77,
      year: 2026,
    })
    expect(syncLegacyGameRoomIdMock).toHaveBeenNthCalledWith(3, {
      tx: fixture.tx,
      gameId: 88,
      year: 2026,
    })
    expect(result).toEqual({
      assignment: fixture.upsertResult,
    })
  })

  test('keeps override assignments isolated from default-assignment cleanup', async () => {
    const fixture = createAssignGameRoomTx({
      roomAvailability: { isAvailable: false },
    })

    await assignGameRoom({
      tx: fixture.tx,
      assignedByUserId: 55,
      input: {
        gameId: 10,
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: true,
        source: 'auto',
      },
    })

    expect(fixture.gameRoomAssignmentFindMany).not.toHaveBeenCalled()
    expect(fixture.gameRoomAssignmentDeleteMany).not.toHaveBeenCalled()
    expect(fixture.gameRoomAssignmentUpsert).toHaveBeenCalledWith({
      where: {
        gameId_roomId_slotId_year_isOverride: {
          gameId: 10,
          roomId: 20,
          slotId: 3,
          year: 2026,
          isOverride: true,
        },
      },
      update: {
        source: 'auto',
        assignmentReason: null,
        assignedByUserId: 55,
      },
      create: {
        gameId: 10,
        roomId: 20,
        slotId: 3,
        year: 2026,
        isOverride: true,
        source: 'auto',
        assignmentReason: null,
        assignedByUserId: 55,
      },
    })
    expect(syncLegacyGameRoomIdMock).toHaveBeenCalledTimes(1)
    expect(syncLegacyGameRoomIdMock).toHaveBeenCalledWith({
      tx: fixture.tx,
      gameId: 10,
      year: 2026,
    })
  })
})
