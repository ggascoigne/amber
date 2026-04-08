import type { InitialPlannerRoom } from './initialPlanner'
import { buildSlotGameRoomPool, isBallroomRoom, type SlotGameRoomPoolContext } from './initialPlanner.roomPools'
import type { PlannedGameContext } from './initialPlanner.seed'

export type RoomCandidate = {
  room: InitialPlannerRoom
  usageCount: number
}

export type PreferredRoomSelectionContext = SlotGameRoomPoolContext & {
  usageCountByRoomId: Map<number, number>
}

const sortRoomsBySizeThenUsage = (left: RoomCandidate, right: RoomCandidate) =>
  right.room.size - left.room.size ||
  left.usageCount - right.usageCount ||
  left.room.description.localeCompare(right.room.description)

const buildRoomCandidates = ({
  rooms,
  usageCountByRoomId,
}: {
  rooms: Array<InitialPlannerRoom>
  usageCountByRoomId: Map<number, number>
}): Array<RoomCandidate> =>
  rooms.map((room) => ({
    room,
    usageCount: usageCountByRoomId.get(room.id) ?? 0,
  }))

const filterPreferredRoomCandidates = ({
  candidates,
  preferNonBallroom,
}: {
  candidates: Array<RoomCandidate>
  preferNonBallroom: boolean
}) => {
  if (!preferNonBallroom || !candidates.some((candidate) => !isBallroomRoom(candidate.room))) {
    return candidates
  }

  return candidates.filter((candidate) => !isBallroomRoom(candidate.room))
}

export const choosePreferredRoomForSlotGame = ({
  context,
  game,
  roomFilter,
  preferNonBallroom,
  sortCandidates,
}: {
  context: PreferredRoomSelectionContext
  game: PlannedGameContext
  roomFilter: (room: InitialPlannerRoom) => boolean
  preferNonBallroom: boolean
  sortCandidates?: (left: RoomCandidate, right: RoomCandidate) => number
}): InitialPlannerRoom | null => {
  const roomPool = buildSlotGameRoomPool({
    context,
    game,
  })
  const eligibleCandidates = buildRoomCandidates({
    rooms: roomPool.eligibleRooms.filter(roomFilter),
    usageCountByRoomId: context.usageCountByRoomId,
  })

  if (eligibleCandidates.length === 0) {
    return null
  }

  const candidatePool = filterPreferredRoomCandidates({
    candidates: eligibleCandidates,
    preferNonBallroom,
  })

  return [...candidatePool].sort(sortCandidates ?? sortRoomsBySizeThenUsage)[0]?.room ?? null
}
