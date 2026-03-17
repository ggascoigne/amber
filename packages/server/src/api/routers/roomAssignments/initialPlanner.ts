import { doesRoomFitGame, getMostRestrictiveAccessibility, type RoomAccessibility } from './domain'

export type InitialPlannerRoom = {
  id: number
  description: string
  size: number
  type: string
  enabled: boolean
  accessibility: RoomAccessibility
}

export type InitialPlannerGame = {
  id: number
  name: string
  slotId: number
  year: number
  category: string
}

export type InitialPlannerParticipant = {
  memberId: number
  gameId: number
  isGm: boolean
  fullName: string
  roomAccessibilityPreference: RoomAccessibility | null
}

export type InitialPlannerRoomAvailability = {
  roomId: number
  slotId: number
  year: number
  isAvailable: boolean
}

export type InitialPlannerMemberRoomAssignment = {
  memberId: number
  roomId: number
  memberName: string
}

export type InitialPlannerExistingAssignment = {
  gameId: number
  roomId: number
  slotId: number
  year: number
  isOverride: boolean
  source: 'manual' | 'auto'
}

export type InitialPlannerInput = {
  year: number
  games: Array<InitialPlannerGame>
  rooms: Array<InitialPlannerRoom>
  participants: Array<InitialPlannerParticipant>
  roomSlotAvailability: Array<InitialPlannerRoomAvailability>
  memberRoomAssignments: Array<InitialPlannerMemberRoomAssignment>
  existingAssignments: Array<InitialPlannerExistingAssignment>
}

export type PlannedRoomAssignment = {
  gameId: number
  gameName: string
  roomId: number
  roomDescription: string
  slotId: number
  year: number
  source: 'auto'
  reason: string
}

export type SkippedPlannedGame = {
  gameId: number
  gameName: string
  slotId: number
  participantCount: number
  reason: string
}

export type PlannerUnmetConstraint = {
  id: string
  slotId: number
  type: 'unused_non_member_room'
  detail: string
}

export type InitialPlannerResult = {
  assignments: Array<PlannedRoomAssignment>
  skippedGames: Array<SkippedPlannedGame>
  unmetConstraints: Array<PlannerUnmetConstraint>
}

type PlannedGameContext = {
  game: InitialPlannerGame
  participantCount: number
  requiredAccessibility: RoomAccessibility
  gmMemberIds: Array<number>
  playerMemberIds: Array<number>
}

type RoomCandidate = {
  room: InitialPlannerRoom
  usageCount: number
}

type OwnedRoomCandidate = RoomCandidate & {
  ownerPriority: number
}

const buildAvailabilityKey = ({ roomId, slotId, year }: { roomId: number; slotId: number; year: number }) =>
  `${year}:${slotId}:${roomId}`

const isBallroomRoom = (room: InitialPlannerRoom) =>
  room.type.toLowerCase().includes('ballroom') || room.description.toLowerCase().includes('ballroom')

const isBlackRabbitBarRoom = (room: InitialPlannerRoom) => room.description.toLowerCase() === 'black rabbit bar'

const isPubTheoryGame = (game: InitialPlannerGame) => game.name.toLowerCase() === 'pub theory & game crawl'

const sortGamesForPlanning = (games: Array<PlannedGameContext>) =>
  [...games].sort(
    (left, right) =>
      right.participantCount - left.participantCount ||
      left.game.name.localeCompare(right.game.name) ||
      left.game.id - right.game.id,
  )

const sortRoomsBySizeThenUsage = (left: RoomCandidate, right: RoomCandidate) =>
  right.room.size - left.room.size ||
  left.usageCount - right.usageCount ||
  left.room.description.localeCompare(right.room.description)

const sortMemberFallbackRooms = ({
  game,
  left,
  right,
}: {
  game: PlannedGameContext
  left: RoomCandidate
  right: RoomCandidate
}) => {
  const leftExcessCapacity = left.room.size - game.participantCount
  const rightExcessCapacity = right.room.size - game.participantCount

  return (
    left.usageCount - right.usageCount ||
    leftExcessCapacity - rightExcessCapacity ||
    left.room.size - right.room.size ||
    left.room.description.localeCompare(right.room.description)
  )
}

