import { buildAssignedMemberNamesByRoomId } from './dashboardIndexes'
import { sortNames } from './dashboardShared'
import type { DashboardMembership, DashboardRoom } from './dashboardShared'
import type { MemberRoomAssignmentRow, RoomMemberAssignmentRow } from './types'

type AssignedMember = {
  id: number
  fullName: string
}

const buildAttendingMemberships = (memberships: Array<DashboardMembership>) =>
  memberships.filter((membership) => membership.attending)

const buildAssignedMembersByRoomId = ({
  memberships,
  memberRoomIdByMemberId,
}: {
  memberships: Array<DashboardMembership>
  memberRoomIdByMemberId: Map<number, number>
}) =>
  memberships.reduce((accumulator, membership) => {
    const assignedRoomId = memberRoomIdByMemberId.get(membership.id) ?? null
    if (!assignedRoomId) {
      return accumulator
    }

    const fullName = membership.user.fullName ?? ''
    if (!fullName) {
      return accumulator
    }

    const assignedMembers = accumulator.get(assignedRoomId) ?? []
    assignedMembers.push({
      id: membership.id,
      fullName,
    })
    accumulator.set(assignedRoomId, assignedMembers)
    return accumulator
  }, new Map<number, Array<AssignedMember>>())

export const buildMemberRoomRows = ({
  memberships,
  memberRoomIdByMemberId,
}: {
  memberships: Array<DashboardMembership>
  memberRoomIdByMemberId: Map<number, number>
}): Array<MemberRoomAssignmentRow> => {
  const attendingMemberships = buildAttendingMemberships(memberships)
  const memberNamesByRoomId = buildAssignedMemberNamesByRoomId(attendingMemberships, memberRoomIdByMemberId)

  return attendingMemberships.map((membership) => {
    const assignedRoomId = memberRoomIdByMemberId.get(membership.id) ?? null
    const fullName = membership.user.fullName ?? ''
    const otherMembers = assignedRoomId
      ? sortNames((memberNamesByRoomId.get(assignedRoomId) ?? []).filter((memberName) => memberName !== fullName))
      : []

    return {
      id: membership.id,
      memberId: membership.id,
      memberName: fullName,
      assignedRoomId,
      sharingLabel: assignedRoomId ? (otherMembers.length > 0 ? otherMembers.join(', ') : 'None') : 'Unassigned',
    }
  })
}

export const buildRoomMemberRows = ({
  rooms,
  memberships,
  memberRoomIdByMemberId,
}: {
  rooms: Array<DashboardRoom>
  memberships: Array<DashboardMembership>
  memberRoomIdByMemberId: Map<number, number>
}): Array<RoomMemberAssignmentRow> => {
  const assignedMembersByRoomId = buildAssignedMembersByRoomId({
    memberships: buildAttendingMemberships(memberships),
    memberRoomIdByMemberId,
  })

  return rooms.map((room) => {
    const assignedMembers = [...(assignedMembersByRoomId.get(room.id) ?? [])].sort((left, right) =>
      left.fullName.localeCompare(right.fullName),
    )

    return {
      id: room.id,
      roomId: room.id,
      roomDescription: room.description,
      roomType: room.type,
      enabled: room.enabled,
      assignedMemberIds: assignedMembers.map((assignedMember) => assignedMember.id),
      assignedMemberNames: assignedMembers.map((assignedMember) => assignedMember.fullName),
    }
  })
}
