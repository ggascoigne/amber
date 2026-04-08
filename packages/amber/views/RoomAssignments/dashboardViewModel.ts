import type { RoomAssignmentDashboardData } from '@amber/client'

import type { DashboardRoomAssignment } from './dashboardShared'
import type {
  CurrentSlotRoomAvailabilityRow,
  ManualGameRoomAssignmentRow,
  ManualRoomSelectOption,
  MemberRoomAssignmentRow,
  RoomAssignmentConflictRow,
  RoomMemberAssignmentRow,
  RoomSlotAvailabilityRow,
  RoomUsageSummaryRow,
  SizedRoomSelectOption,
} from './types'
import {
  buildAssignedMemberNamesByRoomId,
  buildAssignmentCountsByGameId,
  buildCurrentSlotAvailableRooms,
  buildDefaultRoomAssignmentByGameId,
  buildEnabledManualRoomOptions,
  buildGameMembersByGameId,
  buildGmNamesByGameId,
  buildManualGameRows,
  buildMemberRoomIdByMemberId,
  buildMemberRoomRows,
  buildOverrideAssignmentsByGameId,
  buildRequiredAccessibilityByGameId,
  buildRoomAssignmentConflictRows,
  buildRoomMemberRows,
  buildRoomSelectOptions,
  buildRoomSlotAvailabilityMap,
  buildRoomSlotAvailabilityRows,
  buildRoomUsageSummaryRows,
  buildSlotIds,
  sortGamesForRoomAssignment,
} from './utils'

export type RoomAssignmentsMemberOption = {
  id: number
  fullName: string
}

type BuildRoomAssignmentsDashboardViewModelInput = {
  data: RoomAssignmentDashboardData
  numberOfSlots: number
  assignmentSlotFilterId: number
  showMemberRooms: boolean
  conflictShowAllSlots: boolean
  year: number
}

export type RoomAssignmentsDashboardViewModel = {
  slotIds: Array<number>
  defaultAssignmentByGameId: Map<number, DashboardRoomAssignment>
  memberRoomIdByMemberId: Map<number, number>
  roomOptions: Array<SizedRoomSelectOption>
  enabledManualRoomOptions: Array<ManualRoomSelectOption>
  memberOptions: Array<RoomAssignmentsMemberOption>
  filteredManualGameRows: Array<ManualGameRoomAssignmentRow>
  roomSlotAvailabilityRows: Array<RoomSlotAvailabilityRow>
  memberRoomRows: Array<MemberRoomAssignmentRow>
  roomMemberRows: Array<RoomMemberAssignmentRow>
  currentSlotAvailableRooms: Array<CurrentSlotRoomAvailabilityRow>
  filteredRoomUsageSummaryRows: Array<RoomUsageSummaryRow>
  filteredRoomAssignmentConflictRows: Array<RoomAssignmentConflictRow>
}

const buildMemberOptions = (
  memberships: RoomAssignmentDashboardData['memberships'],
): Array<RoomAssignmentsMemberOption> =>
  memberships
    .filter((membership) => membership.attending)
    .map((membership) => ({
      id: membership.id,
      fullName: membership.user.fullName ?? '',
    }))
    .filter((memberOption) => memberOption.fullName)
    .sort((left, right) => left.fullName.localeCompare(right.fullName))

export const buildRoomAssignmentsDashboardViewModel = ({
  data,
  numberOfSlots,
  assignmentSlotFilterId,
  showMemberRooms,
  conflictShowAllSlots,
  year,
}: BuildRoomAssignmentsDashboardViewModelInput): RoomAssignmentsDashboardViewModel => {
  const slotIds = buildSlotIds(numberOfSlots)
  const sortedGames = sortGamesForRoomAssignment(data.games)
  const defaultAssignmentByGameId = buildDefaultRoomAssignmentByGameId(data.roomAssignments)
  const availabilityByKey = buildRoomSlotAvailabilityMap(data.roomSlotAvailability)
  const memberRoomIdByMemberId = buildMemberRoomIdByMemberId(data.memberRoomAssignments)
  const assignedMemberNamesByRoomId = buildAssignedMemberNamesByRoomId(data.memberships, memberRoomIdByMemberId)
  const gmNamesByGameId = buildGmNamesByGameId(data.gameAssignments)
  const assignmentCountsByGameId = buildAssignmentCountsByGameId(data.gameAssignments)
  const gameMembersByGameId = buildGameMembersByGameId(data.gameAssignments)
  const requiredAccessibilityByGameId = buildRequiredAccessibilityByGameId(data.gameAssignments)
  const overrideAssignmentsByGameId = buildOverrideAssignmentsByGameId({
    roomAssignments: data.roomAssignments,
    rooms: data.rooms,
    assignedMemberNamesByRoomId,
  })

  const roomOptions = buildRoomSelectOptions(data.rooms, assignedMemberNamesByRoomId)
  const enabledManualRoomOptions = buildEnabledManualRoomOptions({
    roomOptions,
    rooms: data.rooms,
    roomAssignments: data.roomAssignments,
    availabilityByKey,
    slotId: assignmentSlotFilterId,
    year,
  })
  const manualGameRows = buildManualGameRows({
    games: sortedGames,
    defaultAssignmentByGameId,
    gmNamesByGameId,
    assignmentCountsByGameId,
    gameMembersByGameId,
    overrideAssignmentsByGameId,
  })
  const roomSlotAvailabilityRows = buildRoomSlotAvailabilityRows({
    rooms: data.rooms,
    availabilityByKey,
    slotIds,
    year,
  })
  const memberRoomRows = buildMemberRoomRows({
    memberships: data.memberships,
    memberRoomIdByMemberId,
  })
  const roomMemberRows = buildRoomMemberRows({
    rooms: data.rooms,
    memberships: data.memberships,
    memberRoomIdByMemberId,
  })
  const currentSlotAvailableRooms = buildCurrentSlotAvailableRooms({
    rooms: data.rooms,
    roomAssignments: data.roomAssignments,
    assignedMemberNamesByRoomId,
    availabilityByKey,
    slotId: assignmentSlotFilterId,
    year,
  })
  const roomUsageSummaryRows = buildRoomUsageSummaryRows({
    rooms: data.rooms,
    roomAssignments: data.roomAssignments,
    assignedMemberNamesByRoomId,
  })
  const roomAssignmentConflictRows = buildRoomAssignmentConflictRows({
    games: sortedGames,
    rooms: data.rooms,
    roomAssignments: data.roomAssignments,
    assignmentCountsByGameId,
    gmNamesByGameId,
    requiredAccessibilityByGameId,
    assignedMemberNamesByRoomId,
    availabilityByKey,
    year,
  })

  return {
    slotIds,
    defaultAssignmentByGameId,
    memberRoomIdByMemberId,
    roomOptions,
    enabledManualRoomOptions,
    memberOptions: buildMemberOptions(data.memberships),
    filteredManualGameRows: manualGameRows.filter((row) => row.slotId === assignmentSlotFilterId),
    roomSlotAvailabilityRows,
    memberRoomRows,
    roomMemberRows,
    currentSlotAvailableRooms,
    filteredRoomUsageSummaryRows: showMemberRooms
      ? roomUsageSummaryRows.filter((row) => row.assignedMemberNames.length > 0)
      : roomUsageSummaryRows,
    filteredRoomAssignmentConflictRows: conflictShowAllSlots
      ? roomAssignmentConflictRows
      : roomAssignmentConflictRows.filter((row) => row.slotId === assignmentSlotFilterId),
  }
}
