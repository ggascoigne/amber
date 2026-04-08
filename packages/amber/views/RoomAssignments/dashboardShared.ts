import type { RoomAssignmentDashboardData } from '@amber/client'

export type DashboardRoom = RoomAssignmentDashboardData['rooms'][number]
export type DashboardGame = RoomAssignmentDashboardData['games'][number]
export type DashboardRoomAssignment = RoomAssignmentDashboardData['roomAssignments'][number]
export type DashboardRoomSlotAvailability = RoomAssignmentDashboardData['roomSlotAvailability'][number]
export type DashboardMemberRoomAssignment = RoomAssignmentDashboardData['memberRoomAssignments'][number]
export type DashboardMembership = RoomAssignmentDashboardData['memberships'][number]
export type DashboardGameAssignment = RoomAssignmentDashboardData['gameAssignments'][number]
export type DashboardRoomAccessibility = DashboardRoom['accessibility']

const roomAccessibilityRank: Record<DashboardRoomAccessibility, number> = {
  accessible: 0,
  some_stairs: 1,
  many_stairs: 2,
}

export const getMostRestrictiveAccessibility = (
  roomAccessibilityValues: Array<DashboardRoomAccessibility>,
): DashboardRoomAccessibility => {
  if (roomAccessibilityValues.length === 0) {
    return 'many_stairs'
  }

  return roomAccessibilityValues.reduce((mostRestrictiveValue, nextValue) => {
    if (roomAccessibilityRank[nextValue] < roomAccessibilityRank[mostRestrictiveValue]) {
      return nextValue
    }

    return mostRestrictiveValue
  }, roomAccessibilityValues[0])
}

export const doesRoomMeetAccessibilityRequirement = ({
  roomAccessibility,
  requiredAccessibility,
}: {
  roomAccessibility: DashboardRoomAccessibility
  requiredAccessibility: DashboardRoomAccessibility
}) => roomAccessibilityRank[roomAccessibility] <= roomAccessibilityRank[requiredAccessibility]

export type RoomSlotKeyInput = {
  roomId: number
  slotId: number
  year: number
}

export const buildRoomSlotAvailabilityKey = ({ roomId, slotId, year }: RoomSlotKeyInput) =>
  `${year}:${slotId}:${roomId}`

export const buildRoomSlotAvailabilityMap = (rows: Array<DashboardRoomSlotAvailability>) => {
  const availabilityByKey = new Map<string, boolean>()
  rows.forEach((row) => {
    availabilityByKey.set(
      buildRoomSlotAvailabilityKey({
        roomId: row.roomId,
        slotId: row.slotId,
        year: row.year,
      }),
      row.isAvailable,
    )
  })

  return availabilityByKey
}

export const isRoomAvailableInSlot = ({
  availabilityByKey,
  roomId,
  slotId,
  year,
}: {
  availabilityByKey: Map<string, boolean>
  roomId: number
  slotId: number
  year: number
}) =>
  availabilityByKey.get(
    buildRoomSlotAvailabilityKey({
      roomId,
      slotId,
      year,
    }),
  ) ?? true

export const sortNames = (names: Array<string>) => [...names].sort((left, right) => left.localeCompare(right))
