import { describe, expect, test, vi } from 'vitest'

import {
  firstGameOfSlotInclude,
  gameWithGmsAndRoomInclude,
  getFirstGameOfSlot,
  getGameById,
  getGamesByAuthor,
  getGamesBySlot,
  getGamesBySlotForSignup,
  getGamesByYear,
  getGamesByYearAndAuthor,
  getSmallGamesByYear,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createGamesQueryTx = () => {
  const gameFindMany = vi.fn().mockResolvedValue([{ id: 1 }])
  const gameFindUnique = vi.fn().mockResolvedValue({ id: 2 })

  const tx = {
    game: {
      findMany: gameFindMany,
      findUnique: gameFindUnique,
    },
  } as unknown as TransactionClient

  return {
    tx,
    gameFindMany,
    gameFindUnique,
  }
}

describe('game query helpers', () => {
  test('loads signup games with the requested slot plus any-game records', async () => {
    const fixture = createGamesQueryTx()

    const result = await getGamesBySlotForSignup({
      tx: fixture.tx,
      input: { year: 2026, slotId: 4 },
    })

    expect(fixture.gameFindMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        OR: [{ slotId: 4 }, { category: 'any_game' }],
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      include: gameWithGmsAndRoomInclude,
    })
    expect(result).toEqual([{ id: 1 }])
  })

  test('loads slot-scoped user games with shared room and gm-offer include data', async () => {
    const fixture = createGamesQueryTx()

    await getGamesBySlot({
      tx: fixture.tx,
      input: { year: 2026, slotId: 3 },
    })

    expect(fixture.gameFindMany).toHaveBeenCalledWith({
      where: {
        year: 2026,
        slotId: 3,
        category: 'user',
      },
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
      include: gameWithGmsAndRoomInclude,
    })
  })

  test('loads year-scoped game lists and the small-game variant with the preserved take-one behavior', async () => {
    const fixture = createGamesQueryTx()

    await getGamesByYear({
      tx: fixture.tx,
      input: { year: 2027 },
    })

    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(1, {
      where: {
        year: 2027,
      },
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
      include: gameWithGmsAndRoomInclude,
    })

    await getSmallGamesByYear({
      tx: fixture.tx,
      input: { year: 2027 },
    })

    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(2, {
      where: {
        year: 2027,
        category: 'user',
      },
      orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
      take: 1,
      include: gameWithGmsAndRoomInclude,
    })
  })

  test('loads the first game of slot one with the nested gm-offer membership include', async () => {
    const fixture = createGamesQueryTx()

    await getFirstGameOfSlot({
      tx: fixture.tx,
      input: { year: 2028 },
    })

    expect(fixture.gameFindMany).toHaveBeenCalledWith({
      where: {
        slotId: 1,
        year: 2028,
        category: 'user',
      },
      orderBy: [{ name: 'asc' }],
      take: 1,
      include: firstGameOfSlotInclude,
    })
  })

  test('loads author queries with and without the extra year filter', async () => {
    const fixture = createGamesQueryTx()

    await getGamesByAuthor({
      tx: fixture.tx,
      input: { id: 11 },
    })

    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(1, {
      where: { authorId: 11 },
      include: gameWithGmsAndRoomInclude,
    })

    await getGamesByYearAndAuthor({
      tx: fixture.tx,
      input: { id: 11, year: 2029 },
    })

    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(2, {
      where: {
        authorId: 11,
        year: 2029,
      },
      include: gameWithGmsAndRoomInclude,
    })
  })

  test('loads a single game by id with the shared include shape', async () => {
    const fixture = createGamesQueryTx()

    const result = await getGameById({
      tx: fixture.tx,
      input: { id: 55 },
    })

    expect(fixture.gameFindUnique).toHaveBeenCalledWith({
      where: { id: 55 },
      include: gameWithGmsAndRoomInclude,
    })
    expect(result).toEqual({ id: 2 })
  })
})
