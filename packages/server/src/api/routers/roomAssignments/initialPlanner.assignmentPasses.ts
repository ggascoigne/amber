import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import { isBallroomRoom, isRoomEligibleForGame } from './initialPlanner.roomPools'
import { type RoomCandidate, type SlotRoomPlanner, type SlotRoomSelectionContext } from './initialPlanner.roomSelection'
import type { PlannedGameContext } from './initialPlanner.seed'

export type SlotRoomSelection = {
  game: PlannedGameContext
  room: InitialPlannerRoom
}

export type SlotAssignmentPass = {
  selectRoom: (game: PlannedGameContext) => InitialPlannerRoom | null
  shouldAssignRoom?: (selection: SlotRoomSelection) => boolean
  buildReason: (selection: SlotRoomSelection) => string
}

const isBlackRabbitBarRoom = (room: InitialPlannerRoom) => room.description.toLowerCase() === 'black rabbit bar'

const isPubTheoryGame = (game: { name: string }) => game.name.toLowerCase() === 'pub theory & game crawl'

const sortMemberFallbackRooms = ({
  game,
  left,
  right,
}: {
  game: PlannedGameContext
  left: RoomCandidate
  right: RoomCandidate
}) => {
  const leftExcessCapacity = left.room.size - game.participantCount
  const rightExcessCapacity = right.room.size - game.participantCount

  return (
    left.usageCount - right.usageCount ||
    leftExcessCapacity - rightExcessCapacity ||
    left.room.size - right.room.size ||
    left.room.description.localeCompare(right.room.description)
  )
}

const buildGmOwnedRoomPass = ({ roomPlanner }: { roomPlanner: SlotRoomPlanner }): SlotAssignmentPass => ({
  selectRoom: (game) =>
    roomPlanner.chooseOwnedRoomForGame({
      game,
      memberIds: game.gmMemberIds,
      ownerPriority: () => 0,
    }),
  buildReason: () => 'GM-owned room preference',
})

const buildPlayerOwnedRoomPass = ({
  roomPlanner,
  roomMemberCountByRoomId,
}: {
  roomPlanner: SlotRoomPlanner
  roomMemberCountByRoomId: Map<number, number>
}): SlotAssignmentPass => ({
  selectRoom: (game) =>
    roomPlanner.chooseOwnedRoomForGame({
      game,
      memberIds: game.playerMemberIds,
      ownerPriority: (roomId) => ((roomMemberCountByRoomId.get(roomId) ?? 0) <= 1 ? 0 : 1),
    }),
  shouldAssignRoom: ({ game, room }) =>
    !(room.size === game.participantCount && roomPlanner.hasLargerOpenSharedRoom(game)),
  buildReason: () => 'Player-owned room preference',
})

const buildSharedRoomPass = ({
  roomPlanner,
  memberRoomIds,
}: {
  roomPlanner: SlotRoomPlanner
  memberRoomIds: Set<number>
}): SlotAssignmentPass => ({
  selectRoom: (game) =>
    roomPlanner.choosePreferredRoomForGame({
      game,
      roomFilter: (room) => !memberRoomIds.has(room.id),
      preferNonBallroom: true,
    }),
  buildReason: ({ room }) => (isBallroomRoom(room) ? 'Shared room fallback (ballroom)' : 'Shared room priority'),
})

const buildMemberRoomFallbackPass = ({
  roomPlanner,
  memberRoomIds,
}: {
  roomPlanner: SlotRoomPlanner
  memberRoomIds: Set<number>
}): SlotAssignmentPass => ({
  selectRoom: (game) =>
    roomPlanner.choosePreferredRoomForGame({
      game,
      roomFilter: (room) => memberRoomIds.has(room.id),
      preferNonBallroom: false,
      sortCandidates: (left, right) =>
        sortMemberFallbackRooms({
          game,
          left,
          right,
        }),
    }),
  buildReason: () => 'Member room fallback',
})

export const buildSlotAssignmentPasses = ({
  roomPlanner,
  roomMemberCountByRoomId,
  memberRoomIds,
}: {
  roomPlanner: SlotRoomPlanner
  roomMemberCountByRoomId: Map<number, number>
  memberRoomIds: Set<number>
}): Array<SlotAssignmentPass> => [
  buildGmOwnedRoomPass({
    roomPlanner,
  }),
  buildPlayerOwnedRoomPass({
    roomPlanner,
    roomMemberCountByRoomId,
  }),
  buildSharedRoomPass({
    roomPlanner,
    memberRoomIds,
  }),
  buildMemberRoomFallbackPass({
    roomPlanner,
    memberRoomIds,
  }),
]

export const assignPubTheoryException = ({
  games,
  input,
  context,
  assignedGameIds,
  assignRoom,
}: {
  games: Array<PlannedGameContext>
  input: InitialPlannerInput
  context: SlotRoomSelectionContext
  assignedGameIds: Set<number>
  assignRoom: (selection: { game: PlannedGameContext; room: InitialPlannerRoom; reason: string }) => void
}) => {
  const pubTheoryGame = games.find((game) => !assignedGameIds.has(game.game.id) && isPubTheoryGame(game.game))
  if (!pubTheoryGame) {
    return
  }

  const blackRabbitBar = input.rooms.find((room) => room.enabled && isBlackRabbitBarRoom(room))
  if (
    !blackRabbitBar ||
    !isRoomEligibleForGame({
      context,
      game: pubTheoryGame,
      room: blackRabbitBar,
    })
  ) {
    return
  }

  assignRoom({
    game: pubTheoryGame,
    room: blackRabbitBar,
    reason: 'Black Rabbit Bar fixed exception',
  })
}
