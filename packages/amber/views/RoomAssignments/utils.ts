import type { RoomAssignmentDashboardData } from '@amber/client'

import type {
  CurrentSlotRoomAvailabilityRow,
  ManualGameMember,
  ManualGameRoomAssignmentRow,
  ManualGameRoomOverrideAssignment,
  ManualRoomSelectOption,
  MemberRoomAssignmentRow,
  RoomAssignmentConflictRow,
  RoomMemberAssignmentRow,
  RoomUsageSummaryRow,
  SizedRoomSelectOption,
} from './types'

export type DashboardRoom = RoomAssignmentDashboardData['rooms'][number]
export type DashboardGame = RoomAssignmentDashboardData['games'][number]
export type DashboardRoomAssignment = RoomAssignmentDashboardData['roomAssignments'][number]
export type DashboardRoomSlotAvailability = RoomAssignmentDashboardData['roomSlotAvailability'][number]
export type DashboardMemberRoomAssignment = RoomAssignmentDashboardData['memberRoomAssignments'][number]
export type DashboardMembership = RoomAssignmentDashboardData['memberships'][number]
export type DashboardGameAssignment = RoomAssignmentDashboardData['gameAssignments'][number]
export type DashboardRoomAccessibility = DashboardRoom['accessibility']

const roomAccessibilityRank: Record<DashboardRoomAccessibility, number> = {
  accessible: 0,
  some_stairs: 1,
  many_stairs: 2,
}

const getMostRestrictiveAccessibility = (
  roomAccessibilityValues: Array<DashboardRoomAccessibility>,
): DashboardRoomAccessibility => {
  if (roomAccessibilityValues.length === 0) {
    return 'many_stairs'
  }

  return roomAccessibilityValues.reduce((mostRestrictiveValue, nextValue) => {
    if (roomAccessibilityRank[nextValue] < roomAccessibilityRank[mostRestrictiveValue]) {
      return nextValue
    }

    return mostRestrictiveValue
  }, roomAccessibilityValues[0])
}

export type RoomSlotKeyInput = {
  roomId: number
  slotId: number
  year: number
}

export const buildRoomSlotAvailabilityKey = ({ roomId, slotId, year }: RoomSlotKeyInput) =>
  `${year}:${slotId}:${roomId}`

export const buildSlotIds = (numberOfSlots: number) =>
  Array.from({ length: numberOfSlots }, (_value: undefined, index: number) => index + 1)

export const buildRoomSlotAvailabilityMap = (rows: Array<DashboardRoomSlotAvailability>) => {
  const availabilityByKey = new Map<string, boolean>()
  rows.forEach((row) => {
    availabilityByKey.set(
      buildRoomSlotAvailabilityKey({
        roomId: row.roomId,
        slotId: row.slotId,
        year: row.year,
      }),
      row.isAvailable,
    )
  })

  return availabilityByKey
}

export const isRoomAvailableInSlot = ({
  availabilityByKey,
  roomId,
  slotId,
  year,
}: {
  availabilityByKey: Map<string, boolean>
  roomId: number
  slotId: number
  year: number
}) =>
  availabilityByKey.get(
    buildRoomSlotAvailabilityKey({
      roomId,
      slotId,
      year,
    }),
  ) ?? true

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

export const buildDefaultRoomAssignmentByGameId = (rows: Array<DashboardRoomAssignment>) => {
  const defaultAssignmentByGameId = new Map<number, DashboardRoomAssignment>()

  rows
    .filter((row) => !row.isOverride)
    .sort((left, right) => {
      if (left.id === right.id) {
        return 0
      }
      return left.id < right.id ? -1 : 1
    })
    .forEach((row) => {
      if (!defaultAssignmentByGameId.has(row.gameId)) {
        defaultAssignmentByGameId.set(row.gameId, row)
      }
    })

  return defaultAssignmentByGameId
}

export const sortGamesForRoomAssignment = (games: Array<DashboardGame>) =>
  [...games].sort((left, right) => {
    const leftSlotId = left.slotId ?? Number.MAX_SAFE_INTEGER
    const rightSlotId = right.slotId ?? Number.MAX_SAFE_INTEGER
    if (leftSlotId !== rightSlotId) {
      return leftSlotId - rightSlotId
    }

    return left.name.localeCompare(right.name)
  })

