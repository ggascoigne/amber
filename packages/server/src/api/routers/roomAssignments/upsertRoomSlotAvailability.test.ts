import { describe, expect, test, vi } from 'vitest'

import { upsertRoomSlotAvailability } from './upsertRoomSlotAvailability'

import type { TransactionClient } from '../../inRlsTransaction'

const createUpsertRoomSlotAvailabilityTx = ({
  upsertResult = {
    roomId: 12,
    slotId: 4,
    year: 2026,
    isAvailable: false,
  },
}: {
  upsertResult?: {
    roomId: number
    slotId: number
    year: number
    isAvailable: boolean
  }
} = {}) => {
  const roomSlotAvailabilityUpsert = vi.fn().mockResolvedValue(upsertResult)

  const tx = {
    roomSlotAvailability: {
      upsert: roomSlotAvailabilityUpsert,
    },
  } as unknown as TransactionClient

  return {
    tx,
    roomSlotAvailabilityUpsert,
    upsertResult,
  }
}

describe('upsertRoomSlotAvailability', () => {
  test('upserts the selected room availability for the year and slot', async () => {
    const fixture = createUpsertRoomSlotAvailabilityTx()

    const result = await upsertRoomSlotAvailability({
      tx: fixture.tx,
      input: {
        roomId: 12,
        slotId: 4,
        year: 2026,
        isAvailable: false,
      },
    })

    expect(fixture.roomSlotAvailabilityUpsert).toHaveBeenCalledWith({
      where: {
        roomId_slotId_year: {
          roomId: 12,
          slotId: 4,
          year: 2026,
        },
      },
      update: {
        isAvailable: false,
      },
      create: {
        roomId: 12,
        slotId: 4,
        year: 2026,
        isAvailable: false,
      },
    })
    expect(result).toEqual({
      roomSlotAvailability: fixture.upsertResult,
    })
  })
})
