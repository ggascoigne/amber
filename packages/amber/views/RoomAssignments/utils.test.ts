import { describe, expect, test } from 'vitest'

import type {
  DashboardGame,
  DashboardGameAssignment,
  DashboardMemberRoomAssignment,
  DashboardRoom,
  DashboardRoomAssignment,
  DashboardRoomSlotAvailability,
} from './utils'
import {
  buildAssignedMemberNamesByRoomId,
  buildAssignmentCountsByGameId,
  buildDefaultRoomAssignmentByGameId,
  buildEnabledManualRoomOptions,
  buildGmNamesByGameId,
  buildMemberRoomIdByMemberId,
  buildOverrideAssignmentsByGameId,
  buildRequiredAccessibilityByGameId,
  buildRoomAssignmentConflictRows,
  buildRoomMemberCounts,
  buildRoomSlotAvailabilityMap,
  buildSlotIds,
  isRoomAvailableInSlot,
  sortGamesForRoomAssignment,
} from './utils'

const createRoomAssignment = ({ id, gameId, isOverride }: { id: bigint; gameId: number; isOverride: boolean }) =>
  ({ id, gameId, isOverride }) as DashboardRoomAssignment

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
}) => ({ roomId, slotId, year, isAvailable }) as DashboardRoomSlotAvailability

const createMemberRoomAssignment = ({ memberId, roomId }: { memberId: number; roomId: number }) =>
  ({ memberId, roomId }) as DashboardMemberRoomAssignment

const createGame = ({ id, name, slotId }: { id: number; name: string; slotId: number | null }) =>
  ({ id, name, slotId }) as DashboardGame

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

