export type RoomAccessibility = 'accessible' | 'some_stairs' | 'many_stairs'

const roomAccessibilityRank: Record<RoomAccessibility, number> = {
  accessible: 0,
  some_stairs: 1,
  many_stairs: 2,
}

export const getRoomAccessibilityRank = (roomAccessibility: RoomAccessibility): number =>
  roomAccessibilityRank[roomAccessibility]

export const getMostRestrictiveAccessibility = (
  roomAccessibilityValues: Array<RoomAccessibility>,
): RoomAccessibility => {
  if (roomAccessibilityValues.length === 0) {
    return 'many_stairs'
  }

  return roomAccessibilityValues.reduce((mostRestrictiveValue, nextValue) => {
    if (getRoomAccessibilityRank(nextValue) < getRoomAccessibilityRank(mostRestrictiveValue)) {
      return nextValue
    }
    return mostRestrictiveValue
  }, roomAccessibilityValues[0])
}

export const doesRoomMeetAccessibilityRequirement = ({
  roomAccessibility,
  requiredAccessibility,
}: {
  roomAccessibility: RoomAccessibility
  requiredAccessibility: RoomAccessibility
}): boolean => getRoomAccessibilityRank(roomAccessibility) <= getRoomAccessibilityRank(requiredAccessibility)

export const doesRoomFitGame = ({
  gameSize,
  requiredAccessibility,
  roomAccessibility,
  roomSize,
}: {
  gameSize: number
  requiredAccessibility: RoomAccessibility
  roomAccessibility: RoomAccessibility
  roomSize: number
}): boolean => {
  if (roomSize < gameSize) {
    return false
  }

  return doesRoomMeetAccessibilityRequirement({
    roomAccessibility,
    requiredAccessibility,
  })
}

export const buildRoomSlotConflictKey = ({
  roomId,
  slotId,
  year,
}: {
  roomId: number
  slotId: number
  year: number
}): string => `${year}:${slotId}:${roomId}`
