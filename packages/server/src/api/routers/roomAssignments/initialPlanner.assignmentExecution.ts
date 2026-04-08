import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import {
  assignPubTheoryException,
  buildSlotAssignmentPasses,
  type SlotAssignmentPass,
  type SlotRoomSelection,
} from './initialPlanner.assignmentPasses'
import { type SlotRoomPlanner, type SlotRoomSelectionContext } from './initialPlanner.roomSelection'
import type { PlannedGameContext } from './initialPlanner.seed'

type SlotAssignmentExecutionInput = {
  input: InitialPlannerInput
  games: Array<PlannedGameContext>
  roomSelectionContext: SlotRoomSelectionContext
  roomPlanner: SlotRoomPlanner
  roomMemberCountByRoomId: Map<number, number>
  memberRoomIds: Set<number>
  assignedGameIds: Set<number>
  assignRoom: (selection: SlotRoomSelection & { reason: string }) => void
}

const forEachUnassignedGame = ({
  games,
  assignedGameIds,
  callback,
}: {
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
  callback: (game: PlannedGameContext) => void
}) => {
  games.forEach((game) => {
    if (assignedGameIds.has(game.game.id)) {
      return
    }

    callback(game)
  })
}

const assignSelectedRoomsForGames = ({
  games,
  assignedGameIds,
  selectRoom,
  shouldAssignRoom,
  buildReason,
  assignRoom,
}: {
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
  selectRoom: (game: PlannedGameContext) => InitialPlannerRoom | null
  shouldAssignRoom?: (selection: SlotRoomSelection) => boolean
  buildReason: (selection: SlotRoomSelection) => string
  assignRoom: (selection: SlotRoomSelection & { reason: string }) => void
}) => {
  forEachUnassignedGame({
    games,
    assignedGameIds,
    callback: (game) => {
      const room = selectRoom(game)
      if (!room) {
        return
      }

      const selection = {
        game,
        room,
      }

      if (shouldAssignRoom && !shouldAssignRoom(selection)) {
        return
      }

      assignRoom({
        ...selection,
        reason: buildReason(selection),
      })
    },
  })
}

const applySlotAssignmentPasses = ({
  games,
  assignedGameIds,
  assignRoom,
  passes,
}: {
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
  assignRoom: (selection: SlotRoomSelection & { reason: string }) => void
  passes: Array<SlotAssignmentPass>
}) => {
  passes.forEach((pass) => {
    assignSelectedRoomsForGames({
      games,
      assignedGameIds,
      ...pass,
      assignRoom,
    })
  })
}

export const executeSlotAssignmentPlan = ({
  input,
  games,
  roomSelectionContext,
  roomPlanner,
  roomMemberCountByRoomId,
  memberRoomIds,
  assignedGameIds,
  assignRoom,
}: SlotAssignmentExecutionInput) => {
  assignPubTheoryException({
    games,
    input,
    context: roomSelectionContext,
    assignedGameIds,
    assignRoom,
  })

  applySlotAssignmentPasses({
    games,
    assignedGameIds,
    assignRoom,
    passes: buildSlotAssignmentPasses({
      roomPlanner,
      roomMemberCountByRoomId,
      memberRoomIds,
    }),
  })
}
