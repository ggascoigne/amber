import type {
  InitialPlannerExistingAssignment,
  InitialPlannerInput,
  InitialPlannerRoom,
  PlannedRoomAssignment,
  PlannerUnmetConstraint,
  SkippedPlannedGame,
} from './initialPlanner'
import {
  buildSlotRoomPlanner,
  type SlotRoomPlanner,
  type SlotRoomSelectionContext,
} from './initialPlanner.roomSelection'
import type { PlannedGameContext } from './initialPlanner.seed'

export type SlotPlanningResult = {
  assignments: Array<PlannedRoomAssignment>
  skippedGames: Array<SkippedPlannedGame>
  unmetConstraints: Array<PlannerUnmetConstraint>
}

export type PlannerExecutionState = SlotPlanningResult & {
  usageCountByRoomId: Map<number, number>
}

type SlotAssignmentState = {
  assignments: Array<PlannedRoomAssignment>
  assignedGameIds: Set<number>
  occupiedRoomIds: Set<number>
  assignRoom: (selection: { game: PlannedGameContext; room: InitialPlannerRoom; reason: string }) => void
}

export type SlotPlanningRuntime = SlotAssignmentState & {
  roomSelectionContext: SlotRoomSelectionContext
  roomPlanner: SlotRoomPlanner
}

export type SlotPlanningRuntimeInput = {
  input: InitialPlannerInput
  slotId: number
  roomsById: Map<number, InitialPlannerRoom>
  roomAvailabilityByKey: Map<string, boolean>
  memberRoomIdByMemberId: Map<number, number>
  memberRoomIds: Set<number>
  existingFixedAssignments: Array<InitialPlannerExistingAssignment>
  usageCountByRoomId: Map<number, number>
}

export const buildPlannerExecutionState = (): PlannerExecutionState => ({
  assignments: [],
  skippedGames: [],
  unmetConstraints: [],
  usageCountByRoomId: new Map<number, number>(),
})

const recordRoomUsage = ({
  usageCountByRoomId,
  assignments,
}: {
  usageCountByRoomId: Map<number, number>
  assignments: Array<{ roomId: number }>
}) => {
  assignments.forEach((assignment) => {
    usageCountByRoomId.set(assignment.roomId, (usageCountByRoomId.get(assignment.roomId) ?? 0) + 1)
  })
}

const buildSlotAssignmentState = ({
  existingFixedAssignments,
  slotId,
  year,
}: {
  existingFixedAssignments: Array<InitialPlannerExistingAssignment>
  slotId: number
  year: number
}): SlotAssignmentState => {
  const assignments: Array<PlannedRoomAssignment> = []
  const assignedGameIds = new Set<number>()
  const occupiedRoomIds = new Set(existingFixedAssignments.map((assignment) => assignment.roomId))

  return {
    assignments,
    assignedGameIds,
    occupiedRoomIds,
    assignRoom: ({ game, room, reason }) => {
      assignments.push({
        gameId: game.game.id,
        gameName: game.game.name,
        roomId: room.id,
        roomDescription: room.description,
        slotId,
        year,
        source: 'auto',
        reason,
      })
      assignedGameIds.add(game.game.id)
      occupiedRoomIds.add(room.id)
    },
  }
}

export const buildSlotPlanningRuntime = ({
  input,
  slotId,
  roomsById,
  roomAvailabilityByKey,
  memberRoomIdByMemberId,
  memberRoomIds,
  existingFixedAssignments,
  usageCountByRoomId,
}: SlotPlanningRuntimeInput): SlotPlanningRuntime => {
  const { assignments, assignedGameIds, occupiedRoomIds, assignRoom } = buildSlotAssignmentState({
    existingFixedAssignments,
    slotId,
    year: input.year,
  })
  const roomSelectionContext: SlotRoomSelectionContext = {
    input,
    slotId,
    roomsById,
    roomAvailabilityByKey,
    memberRoomIdByMemberId,
    memberRoomIds,
    occupiedRoomIds,
    usageCountByRoomId,
  }
  const roomPlanner = buildSlotRoomPlanner({
    context: roomSelectionContext,
  })

  return {
    assignments,
    assignedGameIds,
    occupiedRoomIds,
    assignRoom,
    roomSelectionContext,
    roomPlanner,
  }
}

export const appendSlotPlanningResult = ({
  plannerState,
  existingFixedAssignments,
  slotPlan,
}: {
  plannerState: PlannerExecutionState
  existingFixedAssignments: Array<InitialPlannerExistingAssignment>
  slotPlan: SlotPlanningResult
}) => {
  plannerState.assignments.push(...slotPlan.assignments)
  plannerState.skippedGames.push(...slotPlan.skippedGames)
  plannerState.unmetConstraints.push(...slotPlan.unmetConstraints)

  recordRoomUsage({
    usageCountByRoomId: plannerState.usageCountByRoomId,
    assignments: [...existingFixedAssignments, ...slotPlan.assignments],
  })
}
