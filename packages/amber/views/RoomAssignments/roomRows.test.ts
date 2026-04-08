import { describe, expect, test } from 'vitest'

import type { DashboardRoom, DashboardRoomAssignment, DashboardRoomSlotAvailability } from './utils'
import {
  buildCurrentSlotAvailableRooms,
  buildEnabledManualRoomOptions,
  buildRoomSelectOptions,
  buildRoomSlotAvailabilityMap,
  buildRoomUsageSummaryRows,
} from './utils'

const createRoom = ({
  id,
  description,
  size,
  enabled = true,
}: {
  id: number
  description: string
  size: number
  enabled?: boolean
}) =>
  ({
    id,
    description,
    size,
    accessibility: 'accessible',
    enabled,
    type: 'Guest Room',
  }) as DashboardRoom

const createRoomAssignment = ({
  id,
  roomId,
  slotId,
  isOverride = false,
}: {
  id: bigint
  roomId: number
  slotId: number
  isOverride?: boolean
}) =>
  ({
    id,
    roomId,
    slotId,
    isOverride,
  }) as DashboardRoomAssignment

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

describe('room assignment room rows', () => {
  test('room select options sort by size then description and include assigned members', () => {
    const roomOptions = buildRoomSelectOptions(
      [
        createRoom({ id: 2, description: 'Bravo Suite', size: 8 }),
        createRoom({ id: 3, description: 'Alpha Den', size: 12 }),
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 12 }),
      ],
      new Map([
        [1, ['Alex Admin']],
        [3, ['Bailey Builder']],
      ]),
    )

    expect(roomOptions).toEqual([
      {
        id: 3,
        description: 'Alpha Den',
        size: 12,
        assignedMemberNames: ['Bailey Builder'],
      },
      {
        id: 1,
        description: 'Cascade Ballroom',
        size: 12,
        assignedMemberNames: ['Alex Admin'],
      },
      {
        id: 2,
        description: 'Bravo Suite',
        size: 8,
        assignedMemberNames: [],
      },
    ])
  })

  test('manual room options keep enabled available empty rooms first', () => {
    const roomOptions = buildEnabledManualRoomOptions({
      roomOptions: [
        {
          id: 1,
          description: 'Cascade Ballroom',
          size: 16,
          assignedMemberNames: [],
        },
        {
          id: 2,
          description: 'Summit Guest Suite',
          size: 10,
          assignedMemberNames: [],
        },
        {
          id: 3,
          description: 'Annex',
          size: 12,
          assignedMemberNames: [],
        },
        {
          id: 4,
          description: 'Den',
          size: 6,
          assignedMemberNames: [],
        },
      ],
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 16 }),
        createRoom({ id: 2, description: 'Summit Guest Suite', size: 10 }),
        createRoom({ id: 3, description: 'Annex', size: 12, enabled: false }),
        createRoom({ id: 4, description: 'Den', size: 6 }),
      ],
      roomAssignments: [createRoomAssignment({ id: 1n, roomId: 2, slotId: 1 })],
      availabilityByKey: buildRoomSlotAvailabilityMap([
        createAvailability({
          roomId: 1,
          slotId: 1,
          year: 2025,
          isAvailable: false,
        }),
      ]),
      slotId: 1,
      year: 2025,
    })

    expect(
      roomOptions.map((option) => [option.description, option.slotAssignmentCount, option.slotIsAvailable]),
    ).toEqual([
      ['Den', 0, true],
      ['Summit Guest Suite', 1, true],
      ['Cascade Ballroom', 0, false],
    ])
  })

  test('current slot available rooms exclude disabled, unavailable, and non-override occupied rooms', () => {
    const availableRooms = buildCurrentSlotAvailableRooms({
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 16 }),
        createRoom({ id: 2, description: 'Bravo Suite', size: 8 }),
        createRoom({ id: 3, description: 'Annex', size: 12, enabled: false }),
        createRoom({ id: 4, description: 'Den', size: 10 }),
      ],
      roomAssignments: [
        createRoomAssignment({ id: 1n, roomId: 1, slotId: 2 }),
        createRoomAssignment({ id: 2n, roomId: 2, slotId: 2, isOverride: true }),
      ],
      assignedMemberNamesByRoomId: new Map([
        [2, ['Alex Admin']],
        [4, ['Bailey Builder']],
      ]),
      availabilityByKey: buildRoomSlotAvailabilityMap([
        createAvailability({
          roomId: 4,
          slotId: 2,
          year: 2025,
          isAvailable: false,
        }),
      ]),
      slotId: 2,
      year: 2025,
    })

    expect(availableRooms).toEqual([
      {
        id: 2,
        roomId: 2,
        roomDescription: 'Bravo Suite',
        assignedMemberNames: ['Alex Admin'],
        size: 8,
      },
    ])
  })

  test('room usage summary rows count assignments and sort by usage then size', () => {
    const rows = buildRoomUsageSummaryRows({
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 16 }),
        createRoom({ id: 2, description: 'Bravo Suite', size: 8 }),
        createRoom({ id: 3, description: 'Annex', size: 12, enabled: false }),
        createRoom({ id: 4, description: 'Den', size: 12 }),
      ],
      roomAssignments: [
        createRoomAssignment({ id: 1n, roomId: 4, slotId: 1 }),
        createRoomAssignment({ id: 2n, roomId: 1, slotId: 1 }),
        createRoomAssignment({ id: 3n, roomId: 1, slotId: 2 }),
      ],
      assignedMemberNamesByRoomId: new Map([
        [1, ['Alex Admin']],
        [4, ['Bailey Builder']],
      ]),
    })

    expect(rows).toEqual([
      {
        id: 1,
        roomId: 1,
        roomDescription: 'Cascade Ballroom',
        assignedMemberNames: ['Alex Admin'],
        size: 16,
        usageCount: 2,
      },
      {
        id: 4,
        roomId: 4,
        roomDescription: 'Den',
        assignedMemberNames: ['Bailey Builder'],
        size: 12,
        usageCount: 1,
      },
      {
        id: 2,
        roomId: 2,
        roomDescription: 'Bravo Suite',
        assignedMemberNames: [],
        size: 8,
        usageCount: 0,
      },
    ])
  })
})
