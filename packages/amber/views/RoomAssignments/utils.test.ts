import { describe, expect, test } from 'vitest'

import type { DashboardMemberRoomAssignment, DashboardRoomSlotAvailability } from './utils'
import {
  buildMemberRoomIdByMemberId,
  buildRoomMemberCounts,
  buildRoomSlotAvailabilityMap,
  buildSlotIds,
  isRoomAvailableInSlot,
} from './utils'

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
}) => ({ roomId, slotId, year, isAvailable }) as DashboardRoomSlotAvailability

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({ memberId, roomId }) as DashboardMemberRoomAssignment

describe('room assignment utils', () => {
  test('buildSlotIds creates 1-indexed slot list', () => {
    expect(buildSlotIds(5)).toEqual([1, 2, 3, 4, 5])
  })

  test('room slot availability defaults missing entries to available', () => {
    const availabilityByKey = buildRoomSlotAvailabilityMap([
      createAvailability({
        roomId: 2,
        slotId: 3,
        year: 2026,
        isAvailable: false,
      }),
    ])

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 3,
        year: 2026,
      }),
    ).toBe(false)

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 4,
        year: 2026,
      }),
    ).toBe(true)
  })

  test('member room mappings and sharing counts are derived by member and room ids', () => {
    const rows = [
      createMemberRoomAssignment({ memberId: 11, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 12, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 13, roomId: 3 }),
    ]

    const memberRoomIdByMemberId = buildMemberRoomIdByMemberId(rows)
    const roomMemberCounts = buildRoomMemberCounts(rows)

    expect(memberRoomIdByMemberId.get(11)).toBe(2)
    expect(memberRoomIdByMemberId.get(13)).toBe(3)
    expect(roomMemberCounts.get(2)).toBe(2)
    expect(roomMemberCounts.get(3)).toBe(1)
  })
})
