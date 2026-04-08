import type { InitialPlannerInput, PlannerUnmetConstraint, SkippedPlannedGame } from './initialPlanner'
import { isRoomAvailableForSlot } from './initialPlanner.availability'
import type { SlotRoomPlanner } from './initialPlanner.roomSelection'
import type { PlannedGameContext } from './initialPlanner.seed'

const buildUnassignedGames = ({
  games,
  assignedGameIds,
}: {
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
}) => games.filter((game) => !assignedGameIds.has(game.game.id))

const buildSkippedGamesForSlot = ({
  games,
  assignedGameIds,
  roomPlanner,
  slotId,
}: {
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
  roomPlanner: SlotRoomPlanner
  slotId: number
}): Array<SkippedPlannedGame> =>
  buildUnassignedGames({
    games,
    assignedGameIds,
  }).map((game) => ({
    gameId: game.game.id,
    gameName: game.game.name,
    slotId,
    participantCount: game.participantCount,
    reason: roomPlanner.buildSkipReason(game),
  }))

const buildUnusedNonMemberRoomConstraint = ({
  input,
  slotId,
  roomAvailabilityByKey,
  memberRoomIds,
  usedRoomIds,
}: {
  input: InitialPlannerInput
  slotId: number
  roomAvailabilityByKey: Map<string, boolean>
  memberRoomIds: Set<number>
  usedRoomIds: Set<number>
}): PlannerUnmetConstraint | null => {
  const unusedNonMemberRooms = input.rooms
    .filter((room) => room.enabled && !memberRoomIds.has(room.id))
    .filter(
      (room) =>
        isRoomAvailableForSlot({
          roomAvailabilityByKey,
          roomId: room.id,
          slotId,
          year: input.year,
        }) && !usedRoomIds.has(room.id),
    )
    .sort((left, right) => right.size - left.size || left.description.localeCompare(right.description))

  if (unusedNonMemberRooms.length === 0) {
    return null
  }

  return {
    id: `unused-non-member-rooms:${slotId}`,
    slotId,
    type: 'unused_non_member_room',
    detail: `Unused non-member rooms in Slot ${slotId}: ${unusedNonMemberRooms.map((room) => room.description).join(', ')}.`,
  }
}

export const buildSlotPlanningDiagnostics = ({
  input,
  slotId,
  games,
  assignedGameIds,
  roomPlanner,
  roomAvailabilityByKey,
  memberRoomIds,
  occupiedRoomIds,
}: {
  input: InitialPlannerInput
  slotId: number
  games: Array<PlannedGameContext>
  assignedGameIds: Set<number>
  roomPlanner: SlotRoomPlanner
  roomAvailabilityByKey: Map<string, boolean>
  memberRoomIds: Set<number>
  occupiedRoomIds: Set<number>
}): {
  skippedGames: Array<SkippedPlannedGame>
  unmetConstraints: Array<PlannerUnmetConstraint>
} => {
  const skippedGames = buildSkippedGamesForSlot({
    games,
    assignedGameIds,
    roomPlanner,
    slotId,
  })
  const unusedNonMemberRoomConstraint = buildUnusedNonMemberRoomConstraint({
    input,
    slotId,
    roomAvailabilityByKey,
    memberRoomIds,
    usedRoomIds: new Set(occupiedRoomIds),
  })

  return {
    skippedGames,
    unmetConstraints: unusedNonMemberRoomConstraint ? [unusedNonMemberRoomConstraint] : [],
  }
}