describe('room assignment utils', () => {
  test('buildSlotIds creates 1-indexed slot list', () => {
    expect(buildSlotIds(5)).toEqual([1, 2, 3, 4, 5])
  })

  test('room slot availability defaults missing entries to available', () => {
    const availabilityByKey = buildRoomSlotAvailabilityMap([
      createAvailability({
        roomId: 2,
        slotId: 3,
        year: 2026,
        isAvailable: false,
      }),
    ])

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 3,
        year: 2026,
      }),
    ).toBe(false)

    expect(
      isRoomAvailableInSlot({
        availabilityByKey,
        roomId: 2,
        slotId: 4,
        year: 2026,
      }),
    ).toBe(true)
  })

  test('member room mappings and sharing counts are derived by member and room ids', () => {
    const rows = [
      createMemberRoomAssignment({ memberId: 11, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 12, roomId: 2 }),
      createMemberRoomAssignment({ memberId: 13, roomId: 3 }),
    ]

    const memberRoomIdByMemberId = buildMemberRoomIdByMemberId(rows)
    const roomMemberCounts = buildRoomMemberCounts(rows)

    expect(memberRoomIdByMemberId.get(11)).toBe(2)
    expect(memberRoomIdByMemberId.get(13)).toBe(3)
    expect(roomMemberCounts.get(2)).toBe(2)
    expect(roomMemberCounts.get(3)).toBe(1)
  })

  test('default room assignments exclude overrides and keep first non-override assignment', () => {
    const assignmentByGameId = buildDefaultRoomAssignmentByGameId([
      createRoomAssignment({ id: 5n, gameId: 10, isOverride: false }),
      createRoomAssignment({ id: 7n, gameId: 10, isOverride: true }),
      createRoomAssignment({ id: 3n, gameId: 10, isOverride: false }),
      createRoomAssignment({ id: 9n, gameId: 12, isOverride: true }),
      createRoomAssignment({ id: 8n, gameId: 12, isOverride: false }),
    ])

    expect(assignmentByGameId.get(10)?.id).toBe(3n)
    expect(assignmentByGameId.get(12)?.id).toBe(8n)
  })

  test('games are sorted by slot then name with null slots last', () => {
    const sortedGames = sortGamesForRoomAssignment([
      createGame({ id: 2, name: 'Bravo', slotId: 3 }),
      createGame({ id: 1, name: 'Alpha', slotId: 3 }),
      createGame({ id: 4, name: 'Delta', slotId: null }),
      createGame({ id: 3, name: 'Charlie', slotId: 1 }),
    ])

    expect(sortedGames.map((game) => game.id)).toEqual([3, 1, 2, 4])
  })

  test('override room assignments are grouped by game id', () => {
    const overrideAssignmentsByGameId = buildOverrideAssignmentsByGameId({
      roomAssignments: [
        { id: 2n, gameId: 10, roomId: 2, isOverride: true } as DashboardRoomAssignment,
        { id: 3n, gameId: 10, roomId: 1, isOverride: false } as DashboardRoomAssignment,
        { id: 4n, gameId: 10, roomId: 3, isOverride: true } as DashboardRoomAssignment,
      ],
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 16, accessibility: 'accessible' }),
        createRoom({ id: 2, description: 'Summit Guest Suite', size: 8, accessibility: 'many_stairs' }),
        createRoom({ id: 3, description: 'Studio A', size: 6, accessibility: 'accessible' }),
      ],
      assignedMemberNamesByRoomId: new Map([
        [2, ['Alex Admin']],
        [3, ['Bailey Builder']],
      ]),
    })

    expect(overrideAssignmentsByGameId.get(10)).toEqual([
      {
        id: 4n,
        roomId: 3,
        roomDescription: 'Studio A',
        roomSize: 6,
        assignedMemberNames: ['Bailey Builder'],
      },
      {
        id: 2n,
        roomId: 2,
        roomDescription: 'Summit Guest Suite',
        roomSize: 8,
        assignedMemberNames: ['Alex Admin'],
      },
    ])
  })

  test('manual room options include slot availability and sort unavailable rooms after available rooms', () => {
    const options = buildEnabledManualRoomOptions({
      roomOptions: [
        {
          id: 1,
          description: 'Cascade Ballroom',
          size: 16,
          assignedMemberNames: [],
        },
        {
          id: 2,
          description: 'Summit Guest Suite',
          size: 10,
          assignedMemberNames: [],
        },
      ],
      rooms: [
        createRoom({ id: 1, description: 'Cascade Ballroom', size: 16, accessibility: 'accessible' }),
        createRoom({ id: 2, description: 'Summit Guest Suite', size: 10, accessibility: 'accessible' }),
      ],
      roomAssignments: [],
      availabilityByKey: buildRoomSlotAvailabilityMap([
        createAvailability({
          roomId: 1,
          slotId: 1,
          year: 2025,
          isAvailable: false,
        }),
      ]),
      slotId: 1,
      year: 2025,
    })

    expect(options.map((option) => [option.description, option.slotIsAvailable])).toEqual([
      ['Summit Guest Suite', true],
      ['Cascade Ballroom', false],
    ])
  })

  test('conflict summary reports missing rooms, capacity, accessibility, availability, and room conflicts', () => {
    const games = [
      { id: 10, name: 'Alpha', slotId: 1, category: 'user' },
      { id: 11, name: 'Bravo', slotId: 1, category: 'user' },
      { id: 12, name: 'Charlie', slotId: 1, category: 'user' },
      { id: 13, name: 'Delta', slotId: 1, category: 'user' },
    ] as Array<DashboardGame>
    const rooms = [
      createRoom({ id: 1, description: 'Cascade Ballroom', size: 1, accessibility: 'many_stairs' }),
      createRoom({ id: 2, description: 'Summit Guest Suite', size: 4, accessibility: 'accessible' }),
    ]
    const roomAssignments = [
      { id: 1n, gameId: 10, roomId: 1, slotId: 1, year: 2025, isOverride: false } as DashboardRoomAssignment,
      { id: 2n, gameId: 11, roomId: 1, slotId: 1, year: 2025, isOverride: true } as DashboardRoomAssignment,
      { id: 3n, gameId: 12, roomId: 2, slotId: 1, year: 2025, isOverride: false } as DashboardRoomAssignment,
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
      createAvailability({
        roomId: 2,
        slotId: 1,
        year: 2025,
        isAvailable: false,
      }),
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
      'Room conflict',
    ])
  })
})
