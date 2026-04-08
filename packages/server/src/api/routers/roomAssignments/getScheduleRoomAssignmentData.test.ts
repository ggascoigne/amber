import type { TRPCError } from '@trpc/server'
import { describe, expect, test, vi } from 'vitest'

import { getScheduleRoomAssignmentData } from './getScheduleRoomAssignmentData'

import type { TransactionClient } from '../../inRlsTransaction'

const createScheduleRoomAssignmentTx = ({
  game = { id: 10, name: 'Midnight Market', slotId: 3, year: 2026, roomId: 20, category: 'user' },
  rooms = [
    {
      id: 20,
      description: 'Ballroom A',
      size: 12,
      type: 'ballroom',
      enabled: true,
      updated: new Date('2026-01-01T00:00:00.000Z'),
      accessibility: 'accessible' as const,
    },
    {
      id: 21,
      description: 'Ballroom B',
      size: 10,
      type: 'ballroom',
      enabled: true,
      updated: new Date('2026-01-01T00:00:00.000Z'),
      accessibility: 'many_stairs' as const,
    },
  ],
  slotAssignments = [
    { id: BigInt(1), gameId: 10, roomId: 20, slotId: 3, year: 2026 },
    { id: BigInt(2), gameId: 11, roomId: 21, slotId: 3, year: 2026 },
  ],
  slotAvailability = [{ roomId: 20, slotId: 3, isAvailable: false }],
}: {
  game?: {
    id: number
    name: string
    slotId: number | null
    year: number
    roomId: number | null
    category: string
  } | null
  rooms?: Array<{
    id: number
    description: string
    size: number
    type: string
    enabled: boolean
    updated: Date
    accessibility: 'accessible' | 'some_stairs' | 'many_stairs'
  }>
  slotAssignments?: Array<{ id: bigint; gameId: number; roomId: number; slotId: number; year: number }>
  slotAvailability?: Array<{ roomId: number; slotId: number; isAvailable: boolean }>
} = {}) => {
  const gameFindFirst = vi.fn().mockResolvedValue(game)
  const roomFindMany = vi.fn().mockResolvedValue(rooms)
  const gameRoomAssignmentFindMany = vi.fn().mockResolvedValue(slotAssignments)
  const roomSlotAvailabilityFindMany = vi.fn().mockResolvedValue(slotAvailability)

  const tx = {
    game: {
      findFirst: gameFindFirst,
    },
    room: {
      findMany: roomFindMany,
    },
    gameRoomAssignment: {
      findMany: gameRoomAssignmentFindMany,
    },
    roomSlotAvailability: {
      findMany: roomSlotAvailabilityFindMany,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindFirst,
    roomFindMany,
    gameRoomAssignmentFindMany,
    roomSlotAvailabilityFindMany,
    rooms,
    slotAssignments,
  }
}

describe('getScheduleRoomAssignmentData', () => {
  test('rejects missing or unslotted games for the selected year', async () => {
    const missingGame = createScheduleRoomAssignmentTx({
      game: null,
    })
    const unslottedGame = createScheduleRoomAssignmentTx({
      game: { id: 10, name: 'Midnight Market', slotId: null, year: 2026, roomId: null, category: 'user' },
    })

    await expect(
      getScheduleRoomAssignmentData({
        tx: missingGame.tx,
        conventionCode: 'acnw',
        input: {
          gameId: 10,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Game not found for year',
    } satisfies Partial<TRPCError>)

    await expect(
      getScheduleRoomAssignmentData({
        tx: unslottedGame.tx,
        conventionCode: 'acnw',
        input: {
          gameId: 10,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Game not found for year',
    } satisfies Partial<TRPCError>)

    expect(missingGame.roomFindMany).not.toHaveBeenCalled()
    expect(unslottedGame.gameRoomAssignmentFindMany).not.toHaveBeenCalled()
  })

  test('returns slot occupancy and defaults missing room availability rows to available', async () => {
    const fixture = createScheduleRoomAssignmentTx()

    const result = await getScheduleRoomAssignmentData({
      tx: fixture.tx,
      conventionCode: 'acus',
      input: {
        gameId: 10,
        year: 2026,
      },
    })

    expect(fixture.gameFindFirst).toHaveBeenCalledWith({
      where: {
        id: 10,
        year: 2026,
      },
      select: {
        id: true,
        name: true,
        slotId: true,
        year: true,
        roomId: true,
        category: true,
      },
    })
    expect(fixture.gameRoomAssignmentFindMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        slotId: 3,
        isOverride: false,
      },
      select: {
        id: true,
        gameId: true,
        roomId: true,
        slotId: true,
        year: true,
      },
    })
    expect(fixture.roomSlotAvailabilityFindMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        slotId: 3,
      },
      select: {
        roomId: true,
        slotId: true,
        isAvailable: true,
      },
    })
    expect(result).toEqual({
      convention: 'acus',
      game: {
        id: 10,
        name: 'Midnight Market',
        slotId: 3,
        year: 2026,
        roomId: 20,
        category: 'user',
      },
      currentAssignment: fixture.slotAssignments[0],
      rooms: [
        {
          ...fixture.rooms[0],
          occupiedByGameId: 10,
          isAvailable: false,
        },
        {
          ...fixture.rooms[1],
          occupiedByGameId: 11,
          isAvailable: true,
        },
      ],
    })
  })
})
