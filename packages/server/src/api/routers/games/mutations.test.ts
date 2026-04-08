import { describe, expect, test, vi } from 'vitest'

import { createGameRecord, deleteGameRecord, updateGameRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameMutationTx = ({ gateValue = 'Yes' }: { gateValue?: string | null } = {}) => {
  const settingFindFirst = vi.fn().mockResolvedValue(gateValue === null ? null : { value: gateValue })
  const gameAssignmentFindFirst = vi.fn().mockResolvedValue(null)
  const gameCreate = vi.fn().mockResolvedValue({ id: 101, name: 'Created Game' })
  const gameUpdate = vi.fn().mockResolvedValue({ id: 202, name: 'Updated Game' })
  const gameDelete = vi.fn().mockResolvedValue({ id: 303 })

  const tx = {
    setting: {
      findFirst: settingFindFirst,
    },
    gameAssignment: {
      findFirst: gameAssignmentFindFirst,
    },
    game: {
      create: gameCreate,
      update: gameUpdate,
      delete: gameDelete,
    },
  } as unknown as TransactionClient

  return {
    tx,
    settingFindFirst,
    gameAssignmentFindFirst,
    gameCreate,
    gameUpdate,
    gameDelete,
  }
}

describe('game mutation helpers', () => {
  test('blocks createGameRecord when the submission gate is closed', async () => {
    const fixture = createGameMutationTx({ gateValue: 'No' })

    await expect(
      createGameRecord({
        tx: fixture.tx,
        userId: 7,
        userRoles: [],
        input: {
          charInstructions: '',
          description: 'desc',
          estimatedLength: '2h',
          gameContactEmail: 'gm@example.com',
          genre: 'mystery',
          message: '',
          name: 'Test Game',
          playerMax: 5,
          playerMin: 3,
          playerPreference: 'Any',
          playersContactGm: false,
          returningPlayers: '',
          setting: '',
          slotConflicts: '',
          slotPreference: 0,
          teenFriendly: true,
          type: 'Other',
          year: 2026,
        },
      }),
    ).rejects.toThrowError('Game submission is not currently allowed')

    expect(fixture.settingFindFirst).toHaveBeenCalledWith({
      where: { code: 'flag.allow_game_submission' },
    })
    expect(fixture.gameCreate).not.toHaveBeenCalled()
  })

  test('updates games with the editing gate and normalizes an omitted slotId to null', async () => {
    const fixture = createGameMutationTx({ gateValue: 'Yes' })

    const result = await updateGameRecord({
      tx: fixture.tx,
      userId: 7,
      userRoles: [],
      input: {
        id: 22,
        data: {
          name: 'Retitled Game',
        },
      },
    })

    expect(fixture.settingFindFirst).toHaveBeenCalledWith({
      where: { code: 'flag.allow_game_editing' },
    })
    expect(fixture.gameUpdate).toHaveBeenCalledWith({
      where: { id: 22 },
      data: {
        name: 'Retitled Game',
        slotId: null,
      },
    })
    expect(result).toEqual({
      game: { id: 202, name: 'Updated Game' },
    })
  })

  test('deletes games using the editing gate and returns the deleted id', async () => {
    const fixture = createGameMutationTx({ gateValue: 'GameAdmin' })

    const result = await deleteGameRecord({
      tx: fixture.tx,
      userId: 7,
      userRoles: ['ROLE_GAME_ADMIN'],
      input: {
        id: 88,
      },
    })

    expect(fixture.settingFindFirst).toHaveBeenCalledWith({
      where: { code: 'flag.allow_game_editing' },
    })
    expect(fixture.gameDelete).toHaveBeenCalledWith({
      where: { id: 88 },
    })
    expect(result).toEqual({
      deletedGameId: 303,
    })
  })
})
