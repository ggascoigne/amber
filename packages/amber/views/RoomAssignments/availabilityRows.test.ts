import { describe, expect, test } from 'vitest'

import { buildFullAvailabilityUpdates, buildRoomSlotAvailabilityRows } from './availabilityRows'
import { buildRoomSlotAvailabilityMap } from './dashboardShared'
import type { DashboardRoom, DashboardRoomSlotAvailability } from './dashboardShared'

const createRoom = ({ id, description, enabled = true }: { id: number; description: string; enabled?: boolean }) =>
  ({
    id,
    description,
    size: 4,
    accessibility: 'accessible',
    enabled,
    type: 'Guest Room',
  }) as DashboardRoom

const createAvailability = ({
  roomId,
  slotId,
  year,
  isAvailable,
}: {
  roomId: number
  slotId: number
  year: number
  isAvailable: boolean
}) =>
  ({
    roomId,
    slotId,
    year,
    isAvailable,
  }) as DashboardRoomSlotAvailability

describe('room assignment availability rows', () => {
  test('room slot availability rows default missing entries to available', () => {
    const rows = buildRoomSlotAvailabilityRows({
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom' }),
        createRoom({ id: 2, description: 'Summit Suite' }),
      ],
      availabilityByKey: buildRoomSlotAvailabilityMap([
        createAvailability({
          roomId: 1,
          slotId: 2,
          year: 2026,
          isAvailable: false,
        }),
      ]),
      slotIds: [1, 2, 3],
      year: 2026,
    })

    expect(rows).toEqual([
      {
        id: 1,
        roomId: 1,
        roomDescription: 'Cascade Ballroom',
        roomType: 'Guest Room',
        slotAvailabilityBySlotId: {
          1: true,
          2: false,
          3: true,
        },
      },
      {
        id: 2,
        roomId: 2,
        roomDescription: 'Summit Suite',
        roomType: 'Guest Room',
        slotAvailabilityBySlotId: {
          1: true,
          2: true,
          3: true,
        },
      },
    ])
  })

  test('full availability updates include only selected rooms and unavailable slots in row order', () => {
    const updates = buildFullAvailabilityUpdates({
      roomIds: [2, 3],
      rows: [
        {
          id: 1,
          roomId: 1,
          roomDescription: 'Ignored Room',
          roomType: 'Guest Room',
          slotAvailabilityBySlotId: {
            1: false,
            2: false,
          },
        },
        {
          id: 2,
          roomId: 2,
          roomDescription: 'Summit Suite',
          roomType: 'Guest Room',
          slotAvailabilityBySlotId: {
            1: true,
            2: false,
            3: false,
          },
        },
        {
          id: 3,
          roomId: 3,
          roomDescription: 'Cascade Ballroom',
          roomType: 'Ballroom',
          slotAvailabilityBySlotId: {
            1: false,
            2: true,
            3: true,
          },
        },
      ],
      slotIds: [1, 2, 3],
    })

    expect(updates).toEqual([
      {
        roomId: 2,
        slotId: 2,
      },
      {
        roomId: 2,
        slotId: 3,
      },
      {
        roomId: 3,
        slotId: 1,
      },
    ])
  })
})
