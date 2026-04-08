import { doesRoomFitGame } from './domain'
import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import { isRoomAvailableForSlot } from './initialPlanner.availability'
import type { PlannedGameContext } from './initialPlanner.seed'

export type SlotGameRoomPoolContext = {
  input: InitialPlannerInput
  slotId: number
  roomAvailabilityByKey: Map<string, boolean>
  occupiedRoomIds: Set<number>
  memberRoomIds: Set<number>
}

export type SlotGameRoomPool = {
  candidateRooms: Array<InitialPlannerRoom>
  eligibleRooms: Array<InitialPlannerRoom>
}

export const isBallroomRoom = (room: InitialPlannerRoom) =>
  room.type.toLowerCase().includes('ballroom') || room.description.toLowerCase().includes('ballroom')

const doesRoomFitPlannedGame = ({ game, room }: { game: PlannedGameContext; room: InitialPlannerRoom }) =>
  doesRoomFitGame({
    gameSize: game.participantCount,
    requiredAccessibility: game.requiredAccessibility,
    roomAccessibility: room.accessibility,
    roomSize: room.size,
  })

const getCandidateRoomsForGame = ({
  input,
  game,
}: {
  input: InitialPlannerInput
  game: PlannedGameContext
}): Array<InitialPlannerRoom> =>
  input.rooms.filter((room) => room.enabled).filter((room) => doesRoomFitPlannedGame({ game, room }))

export const isRoomEligibleForGame = ({
  context,
  game,
  room,
}: {
  context: SlotGameRoomPoolContext
  game: PlannedGameContext
  room: InitialPlannerRoom
}): boolean => {
  if (!room.enabled || context.occupiedRoomIds.has(room.id) || !doesRoomFitPlannedGame({ game, room })) {
    return false
  }

  return isRoomAvailableForSlot({
    roomAvailabilityByKey: context.roomAvailabilityByKey,
    roomId: room.id,
    slotId: context.slotId,
    year: context.input.year,
  })
}

export const buildSlotGameRoomPool = ({
  context,
  game,
}: {
  context: SlotGameRoomPoolContext
  game: PlannedGameContext
}): SlotGameRoomPool => {
  const candidateRooms = getCandidateRoomsForGame({
    input: context.input,
    game,
  })

  return {
    candidateRooms,
    eligibleRooms: candidateRooms.filter((room) =>
      isRoomEligibleForGame({
        context,
        game,
        room,
      }),
    ),
  }
}

const buildRoomPoolSkipReason = ({
  roomPool,
  game,
}: {
  roomPool: SlotGameRoomPool
  game: PlannedGameContext
}): string => {
  if (roomPool.candidateRooms.length === 0) {
    return `No enabled room can fit ${game.participantCount} participant(s) with ${game.requiredAccessibility} accessibility.`
  }

  if (roomPool.eligibleRooms.length === 0) {
    return 'No eligible room remained after higher-priority assignments or slot availability constraints.'
  }

  return 'No room remained after applying planner priorities.'
}

export const buildSlotGameSkipReason = ({
  context,
  game,
}: {
  context: SlotGameRoomPoolContext
  game: PlannedGameContext
}): string =>
  buildRoomPoolSkipReason({
    roomPool: buildSlotGameRoomPool({
      context,
      game,
    }),
    game,
  })

export const hasLargerOpenSharedRoomForGame = ({
  context,
  game,
}: {
  context: SlotGameRoomPoolContext
  game: PlannedGameContext
}): boolean =>
  buildSlotGameRoomPool({
    context,
    game,
  }).eligibleRooms.some((room) => !context.memberRoomIds.has(room.id) && room.size > game.participantCount)
