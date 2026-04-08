import { describe, expect, test, vi } from 'vitest'

import {
  createBareSlotChoices,
  createGameChoiceRecord,
  createGameSubmissionRecord,
  updateGameChoiceRecord,
  updateGameSubmissionRecord,
  upsertGameChoiceBySlotRecord,
} from './mutations'

import { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

const createGameChoicesMutationsTx = ({
  existingGameChoice = null,
}: {
  existingGameChoice?: { id: number } | null
} = {}) => {
  const createdGameSubmission = {
    id: 11,
    memberId: 4,
    message: 'Running a one-shot',
    year: 2026,
  }
  const updatedGameSubmission = {
    id: 11,
    memberId: 5,
    message: 'Updated pitch',
    year: 2027,
  }
  const createdGameChoice = {
    id: 21,
    memberId: 4,
    gameId: 8,
    rank: 1,
    returningPlayer: false,
    slotId: 2,
    year: 2026,
  }
  const updatedGameChoice = {
    id: 22,
    memberId: 4,
    gameId: null,
    rank: 2,
    returningPlayer: true,
    slotId: 3,
    year: 2026,
  }

  const gameSubmissionCreate = vi.fn().mockResolvedValue(createdGameSubmission)
  const gameSubmissionUpdate = vi.fn().mockResolvedValue(updatedGameSubmission)
  const gameChoiceFindFirst = vi.fn().mockResolvedValue(existingGameChoice)
  const gameChoiceCreate = vi.fn().mockResolvedValue(createdGameChoice)
  const gameChoiceUpdate = vi.fn().mockResolvedValue(updatedGameChoice)
  const executeRaw = vi.fn().mockResolvedValue(1)

  const tx = {
    gameSubmission: {
      create: gameSubmissionCreate,
      update: gameSubmissionUpdate,
    },
    gameChoice: {
      create: gameChoiceCreate,
      findFirst: gameChoiceFindFirst,
      update: gameChoiceUpdate,
    },
  } as unknown as TransactionClient

  return {
    createdGameChoice,
    createdGameSubmission,
    gameChoiceCreate,
    gameChoiceFindFirst,
    gameChoiceUpdate,
    gameSubmissionCreate,
    gameSubmissionUpdate,
    executeRaw,
    tx,
    updatedGameChoice,
    updatedGameSubmission,
  }
}

describe('gameChoices mutation helpers', () => {
  test('createGameChoices calls the bare-slot stored procedure with the existing inputs', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await createBareSlotChoices({
      db: { $executeRaw: fixture.executeRaw },
      input: {
        memberId: 4,
        year: 2026,
        noSlots: 8,
      },
    })

    const [query] = fixture.executeRaw.mock.calls[0] as [Prisma.Sql]
    const expectedQuery = Prisma.sql`SELECT * FROM create_bare_slot_choices (${4}::int, ${2026}::int, ${8}::int)`

    expect(fixture.executeRaw).toHaveBeenCalledTimes(1)
    expect(query.strings).toEqual(expectedQuery.strings)
    expect(query.values).toEqual(expectedQuery.values)
    expect(result).toBe(1)
  })

  test('creates game submissions with the existing select shape', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await createGameSubmissionRecord({
      tx: fixture.tx,
      input: {
        memberId: 4,
        message: 'Running a one-shot',
        year: 2026,
      },
    })

    expect(fixture.gameSubmissionCreate).toHaveBeenCalledWith({
      data: {
        memberId: 4,
        message: 'Running a one-shot',
        year: 2026,
      },
      select: {
        id: true,
        memberId: true,
        message: true,
        year: true,
      },
    })
    expect(result).toEqual({
      gameSubmission: fixture.createdGameSubmission,
    })
  })

  test('updates game submissions with the existing select shape', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await updateGameSubmissionRecord({
      tx: fixture.tx,
      input: {
        id: 11,
        data: {
          memberId: 5,
          message: 'Updated pitch',
          year: 2027,
        },
      },
    })

    expect(fixture.gameSubmissionUpdate).toHaveBeenCalledWith({
      where: { id: 11 },
      data: {
        memberId: 5,
        message: 'Updated pitch',
        year: 2027,
      },
      select: {
        id: true,
        memberId: true,
        message: true,
        year: true,
      },
    })
    expect(result).toEqual({
      gameSubmission: fixture.updatedGameSubmission,
    })
  })

  test('creates game choices with the existing select shape', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await createGameChoiceRecord({
      tx: fixture.tx,
      input: {
        gameId: 8,
        memberId: 4,
        rank: 1,
        returningPlayer: false,
        slotId: 2,
        year: 2026,
      },
    })

    expect(fixture.gameChoiceCreate).toHaveBeenCalledWith({
      data: {
        gameId: 8,
        memberId: 4,
        rank: 1,
        returningPlayer: false,
        slotId: 2,
        year: 2026,
      },
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
      gameChoice: fixture.createdGameChoice,
    })
  })

  test('updates game choices with the existing select shape', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await updateGameChoiceRecord({
      tx: fixture.tx,
      input: {
        id: 22,
        data: {
          gameId: null,
          memberId: 4,
          rank: 2,
          returningPlayer: true,
          slotId: 3,
          year: 2026,
        },
      },
    })

    expect(fixture.gameChoiceUpdate).toHaveBeenCalledWith({
      where: { id: 22 },
      data: {
        gameId: null,
        memberId: 4,
        rank: 2,
        returningPlayer: true,
        slotId: 3,
        year: 2026,
      },
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
      gameChoice: fixture.updatedGameChoice,
    })
  })

  test('upsertGameChoiceBySlot updates the matching choice when one already exists', async () => {
    const fixture = createGameChoicesMutationsTx({ existingGameChoice: { id: 99 } })

    const result = await upsertGameChoiceBySlotRecord({
      tx: fixture.tx,
      input: {
        memberId: 4,
        year: 2026,
        slotId: 2,
        rank: 1,
        gameId: 8,
        returningPlayer: true,
      },
    })

    expect(fixture.gameChoiceFindFirst).toHaveBeenCalledWith({
      where: {
        memberId: 4,
        year: 2026,
        slotId: 2,
        rank: 1,
      },
    })
    expect(fixture.gameChoiceUpdate).toHaveBeenCalledWith({
      where: { id: 99 },
      data: {
        gameId: 8,
        memberId: 4,
        rank: 1,
        returningPlayer: true,
        slotId: 2,
        year: 2026,
      },
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
    expect(fixture.gameChoiceCreate).not.toHaveBeenCalled()
    expect(result).toEqual({
      gameChoice: fixture.updatedGameChoice,
    })
  })

  test('upsertGameChoiceBySlot creates a choice when no existing slot/rank record exists', async () => {
    const fixture = createGameChoicesMutationsTx()

    const result = await upsertGameChoiceBySlotRecord({
      tx: fixture.tx,
      input: {
        memberId: 4,
        year: 2026,
        slotId: 2,
        rank: 1,
        gameId: null,
        returningPlayer: false,
      },
    })

    expect(fixture.gameChoiceFindFirst).toHaveBeenCalledWith({
      where: {
        memberId: 4,
        year: 2026,
        slotId: 2,
        rank: 1,
      },
    })
    expect(fixture.gameChoiceCreate).toHaveBeenCalledWith({
      data: {
        gameId: null,
        memberId: 4,
        rank: 1,
        returningPlayer: false,
        slotId: 2,
        year: 2026,
      },
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
    expect(fixture.gameChoiceUpdate).not.toHaveBeenCalled()
    expect(result).toEqual({
      gameChoice: fixture.createdGameChoice,
    })
  })
})