const sortNames = (names: Array<string>) => [...names].sort((left, right) => left.localeCompare(right))

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

export const buildGmNamesByGameId = (gameAssignments: Array<DashboardGameAssignment>) =>
  gameAssignments.reduce((accumulator, gameAssignment) => {
    if (!gameAssignment.gm) {
      return accumulator
    }

    const memberName = gameAssignment.membership.user.fullName ?? ''
    if (!memberName) {
      return accumulator
    }

    const gmNames = accumulator.get(gameAssignment.gameId) ?? []
    gmNames.push(memberName)
    accumulator.set(gameAssignment.gameId, gmNames)
    return accumulator
  }, new Map<number, Array<string>>())

export const buildAssignmentCountsByGameId = (gameAssignments: Array<DashboardGameAssignment>) =>
  gameAssignments.reduce((accumulator, gameAssignment) => {
    if (gameAssignment.gm < 0) {
      return accumulator
    }

    accumulator.set(gameAssignment.gameId, (accumulator.get(gameAssignment.gameId) ?? 0) + 1)
    return accumulator
  }, new Map<number, number>())

export const buildGameMembersByGameId = (gameAssignments: Array<DashboardGameAssignment>) =>
  gameAssignments.reduce((accumulator, gameAssignment) => {
    if (gameAssignment.gm < 0) {
      return accumulator
    }

    const memberName = gameAssignment.membership.user.fullName ?? 'Unknown member'
    const members = accumulator.get(gameAssignment.gameId) ?? []
    members.push({
      id: `${gameAssignment.memberId}-${gameAssignment.gameId}-${gameAssignment.gm}`,
      memberId: gameAssignment.memberId,
      memberName,
      roleLabel: gameAssignment.gm === 0 ? 'Player' : 'GM',
      gm: gameAssignment.gm !== 0,
    })
    accumulator.set(gameAssignment.gameId, members)
    return accumulator
  }, new Map<number, Array<ManualGameMember>>())

export const buildRoomSelectOptions = (
  rooms: Array<DashboardRoom>,
  assignedMemberNamesByRoomId: Map<number, Array<string>>,
): Array<SizedRoomSelectOption> =>
  [...rooms]
    .sort((left, right) => right.size - left.size || left.description.localeCompare(right.description))
    .map((room) => ({
      id: room.id,
      description: room.description,
      size: room.size,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
    }))

export const buildEnabledManualRoomOptions = ({
  roomOptions,
  rooms,
  roomAssignments,
  availabilityByKey,
  slotId,
  year,
}: {
  roomOptions: Array<SizedRoomSelectOption>
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  availabilityByKey: Map<string, boolean>
  slotId: number
  year: number
}): Array<ManualRoomSelectOption> => {
  const enabledRoomIds = new Set(rooms.filter((room) => room.enabled).map((room) => room.id))
  const slotAssignmentCountByRoomId = roomAssignments.reduce((accumulator, assignment) => {
    if (assignment.slotId !== slotId) {
      return accumulator
    }

    accumulator.set(assignment.roomId, (accumulator.get(assignment.roomId) ?? 0) + 1)
    return accumulator
  }, new Map<number, number>())

  return roomOptions
    .filter((roomOption) => enabledRoomIds.has(roomOption.id))
    .map((roomOption) => ({
      ...roomOption,
      slotAssignmentCount: slotAssignmentCountByRoomId.get(roomOption.id) ?? 0,
      slotIsAvailable: isRoomAvailableInSlot({
        availabilityByKey,
        roomId: roomOption.id,
        slotId,
        year,
      }),
    }))
    .sort(
      (left, right) =>
        Number(left.slotIsAvailable === false) - Number(right.slotIsAvailable === false) ||
        Number(left.slotAssignmentCount > 0) - Number(right.slotAssignmentCount > 0) ||
        right.size - left.size ||
        left.description.localeCompare(right.description),
    )
}

