import { describe, expect, test, vi } from 'vitest'

import { createHotelRoomDetailRecord, deleteHotelRoomDetailRecord, updateHotelRoomDetailRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createHotelRoomDetailsMutationsTx = () => {
  const hotelRoomDetailsCreate = vi.fn().mockResolvedValue({
    id: 5n,
    name: 'Deluxe King',
    roomType: 'king',
    comment: '',
    reservedFor: '',
    bathroomType: 'private',
    gamingRoom: true,
    enabled: true,
    formattedRoomType: '',
    internalRoomType: '',
    reserved: false,
    version: 1,
  })
  const hotelRoomDetailsUpdate = vi.fn().mockResolvedValue({
    id: 6n,
    name: 'Corner Suite',
    roomType: 'suite',
    comment: 'Near elevator',
    reservedFor: 'Guests of Honor',
    bathroomType: 'private',
    gamingRoom: false,
    enabled: true,
    formattedRoomType: 'Corner Suite',
    internalRoomType: 'corner_suite',
    reserved: true,
    version: 2,
  })
  const hotelRoomDetailsDelete = vi.fn().mockResolvedValue({ id: 7n })

  const tx = {
    hotelRoomDetails: {
      create: hotelRoomDetailsCreate,
      update: hotelRoomDetailsUpdate,
      delete: hotelRoomDetailsDelete,
    },
  } as unknown as TransactionClient

  return {
    hotelRoomDetailsCreate,
    hotelRoomDetailsUpdate,
    hotelRoomDetailsDelete,
    tx,
  }
}

describe('hotel room detail mutation helpers', () => {
  test('creates hotel room details with the preserved default fields', async () => {
    const fixture = createHotelRoomDetailsMutationsTx()

    const result = await createHotelRoomDetailRecord({
      tx: fixture.tx,
      input: {
        name: 'Deluxe King',
        roomType: 'king',
        bathroomType: 'private',
        gamingRoom: true,
        enabled: true,
      },
    })

    expect(fixture.hotelRoomDetailsCreate).toHaveBeenCalledWith({
      data: {
        name: 'Deluxe King',
        roomType: 'king',
        comment: '',
        reservedFor: '',
        bathroomType: 'private',
        gamingRoom: true,
        enabled: true,
        formattedRoomType: '',
        internalRoomType: '',
        reserved: false,
        version: 1,
      },
    })
    expect(result).toEqual({
      hotelRoomDetail: {
        id: 5n,
        name: 'Deluxe King',
        roomType: 'king',
        comment: '',
        reservedFor: '',
        bathroomType: 'private',
        gamingRoom: true,
        enabled: true,
        formattedRoomType: '',
        internalRoomType: '',
        reserved: false,
        version: 1,
      },
    })
  })

  test('updates hotel room details by id with the existing partial data payload', async () => {
    const fixture = createHotelRoomDetailsMutationsTx()

    const result = await updateHotelRoomDetailRecord({
      tx: fixture.tx,
      input: {
        id: 6n,
        data: {
          reservedFor: 'Guests of Honor',
          reserved: true,
        },
      },
    })

    expect(fixture.hotelRoomDetailsUpdate).toHaveBeenCalledWith({
      where: { id: 6n },
      data: {
        reservedFor: 'Guests of Honor',
        reserved: true,
      },
    })
    expect(result).toEqual({
      hotelRoomDetail: {
        id: 6n,
        name: 'Corner Suite',
        roomType: 'suite',
        comment: 'Near elevator',
        reservedFor: 'Guests of Honor',
        bathroomType: 'private',
        gamingRoom: false,
        enabled: true,
        formattedRoomType: 'Corner Suite',
        internalRoomType: 'corner_suite',
        reserved: true,
        version: 2,
      },
    })
  })

  test('deletes hotel room details and returns only the deleted id', async () => {
    const fixture = createHotelRoomDetailsMutationsTx()

    const result = await deleteHotelRoomDetailRecord({
      tx: fixture.tx,
      input: { id: 7n },
    })

    expect(fixture.hotelRoomDetailsDelete).toHaveBeenCalledWith({
      where: { id: 7n },
    })
    expect(result).toEqual({
      deletedHotelRoomDetail: 7n,
    })
  })
})
