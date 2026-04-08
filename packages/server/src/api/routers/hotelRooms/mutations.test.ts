import { describe, expect, test, vi } from 'vitest'

import { createHotelRoomRecord, deleteHotelRoomRecord, updateHotelRoomRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createHotelRoomsMutationsTx = () => {
  const hotelRoomCreate = vi.fn().mockResolvedValue({
    id: 5,
    description: 'Double Queen',
    gamingRoom: false,
    bathroomType: 'shared',
    occupancy: '4',
    rate: '219',
    type: 'standard',
    quantity: 12,
  })
  const hotelRoomUpdate = vi.fn().mockResolvedValue({
    id: 6,
    description: 'King Suite',
    gamingRoom: true,
    bathroomType: 'private',
    occupancy: '2',
    rate: '329',
    type: 'suite',
    quantity: 4,
  })
  const hotelRoomDelete = vi.fn().mockResolvedValue({ id: 7 })

  const tx = {
    hotelRoom: {
      create: hotelRoomCreate,
      update: hotelRoomUpdate,
      delete: hotelRoomDelete,
    },
  } as unknown as TransactionClient

  return {
    hotelRoomCreate,
    hotelRoomUpdate,
    hotelRoomDelete,
    tx,
  }
}

describe('hotelRooms mutation helpers', () => {
  test('creates hotel rooms with the existing create payload', async () => {
    const fixture = createHotelRoomsMutationsTx()

    const result = await createHotelRoomRecord({
      tx: fixture.tx,
      input: {
        description: 'Double Queen',
        gamingRoom: false,
        bathroomType: 'shared',
        occupancy: '4',
        rate: '219',
        type: 'standard',
        quantity: 12,
      },
    })

    expect(fixture.hotelRoomCreate).toHaveBeenCalledWith({
      data: {
        description: 'Double Queen',
        gamingRoom: false,
        bathroomType: 'shared',
        occupancy: '4',
        rate: '219',
        type: 'standard',
        quantity: 12,
      },
    })
    expect(result).toEqual({
      hotelRoom: {
        id: 5,
        description: 'Double Queen',
        gamingRoom: false,
        bathroomType: 'shared',
        occupancy: '4',
        rate: '219',
        type: 'standard',
        quantity: 12,
      },
    })
  })

  test('updates hotel rooms by id with the existing partial data payload', async () => {
    const fixture = createHotelRoomsMutationsTx()

    const result = await updateHotelRoomRecord({
      tx: fixture.tx,
      input: {
        id: 6,
        data: {
          gamingRoom: true,
          quantity: 4,
        },
      },
    })

    expect(fixture.hotelRoomUpdate).toHaveBeenCalledWith({
      where: { id: 6 },
      data: {
        gamingRoom: true,
        quantity: 4,
      },
    })
    expect(result).toEqual({
      hotelRoom: {
        id: 6,
        description: 'King Suite',
        gamingRoom: true,
        bathroomType: 'private',
        occupancy: '2',
        rate: '329',
        type: 'suite',
        quantity: 4,
      },
    })
  })

  test('deletes hotel rooms and returns only the deleted id', async () => {
    const fixture = createHotelRoomsMutationsTx()

    const result = await deleteHotelRoomRecord({
      tx: fixture.tx,
      input: { id: 7 },
    })

    expect(fixture.hotelRoomDelete).toHaveBeenCalledWith({
      where: { id: 7 },
    })
    expect(result).toEqual({
      deletedHotelRoomId: 7,
    })
  })
})
