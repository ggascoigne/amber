import type { InitialPlannerRoom } from './initialPlanner'
import { isRoomEligibleForGame, type SlotGameRoomPoolContext } from './initialPlanner.roomPools'
import type { PlannedGameContext } from './initialPlanner.seed'

export type OwnedRoomSelectionContext = SlotGameRoomPoolContext & {
  roomsById: Map<number, InitialPlannerRoom>
  memberRoomIdByMemberId: Map<number, number>
  usageCountByRoomId: Map<number, number>
}

type OwnedRoomCandidate = {
  room: InitialPlannerRoom
  usageCount: number
  ownerPriority: number
}

const buildOwnedRoomCandidate = ({
  context,
  roomId,
  game,
  ownerPriority,
}: {
  context: OwnedRoomSelectionContext
  roomId: number
  game: PlannedGameContext
  ownerPriority: (roomId: number) => number
}): OwnedRoomCandidate | null => {
  const room = context.roomsById.get(roomId)
  if (
    !room ||
    !isRoomEligibleForGame({
      context,
      game,
      room,
    })
  ) {
    return null
  }

  return {
    room,
    usageCount: context.usageCountByRoomId.get(room.id) ?? 0,
    ownerPriority: ownerPriority(room.id),
  }
}

const buildOwnedRoomCandidatesByRoomId = ({
  context,
  game,
  memberIds,
  ownerPriority,
}: {
  context: OwnedRoomSelectionContext
  game: PlannedGameContext
  memberIds: Array<number>
  ownerPriority: (roomId: number) => number
}) =>
  memberIds.reduce((accumulator, memberId) => {
    const roomId = context.memberRoomIdByMemberId.get(memberId)
    if (!roomId) {
      return accumulator
    }

    const nextCandidate = buildOwnedRoomCandidate({
      context,
      roomId,
      game,
      ownerPriority,
    })
    if (!nextCandidate) {
      return accumulator
    }

    const previousCandidate = accumulator.get(roomId)
    if (!previousCandidate || nextCandidate.ownerPriority < previousCandidate.ownerPriority) {
      accumulator.set(roomId, nextCandidate)
    }

    return accumulator
  }, new Map<number, OwnedRoomCandidate>())

const sortOwnedRoomCandidates = (left: OwnedRoomCandidate, right: OwnedRoomCandidate) =>
  left.ownerPriority - right.ownerPriority ||
  right.room.size - left.room.size ||
  left.usageCount - right.usageCount ||
  left.room.description.localeCompare(right.room.description)

export const chooseOwnedRoomForSlotGame = ({
  context,
  game,
  memberIds,
  ownerPriority,
}: {
  context: OwnedRoomSelectionContext
  game: PlannedGameContext
  memberIds: Array<number>
  ownerPriority: (roomId: number) => number
}): InitialPlannerRoom | null => {
  const roomCandidatesByRoomId = buildOwnedRoomCandidatesByRoomId({
    context,
    game,
    memberIds,
    ownerPriority,
  })
  const bestCandidate = [...roomCandidatesByRoomId.values()].sort(sortOwnedRoomCandidates)[0]

  return bestCandidate?.room ?? null
}
