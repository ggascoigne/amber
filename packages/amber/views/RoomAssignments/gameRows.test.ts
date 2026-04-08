import { describe, expect, test } from 'vitest'

import type { DashboardGame, DashboardGameAssignment, DashboardRoom, DashboardRoomAssignment } from './utils'
import {
  buildAssignmentCountsByGameId,
  buildDefaultRoomAssignmentByGameId,
  buildGameMembersByGameId,
  buildGmNamesByGameId,
  buildManualGameRows,
  buildOverrideAssignmentsByGameId,
  buildRequiredAccessibilityByGameId,
  sortGamesForRoomAssignment,
} from './utils'

const createRoomAssignment = ({
  id,
  gameId,
  roomId,
  isOverride,
  assignmentReason,
  room,
}: {
  id: bigint
  gameId: number
  roomId?: number
  isOverride: boolean
  assignmentReason?: string | null
  room?: DashboardRoom
}) =>
  ({
    id,
    gameId,
    roomId: roomId ?? room?.id ?? 0,
    isOverride,
    assignmentReason: assignmentReason ?? null,
    room: room ?? ({ size: 0 } as DashboardRoom),
  }) as DashboardRoomAssignment

const createGame = ({
  id,
  name,
  slotId,
  category,
}: {
  id: number
  name: string
  slotId: number | null
  category?: DashboardGame['category']
}) => ({ id, name, slotId, category: category ?? 'user' }) as DashboardGame

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
  fullName: string | null
  roomAccessibilityPreference?: 'accessible' | 'some_stairs' | 'many_stairs'
}) =>
  ({
    gameId,
    memberId,
    gm,
    membership: {
      user: {
        fullName,
        profile: roomAccessibilityPreference ? [{ roomAccessibilityPreference }] : [],
      },
    },
  }) as DashboardGameAssignment

describe('room assignment game rows', () => {
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

  test('game assignment helpers preserve gm-name behavior while skipping offers from counts and member rows', () => {
    const gameAssignments = [
      createGameAssignment({
        gameId: 10,
        memberId: 201,
        gm: 1,
        fullName: 'Gamma GM',
        roomAccessibilityPreference: 'accessible',
      }),
      createGameAssignment({
        gameId: 10,
        memberId: 202,
        gm: 0,
        fullName: null,
        roomAccessibilityPreference: 'some_stairs',
      }),
      createGameAssignment({
        gameId: 10,
        memberId: 203,
        gm: -1,
        fullName: 'Offer Only',
        roomAccessibilityPreference: 'many_stairs',
      }),
      createGameAssignment({
        gameId: 11,
        memberId: 204,
        gm: 2,
        fullName: '',
      }),
    ]

    expect(buildGmNamesByGameId(gameAssignments)).toEqual(new Map([[10, ['Gamma GM', 'Offer Only']]]))
    expect(buildAssignmentCountsByGameId(gameAssignments)).toEqual(
      new Map([
        [10, 2],
        [11, 1],
      ]),
    )
    expect(buildGameMembersByGameId(gameAssignments)).toEqual(
      new Map([
        [
          10,
          [
            {
              id: '201-10-1',
              memberId: 201,
              memberName: 'Gamma GM',
              roleLabel: 'GM',
              gm: true,
            },
            {
              id: '202-10-0',
              memberId: 202,
              memberName: 'Unknown member',
              roleLabel: 'Player',
              gm: false,
            },
          ],
        ],
        [
          11,
          [
            {
              id: '204-11-2',
              memberId: 204,
              memberName: '',
              roleLabel: 'GM',
              gm: true,
            },
          ],
        ],
      ]),
    )
    expect(buildRequiredAccessibilityByGameId(gameAssignments)).toEqual(new Map([[10, ['accessible', 'some_stairs']]]))
  })

  test('override room assignments are grouped by game id and manual rows summarize active user games', () => {
    const cascadeBallroom = createRoom({
      id: 1,
      description: 'Cascade Ballroom',
      size: 16,
      accessibility: 'accessible',
    })
    const summitGuestSuite = createRoom({
      id: 2,
      description: 'Summit Guest Suite',
      size: 8,
      accessibility: 'many_stairs',
    })
    const studioA = createRoom({
      id: 3,
      description: 'Studio A',
      size: 6,
      accessibility: 'accessible',
    })

    const overrideAssignmentsByGameId = buildOverrideAssignmentsByGameId({
      roomAssignments: [
        createRoomAssignment({ id: 2n, gameId: 10, roomId: 2, isOverride: true }),
        createRoomAssignment({ id: 3n, gameId: 10, roomId: 1, isOverride: false }),
        createRoomAssignment({ id: 4n, gameId: 10, roomId: 3, isOverride: true }),
      ],
      rooms: [cascadeBallroom, summitGuestSuite, studioA],
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

    const manualGameRows = buildManualGameRows({
      games: [
        createGame({ id: 10, name: 'Zeta Quest', slotId: 2 }),
        createGame({ id: 11, name: 'No Players Yet', slotId: 2 }),
        createGame({ id: 12, name: 'No Game Helper', slotId: 2, category: 'no_game' }),
        createGame({ id: 13, name: 'Unslotted Mystery', slotId: null }),
      ],
      defaultAssignmentByGameId: new Map([
        [
          10,
          createRoomAssignment({
            id: 1n,
            gameId: 10,
            room: cascadeBallroom,
            isOverride: false,
            assignmentReason: 'manual',
          }),
        ],
      ]),
      gmNamesByGameId: new Map([[10, ['Zulu GM', 'Alpha GM']]]),
      assignmentCountsByGameId: new Map([
        [10, 3],
        [11, 0],
        [12, 4],
        [13, 2],
      ]),
      gameMembersByGameId: new Map([
        [
          10,
          [
            {
              id: '2-10-0',
              memberId: 2,
              memberName: 'Player Zed',
              roleLabel: 'Player',
              gm: false,
            },
            {
              id: '1-10-1',
              memberId: 1,
              memberName: 'Game Master',
              roleLabel: 'GM',
              gm: true,
            },
            {
              id: '3-10-0',
              memberId: 3,
              memberName: 'Alpha Player',
              roleLabel: 'Player',
              gm: false,
            },
          ],
        ],
      ]),
      overrideAssignmentsByGameId,
    })

    expect(manualGameRows).toEqual([
      {
        id: 10,
        gameId: 10,
        slotId: 2,
        gameName: 'Zeta Quest',
        gmNames: ['Alpha GM', 'Zulu GM'],
        assignedCount: 3,
        currentRoomSize: 30,
        roomSpace: 27,
        currentRoomId: 1,
        currentRoomAssignmentReason: 'manual',
        overrideAssignments: [
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
        ],
        members: [
          {
            id: '1-10-1',
            memberId: 1,
            memberName: 'Game Master',
            roleLabel: 'GM',
            gm: true,
          },
          {
            id: '3-10-0',
            memberId: 3,
            memberName: 'Alpha Player',
            roleLabel: 'Player',
            gm: false,
          },
          {
            id: '2-10-0',
            memberId: 2,
            memberName: 'Player Zed',
            roleLabel: 'Player',
            gm: false,
          },
        ],
      },
    ])
  })
})
