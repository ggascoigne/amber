import { describe, expect, test, vi } from 'vitest'

import { ensureSpecialGamesForYear } from './ensureSpecial'
import type { SpecialGameTemplate } from './special'

import type { TransactionClient } from '../../inRlsTransaction'

type NoGameTemplateRecord = SpecialGameTemplate & {
  slotId: number | null
}

const createEnsureSpecialGamesForYearTx = ({
  anyGameTemplate = null,
  createManyResult = { count: 0 },
  existingSpecialGames = [],
  noGameTemplates = [],
  slots = [],
}: {
  anyGameTemplate?: SpecialGameTemplate | null
  createManyResult?: { count: number }
  existingSpecialGames?: Array<{ category: string; slotId: number | null }>
  noGameTemplates?: Array<NoGameTemplateRecord>
  slots?: Array<{ id: number }>
} = {}) => {
  const slotFindMany = vi.fn().mockResolvedValue(slots)
  const gameFindMany = vi.fn().mockResolvedValueOnce(existingSpecialGames).mockResolvedValueOnce(noGameTemplates)
  const gameFindFirst = vi.fn().mockResolvedValue(anyGameTemplate)
  const gameCreateMany = vi.fn().mockResolvedValue(createManyResult)
  const gameCreate = vi.fn().mockResolvedValue({ id: 1 })

  const tx = {
    slot: {
      findMany: slotFindMany,
    },
    game: {
      findMany: gameFindMany,
      findFirst: gameFindFirst,
      createMany: gameCreateMany,
      create: gameCreate,
    },
  } as unknown as TransactionClient

  return {
    tx,
    slotFindMany,
    gameFindMany,
    gameFindFirst,
    gameCreateMany,
    gameCreate,
  }
}