const buildSkipReason = ({
  candidateRooms,
  eligibleRooms,
  game,
}: {
  candidateRooms: Array<InitialPlannerRoom>
  eligibleRooms: Array<InitialPlannerRoom>
  game: PlannedGameContext
}): string => {
  if (candidateRooms.length === 0) {
    return `No enabled room can fit ${game.participantCount} participant(s) with ${game.requiredAccessibility} accessibility.`
  }

  if (eligibleRooms.length === 0) {
    return 'No eligible room remained after higher-priority assignments or slot availability constraints.'
  }

  return 'No room remained after applying planner priorities.'
}

export const planInitialRoomAssignments = (input: InitialPlannerInput): InitialPlannerResult => {
  const roomsById = new Map(input.rooms.map((room) => [room.id, room]))
  const roomAvailabilityByKey = new Map(
    input.roomSlotAvailability.map((row) => [buildAvailabilityKey(row), row.isAvailable]),
  )
  const memberRoomIdByMemberId = new Map(
    input.memberRoomAssignments.map((assignment) => [assignment.memberId, assignment.roomId]),
  )
  const roomMemberCountByRoomId = input.memberRoomAssignments.reduce((counts, assignment) => {
    counts.set(assignment.roomId, (counts.get(assignment.roomId) ?? 0) + 1)
    return counts
  }, new Map<number, number>())
  const memberRoomIds = new Set(input.memberRoomAssignments.map((assignment) => assignment.roomId))

  const existingFixedAssignmentsBySlotId = input.existingAssignments.reduce((accumulator, assignment) => {
    const assignments = accumulator.get(assignment.slotId) ?? []
    assignments.push(assignment)
    accumulator.set(assignment.slotId, assignments)
    return accumulator
  }, new Map<number, Array<InitialPlannerExistingAssignment>>())
  const lockedGameIds = new Set(input.existingAssignments.map((assignment) => assignment.gameId))

  const participantsByGameId = input.participants.reduce((accumulator, participant) => {
    const participants = accumulator.get(participant.gameId) ?? []
    participants.push(participant)
    accumulator.set(participant.gameId, participants)
    return accumulator
  }, new Map<number, Array<InitialPlannerParticipant>>())

  const plannedGamesBySlotId = input.games
    .filter((game) => game.year === input.year && game.category === 'user')
    .reduce((accumulator, game) => {
      const participants = participantsByGameId.get(game.id) ?? []
      const gmMemberIds = participants
        .filter((participant) => participant.isGm)
        .map((participant) => participant.memberId)
      const playerMemberIds = participants
        .filter((participant) => !participant.isGm)
        .map((participant) => participant.memberId)
      const requiredAccessibility = getMostRestrictiveAccessibility(
        participants.flatMap((participant) =>
          participant.roomAccessibilityPreference ? [participant.roomAccessibilityPreference] : [],
        ),
      )
      const plannedGame = {
        game,
        participantCount: participants.length,
        requiredAccessibility,
        gmMemberIds,
        playerMemberIds,
      }

      const games = accumulator.get(game.slotId) ?? []
      games.push(plannedGame)
      accumulator.set(game.slotId, games)
      return accumulator
    }, new Map<number, Array<PlannedGameContext>>())

  const slotIds = [...plannedGamesBySlotId.keys()].sort((left, right) => left - right)
  const assignments: Array<PlannedRoomAssignment> = []
  const skippedGames: Array<SkippedPlannedGame> = []
  const unmetConstraints: Array<PlannerUnmetConstraint> = []
  const usageCountByRoomId = new Map<number, number>()

  const doesRoomFitCurrentGame = ({ game, room }: { game: PlannedGameContext; room: InitialPlannerRoom }) =>
    doesRoomFitGame({
      gameSize: game.participantCount,
      requiredAccessibility: game.requiredAccessibility,
      roomAccessibility: room.accessibility,
      roomSize: room.size,
    })

  slotIds.forEach((slotId) => {
    const gamesForSlot = sortGamesForPlanning(plannedGamesBySlotId.get(slotId) ?? []).filter(
      ({ game }) => !lockedGameIds.has(game.id),
    )
    const occupiedRoomIds = new Set(
      (existingFixedAssignmentsBySlotId.get(slotId) ?? []).map((assignment) => assignment.roomId),
    )
    const assignedGameIds = new Set<number>()

    const getCandidateRooms = (game: PlannedGameContext) =>
      input.rooms.filter((room) => room.enabled).filter((room) => doesRoomFitCurrentGame({ game, room }))

    const getEligibleRooms = (game: PlannedGameContext) =>
      getCandidateRooms(game).filter((room) => {
        if (occupiedRoomIds.has(room.id)) {
          return false
        }

        return (
          roomAvailabilityByKey.get(
            buildAvailabilityKey({
              roomId: room.id,
              slotId,
              year: input.year,
            }),
          ) ?? true
        )
      })

    const hasLargerOpenSharedRoom = (game: PlannedGameContext) =>
      getEligibleRooms(game).some((room) => !memberRoomIds.has(room.id) && room.size > game.participantCount)

    const assignRoom = ({
      game,
      room,
      reason,
    }: {
      game: PlannedGameContext
      room: InitialPlannerRoom
      reason: string
    }) => {
      assignments.push({
        gameId: game.game.id,
        gameName: game.game.name,
        roomId: room.id,
        roomDescription: room.description,
        slotId,
        year: input.year,
        source: 'auto',
        reason,
      })
      assignedGameIds.add(game.game.id)
      occupiedRoomIds.add(room.id)
    }

    const chooseOwnedRoom = ({
      game,
      memberIds,
      ownerPriority,
    }: {
      game: PlannedGameContext
      memberIds: Array<number>
      ownerPriority: (roomId: number) => number
    }): InitialPlannerRoom | null => {
      const roomCandidatesByRoomId = memberIds.reduce((accumulator, memberId) => {
        const roomId = memberRoomIdByMemberId.get(memberId)
        if (!roomId) {
          return accumulator
        }

        const room = roomsById.get(roomId)
        if (!room || !room.enabled || occupiedRoomIds.has(room.id)) {
          return accumulator
        }

        const isAvailable =
          roomAvailabilityByKey.get(
            buildAvailabilityKey({
              roomId: room.id,
              slotId,
              year: input.year,
            }),
          ) ?? true
        if (!isAvailable || !doesRoomFitCurrentGame({ game, room })) {
          return accumulator
        }

        const nextCandidate: OwnedRoomCandidate = {
          room,
          usageCount: usageCountByRoomId.get(room.id) ?? 0,
          ownerPriority: ownerPriority(room.id),
        }
        const previousCandidate = accumulator.get(room.id)
        if (!previousCandidate || nextCandidate.ownerPriority < previousCandidate.ownerPriority) {
          accumulator.set(room.id, nextCandidate)
        }
        return accumulator
      }, new Map<number, OwnedRoomCandidate>())

      const bestCandidate = [...roomCandidatesByRoomId.values()].sort(
        (left, right) =>
          left.ownerPriority - right.ownerPriority ||
          right.room.size - left.room.size ||
          left.usageCount - right.usageCount ||
          left.room.description.localeCompare(right.room.description),
      )[0]

      return bestCandidate?.room ?? null
    }

    const choosePreferredRoom = ({
      game,
      roomFilter,
      preferNonBallroom,
      sortCandidates,
    }: {
      game: PlannedGameContext
      roomFilter: (room: InitialPlannerRoom) => boolean
      preferNonBallroom: boolean
      sortCandidates?: (left: RoomCandidate, right: RoomCandidate) => number
    }): InitialPlannerRoom | null => {
      const eligibleCandidates = getEligibleRooms(game)
        .filter(roomFilter)
        .map((room) => ({
          room,
          usageCount: usageCountByRoomId.get(room.id) ?? 0,
        }))

      if (eligibleCandidates.length === 0) {
        return null
      }

      const candidatePool =
        preferNonBallroom && eligibleCandidates.some((candidate) => !isBallroomRoom(candidate.room))
          ? eligibleCandidates.filter((candidate) => !isBallroomRoom(candidate.room))
          : eligibleCandidates

      return [...candidatePool].sort(sortCandidates ?? sortRoomsBySizeThenUsage)[0]?.room ?? null
    }

    const assignSpecialPubTheory = () => {
      const pubTheoryGame = gamesForSlot.find(
        (game) => !assignedGameIds.has(game.game.id) && isPubTheoryGame(game.game),
      )
      if (!pubTheoryGame) {
        return
      }

      const blackRabbitBar = input.rooms.find((room) => room.enabled && isBlackRabbitBarRoom(room))
      if (
        !blackRabbitBar ||
        occupiedRoomIds.has(blackRabbitBar.id) ||
        !doesRoomFitCurrentGame({ game: pubTheoryGame, room: blackRabbitBar })
      ) {
        return
      }

      const isAvailable =
        roomAvailabilityByKey.get(
          buildAvailabilityKey({
            roomId: blackRabbitBar.id,
            slotId,
            year: input.year,
          }),
        ) ?? true

      if (!isAvailable) {
        return
      }

      assignRoom({
        game: pubTheoryGame,
        room: blackRabbitBar,
        reason: 'Black Rabbit Bar fixed exception',
      })
    }

    assignSpecialPubTheory()

    gamesForSlot.forEach((game) => {
      if (assignedGameIds.has(game.game.id)) {
        return
      }

      const gmOwnedRoom = chooseOwnedRoom({
        game,
        memberIds: game.gmMemberIds,
        ownerPriority: () => 0,
      })
      if (gmOwnedRoom) {
        assignRoom({
          game,
          room: gmOwnedRoom,
          reason: 'GM-owned room preference',
        })
      }
    })

    gamesForSlot.forEach((game) => {
      if (assignedGameIds.has(game.game.id)) {
        return
      }

      const memberOwnedRoom = chooseOwnedRoom({
        game,
        memberIds: game.playerMemberIds,
        ownerPriority: (roomId) => ((roomMemberCountByRoomId.get(roomId) ?? 0) <= 1 ? 0 : 1),
      })
      if (memberOwnedRoom && !(memberOwnedRoom.size === game.participantCount && hasLargerOpenSharedRoom(game))) {
        assignRoom({
          game,
          room: memberOwnedRoom,
          reason: 'Player-owned room preference',
        })
      }
    })

    gamesForSlot.forEach((game) => {
      if (assignedGameIds.has(game.game.id)) {
        return
      }

      const sharedRoom = choosePreferredRoom({
        game,
        roomFilter: (room) => !memberRoomIds.has(room.id),
        preferNonBallroom: true,
      })
      if (sharedRoom) {
        assignRoom({
          game,
          room: sharedRoom,
          reason: isBallroomRoom(sharedRoom) ? 'Shared room fallback (ballroom)' : 'Shared room priority',
        })
      }
    })

    gamesForSlot.forEach((game) => {
      if (assignedGameIds.has(game.game.id)) {
        return
      }

      const memberRoom = choosePreferredRoom({
        game,
        roomFilter: (room) => memberRoomIds.has(room.id),
        preferNonBallroom: false,
        sortCandidates: (left, right) =>
          sortMemberFallbackRooms({
            game,
            left,
            right,
          }),
      })
      if (memberRoom) {
        assignRoom({
          game,
          room: memberRoom,
          reason: 'Member room fallback',
        })
        return
      }

      skippedGames.push({
        gameId: game.game.id,
        gameName: game.game.name,
        slotId,
        participantCount: game.participantCount,
        reason: buildSkipReason({
          candidateRooms: getCandidateRooms(game),
          eligibleRooms: getEligibleRooms(game),
          game,
        }),
      })
    })

    const usedRoomIdsForSlot = new Set([
      ...(existingFixedAssignmentsBySlotId.get(slotId) ?? []).map((assignment) => assignment.roomId),
      ...assignments.filter((assignment) => assignment.slotId === slotId).map((assignment) => assignment.roomId),
    ])

    const unusedNonMemberRooms = input.rooms
      .filter((room) => room.enabled && !memberRoomIds.has(room.id))
      .filter(
        (room) =>
          (roomAvailabilityByKey.get(
            buildAvailabilityKey({
              roomId: room.id,
              slotId,
              year: input.year,
            }),
          ) ??
            true) &&
          !usedRoomIdsForSlot.has(room.id),
      )
      .sort((left, right) => right.size - left.size || left.description.localeCompare(right.description))

    if (unusedNonMemberRooms.length > 0) {
      unmetConstraints.push({
        id: `unused-non-member-rooms:${slotId}`,
        slotId,
        type: 'unused_non_member_room',
        detail: `Unused non-member rooms in Slot ${slotId}: ${unusedNonMemberRooms.map((room) => room.description).join(', ')}.`,
      })
    }

    ;[
      ...(existingFixedAssignmentsBySlotId.get(slotId) ?? []),
      ...assignments.filter((assignment) => assignment.slotId === slotId),
    ].forEach((assignment) => {
      usageCountByRoomId.set(assignment.roomId, (usageCountByRoomId.get(assignment.roomId) ?? 0) + 1)
    })
  })

  return {
    assignments,
    skippedGames: skippedGames.sort(
      (left, right) =>
        left.slotId - right.slotId ||
        right.participantCount - left.participantCount ||
        left.gameName.localeCompare(right.gameName),
    ),
    unmetConstraints: unmetConstraints.sort(
      (left, right) => left.slotId - right.slotId || left.detail.localeCompare(right.detail),
    ),
  }
}
