import { describe, expect, test } from 'vitest'

import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import {
  choosePreferredRoomForSlotGame,
  type PreferredRoomSelectionContext,
} from './initialPlanner.preferredRoomSelection'
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

const buildPreferredSelectionContext = ({
  input,
  usageCountByRoomId,
  occupiedRoomIds,
  unavailableRoomIds,
}: {
  input: InitialPlannerInput
  usageCountByRoomId?: Map<number, number>
  occupiedRoomIds?: Set<number>
  unavailableRoomIds?: Array<number>
}): PreferredRoomSelectionContext => ({
  input,
  slotId,
  roomAvailabilityByKey: new Map(
    (unavailableRoomIds ?? []).map((roomId) => [buildAvailabilityKey({ roomId, slotId, year }), false]),
  ),
  occupiedRoomIds: occupiedRoomIds ?? new Set<number>(),
  memberRoomIds: new Set<number>(),
  usageCountByRoomId: usageCountByRoomId ?? new Map<number, number>(),
})

describe('choosePreferredRoomForSlotGame', () => {
  test('avoids ballroom rooms when a non-ballroom candidate also fits', () => {
    const ballroom = buildRoom({ id: 1, description: 'Cascade Ballroom', type: 'Ballroom', size: 20 })
    const boardroom = buildRoom({ id: 2, description: 'Boardroom I', type: 'Shared Space', size: 12 })

    const selectedRoom = choosePreferredRoomForSlotGame({
      context: buildPreferredSelectionContext({
        input: buildPlannerInput([ballroom, boardroom]),
      }),
      game: buildGameContext(),
      roomFilter: () => true,
      preferNonBallroom: true,
    })

    expect(selectedRoom?.id).toBe(boardroom.id)
  })

  test('uses size, usage, and description tie-breakers when default sorting candidates', () => {
    const largerRoom = buildRoom({ id: 1, description: 'Larger Hall', type: 'Shared Space', size: 10 })
    const lowerUsageRoom = buildRoom({ id: 2, description: 'Alpha Hall', type: 'Shared Space', size: 8 })
    const higherUsageRoom = buildRoom({ id: 3, description: 'Bravo Hall', type: 'Shared Space', size: 8 })

    const context = buildPreferredSelectionContext({
      input: buildPlannerInput([higherUsageRoom, lowerUsageRoom, largerRoom]),
      usageCountByRoomId: new Map([
        [largerRoom.id, 0],
        [lowerUsageRoom.id, 1],
        [higherUsageRoom.id, 3],
      ]),
    })

    expect(
      choosePreferredRoomForSlotGame({
        context,
        game: buildGameContext(),
        roomFilter: (room) => room.id !== largerRoom.id,
        preferNonBallroom: false,
      })?.id,
    ).toBe(lowerUsageRoom.id)

    expect(
      choosePreferredRoomForSlotGame({
        context,
        game: buildGameContext(),
        roomFilter: () => true,
        preferNonBallroom: false,
      })?.id,
    ).toBe(largerRoom.id)
  })

  test('allows callers to override candidate ranking with a custom sorter', () => {
    const largerRoom = buildRoom({ id: 1, description: 'Large Suite', type: 'Guest Room', size: 10 })
    const tighterFitRoom = buildRoom({ id: 2, description: 'Small Suite', type: 'Guest Room', size: 6 })

    const selectedRoom = choosePreferredRoomForSlotGame({
      context: buildPreferredSelectionContext({
        input: buildPlannerInput([largerRoom, tighterFitRoom]),
      }),
      game: buildGameContext(),
      roomFilter: () => true,
      preferNonBallroom: false,
      sortCandidates: (left, right) =>
        left.room.size - right.room.size || left.room.description.localeCompare(right.room.description),
    })

    expect(selectedRoom?.id).toBe(tighterFitRoom.id)
  })
})
