import { describe, expect, test } from 'vitest'

import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import {
  buildSlotGameRoomPool,
  buildSlotGameSkipReason,
  hasLargerOpenSharedRoomForGame,
  isBallroomRoom,
  type SlotGameRoomPoolContext,
} from './initialPlanner.roomPools'
import { buildAvailabilityKey, type PlannedGameContext } from './initialPlanner.seed'

const year = 2026
const slotId = 1

const buildRoom = (
  overrides: Partial<InitialPlannerRoom> & Pick<InitialPlannerRoom, 'id' | 'description'>,
): InitialPlannerRoom => ({
  id: overrides.id,
  description: overrides.description,
  size: overrides.size ?? 8,
  type: overrides.type ?? 'Guest Room',
  enabled: overrides.enabled ?? true,
  accessibility: overrides.accessibility ?? 'many_stairs',
})

const buildPlannerInput = (rooms: Array<InitialPlannerRoom>): InitialPlannerInput => ({
  year,
  games: [],
  rooms,
  participants: [],
  roomSlotAvailability: [],
  memberRoomAssignments: [],
  existingAssignments: [],
})

const buildGameContext = (overrides: Partial<PlannedGameContext> = {}): PlannedGameContext => ({
  game: {
    id: overrides.game?.id ?? 10,
    name: overrides.game?.name ?? 'Example Game',
    slotId: overrides.game?.slotId ?? slotId,
    year: overrides.game?.year ?? year,
    category: overrides.game?.category ?? 'user',
  },
  participantCount: overrides.participantCount ?? 4,
  requiredAccessibility: overrides.requiredAccessibility ?? 'many_stairs',
  gmMemberIds: overrides.gmMemberIds ?? [1],
  playerMemberIds: overrides.playerMemberIds ?? [2],
})

const buildRoomPoolContext = ({
  input,
  occupiedRoomIds,
  unavailableRoomIds,
  memberRoomIds,
}: {
  input: InitialPlannerInput
  occupiedRoomIds?: Set<number>
  unavailableRoomIds?: Array<number>
  memberRoomIds?: Set<number>
}): SlotGameRoomPoolContext => ({
  input,
  slotId,
  roomAvailabilityByKey: new Map(
    (unavailableRoomIds ?? []).map((roomId) => [buildAvailabilityKey({ roomId, slotId, year }), false]),
  ),
  occupiedRoomIds: occupiedRoomIds ?? new Set<number>(),
  memberRoomIds: memberRoomIds ?? new Set<number>(),
})

describe('initialPlanner.roomPools', () => {
  test('builds candidate rooms from enabled fits and filters eligibility by occupancy and availability', () => {
    const input = buildPlannerInput([
      buildRoom({ id: 1, description: 'Disabled Hall', enabled: false, size: 10 }),
      buildRoom({ id: 2, description: 'Occupied Hall', type: 'Shared Space', size: 10 }),
      buildRoom({ id: 3, description: 'Unavailable Hall', type: 'Shared Space', size: 10 }),
      buildRoom({ id: 4, description: 'Cascade Ballroom', type: 'Ballroom', size: 10 }),
      buildRoom({ id: 5, description: 'Tiny Hall', type: 'Shared Space', size: 2 }),
    ])
    const game = buildGameContext()

    const roomPool = buildSlotGameRoomPool({
      context: buildRoomPoolContext({
        input,
        occupiedRoomIds: new Set([2]),
        unavailableRoomIds: [3],
      }),
      game,
    })

    expect(roomPool.candidateRooms.map((room) => room.id)).toEqual([2, 3, 4])
    expect(roomPool.eligibleRooms.map((room) => room.id)).toEqual([4])
    expect(isBallroomRoom(roomPool.eligibleRooms[0])).toBe(true)
  })

  test('reports when no enabled room can fit the game requirements', () => {
    const input = buildPlannerInput([buildRoom({ id: 1, description: 'Tiny Hall', type: 'Shared Space', size: 2 })])

    expect(
      buildSlotGameSkipReason({
        context: buildRoomPoolContext({ input }),
        game: buildGameContext(),
      }),
    ).toBe('No enabled room can fit 4 participant(s) with many_stairs accessibility.')
  })

  test('reports when fitting rooms become ineligible after occupancy or availability filtering', () => {
    const input = buildPlannerInput([
      buildRoom({ id: 1, description: 'Occupied Hall', type: 'Shared Space', size: 10 }),
      buildRoom({ id: 2, description: 'Unavailable Hall', type: 'Shared Space', size: 10 }),
    ])

    expect(
      buildSlotGameSkipReason({
        context: buildRoomPoolContext({
          input,
          occupiedRoomIds: new Set([1]),
          unavailableRoomIds: [2],
        }),
        game: buildGameContext(),
      }),
    ).toBe('No eligible room remained after higher-priority assignments or slot availability constraints.')
  })

  test('only treats larger eligible non-member rooms as open shared-room fallbacks', () => {
    const game = buildGameContext()
    const largerMemberRoom = buildRoom({ id: 1, description: 'Member Suite', size: 8 })

    expect(
      hasLargerOpenSharedRoomForGame({
        context: buildRoomPoolContext({
          input: buildPlannerInput([
            largerMemberRoom,
            buildRoom({ id: 2, description: 'Shared Hall', type: 'Shared Space', size: 4 }),
          ]),
          memberRoomIds: new Set([largerMemberRoom.id]),
        }),
        game,
      }),
    ).toBe(false)

    expect(
      hasLargerOpenSharedRoomForGame({
        context: buildRoomPoolContext({
          input: buildPlannerInput([
            largerMemberRoom,
            buildRoom({ id: 3, description: 'Large Shared Hall', type: 'Shared Space', size: 7 }),
          ]),
          memberRoomIds: new Set([largerMemberRoom.id]),
        }),
        game,
      }),
    ).toBe(true)
  })
})
