import { describe, expect, test, vi } from 'vitest'

import { getGameChoiceById, getGameChoices, getGameChoicesByYear } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameChoicesQueriesTx = () => {
  const gameSubmissions = [
    {
      id: 21,
      memberId: 4,
      message: 'Happy to run backup',
      year: 2026,
    },
  ]
  const dashboardGameSubmissions = [
    {
      ...gameSubmissions[0],
      membership: {
        id: 4,
        user: {
          fullName: 'Alex Morgan',
        },
      },
    },
  ]
  const gameChoices = [
    {
      id: 31,
      memberId: 4,
      gameId: 8,
      rank: 1,
      returningPlayer: false,
      slotId: 2,
      year: 2026,
    },
  ]
  const dashboardGameChoices = [
    {
      ...gameChoices[0],
      membership: {
        id: 4,
        user: {
          fullName: 'Alex Morgan',
        },
      },
      game: {
        id: 8,
        name: 'Goblin Market',
        slotId: 2,
        category: 'user',
      },
    },
  ]
  const gameChoice = gameChoices[0]

  const gameSubmissionFindMany = vi
    .fn()
    .mockResolvedValueOnce(gameSubmissions)
    .mockResolvedValueOnce(dashboardGameSubmissions)
  const gameChoiceFindMany = vi.fn().mockResolvedValueOnce(gameChoices).mockResolvedValueOnce(dashboardGameChoices)
  const gameChoiceFindUnique = vi.fn().mockResolvedValue(gameChoice)

  const tx = {
    gameSubmission: {
      findMany: gameSubmissionFindMany,
    },
    gameChoice: {
      findMany: gameChoiceFindMany,
      findUnique: gameChoiceFindUnique,
    },
  } as unknown as TransactionClient

  return {
    dashboardGameChoices,
    dashboardGameSubmissions,
    gameChoice,
    gameChoiceFindMany,
    gameChoiceFindUnique,
    gameChoices,
    gameSubmissionFindMany,
    gameSubmissions,
    tx,
  }
}

describe('gameChoices query helpers', () => {
  test('loads member game choices and submissions with the existing base select shape', async () => {
    const fixture = createGameChoicesQueriesTx()

    const result = await getGameChoices({
      tx: fixture.tx,
      input: {
        memberId: 4,
        year: 2026,
      },
    })

    expect(fixture.gameSubmissionFindMany).toHaveBeenNthCalledWith(1, {
      where: { memberId: 4, year: 2026 },
      select: {
        id: true,
        memberId: true,
        message: true,
        year: true,
      },
    })
    expect(fixture.gameChoiceFindMany).toHaveBeenNthCalledWith(1, {
      where: { memberId: 4, year: 2026 },
      select: {
        id: true,
        memberId: true,
        gameId: true,
        rank: true,
        returningPlayer: true,
        slotId: true,
        year: true,
      },
    })
    expect(result).toEqual({
      gameSubmissions: fixture.gameSubmissions,
      gameChoices: fixture.gameChoices,
    })
  })

  test('loads dashboard game choices and submissions with the existing nested select shape', async () => {
    const fixture = createGameChoicesQueriesTx()

    await getGameChoices({
      tx: fixture.tx,
      input: {
        memberId: 4,
        year: 2026,
      },
    })

    const result = await getGameChoicesByYear({
      tx: fixture.tx,
      input: {
        year: 2026,
      },
    })

    expect(fixture.gameSubmissionFindMany).toHaveBeenNthCalledWith(2, {
      where: { year: 2026 },
      select: {
        id: true,
        memberId: true,
        message: true,
        year: true,
        membership: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    })
    expect(fixture.gameChoiceFindMany).toHaveBeenNthCalledWith(2, {
      where: { year: 2026 },
      select: {
        id: true,
        memberId: true,
        gameId: true,
        rank: true,
        returningPlayer: true,
        slotId: true,
        year: true,
        membership: {
          select: {
            id: true,
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
        game: {
          select: {
            id: true,
            name: true,
            slotId: true,
            category: true,
          },
        },
      },
    })
    expect(result).toEqual({
      gameSubmissions: fixture.dashboardGameSubmissions,
      gameChoices: fixture.dashboardGameChoices,
    })
  })

  test('loads a single game choice by id with the existing base select shape', async () => {
    const fixture = createGameChoicesQueriesTx()

    const result = await getGameChoiceById({
      tx: fixture.tx,
      input: {
        id: 31,
      },
    })

    expect(fixture.gameChoiceFindUnique).toHaveBeenCalledWith({
      where: { id: 31 },
      select: {
        id: true,
        memberId: true,
        gameId: true,
        rank: true,
        returningPlayer: true,
        slotId: true,
        year: true,
      },
    })
    expect(result).toEqual(fixture.gameChoice)
  })
})
