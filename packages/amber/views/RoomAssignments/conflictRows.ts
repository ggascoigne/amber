import {
  buildRoomSlotAvailabilityKey,
  doesRoomMeetAccessibilityRequirement,
  getMostRestrictiveAccessibility,
  isRoomAvailableInSlot,
  sortNames,
} from './dashboardShared'
import type {
  DashboardGame,
  DashboardRoom,
  DashboardRoomAccessibility,
  DashboardRoomAssignment,
} from './dashboardShared'
import type { RoomAssignmentConflictRow } from './types'

type BuildRoomAssignmentConflictRowsInput = {
  games: Array<DashboardGame>
  rooms: Array<DashboardRoom>
  roomAssignments: Array<DashboardRoomAssignment>
  assignmentCountsByGameId: Map<number, number>
  gmNamesByGameId: Map<number, Array<string>>
  requiredAccessibilityByGameId: Map<number, Array<DashboardRoomAccessibility>>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
  availabilityByKey: Map<string, boolean>
  year: number
}

type ConflictGameContext = {
  game: DashboardGame
  participantCount: number
  requiredAccessibility: DashboardRoomAccessibility
  gmNames: Array<string>
}

const buildConflictGameContexts = ({
  games,
  assignmentCountsByGameId,
  gmNamesByGameId,
  requiredAccessibilityByGameId,
}: Pick<
  BuildRoomAssignmentConflictRowsInput,
  'games' | 'assignmentCountsByGameId' | 'gmNamesByGameId' | 'requiredAccessibilityByGameId'
>): Array<ConflictGameContext> =>
  games
    .filter((game) => !!game.slotId && game.category === 'user')
    .filter((game) => (assignmentCountsByGameId.get(game.id) ?? 0) > 0)
    .map((game) => ({
      game,
      participantCount: assignmentCountsByGameId.get(game.id) ?? 0,
      requiredAccessibility: getMostRestrictiveAccessibility(requiredAccessibilityByGameId.get(game.id) ?? []),
      gmNames: sortNames(gmNamesByGameId.get(game.id) ?? []),
    }))

const buildAssignmentsByGameId = (roomAssignments: Array<DashboardRoomAssignment>) =>
  roomAssignments.reduce((accumulator, assignment) => {
    const gameAssignmentsForGame = accumulator.get(assignment.gameId) ?? []
    gameAssignmentsForGame.push(assignment)
    accumulator.set(assignment.gameId, gameAssignmentsForGame)
    return accumulator
  }, new Map<number, Array<DashboardRoomAssignment>>())