export const buildOverrideAssignmentsByGameId = ({
  roomAssignments,
  rooms,
  assignedMemberNamesByRoomId,
}: {
  roomAssignments: Array<DashboardRoomAssignment>
  rooms: Array<DashboardRoom>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
}) => {
  const roomById = new Map(rooms.map((room) => [room.id, room]))

  return roomAssignments
    .filter((assignment) => assignment.isOverride)
    .reduce((accumulator, assignment) => {
      const room = roomById.get(assignment.roomId)
      if (!room) {
        return accumulator
      }

      const overrideAssignments = accumulator.get(assignment.gameId) ?? []
      overrideAssignments.push({
        id: assignment.id,
        roomId: room.id,
        roomDescription: room.description,
        roomSize: room.size,
        assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      })
      overrideAssignments.sort((left, right) => left.roomDescription.localeCompare(right.roomDescription))
      accumulator.set(assignment.gameId, overrideAssignments)
      return accumulator
    }, new Map<number, Array<ManualGameRoomOverrideAssignment>>())
}

export const buildManualGameRows = ({
  games,
  defaultAssignmentByGameId,
  gmNamesByGameId,
  assignmentCountsByGameId,
  gameMembersByGameId,
  overrideAssignmentsByGameId,
}: {
  games: Array<DashboardGame>
  defaultAssignmentByGameId: Map<number, DashboardRoomAssignment>
  gmNamesByGameId: Map<number, Array<string>>
  assignmentCountsByGameId: Map<number, number>
  gameMembersByGameId: Map<number, Array<ManualGameMember>>
  overrideAssignmentsByGameId: Map<number, Array<ManualGameRoomOverrideAssignment>>
}): Array<ManualGameRoomAssignmentRow> =>
  games
    .filter((game) => !!game.slotId && game.category === 'user')
    .filter((game) => (assignmentCountsByGameId.get(game.id) ?? 0) > 0)
    .map((game) => {
      const assignedCount = assignmentCountsByGameId.get(game.id) ?? 0
      const defaultAssignment = defaultAssignmentByGameId.get(game.id)
      const overrideAssignments = [...(overrideAssignmentsByGameId.get(game.id) ?? [])]
      const totalRoomSize =
        (defaultAssignment?.room.size ?? 0) +
        overrideAssignments.reduce((sum, overrideAssignment) => sum + overrideAssignment.roomSize, 0)

      return {
        id: game.id,
        gameId: game.id,
        slotId: game.slotId ?? 0,
        gameName: game.name,
        gmNames: sortNames(gmNamesByGameId.get(game.id) ?? []),
        assignedCount,
        currentRoomSize: totalRoomSize > 0 ? totalRoomSize : null,
        roomSpace: totalRoomSize > 0 ? totalRoomSize - assignedCount : null,
        currentRoomId: defaultAssignment?.roomId ?? null,
        currentRoomAssignmentReason: defaultAssignment?.assignmentReason ?? null,
        overrideAssignments,
        members: [...(gameMembersByGameId.get(game.id) ?? [])].sort(
          (left, right) => Number(right.gm) - Number(left.gm) || left.memberName.localeCompare(right.memberName),
        ),
      }
    })

export const buildRequiredAccessibilityByGameId = (gameAssignments: Array<DashboardGameAssignment>) =>
  gameAssignments.reduce((accumulator, gameAssignment) => {
    if (gameAssignment.gm < 0) {
      return accumulator
    }

    const roomAccessibilityPreference = gameAssignment.membership.user.profile[0]?.roomAccessibilityPreference
    if (!roomAccessibilityPreference) {
      return accumulator
    }

    const existingPreferences = accumulator.get(gameAssignment.gameId) ?? []
    existingPreferences.push(roomAccessibilityPreference)
    accumulator.set(gameAssignment.gameId, existingPreferences)
    return accumulator
  }, new Map<number, Array<DashboardRoomAccessibility>>())

