import type { TRPCError } from '@trpc/server'
import { describe, expect, test, vi } from 'vitest'

import { getScheduleRoomAssignmentData } from './getScheduleRoomAssignmentData'

import type { TransactionClient } from '../../inRlsTransaction'

const createScheduleRoomAssignmentTx = ({
  game = { id: 10, name: 'Midnight Market', slotId: 3, year: 2026, roomId: 20, category: 'user' },
  roomRows = [
    {
      id: 20,
      description: 'Ballroom A',
      size: 12,
      type: 'ballroom',
      enabled: true,
      updated: new Date('2026-01-01T00:00:00.000Z'),
      accessibility: 'accessible' as const,
      assignmentId: 1n,
      occupiedByGameId: 10,
      assignmentSlotId: 3,
      assignmentYear: 2026,
      isAvailable: false,
    },
    {
      id: 21,
      description: 'Ballroom B',
      size: 10,
      type: 'ballroom',
      enabled: true,
      updated: new Date('2026-01-01T00:00:00.000Z'),
      accessibility: 'many_stairs' as const,
      assignmentId: 2n,
      occupiedByGameId: 11,
      assignmentSlotId: 3,
      assignmentYear: 2026,
      isAvailable: true,
    },
  ],
}: {
  game?: {
    id: number
    name: string
    slotId: number | null
    year: number
    roomId: number | null
    category: string
  } | null
  roomRows?: Array<{
    id: number
    description: string
    size: number
    type: string
    enabled: boolean
    updated: Date
    accessibility: 'accessible' | 'some_stairs' | 'many_stairs'
    assignmentId: bigint | string | null
    occupiedByGameId: number | null
    assignmentSlotId: number | null
    assignmentYear: number | null
    isAvailable: boolean
  }>
} = {}) => {
  const gameFindFirst = vi.fn().mockResolvedValue(game)
  const queryRaw = vi.fn().mockResolvedValue(roomRows)

  const tx = {
    $queryRaw: queryRaw,
    game: {
      findFirst: gameFindFirst,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindFirst,
    queryRaw,
    roomRows,
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

    expect(missingGame.queryRaw).not.toHaveBeenCalled()
    expect(unslottedGame.queryRaw).not.toHaveBeenCalled()
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
    expect(fixture.queryRaw).toHaveBeenCalledTimes(1)
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
      currentAssignment: {
        id: 1n,
        gameId: 10,
        roomId: 20,
        slotId: 3,
        year: 2026,
      },
      rooms: [
        {
          id: 20,
          description: 'Ballroom A',
          size: 12,
          type: 'ballroom',
          enabled: true,
          updated: new Date('2026-01-01T00:00:00.000Z'),
          accessibility: 'accessible',
          occupiedByGameId: 10,
          isAvailable: false,
        },
        {
          id: 21,
          description: 'Ballroom B',
          size: 10,
          type: 'ballroom',
          enabled: true,
          updated: new Date('2026-01-01T00:00:00.000Z'),
          accessibility: 'many_stairs',
          occupiedByGameId: 11,
          isAvailable: true,
        },
      ],
    })
  })
})