const buildAssignmentsByRoomSlotKey = (roomAssignments: Array<DashboardRoomAssignment>) =>
  roomAssignments.reduce((accumulator, assignment) => {
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

const buildMissingRoomConflict = ({
  game,
  gmNames,
}: Pick<ConflictGameContext, 'game' | 'gmNames'>): RoomAssignmentConflictRow => ({
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

const buildAssignmentConflicts = ({
  context,
  assignment,
  room,
  assignedMemberNamesByRoomId,
  availabilityByKey,
  year,
}: {
  context: ConflictGameContext
  assignment: DashboardRoomAssignment
  room: DashboardRoom
  assignedMemberNamesByRoomId: Map<number, Array<string>>
  availabilityByKey: Map<string, boolean>
  year: number
}): Array<RoomAssignmentConflictRow> => {
  const assignedMemberNames = assignedMemberNamesByRoomId.get(room.id) ?? []
  const conflicts: Array<RoomAssignmentConflictRow> = []

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
      gameId: context.game.id,
      gameName: context.game.name,
      gmNames: context.gmNames,
      roomDescription: room.description,
      assignedMemberNames,
      severity: 'error',
      issueType: 'Unavailable room',
      detail: `Room ${room.description} is marked unavailable for Slot ${assignment.slotId}.`,
    })
  }

  if (room.size < context.participantCount) {
    conflicts.push({
      id: `capacity:${assignment.id}`,
      slotId: assignment.slotId,
      gameId: context.game.id,
      gameName: context.game.name,
      gmNames: context.gmNames,
      roomDescription: room.description,
      assignedMemberNames,
      severity: 'error',
      issueType: 'Capacity too small',
      detail: `Room size ${room.size} is smaller than the current player count ${context.participantCount}.`,
    })
  }

  if (
    !doesRoomMeetAccessibilityRequirement({
      roomAccessibility: room.accessibility,
      requiredAccessibility: context.requiredAccessibility,
    })
  ) {
    conflicts.push({
      id: `accessibility:${assignment.id}`,
      slotId: assignment.slotId,
      gameId: context.game.id,
      gameName: context.game.name,
      gmNames: context.gmNames,
      roomDescription: room.description,
      assignedMemberNames,
      severity: 'error',
      issueType: 'Accessibility mismatch',
      detail: `Room accessibility ${room.accessibility} does not meet the game requirement ${context.requiredAccessibility}.`,
    })
  }

  return conflicts
}

const buildRoomConflict = ({
  assignmentsForRoomSlot,
  roomById,
  gameById,
  assignedMemberNamesByRoomId,
}: {
  assignmentsForRoomSlot: Array<DashboardRoomAssignment>
  roomById: Map<number, DashboardRoom>
  gameById: Map<number, DashboardGame>
  assignedMemberNamesByRoomId: Map<number, Array<string>>
}): RoomAssignmentConflictRow | null => {
  const gameIds = [...new Set(assignmentsForRoomSlot.map((assignment) => assignment.gameId))]
  if (gameIds.length <= 1) {
    return null
  }

  const firstAssignment = assignmentsForRoomSlot[0]
  if (!firstAssignment) {
    return null
  }

  const room = roomById.get(firstAssignment.roomId)
  if (!room || room.description === 'N/A') {
    return null
  }

  const gameNames = gameIds
    .map((gameId) => gameById.get(gameId)?.name)
    .filter((gameName): gameName is string => !!gameName)
    .sort((left, right) => left.localeCompare(right))

  return {
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
  }
}

const sortConflicts = (left: RoomAssignmentConflictRow, right: RoomAssignmentConflictRow) => {
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
}: BuildRoomAssignmentConflictRowsInput): Array<RoomAssignmentConflictRow> => {
  const conflicts: Array<RoomAssignmentConflictRow> = []
  const roomById = new Map(rooms.map((room) => [room.id, room]))
  const gameContexts = buildConflictGameContexts({
    games,
    assignmentCountsByGameId,
    gmNamesByGameId,
    requiredAccessibilityByGameId,
  })
  const gameById = new Map(gameContexts.map(({ game }) => [game.id, game]))
  const assignmentsByGameId = buildAssignmentsByGameId(roomAssignments)

  gameContexts.forEach((context) => {
    const gameAssignmentsForGame = assignmentsByGameId.get(context.game.id) ?? []
    if (gameAssignmentsForGame.length === 0) {
      conflicts.push(
        buildMissingRoomConflict({
          game: context.game,
          gmNames: context.gmNames,
        }),
      )
      return
    }

    gameAssignmentsForGame.forEach((assignment) => {
      const room = roomById.get(assignment.roomId)
      if (!room) {
        return
      }

      conflicts.push(
        ...buildAssignmentConflicts({
          context,
          assignment,
          room,
          assignedMemberNamesByRoomId,
          availabilityByKey,
          year,
        }),
      )
    })
  })

  buildAssignmentsByRoomSlotKey(roomAssignments).forEach((assignmentsForRoomSlot) => {
    const roomConflict = buildRoomConflict({
      assignmentsForRoomSlot,
      roomById,
      gameById,
      assignedMemberNamesByRoomId,
    })

    if (roomConflict) {
      conflicts.push(roomConflict)
    }
  })

  return conflicts.sort(sortConflicts)
}
