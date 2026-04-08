import type { InitialPlannerInput } from './initialPlanner'
import type { getRoomAssignmentPlannerSnapshot } from './plannerSnapshot'

export type RoomAssignmentPlannerSnapshot = Awaited<ReturnType<typeof getRoomAssignmentPlannerSnapshot>>

export const buildPlannerInputFromSnapshot = ({
  plannerData,
  year,
  slotId,
}: {
  plannerData: RoomAssignmentPlannerSnapshot
  year: number
  slotId?: number
}): InitialPlannerInput => ({
  year,
  games: plannerData.games
    .filter((game) => game.slotId !== null)
    .filter((game) => (slotId ? game.slotId === slotId : true))
    .map((game) => ({
      id: game.id,
      name: game.name,
      slotId: game.slotId ?? 0,
      year: game.year,
      category: game.category,
    })),
  rooms: plannerData.rooms.map((room) => ({
    id: room.id,
    description: room.description,
    size: room.size,
    type: room.type,
    enabled: room.enabled,
    accessibility: room.accessibility,
  })),
  participants: plannerData.gameAssignments.map((assignment) => ({
    memberId: assignment.memberId,
    gameId: assignment.gameId,
    isGm: assignment.gm !== 0,
    fullName: assignment.membership.user.fullName ?? 'Unknown member',
    roomAccessibilityPreference: assignment.membership.user.profile[0]?.roomAccessibilityPreference ?? null,
  })),
  roomSlotAvailability: plannerData.roomSlotAvailability.map((availability) => ({
    roomId: availability.roomId,
    slotId: availability.slotId,
    year: availability.year,
    isAvailable: availability.isAvailable,
  })),
  memberRoomAssignments: plannerData.memberRoomAssignments.map((assignment) => ({
    memberId: assignment.memberId,
    roomId: assignment.roomId,
    memberName: assignment.membership.user.fullName ?? 'Unknown member',
  })),
  existingAssignments: plannerData.roomAssignments.map((assignment) => ({
    gameId: assignment.gameId,
    roomId: assignment.roomId,
    slotId: assignment.slotId,
    year: assignment.year,
    isOverride: assignment.isOverride,
    source: assignment.source === 'auto' ? ('auto' as const) : ('manual' as const),
  })),
})
