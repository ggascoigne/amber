import type { InitialPlannerRoom } from './initialPlanner'
import { chooseOwnedRoomForSlotGame, type OwnedRoomSelectionContext } from './initialPlanner.ownedRoomSelection'
import { choosePreferredRoomForSlotGame, type RoomCandidate } from './initialPlanner.preferredRoomSelection'
import { buildSlotGameSkipReason, hasLargerOpenSharedRoomForGame } from './initialPlanner.roomPools'
import type { PlannedGameContext } from './initialPlanner.seed'

export type { RoomCandidate } from './initialPlanner.preferredRoomSelection'

export type SlotRoomSelectionContext = OwnedRoomSelectionContext

export type SlotRoomPlanner = {
  chooseOwnedRoomForGame: ({
    game,
    memberIds,
    ownerPriority,
  }: {
    game: PlannedGameContext
    memberIds: Array<number>
    ownerPriority: (roomId: number) => number
  }) => InitialPlannerRoom | null
  choosePreferredRoomForGame: ({
    game,
    roomFilter,
    preferNonBallroom,
    sortCandidates,
  }: {
    game: PlannedGameContext
    roomFilter: (room: InitialPlannerRoom) => boolean
    preferNonBallroom: boolean
    sortCandidates?: (left: RoomCandidate, right: RoomCandidate) => number
  }) => InitialPlannerRoom | null
  hasLargerOpenSharedRoom: (game: PlannedGameContext) => boolean
  buildSkipReason: (game: PlannedGameContext) => string
}

export const buildSlotRoomPlanner = ({ context }: { context: SlotRoomSelectionContext }): SlotRoomPlanner => ({
  chooseOwnedRoomForGame: ({ game, memberIds, ownerPriority }) =>
    chooseOwnedRoomForSlotGame({
      context,
      game,
      memberIds,
      ownerPriority,
    }),
  choosePreferredRoomForGame: ({ game, roomFilter, preferNonBallroom, sortCandidates }) =>
    choosePreferredRoomForSlotGame({
      context,
      game,
      roomFilter,
      preferNonBallroom,
      sortCandidates,
    }),
  hasLargerOpenSharedRoom: (game) =>
    hasLargerOpenSharedRoomForGame({
      context,
      game,
    }),
  buildSkipReason: (game) =>
    buildSlotGameSkipReason({
      context,
      game,
    }),
})
