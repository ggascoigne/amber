import type { RoomAssignmentDashboardData } from '@amber/client'
import { describe, expect, test } from 'vitest'

import type {
  DashboardGame,
  DashboardGameAssignment,
  DashboardMembership,
  DashboardMemberRoomAssignment,
  DashboardRoom,
  DashboardRoomAssignment,
  DashboardRoomSlotAvailability,
} from './dashboardShared'
import { buildRoomAssignmentsDashboardViewModel } from './dashboardViewModel'

const createRoom = ({
  id,
  description,
  size,
  enabled = true,
}: {
  id: number
  description: string
  size: number
  enabled?: boolean
}) =>
  ({
    id,
    description,
    size,
    enabled,
    accessibility: 'accessible',
    type: 'Guest Room',
  }) as DashboardRoom

const createGame = ({ id, name, slotId }: { id: number; name: string; slotId: number | null }) =>
  ({
    id,
    name,
    slotId,
    category: 'user',
  }) as DashboardGame

const createRoomAssignment = ({
  id,
  gameId,
  room,
  slotId,
  year,
  isOverride = false,
}: {
  id: bigint
  gameId: number
  room: DashboardRoom
  slotId: number
  year: number
  isOverride?: boolean
}) =>
  ({
    id,
    gameId,
    roomId: room.id,
    room,
    slotId,
    year,
    isOverride,
    assignmentReason: null,
  }) as DashboardRoomAssignment

const createAvailability = ({
  roomId,
  slotId,
  year,
  isAvailable,
}: {
  roomId: number
  slotId: number
  year: number
  isAvailable: boolean
}) =>
  ({
    roomId,
    slotId,
    year,
    isAvailable,
  }) as DashboardRoomSlotAvailability

const createMembership = ({
  id,
  fullName,
  attending = true,
}: {
  id: number
  fullName: string | null
  attending?: boolean
}) =>
  ({
    id,
    attending,
    user: {
      fullName,
    },
  }) as DashboardMembership

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({
    memberId,
    roomId,
  }) as DashboardMemberRoomAssignment

const createGameAssignment = ({
  gameId,
  memberId,
  gm,
  fullName,
  slotId,
  year,
}: {
  gameId: number
  memberId: number
  gm: number
  fullName: string | null
  slotId: number | null
  year: number
}) =>
  ({
    gameId,
    memberId,
    gm,
    year,
    game: {
      id: gameId,
      slotId,
      year,
    },
    membership: {
      id: memberId,
      userId: memberId,
      user: {
        fullName,
        profile: [],
      },
    },
  }) as DashboardGameAssignment

const createDashboardData = (): RoomAssignmentDashboardData => {
  const summitSuite = createRoom({
    id: 1,
    description: 'Summit Suite',
    size: 6,
  })
  const cascadeBallroom = createRoom({
    id: 2,
    description: 'Cascade Ballroom',
    size: 12,
  })

  return {
    rooms: [summitSuite, cascadeBallroom],
    games: [
      createGame({ id: 1, name: 'Alpha Quest', slotId: 1 }),
      createGame({ id: 2, name: 'Beta Brigade', slotId: 2 }),
    ],
    roomAssignments: [
      createRoomAssignment({
        id: 11n,
        gameId: 1,
        room: summitSuite,
        slotId: 1,
        year: 2026,
      }),
      createRoomAssignment({
        id: 12n,
        gameId: 1,
        room: cascadeBallroom,
        slotId: 1,
        year: 2026,
        isOverride: true,
      }),
    ],
    roomSlotAvailability: [
      createAvailability({
        roomId: 2,
        slotId: 1,
        year: 2026,
        isAvailable: false,
      }),
    ],
    memberRoomAssignments: [createMemberRoomAssignment({ memberId: 1, roomId: 1 })],
    memberships: [
      createMembership({ id: 1, fullName: 'Zed GM' }),
      createMembership({ id: 2, fullName: 'Alex Player' }),
      createMembership({ id: 3, fullName: null }),
      createMembership({ id: 4, fullName: 'Dana Declined', attending: false }),
    ],
    gameAssignments: [
      createGameAssignment({
        gameId: 1,
        memberId: 1,
        gm: 1,
        fullName: 'Zed GM',
        slotId: 1,
        year: 2026,
      }),
      createGameAssignment({
        gameId: 1,
        memberId: 2,
        gm: 0,
        fullName: 'Alex Player',
        slotId: 1,
        year: 2026,
      }),
      createGameAssignment({
        gameId: 2,
        memberId: 2,
        gm: 0,
        fullName: 'Alex Player',
        slotId: 2,
        year: 2026,
      }),
    ],
  } as RoomAssignmentDashboardData
}

describe('room assignments dashboard view model', () => {
  test('composes filtered manual rows, slot-scoped room options, and sorted member options', () => {
    const viewModel = buildRoomAssignmentsDashboardViewModel({
      data: createDashboardData(),
      numberOfSlots: 3,
      assignmentSlotFilterId: 1,
      showMemberRooms: false,
      conflictShowAllSlots: false,
      year: 2026,
    })

    expect(viewModel.slotIds).toEqual([1, 2, 3])
    expect(viewModel.defaultAssignmentByGameId.get(1)?.roomId).toBe(1)
    expect(viewModel.filteredManualGameRows.map((row) => row.gameId)).toEqual([1])
    expect(viewModel.memberOptions).toEqual([
      { id: 2, fullName: 'Alex Player' },
      { id: 1, fullName: 'Zed GM' },
    ])
    expect(viewModel.enabledManualRoomOptions.map((roomOption) => roomOption.id)).toEqual([1, 2])
    expect(viewModel.enabledManualRoomOptions.map((roomOption) => roomOption.slotIsAvailable)).toEqual([true, false])
  })

  test('applies member-room and conflict filters from the current page state', () => {
    const dashboardData = createDashboardData()

    const slotOneViewModel = buildRoomAssignmentsDashboardViewModel({
      data: dashboardData,
      numberOfSlots: 3,
      assignmentSlotFilterId: 1,
      showMemberRooms: true,
      conflictShowAllSlots: false,
      year: 2026,
    })
    const slotTwoViewModel = buildRoomAssignmentsDashboardViewModel({
      data: dashboardData,
      numberOfSlots: 3,
      assignmentSlotFilterId: 2,
      showMemberRooms: true,
      conflictShowAllSlots: false,
      year: 2026,
    })
    const allSlotsConflictViewModel = buildRoomAssignmentsDashboardViewModel({
      data: dashboardData,
      numberOfSlots: 3,
      assignmentSlotFilterId: 1,
      showMemberRooms: true,
      conflictShowAllSlots: true,
      year: 2026,
    })

    expect(slotOneViewModel.filteredRoomUsageSummaryRows.map((row) => row.roomId)).toEqual([1])
    expect(slotOneViewModel.filteredRoomAssignmentConflictRows.map((row) => row.id)).toEqual(['room-unavailable:12'])
    expect(slotTwoViewModel.filteredRoomAssignmentConflictRows.map((row) => row.id)).toEqual(['missing-room:2'])
    expect(allSlotsConflictViewModel.filteredRoomAssignmentConflictRows.map((row) => row.id)).toEqual([
      'room-unavailable:12',
      'missing-room:2',
    ])
  })
})
