import { isRoomAvailableInSlot } from './dashboardShared'
import type { DashboardRoom, DashboardRoomAssignment } from './dashboardShared'
import type {
  CurrentSlotRoomAvailabilityRow,
  ManualRoomSelectOption,
  RoomUsageSummaryRow,
  SizedRoomSelectOption,
} from './types'

type RoomSizeDescriptor = {
  description: string
  size: number
}

const sortRoomsBySizeAndDescription = (left: RoomSizeDescriptor, right: RoomSizeDescriptor) =>
  right.size - left.size || left.description.localeCompare(right.description)

const buildSlotAssignmentCountByRoomId = ({
  roomAssignments,
  slotId,
}: {
  roomAssignments: Array<DashboardRoomAssignment>
  slotId: number
}) =>
  roomAssignments.reduce((accumulator, assignment) => {
    if (assignment.slotId !== slotId) {
      return accumulator
    }

    accumulator.set(assignment.roomId, (accumulator.get(assignment.roomId) ?? 0) + 1)
    return accumulator
  }, new Map<number, number>())

const buildOccupiedRoomIds = ({
  roomAssignments,
  slotId,
}: {
  roomAssignments: Array<DashboardRoomAssignment>
  slotId: number
}) =>
  new Set(
    roomAssignments
      .filter((assignment) => assignment.slotId === slotId && !assignment.isOverride)
      .map((assignment) => assignment.roomId),
  )

export const buildRoomSelectOptions = (
  rooms: Array<DashboardRoom>,
  assignedMemberNamesByRoomId: Map<number, Array<string>>,
): Array<SizedRoomSelectOption> =>
  [...rooms].sort(sortRoomsBySizeAndDescription).map((room) => ({
    id: room.id,
    description: room.description,
    size: room.size,
    assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
  }))

export const buildEnabledManualRoomOptions = ({
  roomOptions,
  rooms,
  roomAssignments,
  availabilityByKey,
  slotId,
  year,
}: {
  roomOptions: Array<SizedRoomSelectOption>
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  availabilityByKey: Map<string, boolean>
  slotId: number
  year: number
}): Array<ManualRoomSelectOption> => {
  const enabledRoomIds = new Set(rooms.filter((room) => room.enabled).map((room) => room.id))
  const slotAssignmentCountByRoomId = buildSlotAssignmentCountByRoomId({
    roomAssignments,
    slotId,
  })

  return roomOptions
    .filter((roomOption) => enabledRoomIds.has(roomOption.id))
    .map((roomOption) => ({
      ...roomOption,
      slotAssignmentCount: slotAssignmentCountByRoomId.get(roomOption.id) ?? 0,
      slotIsAvailable: isRoomAvailableInSlot({
        availabilityByKey,
        roomId: roomOption.id,
        slotId,
        year,
      }),
    }))
    .sort(
      (left, right) =>
        Number(left.slotIsAvailable === false) - Number(right.slotIsAvailable === false) ||
        Number(left.slotAssignmentCount > 0) - Number(right.slotAssignmentCount > 0) ||
        sortRoomsBySizeAndDescription(left, right),
    )
}

export const buildCurrentSlotAvailableRooms = ({
  rooms,
  roomAssignments,
  assignedMemberNamesByRoomId,
  availabilityByKey,
  slotId,
  year,
}: {
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
  availabilityByKey: Map<string, boolean>
  slotId: number
  year: number
}): Array<CurrentSlotRoomAvailabilityRow> => {
  const occupiedRoomIds = buildOccupiedRoomIds({
    roomAssignments,
    slotId,
  })

  return rooms
    .filter(
      (room) =>
        room.enabled &&
        isRoomAvailableInSlot({
          availabilityByKey,
          roomId: room.id,
          slotId,
          year,
        }) &&
        !occupiedRoomIds.has(room.id),
    )
    .map((room) => ({
      id: room.id,
      roomId: room.id,
      roomDescription: room.description,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      size: room.size,
    }))
    .sort((left, right) => right.size - left.size || left.roomDescription.localeCompare(right.roomDescription))
}

export const buildRoomUsageSummaryRows = ({
  rooms,
  roomAssignments,
  assignedMemberNamesByRoomId,
}: {
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
}): Array<RoomUsageSummaryRow> => {
  const usageCountByRoomId = roomAssignments.reduce((accumulator, assignment) => {
    const currentCount = accumulator.get(assignment.roomId) ?? 0
    accumulator.set(assignment.roomId, currentCount + 1)
    return accumulator
  }, new Map<number, number>())

  return rooms
    .filter((room) => room.enabled)
    .map((room) => ({
      id: room.id,
      roomId: room.id,
      roomDescription: room.description,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      size: room.size,
      usageCount: usageCountByRoomId.get(room.id) ?? 0,
    }))
    .sort(
      (left, right) =>
        right.usageCount - left.usageCount ||
        right.size - left.size ||
        left.roomDescription.localeCompare(right.roomDescription),
    )
}
