import type { InitialPlannerInput, InitialPlannerResult } from './initialPlanner'
import { executeSlotAssignmentPlan } from './initialPlanner.assignmentExecution'
import { buildSlotPlanningDiagnostics } from './initialPlanner.diagnostics'
import {
  appendSlotPlanningResult,
  buildPlannerExecutionState,
  buildSlotPlanningRuntime,
  type SlotPlanningResult,
} from './initialPlanner.runtime'
import { buildPlannerSeedData, type PlannerSeedData } from './initialPlanner.seed'
import { buildSlotPlanningSeeds, type SlotPlanningSeed } from './initialPlanner.slotSeeds'

type SlotPlanningSharedContext = Pick<
  PlannerSeedData,
  'roomsById' | 'roomAvailabilityByKey' | 'memberRoomIdByMemberId' | 'roomMemberCountByRoomId' | 'memberRoomIds'
>

type PlanSlotAssignmentsInput = {
  input: InitialPlannerInput
  usageCountByRoomId: Map<number, number>
} & SlotPlanningSharedContext &
  SlotPlanningSeed

const planSlotAssignments = ({
  input,
  slotId,
  roomsById,
  roomAvailabilityByKey,
  memberRoomIdByMemberId,
  roomMemberCountByRoomId,
  memberRoomIds,
  existingFixedAssignments,
  gamesForSlot,
  usageCountByRoomId,
}: PlanSlotAssignmentsInput): SlotPlanningResult => {
  const { assignments, assignedGameIds, occupiedRoomIds, assignRoom, roomSelectionContext, roomPlanner } =
    buildSlotPlanningRuntime({
      input,
      slotId,
      roomsById,
      roomAvailabilityByKey,
      memberRoomIdByMemberId,
      memberRoomIds,
      existingFixedAssignments,
      usageCountByRoomId,
    })

  executeSlotAssignmentPlan({
    input,
    games: gamesForSlot,
    roomSelectionContext,
    roomPlanner,
    roomMemberCountByRoomId,
    memberRoomIds,
    assignedGameIds,
    assignRoom,
  })

  const { skippedGames, unmetConstraints } = buildSlotPlanningDiagnostics({
    input,
    slotId,
    games: gamesForSlot,
    assignedGameIds,
    roomPlanner,
    roomAvailabilityByKey,
    memberRoomIds,
    occupiedRoomIds,
  })

  return {
    assignments,
    skippedGames,
    unmetConstraints,
  }
}

const buildPlanSlotAssignmentsInput = ({
  input,
  seedData,
  slotPlanningSeed,
  usageCountByRoomId,
}: {
  input: InitialPlannerInput
  seedData: PlannerSeedData
  slotPlanningSeed: SlotPlanningSeed
  usageCountByRoomId: Map<number, number>
}): PlanSlotAssignmentsInput => ({
  input,
  usageCountByRoomId,
  roomsById: seedData.roomsById,
  roomAvailabilityByKey: seedData.roomAvailabilityByKey,
  memberRoomIdByMemberId: seedData.memberRoomIdByMemberId,
  roomMemberCountByRoomId: seedData.roomMemberCountByRoomId,
  memberRoomIds: seedData.memberRoomIds,
  ...slotPlanningSeed,
})

const planSlots = ({
  input,
  seedData,
}: {
  input: InitialPlannerInput
  seedData: PlannerSeedData
}): SlotPlanningResult => {
  const plannerState = buildPlannerExecutionState()

  buildSlotPlanningSeeds(seedData).forEach((slotPlanningSeed) => {
    const slotPlanningInput = buildPlanSlotAssignmentsInput({
      input,
      seedData,
      slotPlanningSeed,
      usageCountByRoomId: plannerState.usageCountByRoomId,
    })
    const slotPlan = planSlotAssignments(slotPlanningInput)

    appendSlotPlanningResult({
      plannerState,
      existingFixedAssignments: slotPlanningInput.existingFixedAssignments,
      slotPlan,
    })
  })

  return {
    assignments: plannerState.assignments,
    skippedGames: plannerState.skippedGames,
    unmetConstraints: plannerState.unmetConstraints,
  }
}

export const buildInitialPlannerResult = (input: InitialPlannerInput): InitialPlannerResult => {
  const seedData = buildPlannerSeedData(input)
  const { assignments, skippedGames, unmetConstraints } = planSlots({
    input,
    seedData,
  })

  return {
    assignments,
    skippedGames: skippedGames.sort(
      (left, right) =>
        left.slotId - right.slotId ||
        right.participantCount - left.participantCount ||
        left.gameName.localeCompare(right.gameName),
    ),
    unmetConstraints: unmetConstraints.sort(
      (left, right) => left.slotId - right.slotId || left.detail.localeCompare(right.detail),
    ),
  }
}
