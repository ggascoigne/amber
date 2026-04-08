import { describe, expect, test, vi } from 'vitest'

import { getHotelRoomDetails } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createHotelRoomDetailsQueriesTx = () => {
  const hotelRoomDetails = [
    {
      id: 3n,
      name: 'Accessible Double Queen',
      roomType: 'double_queen',
      comment: 'Near elevators',
      reservedFor: 'Staff',
      bathroomType: 'private',
      gamingRoom: false,
      enabled: true,
      formattedRoomType: 'Accessible Double Queen',
      internalRoomType: 'ADQ',
      reserved: true,
    },
  ]

  const hotelRoomDetailsFindMany = vi.fn().mockResolvedValue(hotelRoomDetails)

  const tx = {
    hotelRoomDetails: {
      findMany: hotelRoomDetailsFindMany,
    },
  } as unknown as TransactionClient

  return {
    hotelRoomDetails,
    hotelRoomDetailsFindMany,
    tx,
  }
}

describe('hotelRoomDetails query helpers', () => {
  test('loads hotel room details with the existing ordering and summary select shape', async () => {
    const fixture = createHotelRoomDetailsQueriesTx()

    const result = await getHotelRoomDetails({ tx: fixture.tx })

    expect(fixture.hotelRoomDetailsFindMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        roomType: true,
        comment: true,
        reservedFor: true,
        bathroomType: true,
        gamingRoom: true,
        enabled: true,
        formattedRoomType: true,
        internalRoomType: true,
        reserved: true,
      },
    })
    expect(result).toEqual(fixture.hotelRoomDetails)
  })
})
