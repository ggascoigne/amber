import { sortNames } from './dashboardShared'
import type {
  DashboardGame,
  DashboardGameAssignment,
  DashboardRoom,
  DashboardRoomAccessibility,
  DashboardRoomAssignment,
} from './dashboardShared'
import type { ManualGameMember, ManualGameRoomAssignmentRow, ManualGameRoomOverrideAssignment } from './types'

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
