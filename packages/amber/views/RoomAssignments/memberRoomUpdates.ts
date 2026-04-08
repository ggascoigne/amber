import type { DashboardMembership } from './dashboardShared'

export type RoomMemberAssignmentUpdate = {
  memberId: number
  roomId: number | null
}

export const buildRoomMemberAssignmentUpdates = ({
  roomId,
  memberships,
  memberRoomIdByMemberId,
  nextMemberIds,
}: {
  roomId: number
  memberships: Array<DashboardMembership>
  memberRoomIdByMemberId: Map<number, number>
  nextMemberIds: Array<number>
}): Array<RoomMemberAssignmentUpdate> => {
  const uniqueNextMemberIds = [...new Set(nextMemberIds)]
  const currentMemberIdsForRoom = memberships
    .filter((membership) => membership.attending)
    .filter((membership) => memberRoomIdByMemberId.get(membership.id) === roomId)
    .map((membership) => membership.id)

  const currentMemberIdsForRoomSet = new Set(currentMemberIdsForRoom)
  const nextMemberIdsSet = new Set(uniqueNextMemberIds)

  const memberIdsToAssign = uniqueNextMemberIds.filter((memberId) => !currentMemberIdsForRoomSet.has(memberId))
  const memberIdsToUnassign = currentMemberIdsForRoom.filter((memberId) => !nextMemberIdsSet.has(memberId))

  return [
    ...memberIdsToAssign.map((memberId) => ({
      memberId,
      roomId,
    })),
    ...memberIdsToUnassign.map((memberId) => ({
      memberId,
      roomId: null,
    })),
  ]
}
