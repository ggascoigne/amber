import { describe, expect, test, vi } from 'vitest'

import { getGameRoomAndGames, getGameRooms } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameRoomsQueriesTx = () => {
  const rooms = [
    {
      id: 3,
      description: 'Ballroom A',
      size: 8,
      type: 'table',
      enabled: true,
      updated: false,
      accessibility: 'accessible',
    },
  ]
  const roomsWithGames = [
    {
      id: 3,
      description: 'Ballroom A',
      game: [{ id: 14, name: 'Night Train', slotId: 2, gmNames: 'Casey' }],
    },
  ]
  const roomsWithGamesWithoutYear = [
    {
      id: 4,
      description: 'Ballroom B',
      game: [{ id: 15, name: 'Moonbase', slotId: 3, gmNames: 'Jordan' }],
    },
  ]

  const roomFindMany = vi
    .fn()
    .mockResolvedValueOnce(rooms)
    .mockResolvedValueOnce(roomsWithGames)
    .mockResolvedValueOnce(roomsWithGamesWithoutYear)

  const tx = {
    room: {
      findMany: roomFindMany,
    },
  } as unknown as TransactionClient

  return {
    roomFindMany,
    rooms,
    roomsWithGames,
    roomsWithGamesWithoutYear,
    tx,
  }
}

describe('gameRooms query helpers', () => {
  test('loads game rooms with the existing room summary select shape', async () => {
    const fixture = createGameRoomsQueriesTx()

    const result = await getGameRooms({ tx: fixture.tx })

    expect(fixture.roomFindMany).toHaveBeenNthCalledWith(1, {
      select: {
        id: true,
        description: true,
        size: true,
        type: true,
        enabled: true,
        updated: true,
        accessibility: true,
      },
    })
    expect(result).toEqual(fixture.rooms)
  })

  test('loads room games ordered by slot for the requested year', async () => {
    const fixture = createGameRoomsQueriesTx()

    await getGameRooms({ tx: fixture.tx })

    const result = await getGameRoomAndGames({
      tx: fixture.tx,
      input: { year: 2026 },
    })

    expect(fixture.roomFindMany).toHaveBeenNthCalledWith(2, {
      select: {
        id: true,
        description: true,
        game: {
          where: { year: 2026 },
          orderBy: { slotId: 'asc' },
          select: {
            id: true,
            name: true,
            slotId: true,
            gmNames: true,
          },
        },
      },
    })
    expect(result).toEqual(fixture.roomsWithGames)
  })

  test('keeps the no-year room game query unfiltered while preserving slot ordering', async () => {
    const fixture = createGameRoomsQueriesTx()

    await getGameRooms({ tx: fixture.tx })
    await getGameRoomAndGames({
      tx: fixture.tx,
      input: { year: 2026 },
    })

    const result = await getGameRoomAndGames({
      tx: fixture.tx,
      input: {},
    })

    expect(fixture.roomFindMany).toHaveBeenNthCalledWith(3, {
      select: {
        id: true,
        description: true,
        game: {
          where: {},
          orderBy: { slotId: 'asc' },
          select: {
            id: true,
            name: true,
            slotId: true,
            gmNames: true,
          },
        },
      },
    })
    expect(result).toEqual(fixture.roomsWithGamesWithoutYear)
  })
})
