import { buildAvailabilityKey } from './initialPlanner.seed'

export const isRoomAvailableForSlot = ({
  roomAvailabilityByKey,
  roomId,
  slotId,
  year,
}: {
  roomAvailabilityByKey: Map<string, boolean>
  roomId: number
  slotId: number
  year: number
}) =>
  roomAvailabilityByKey.get(
    buildAvailabilityKey({
      roomId,
      slotId,
      year,
    }),
  ) ?? true
