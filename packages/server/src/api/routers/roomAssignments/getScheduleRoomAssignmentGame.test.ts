import type { TRPCError } from '@trpc/server'
import { describe, expect, test, vi } from 'vitest'

import { getScheduleRoomAssignmentGame } from './getScheduleRoomAssignmentGame'

import type { TransactionClient } from '../../inRlsTransaction'

const createScheduleRoomAssignmentGameTx = ({
  game = { id: 10, name: 'Midnight Market', slotId: 3, year: 2026, roomId: 20, category: 'user' },
}: {
  game?: {
    id: number
    name: string
    slotId: number | null
    year: number
    roomId: number | null
    category: string
  } | null
} = {}) => {
  const gameFindFirst = vi.fn().mockResolvedValue(game)

  const tx = {
    game: {
      findFirst: gameFindFirst,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindFirst,
    game,
  }
}

describe('getScheduleRoomAssignmentGame', () => {
  test('rejects missing or unslotted games for the selected year', async () => {
    const missingGame = createScheduleRoomAssignmentGameTx({
      game: null,
    })
    const unslottedGame = createScheduleRoomAssignmentGameTx({
      game: { id: 10, name: 'Midnight Market', slotId: null, year: 2026, roomId: null, category: 'user' },
    })

    await expect(
      getScheduleRoomAssignmentGame({
        tx: missingGame.tx,
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
      getScheduleRoomAssignmentGame({
        tx: unslottedGame.tx,
        input: {
          gameId: 10,
          year: 2026,
        },
      }),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Game not found for year',
    } satisfies Partial<TRPCError>)
  })

  test('returns the selected game with a narrowed slot id when it exists', async () => {
    const fixture = createScheduleRoomAssignmentGameTx()

    const result = await getScheduleRoomAssignmentGame({
      tx: fixture.tx,
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
    expect(result).toEqual(fixture.game)
  })
})
