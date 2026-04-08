import { describe, expect, test, vi } from 'vitest'

import { getHotelRooms } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createHotelRoomsQueriesTx = () => {
  const hotelRooms = [
    {
      id: 7,
      description: 'Tower Suite',
      gamingRoom: true,
      bathroomType: 'private',
      occupancy: '4',
      rate: '299',
      type: 'suite',
      quantity: 2,
    },
  ]

  const hotelRoomFindMany = vi.fn().mockResolvedValue(hotelRooms)

  const tx = {
    hotelRoom: {
      findMany: hotelRoomFindMany,
    },
  } as unknown as TransactionClient

  return {
    hotelRoomFindMany,
    hotelRooms,
    tx,
  }
}

describe('hotelRooms query helpers', () => {
  test('loads hotel rooms with the existing ordering and summary select shape', async () => {
    const fixture = createHotelRoomsQueriesTx()

    const result = await getHotelRooms({ tx: fixture.tx })

    expect(fixture.hotelRoomFindMany).toHaveBeenCalledWith({
      orderBy: { type: 'asc' },
      select: {
        id: true,
        description: true,
        gamingRoom: true,
        bathroomType: true,
        occupancy: true,
        rate: true,
        type: true,
        quantity: true,
      },
    })
    expect(result).toEqual(fixture.hotelRooms)
  })
})