export const buildMemberRoomRows = ({
  memberships,
  memberRoomIdByMemberId,
}: {
  memberships: Array<DashboardMembership>
  memberRoomIdByMemberId: Map<number, number>
}): Array<MemberRoomAssignmentRow> => {
  const memberNamesByRoomId = memberships.reduce((accumulator, membership) => {
    if (!membership.attending) {
      return accumulator
    }

    const assignedRoomId = memberRoomIdByMemberId.get(membership.id) ?? null
    if (!assignedRoomId) {
      return accumulator
    }

    const memberNames = accumulator.get(assignedRoomId) ?? []
    memberNames.push(membership.user.fullName ?? '')
    accumulator.set(assignedRoomId, memberNames)
    return accumulator
  }, new Map<number, Array<string>>())

  return memberships
    .filter((membership) => membership.attending)
    .map((membership) => {
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
}): Array<RoomMemberAssignmentRow> =>
  rooms.map((room) => {
    const assignedMembers = memberships
      .filter((membership) => membership.attending)
      .filter((membership) => memberRoomIdByMemberId.get(membership.id) === room.id)
      .map((membership) => ({
        id: membership.id,
        fullName: membership.user.fullName ?? '',
      }))
      .filter((assignedMember) => assignedMember.fullName)
      .sort((left, right) => left.fullName.localeCompare(right.fullName))

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

export const buildCurrentSlotAvailableRooms = ({
  rooms,
  roomAssignments,
  assignedMemberNamesByRoomId,
  availabilityByKey,
  slotId,
  year,
}: {
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
  availabilityByKey: Map<string, boolean>
  slotId: number
  year: number
}): Array<CurrentSlotRoomAvailabilityRow> => {
  const occupiedRoomIds = new Set(
    roomAssignments
      .filter((assignment) => assignment.slotId === slotId && !assignment.isOverride)
      .map((assignment) => assignment.roomId),
  )

  return rooms
    .filter(
      (room) =>
        room.enabled &&
        isRoomAvailableInSlot({
          availabilityByKey,
          roomId: room.id,
          slotId,
          year,
        }) &&
        !occupiedRoomIds.has(room.id),
    )
    .map((room) => ({
      id: room.id,
      roomId: room.id,
      roomDescription: room.description,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      size: room.size,
    }))
    .sort((left, right) => right.size - left.size || left.roomDescription.localeCompare(right.roomDescription))
}

export const buildRoomUsageSummaryRows = ({
  rooms,
  roomAssignments,
  assignedMemberNamesByRoomId,
}: {
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
}): Array<RoomUsageSummaryRow> => {
  const usageCountByRoomId = roomAssignments.reduce((accumulator, assignment) => {
    const currentCount = accumulator.get(assignment.roomId) ?? 0
    accumulator.set(assignment.roomId, currentCount + 1)
    return accumulator
  }, new Map<number, number>())

  return rooms
    .filter((room) => room.enabled)
    .map((room) => ({
      id: room.id,
      roomId: room.id,
      roomDescription: room.description,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      size: room.size,
      usageCount: usageCountByRoomId.get(room.id) ?? 0,
    }))
    .sort(
      (left, right) =>
        right.usageCount - left.usageCount ||
        right.size - left.size ||
        left.roomDescription.localeCompare(right.roomDescription),
    )
}

export const buildRoomAssignmentConflictRows = ({
  games,
  rooms,
  roomAssignments,
  assignmentCountsByGameId,
  gmNamesByGameId,
  requiredAccessibilityByGameId,
  assignedMemberNamesByRoomId,
  availabilityByKey,
  year,
}: {
  games: Array<DashboardGame>
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignmentCountsByGameId: Map<number, number>
  gmNamesByGameId: Map<number, Array<string>>
  requiredAccessibilityByGameId: Map<number, Array<DashboardRoomAccessibility>>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
  availabilityByKey: Map<string, boolean>
  year: number
}): Array<RoomAssignmentConflictRow> => {
  const userGames = games
    .filter((game) => !!game.slotId && game.category === 'user')
    .filter((game) => (assignmentCountsByGameId.get(game.id) ?? 0) > 0)
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const gameById = new Map(userGames.map((game) => [game.id, game]))
  const assignmentsByGameId = roomAssignments.reduce((accumulator, assignment) => {
    const gameAssignmentsForGame = accumulator.get(assignment.gameId) ?? []
    gameAssignmentsForGame.push(assignment)
    accumulator.set(assignment.gameId, gameAssignmentsForGame)
    return accumulator
  }, new Map<number, Array<DashboardRoomAssignment>>())
  const conflicts: Array<RoomAssignmentConflictRow> = []

  userGames.forEach((game) => {
    const gameAssignmentsForGame = assignmentsByGameId.get(game.id) ?? []
    const participantCount = assignmentCountsByGameId.get(game.id) ?? 0
    const requiredAccessibility = getMostRestrictiveAccessibility(requiredAccessibilityByGameId.get(game.id) ?? [])
    const gmNames = sortNames(gmNamesByGameId.get(game.id) ?? [])

    if (gameAssignmentsForGame.length === 0) {
      conflicts.push({
        id: `missing-room:${game.id}`,
        slotId: game.slotId ?? 0,
        gameId: game.id,
        gameName: game.name,
        gmNames,
        roomDescription: 'Unassigned',
        assignedMemberNames: [],
        severity: 'error',
        issueType: 'Missing room assignment',
        detail: 'This game does not have any room assignment for its slot.',
      })
      return
    }

    gameAssignmentsForGame.forEach((assignment) => {
      const room = roomById.get(assignment.roomId)
      if (!room) {
        return
      }

      if (
        !isRoomAvailableInSlot({
          availabilityByKey,
          roomId: room.id,
          slotId: assignment.slotId,
          year,
        })
      ) {
        conflicts.push({
          id: `room-unavailable:${assignment.id}`,
          slotId: assignment.slotId,
          gameId: game.id,
          gameName: game.name,
          gmNames,
          roomDescription: room.description,
          assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
          severity: 'error',
          issueType: 'Unavailable room',
          detail: `Room ${room.description} is marked unavailable for Slot ${assignment.slotId}.`,
        })
      }

      if (room.size < participantCount) {
        conflicts.push({
          id: `capacity:${assignment.id}`,
          slotId: assignment.slotId,
          gameId: game.id,
          gameName: game.name,
          gmNames,
          roomDescription: room.description,
          assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
          severity: 'error',
          issueType: 'Capacity too small',
          detail: `Room size ${room.size} is smaller than the current player count ${participantCount}.`,
        })
      }

      if (roomAccessibilityRank[room.accessibility] > roomAccessibilityRank[requiredAccessibility]) {
        conflicts.push({
          id: `accessibility:${assignment.id}`,
          slotId: assignment.slotId,
          gameId: game.id,
          gameName: game.name,
          gmNames,
          roomDescription: room.description,
          assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
          severity: 'error',
          issueType: 'Accessibility mismatch',
          detail: `Room accessibility ${room.accessibility} does not meet the game requirement ${requiredAccessibility}.`,
        })
      }
    })
  })

  const assignmentsByRoomSlotKey = roomAssignments.reduce((accumulator, assignment) => {
    const roomSlotKey = buildRoomSlotAvailabilityKey({
      roomId: assignment.roomId,
      slotId: assignment.slotId,
      year: assignment.year,
    })
    const assignmentsForRoomSlot = accumulator.get(roomSlotKey) ?? []
    assignmentsForRoomSlot.push(assignment)
    accumulator.set(roomSlotKey, assignmentsForRoomSlot)
    return accumulator
  }, new Map<string, Array<DashboardRoomAssignment>>())

  assignmentsByRoomSlotKey.forEach((assignmentsForRoomSlot) => {
    const gameIds = [...new Set(assignmentsForRoomSlot.map((assignment) => assignment.gameId))]
    if (gameIds.length <= 1) {
      return
    }

    const firstAssignment = assignmentsForRoomSlot[0]
    if (!firstAssignment) {
      return
    }

    const room = roomById.get(firstAssignment.roomId)
    if (!room) {
      return
    }

    if (room.description === 'N/A') {
      return
    }

    const gameNames = gameIds
      .map((gameId) => gameById.get(gameId)?.name)
      .filter((gameName): gameName is string => !!gameName)
      .sort((left, right) => left.localeCompare(right))

    conflicts.push({
      id: `room-conflict:${firstAssignment.year}:${firstAssignment.slotId}:${firstAssignment.roomId}`,
      slotId: firstAssignment.slotId,
      gameId: null,
      gameName: gameNames.join(', '),
      gmNames: [],
      roomDescription: room.description,
      assignedMemberNames: assignedMemberNamesByRoomId.get(room.id) ?? [],
      severity: 'warning',
      issueType: 'Room conflict',
      detail: `Room ${room.description} is assigned to multiple games in Slot ${firstAssignment.slotId}.`,
    })
  })

  return conflicts.sort((left, right) => {
    const severitySort = Number(left.severity === 'warning') - Number(right.severity === 'warning')
    if (severitySort !== 0) {
      return severitySort
    }

    return (
      left.slotId - right.slotId ||
      left.gameName.localeCompare(right.gameName) ||
      left.roomDescription.localeCompare(right.roomDescription) ||
      left.issueType.localeCompare(right.issueType)
    )
  })
}
