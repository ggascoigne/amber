import type { TRPCError } from '@trpc/server'
import { describe, expect, test, vi } from 'vitest'

import { getAssignGameRoomTarget } from './assignGameRoom.target'

import type { TransactionClient } from '../../inRlsTransaction'

const createAssignGameRoomTargetTx = ({
  game = { id: 10, year: 2026, slotId: 3 },
  room = { id: 20 },
}: {
  game?: { id: number; year: number; slotId: number | null } | null
  room?: { id: number } | null
} = {}) => {
  const gameFindUnique = vi.fn().mockResolvedValue(game)
  const roomFindUnique = vi.fn().mockResolvedValue(room)

  return {
    tx: {
      game: {
        findUnique: gameFindUnique,
      },
      room: {
        findUnique: roomFindUnique,
      },
    } as unknown as Pick<TransactionClient, 'game' | 'room'>,
    gameFindUnique,
    roomFindUnique,
  }
}

describe('getAssignGameRoomTarget', () => {
  test('returns the validated game and room when the input matches', async () => {
    const fixture = createAssignGameRoomTargetTx()

    await expect(
      getAssignGameRoomTarget({
        tx: fixture.tx,
        input: {
          gameId: 10,
          roomId: 20,
          slotId: 3,
          year: 2026,
        },
      }),
    ).resolves.toEqual({
      game: {
        id: 10,
        slotId: 3,
        year: 2026,
      },
      room: {
        id: 20,
      },
    })

    expect(fixture.gameFindUnique).toHaveBeenCalledWith({
      where: {
        id: 10,
      },
      select: {
        id: true,
        year: true,
        slotId: true,
      },
    })
    expect(fixture.roomFindUnique).toHaveBeenCalledWith({
      where: {
        id: 20,
      },
      select: {
        id: true,
      },
    })
  })

  test('rejects missing games and slot or year mismatches', async () => {
    const missingGameFixture = createAssignGameRoomTargetTx({
      game: null,
    })

    await expect(
      getAssignGameRoomTarget({
        tx: missingGameFixture.tx,
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

    const mismatchedSlotFixture = createAssignGameRoomTargetTx({
      game: { id: 10, year: 2026, slotId: 4 },
    })

    await expect(
      getAssignGameRoomTarget({
        tx: mismatchedSlotFixture.tx,
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
  })

  test('rejects missing rooms after the game validation succeeds', async () => {
    const fixture = createAssignGameRoomTargetTx({
      room: null,
    })

    await expect(
      getAssignGameRoomTarget({
        tx: fixture.tx,
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
  })
})