describe('ensureSpecialGamesForYear', () => {
  test('loads the planner inputs and persists missing no-game and any-game records', async () => {
    const fixture = createEnsureSpecialGamesForYearTx({
      slots: [{ id: 1 }, { id: 2 }],
      existingSpecialGames: [{ slotId: 1, category: 'no_game' }],
      noGameTemplates: [
        {
          slotId: 2,
          description: 'No Game template',
          lateFinish: false,
          lateStart: null,
          name: 'No Game 2',
          playerMax: 10,
          playerMin: 0,
          roomId: null,
          shortName: null,
          charInstructions: '',
          estimatedLength: '2h',
          gameContactEmail: '',
          genre: 'other',
          gmNames: null,
          message: '',
          playerPreference: 'Any',
          playersContactGm: false,
          returningPlayers: '',
          setting: '',
          slotConflicts: '',
          slotPreference: 0,
          teenFriendly: true,
          type: 'Other',
          authorId: null,
          full: false,
        },
      ],
      anyGameTemplate: {
        description: 'Any Game template',
        lateFinish: false,
        lateStart: null,
        name: 'Any Game',
        playerMax: 999,
        playerMin: 0,
        roomId: null,
        shortName: null,
        charInstructions: '',
        estimatedLength: 'n/a',
        gameContactEmail: '',
        genre: 'other',
        gmNames: null,
        message: '',
        playerPreference: 'Any',
        playersContactGm: false,
        returningPlayers: '',
        setting: '',
        slotConflicts: '',
        slotPreference: 0,
        teenFriendly: true,
        type: 'Other',
        authorId: null,
        full: false,
      },
      createManyResult: { count: 99 },
    })

    const result = await ensureSpecialGamesForYear({
      tx: fixture.tx,
      input: {
        year: 2028,
      },
    })

    expect(fixture.slotFindMany).toHaveBeenCalledWith({
      select: { id: true },
      orderBy: [{ id: 'asc' }],
    })
    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(1, {
      where: {
        year: 2028,
        category: {
          in: ['no_game', 'any_game'],
        },
      },
      select: {
        slotId: true,
        category: true,
      },
    })
    expect(fixture.gameFindMany).toHaveBeenNthCalledWith(2, {
      where: {
        category: 'no_game',
        slotId: { not: null },
      },
      select: {
        description: true,
        lateFinish: true,
        lateStart: true,
        name: true,
        playerMax: true,
        playerMin: true,
        roomId: true,
        shortName: true,
        charInstructions: true,
        estimatedLength: true,
        gameContactEmail: true,
        genre: true,
        gmNames: true,
        message: true,
        playerPreference: true,
        playersContactGm: true,
        returningPlayers: true,
        setting: true,
        slotConflicts: true,
        slotPreference: true,
        teenFriendly: true,
        type: true,
        authorId: true,
        full: true,
        slotId: true,
      },
      orderBy: [{ year: 'desc' }, { id: 'desc' }],
    })
    expect(fixture.gameFindFirst).toHaveBeenCalledWith({
      where: { category: 'any_game' },
      select: {
        description: true,
        lateFinish: true,
        lateStart: true,
        name: true,
        playerMax: true,
        playerMin: true,
        roomId: true,
        shortName: true,
        charInstructions: true,
        estimatedLength: true,
        gameContactEmail: true,
        genre: true,
        gmNames: true,
        message: true,
        playerPreference: true,
        playersContactGm: true,
        returningPlayers: true,
        setting: true,
        slotConflicts: true,
        slotPreference: true,
        teenFriendly: true,
        type: true,
        authorId: true,
        full: true,
      },
      orderBy: [{ year: 'desc' }, { id: 'desc' }],
    })
    expect(fixture.gameCreateMany).toHaveBeenCalledWith({
      data: [
        {
          slotId: 2,
          year: 2028,
          category: 'no_game',
          description: 'No Game template',
          lateFinish: false,
          lateStart: null,
          name: 'No Game 2',
          playerMax: 10,
          playerMin: 0,
          roomId: null,
          shortName: null,
          charInstructions: '',
          estimatedLength: '2h',
          gameContactEmail: '',
          genre: 'other',
          gmNames: null,
          message: '',
          playerPreference: 'Any',
          playersContactGm: false,
          returningPlayers: '',
          setting: '',
          slotConflicts: '',
          slotPreference: 0,
          teenFriendly: true,
          type: 'Other',
          authorId: null,
          full: false,
        },
      ],
    })
    expect(fixture.gameCreate).toHaveBeenCalledWith({
      data: {
        slotId: null,
        year: 2028,
        category: 'any_game',
        description: 'Any Game template',
        lateFinish: false,
        lateStart: null,
        name: 'Any Game',
        playerMax: 999,
        playerMin: 0,
        roomId: null,
        shortName: null,
        charInstructions: '',
        estimatedLength: 'n/a',
        gameContactEmail: '',
        genre: 'other',
        gmNames: null,
        message: '',
        playerPreference: 'Any',
        playersContactGm: false,
        returningPlayers: '',
        setting: '',
        slotConflicts: '',
        slotPreference: 0,
        teenFriendly: true,
        type: 'Other',
        authorId: null,
        full: false,
      },
    })
    expect(result).toEqual({
      createdNoGameCount: 1,
      createdAnyGameCount: 1,
    })
  })

  test('skips writes when the planner finds that all required special games already exist', async () => {
    const fixture = createEnsureSpecialGamesForYearTx({
      slots: [{ id: 1 }],
      existingSpecialGames: [
        { slotId: 1, category: 'no_game' },
        { slotId: null, category: 'any_game' },
      ],
    })

    const result = await ensureSpecialGamesForYear({
      tx: fixture.tx,
      input: {
        year: 2028,
      },
    })

    expect(fixture.gameCreateMany).not.toHaveBeenCalled()
    expect(fixture.gameCreate).not.toHaveBeenCalled()
    expect(result).toEqual({
      createdNoGameCount: 0,
      createdAnyGameCount: 0,
    })
  })
})
