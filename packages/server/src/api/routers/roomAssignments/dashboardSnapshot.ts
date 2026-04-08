import type { TransactionClient } from '../../inRlsTransaction'

const roomSelect = {
  id: true,
  description: true,
  size: true,
  type: true,
  enabled: true,
  updated: true,
  accessibility: true,
}

const roomAssignmentSelect = {
  id: true,
  gameId: true,
  roomId: true,
  slotId: true,
  year: true,
  isOverride: true,
  source: true,
  assignmentReason: true,
  assignedByUserId: true,
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
      playerMin: true,
      playerMax: true,
      year: true,
      category: true,
    },
  },
  room: {
    select: roomSelect,
  },
}

const dashboardGameSelect = {
  id: true,
  name: true,
  slotId: true,
  roomId: true,
  year: true,
  playerMin: true,
  playerMax: true,
  category: true,
}

const dashboardMembershipSelect = {
  id: true,
  userId: true,
  year: true,
  attending: true,
  user: {
    select: {
      fullName: true,
    },
  },
}

const dashboardGameAssignmentSelect = {
  memberId: true,
  gameId: true,
  gm: true,
  year: true,
  game: {
    select: {
      id: true,
      slotId: true,
      year: true,
    },
  },
  membership: {
    select: {
      id: true,
      userId: true,
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

export const getRoomAssignmentDashboardSnapshot = async ({ tx, year }: { tx: TransactionClient; year: number }) => {
  const [games, rooms, roomAssignments, roomSlotAvailability, memberRoomAssignments, memberships, gameAssignments] =
    await Promise.all([
      tx.game.findMany({
        where: {
          year,
        },
        select: dashboardGameSelect,
        orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
      }),
      tx.room.findMany({
        select: roomSelect,
        orderBy: [{ description: 'asc' }],
      }),
      tx.gameRoomAssignment.findMany({
        where: {
          year,
        },
        select: roomAssignmentSelect,
        orderBy: [{ slotId: 'asc' }, { id: 'asc' }],
      }),
      tx.roomSlotAvailability.findMany({
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
      }),
      tx.memberRoomAssignment.findMany({
        where: {
          year,
        },
        select: {
          memberId: true,
          roomId: true,
          year: true,
          membership: {
            select: {
              id: true,
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          room: {
            select: roomSelect,
          },
        },
        orderBy: [{ roomId: 'asc' }, { memberId: 'asc' }],
      }),
      tx.membership.findMany({
        where: {
          year,
        },
        select: dashboardMembershipSelect,
        orderBy: [
          {
            user: {
              fullName: 'asc',
            },
          },
        ],
      }),
      tx.gameAssignment.findMany({
        where: {
          year,
          gm: {
            gte: 0,
          },
        },
        select: dashboardGameAssignmentSelect,
      }),
    ])

  return {
    games,
    rooms,
    roomAssignments,
    roomSlotAvailability,
    memberRoomAssignments,
    memberships,
    gameAssignments,
  }
}
