import { sortNames } from './dashboardShared'
import type { DashboardMemberRoomAssignment, DashboardMembership } from './dashboardShared'

export const buildSlotIds = (numberOfSlots: number) =>
  Array.from({ length: numberOfSlots }, (_value: undefined, index: number) => index + 1)

export const buildMemberRoomIdByMemberId = (rows: Array<DashboardMemberRoomAssignment>) => {
  const memberRoomIdByMemberId = new Map<number, number>()
  rows.forEach((row) => {
    memberRoomIdByMemberId.set(row.memberId, row.roomId)
  })

  return memberRoomIdByMemberId
}

export const buildRoomMemberCounts = (rows: Array<DashboardMemberRoomAssignment>) => {
  const roomMemberCounts = new Map<number, number>()
  rows.forEach((row) => {
    roomMemberCounts.set(row.roomId, (roomMemberCounts.get(row.roomId) ?? 0) + 1)
  })

  return roomMemberCounts
}

export const buildAssignedMemberNamesByRoomId = (
  memberships: Array<DashboardMembership>,
  memberRoomIdByMemberId: Map<number, number>,
) => {
  const assignedMemberNamesByRoomId = memberships.reduce((accumulator, membership) => {
    const roomId = memberRoomIdByMemberId.get(membership.id)

    if (!roomId) {
      return accumulator
    }

    const memberName = membership.user.fullName ?? ''
    if (!memberName) {
      return accumulator
    }

    const memberNames = accumulator.get(roomId) ?? []
    memberNames.push(memberName)
    accumulator.set(roomId, memberNames)
    return accumulator
  }, new Map<number, Array<string>>())

  assignedMemberNamesByRoomId.forEach((memberNames, roomId) => {
    assignedMemberNamesByRoomId.set(roomId, sortNames(memberNames))
  })

  return assignedMemberNamesByRoomId
}
