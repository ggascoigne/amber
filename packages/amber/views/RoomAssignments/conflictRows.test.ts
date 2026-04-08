import { describe, expect, test } from 'vitest'

import type {
  DashboardGame,
  DashboardGameAssignment,
  DashboardMemberRoomAssignment,
  DashboardRoom,
  DashboardRoomAssignment,
} from './utils'
import {
  buildAssignedMemberNamesByRoomId,
  buildAssignmentCountsByGameId,
  buildGmNamesByGameId,
  buildMemberRoomIdByMemberId,
  buildRequiredAccessibilityByGameId,
  buildRoomAssignmentConflictRows,
  buildRoomSlotAvailabilityMap,
} from './utils'

const createRoom = ({
  id,
  description,
  size,
  accessibility,
}: {
  id: number
  description: string
  size: number
  accessibility: DashboardRoom['accessibility']
}) => ({ id, description, size, accessibility, enabled: true, type: 'Guest Room' }) as DashboardRoom

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({ memberId, roomId }) as DashboardMemberRoomAssignment

const createGameAssignment = ({
  gameId,
  memberId,
  gm,
  fullName,
  roomAccessibilityPreference,
}: {
  gameId: number
  memberId: number
  gm: number
  fullName: string
  roomAccessibilityPreference: 'accessible' | 'some_stairs' | 'many_stairs'
}) =>
  ({
    game: {
      id: gameId,
      slotId: 1,
      year: 2025,
    },
    gameId,
    memberId,
    gm,
    year: 2025,
    membership: {
      id: memberId,
      userId: memberId,
      user: {
        fullName,
        profile: [{ roomAccessibilityPreference }],
      },
    },
  }) as DashboardGameAssignment

describe('buildRoomAssignmentConflictRows', () => {
  test('reports missing-room, unavailable-room, capacity, accessibility, and room-conflict issues in sorted order', () => {
    const games = [
      { id: 10, name: 'Alpha', slotId: 1, category: 'user' },
      { id: 11, name: 'Bravo', slotId: 1, category: 'user' },
      { id: 12, name: 'Charlie', slotId: 1, category: 'user' },
    ] as Array<DashboardGame>
    const rooms = [
      createRoom({ id: 1, description: 'Cascade Ballroom', size: 1, accessibility: 'many_stairs' }),
      createRoom({ id: 2, description: 'Summit Guest Suite', size: 4, accessibility: 'accessible' }),
    ]
    const roomAssignments = [
      { id: 1n, gameId: 10, roomId: 1, slotId: 1, year: 2025, isOverride: false } as DashboardRoomAssignment,
      { id: 2n, gameId: 11, roomId: 1, slotId: 1, year: 2025, isOverride: true } as DashboardRoomAssignment,
    ]
    const gameAssignments = [
      createGameAssignment({
        gameId: 10,
        memberId: 1,
        gm: 1,
        fullName: 'Alex Admin',
        roomAccessibilityPreference: 'accessible',
      }),
      createGameAssignment({
        gameId: 10,
        memberId: 2,
        gm: 0,
        fullName: 'Bailey Builder',
        roomAccessibilityPreference: 'many_stairs',
      }),
      createGameAssignment({
        gameId: 10,
        memberId: 4,
        gm: 0,
        fullName: 'Dana Daring',
        roomAccessibilityPreference: 'many_stairs',
      }),
      createGameAssignment({
        gameId: 11,
        memberId: 3,
        gm: 1,
        fullName: 'Casey Coordinator',
        roomAccessibilityPreference: 'many_stairs',
      }),
      createGameAssignment({
        gameId: 12,
        memberId: 5,
        gm: 1,
        fullName: 'Emery Explorer',
        roomAccessibilityPreference: 'accessible',
      }),
    ]
    const requiredAccessibilityByGameId = buildRequiredAccessibilityByGameId(gameAssignments)
    const assignmentCountsByGameId = buildAssignmentCountsByGameId(gameAssignments)
    const gmNamesByGameId = buildGmNamesByGameId(gameAssignments)
    const memberRoomIdByMemberId = buildMemberRoomIdByMemberId([
      createMemberRoomAssignment({ memberId: 1, roomId: 1 }),
      createMemberRoomAssignment({ memberId: 2, roomId: 1 }),
      createMemberRoomAssignment({ memberId: 3, roomId: 2 }),
    ])
    const assignedMemberNamesByRoomId = buildAssignedMemberNamesByRoomId(
      [
        { id: 1, user: { fullName: 'Alex Admin' } },
        { id: 2, user: { fullName: 'Bailey Builder' } },
        { id: 3, user: { fullName: 'Casey Coordinator' } },
      ] as never,
      memberRoomIdByMemberId,
    )
    const availabilityByKey = buildRoomSlotAvailabilityMap([
      {
        roomId: 1,
        slotId: 1,
        year: 2025,
        isAvailable: false,
      },
    ])

    const conflicts = buildRoomAssignmentConflictRows({
      games,
      rooms,
      roomAssignments,
      assignmentCountsByGameId,
      gmNamesByGameId,
      requiredAccessibilityByGameId,
      assignedMemberNamesByRoomId,
      availabilityByKey,
      year: 2025,
    })

    expect(conflicts.map((conflict) => conflict.issueType)).toEqual([
      'Accessibility mismatch',
      'Capacity too small',
      'Unavailable room',
      'Unavailable room',
      'Missing room assignment',
      'Room conflict',
    ])
    expect(conflicts[0]).toMatchObject({
      gameId: 10,
      gameName: 'Alpha',
      roomDescription: 'Cascade Ballroom',
      gmNames: ['Alex Admin'],
      assignedMemberNames: ['Alex Admin', 'Bailey Builder'],
    })
    expect(conflicts[3]).toMatchObject({
      gameId: 11,
      roomDescription: 'Cascade Ballroom',
      issueType: 'Unavailable room',
    })
    expect(conflicts[4]).toMatchObject({
      gameId: 12,
      roomDescription: 'Unassigned',
      issueType: 'Missing room assignment',
    })
    expect(conflicts[5]).toMatchObject({
      gameId: null,
      gameName: 'Alpha, Bravo',
      severity: 'warning',
    })
  })

  test('ignores conflicts for duplicate assignments to the N/A room', () => {
    const conflicts = buildRoomAssignmentConflictRows({
      games: [{ id: 10, name: 'Alpha', slotId: 1, category: 'user' }] as Array<DashboardGame>,
      rooms: [createRoom({ id: 1, description: 'N/A', size: 8, accessibility: 'accessible' })],
      roomAssignments: [
        { id: 1n, gameId: 10, roomId: 1, slotId: 1, year: 2025, isOverride: false } as DashboardRoomAssignment,
        { id: 2n, gameId: 11, roomId: 1, slotId: 1, year: 2025, isOverride: true } as DashboardRoomAssignment,
      ],
      assignmentCountsByGameId: new Map([[10, 1]]),
      gmNamesByGameId: new Map(),
      requiredAccessibilityByGameId: new Map(),
      assignedMemberNamesByRoomId: new Map(),
      availabilityByKey: new Map(),
      year: 2025,
    })

    expect(conflicts).toEqual([])
  })
})
