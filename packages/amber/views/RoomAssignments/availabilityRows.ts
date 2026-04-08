import { isRoomAvailableInSlot, type DashboardRoom } from './dashboardShared'
import type { RoomSlotAvailabilityRow } from './types'

export type FullAvailabilityUpdate = {
  roomId: number
  slotId: number
}

export const buildRoomSlotAvailabilityRows = ({
  rooms,
  availabilityByKey,
  slotIds,
  year,
}: {
  rooms: Array<DashboardRoom>
  availabilityByKey: Map<string, boolean>
  slotIds: Array<number>
  year: number
}): Array<RoomSlotAvailabilityRow> =>
  rooms.map((room) => ({
    id: room.id,
    roomId: room.id,
    roomDescription: room.description,
    roomType: room.type,
    slotAvailabilityBySlotId: Object.fromEntries(
      slotIds.map((slotId) => [
        slotId,
        isRoomAvailableInSlot({
          availabilityByKey,
          roomId: room.id,
          slotId,
          year,
        }),
      ]),
    ),
  }))

export const buildFullAvailabilityUpdates = ({
  roomIds,
  rows,
  slotIds,
}: {
  roomIds: Array<number>
  rows: Array<RoomSlotAvailabilityRow>
  slotIds: Array<number>
}): Array<FullAvailabilityUpdate> => {
  const selectedRoomIds = new Set(roomIds)

  return rows.flatMap((row) =>
    selectedRoomIds.has(row.roomId)
      ? slotIds
          .filter((slotId) => !(row.slotAvailabilityBySlotId[slotId] ?? true))
          .map((slotId) => ({
            roomId: row.roomId,
            slotId,
          }))
      : [],
  )
}
