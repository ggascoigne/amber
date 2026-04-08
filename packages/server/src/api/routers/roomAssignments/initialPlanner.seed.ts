import type {
  InitialPlannerExistingAssignment,
  InitialPlannerInput,
  InitialPlannerMemberRoomAssignment,
  InitialPlannerRoom,
} from './initialPlanner'
import { buildPlannedGamesBySlotId, type PlannedGameContext } from './initialPlanner.games'

export type { PlannedGameContext } from './initialPlanner.games'

type PlannerRoomIndexes = Pick<PlannerSeedData, 'roomsById' | 'roomAvailabilityByKey'>
type PlannedGameIndexes = Pick<PlannerSeedData, 'plannedGamesBySlotId'>
type MemberRoomIndexes = Pick<PlannerSeedData, 'memberRoomIdByMemberId' | 'roomMemberCountByRoomId' | 'memberRoomIds'>
type ExistingAssignmentIndexes = Pick<PlannerSeedData, 'existingFixedAssignmentsBySlotId' | 'lockedGameIds'>

export type PlannerSeedData = {
  roomsById: Map<number, InitialPlannerRoom>
  roomAvailabilityByKey: Map<string, boolean>
  memberRoomIdByMemberId: Map<number, number>
  roomMemberCountByRoomId: Map<number, number>
  memberRoomIds: Set<number>
  existingFixedAssignmentsBySlotId: Map<number, Array<InitialPlannerExistingAssignment>>
  lockedGameIds: Set<number>
  plannedGamesBySlotId: Map<number, Array<PlannedGameContext>>
}

export const buildAvailabilityKey = ({ roomId, slotId, year }: { roomId: number; slotId: number; year: number }) =>
  `${year}:${slotId}:${roomId}`

const buildMemberRoomIndexes = (
  memberRoomAssignments: Array<InitialPlannerMemberRoomAssignment>,
): MemberRoomIndexes => ({
  memberRoomIdByMemberId: new Map(memberRoomAssignments.map((assignment) => [assignment.memberId, assignment.roomId])),
  roomMemberCountByRoomId: memberRoomAssignments.reduce((counts, assignment) => {
    counts.set(assignment.roomId, (counts.get(assignment.roomId) ?? 0) + 1)
    return counts
  }, new Map<number, number>()),
  memberRoomIds: new Set(memberRoomAssignments.map((assignment) => assignment.roomId)),
})

const buildExistingAssignmentIndexes = (
  existingAssignments: Array<InitialPlannerExistingAssignment>,
): ExistingAssignmentIndexes => ({
  existingFixedAssignmentsBySlotId: existingAssignments.reduce((accumulator, assignment) => {
    const assignments = accumulator.get(assignment.slotId) ?? []
    assignments.push(assignment)
    accumulator.set(assignment.slotId, assignments)
    return accumulator
  }, new Map<number, Array<InitialPlannerExistingAssignment>>()),
  lockedGameIds: new Set(existingAssignments.map((assignment) => assignment.gameId)),
})

const buildPlannerRoomIndexes = ({
  rooms,
  roomSlotAvailability,
}: Pick<InitialPlannerInput, 'rooms' | 'roomSlotAvailability'>): PlannerRoomIndexes => ({
  roomsById: new Map(rooms.map((room) => [room.id, room])),
  roomAvailabilityByKey: new Map(roomSlotAvailability.map((row) => [buildAvailabilityKey(row), row.isAvailable])),
})

const buildPlannedGameIndexes = ({
  games,
  year,
  participants,
}: Pick<InitialPlannerInput, 'games' | 'year' | 'participants'>): PlannedGameIndexes => ({
  plannedGamesBySlotId: buildPlannedGamesBySlotId({
    games,
    year,
    participants,
  }),
})

export const buildPlannerSeedData = (input: InitialPlannerInput): PlannerSeedData => {
  const { roomsById, roomAvailabilityByKey } = buildPlannerRoomIndexes(input)
  const { memberRoomIdByMemberId, roomMemberCountByRoomId, memberRoomIds } = buildMemberRoomIndexes(
    input.memberRoomAssignments,
  )
  const { existingFixedAssignmentsBySlotId, lockedGameIds } = buildExistingAssignmentIndexes(input.existingAssignments)
  const { plannedGamesBySlotId } = buildPlannedGameIndexes(input)

  return {
    roomsById,
    roomAvailabilityByKey,
    memberRoomIdByMemberId,
    roomMemberCountByRoomId,
    memberRoomIds,
    existingFixedAssignmentsBySlotId,
    lockedGameIds,
    plannedGamesBySlotId,
  }
}
