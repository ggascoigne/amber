import { describe, expect, test, vi } from 'vitest'

import { syncLegacyGameRoomId, syncLegacyGameRoomIdsForYear } from './legacyRoomSync'

const createLegacyRoomSyncTx = ({
  games = [{ id: 101 }],
  overrideAssignment = null,
  defaultAssignments = [],
}: {
  games?: Array<{ id: number }>
  overrideAssignment?: { roomId: number | null } | null
  defaultAssignments?: Array<{ roomId: number | null }>
} = {}) => {
  const findFirst = vi.fn().mockResolvedValue(overrideAssignment)
  const findManyAssignments = vi.fn().mockResolvedValue(defaultAssignments)
  const findManyGames = vi.fn().mockResolvedValue(games)
  const updateMany = vi.fn().mockResolvedValue({ count: 1 })

  return {
    findFirst,
    findManyAssignments,
    findManyGames,
    updateMany,
    tx: {
      game: {
        findMany: findManyGames,
        updateMany,
      },
      gameRoomAssignment: {
        findFirst,
        findMany: findManyAssignments,
      },
    },
  }
}

describe('legacy room sync helper', () => {
  test('prefers the earliest override assignment and skips default lookups', async () => {
    const fixture = createLegacyRoomSyncTx({
      overrideAssignment: { roomId: 12 },
    })

    await syncLegacyGameRoomId({
      tx: fixture.tx,
      gameId: 101,
      year: 2026,
    })

    expect(fixture.findManyAssignments).not.toHaveBeenCalled()
    expect(fixture.updateMany).toHaveBeenCalledWith({
      where: {
        id: 101,
        year: 2026,
      },
      data: {
        roomId: 12,
      },
    })
  })

  test('falls back to the lone default assignment when no override exists', async () => {
    const fixture = createLegacyRoomSyncTx({
      defaultAssignments: [{ roomId: 22 }],
    })

    await syncLegacyGameRoomId({
      tx: fixture.tx,
      gameId: 101,
      year: 2026,
    })

    expect(fixture.findManyAssignments).toHaveBeenCalledWith({
      where: {
        gameId: 101,
        year: 2026,
        isOverride: false,
      },
      select: {
        roomId: true,
      },
      orderBy: {
        id: 'asc',
      },
      take: 2,
    })
    expect(fixture.updateMany).toHaveBeenCalledWith({
      where: {
        id: 101,
        year: 2026,
      },
      data: {
        roomId: 22,
      },
    })
  })

  test('clears the legacy room id when defaults are ambiguous or absent', async () => {
    const multipleDefaults = createLegacyRoomSyncTx({
      defaultAssignments: [{ roomId: 31 }, { roomId: 32 }],
    })
    const noDefaults = createLegacyRoomSyncTx()

    await syncLegacyGameRoomId({
      tx: multipleDefaults.tx,
      gameId: 101,
      year: 2026,
    })
    await syncLegacyGameRoomId({
      tx: noDefaults.tx,
      gameId: 101,
      year: 2026,
    })

    expect(multipleDefaults.updateMany).toHaveBeenCalledWith({
      where: {
        id: 101,
        year: 2026,
      },
      data: {
        roomId: null,
      },
    })
    expect(noDefaults.updateMany).toHaveBeenCalledWith({
      where: {
        id: 101,
        year: 2026,
      },
      data: {
        roomId: null,
      },
    })
  })

  test('syncs every game in a year', async () => {
    const fixture = createLegacyRoomSyncTx({
      games: [{ id: 101 }, { id: 202 }],
      defaultAssignments: [{ roomId: 40 }],
    })

    await syncLegacyGameRoomIdsForYear({
      tx: fixture.tx,
      year: 2026,
    })

    expect(fixture.findManyGames).toHaveBeenCalledWith({
      where: {
        year: 2026,
      },
      select: {
        id: true,
      },
    })
    expect(fixture.updateMany).toHaveBeenNthCalledWith(1, {
      where: {
        id: 101,
        year: 2026,
      },
      data: {
        roomId: 40,
      },
    })
    expect(fixture.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: 202,
        year: 2026,
      },
      data: {
        roomId: 40,
      },
    })
  })
})
