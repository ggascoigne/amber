import { describe, expect, test, vi } from 'vitest'

import { createGameRoomRecord, deleteGameRoomRecord, updateGameRoomRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createGameRoomsMutationsTx = () => {
  const roomCreate = vi.fn().mockResolvedValue({
    id: 8,
    description: 'Atrium',
    size: 12,
    type: 'table',
    enabled: true,
    updated: false,
    accessibility: 'accessible',
  })
  const roomUpdate = vi.fn().mockResolvedValue({
    id: 9,
    description: 'Library',
    size: 6,
    type: 'quiet',
    enabled: false,
    updated: true,
    accessibility: 'some_stairs',
  })
  const roomDelete = vi.fn().mockResolvedValue({ id: 10 })

  const tx = {
    room: {
      create: roomCreate,
      update: roomUpdate,
      delete: roomDelete,
    },
  } as unknown as TransactionClient

  return {
    roomCreate,
    roomUpdate,
    roomDelete,
    tx,
  }
}

describe('gameRooms mutation helpers', () => {
  test('creates rooms with the preserved enabled, updated, and accessibility defaults', async () => {
    const fixture = createGameRoomsMutationsTx()

    const result = await createGameRoomRecord({
      tx: fixture.tx,
      input: {
        description: 'Atrium',
        size: 12,
        type: 'table',
      },
    })

    expect(fixture.roomCreate).toHaveBeenCalledWith({
      data: {
        description: 'Atrium',
        size: 12,
        type: 'table',
        enabled: true,
        updated: false,
        accessibility: 'accessible',
      },
    })
    expect(result).toEqual({
      room: {
        id: 8,
        description: 'Atrium',
        size: 12,
        type: 'table',
        enabled: true,
        updated: false,
        accessibility: 'accessible',
      },
    })
  })

  test('updates rooms by id with the existing summary select shape', async () => {
    const fixture = createGameRoomsMutationsTx()

    const result = await updateGameRoomRecord({
      tx: fixture.tx,
      input: {
        id: 9,
        data: {
          description: 'Library',
          enabled: false,
          accessibility: 'some_stairs',
        },
      },
    })

    expect(fixture.roomUpdate).toHaveBeenCalledWith({
      where: { id: 9 },
      data: {
        description: 'Library',
        enabled: false,
        accessibility: 'some_stairs',
      },
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
    expect(result).toEqual({
      room: {
        id: 9,
        description: 'Library',
        size: 6,
        type: 'quiet',
        enabled: false,
        updated: true,
        accessibility: 'some_stairs',
      },
    })
  })

  test('deletes rooms and returns only the deleted id', async () => {
    const fixture = createGameRoomsMutationsTx()

    const result = await deleteGameRoomRecord({
      tx: fixture.tx,
      input: { id: 10 },
    })

    expect(fixture.roomDelete).toHaveBeenCalledWith({
      where: { id: 10 },
    })
    expect(result).toEqual({
      deletedRoomId: 10,
    })
  })
})
