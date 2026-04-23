import type { TransactionClient } from '../../inRlsTransaction'

const plannerGameSelect = {
  id: true,
  name: true,
  slotId: true,
  year: true,
  category: true,
}

const plannerRoomSelect = {
  id: true,
  description: true,
  size: true,
  type: true,
  enabled: true,
  accessibility: true,
}

const plannerAssignmentSelect = {
  gameId: true,
  roomId: true,
  slotId: true,
  year: true,
  isOverride: true,
  source: true,
}

const plannerParticipantSelect = {
  memberId: true,
  gameId: true,
  gm: true,
  membership: {
    select: {
      user: {
        select: {
          fullName: true,
          profile: {
            select: {
              roomAccessibilityPreference: true,
            },
          },
        },
      },
    },
  },
}

export const getRoomAssignmentPlannerSnapshot = async ({ tx, year }: { tx: TransactionClient; year: number }) => {
  const games = await tx.game.findMany({
    where: {
      year,
    },
    select: plannerGameSelect,
    orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
  })
  const rooms = await tx.room.findMany({
    select: plannerRoomSelect,
    orderBy: [{ description: 'asc' }],
  })
  const roomAssignments = await tx.gameRoomAssignment.findMany({
    where: {
      year,
    },
    select: plannerAssignmentSelect,
    orderBy: [{ slotId: 'asc' }, { gameId: 'asc' }],
  })
  const roomSlotAvailability = await tx.roomSlotAvailability.findMany({
    where: {
      year,
    },
    select: {
      roomId: true,
      slotId: true,
      year: true,
      isAvailable: true,
    },
    orderBy: [{ slotId: 'asc' }, { roomId: 'asc' }],
  })
  const memberRoomAssignments = await tx.memberRoomAssignment.findMany({
    where: {
      year,
    },
    select: {
      memberId: true,
      roomId: true,
      membership: {
        select: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: [{ roomId: 'asc' }, { memberId: 'asc' }],
  })
  const gameAssignments = await tx.gameAssignment.findMany({
    where: {
      year,
      gm: {
        gte: 0,
      },
    },
    select: plannerParticipantSelect,
  })

  return {
    games,
    rooms,
    roomAssignments,
    roomSlotAvailability,
    memberRoomAssignments,
    gameAssignments,
  }
}
