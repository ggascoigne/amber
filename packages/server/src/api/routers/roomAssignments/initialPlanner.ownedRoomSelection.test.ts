import { describe, expect, test } from 'vitest'

import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import { chooseOwnedRoomForSlotGame, type OwnedRoomSelectionContext } from './initialPlanner.ownedRoomSelection'
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

const buildOwnedSelectionContext = ({
  input,
  memberRoomIdByMemberId,
  usageCountByRoomId,
  occupiedRoomIds,
  unavailableRoomIds,
}: {
  input: InitialPlannerInput
  memberRoomIdByMemberId: Map<number, number>
  usageCountByRoomId?: Map<number, number>
  occupiedRoomIds?: Set<number>
  unavailableRoomIds?: Array<number>
}): OwnedRoomSelectionContext => ({
  input,
  slotId,
  roomsById: new Map(input.rooms.map((room) => [room.id, room])),
  roomAvailabilityByKey: new Map(
    (unavailableRoomIds ?? []).map((roomId) => [buildAvailabilityKey({ roomId, slotId, year }), false]),
  ),
  memberRoomIdByMemberId,
  memberRoomIds: new Set<number>([...memberRoomIdByMemberId.values()]),
  occupiedRoomIds: occupiedRoomIds ?? new Set<number>(),
  usageCountByRoomId: usageCountByRoomId ?? new Map<number, number>(),
})

describe('chooseOwnedRoomForSlotGame', () => {
  test('prefers lower owner priority before size and usage tie-breakers', () => {
    const roomA = buildRoom({ id: 1, description: 'Alpha Suite', size: 5 })
    const roomB = buildRoom({ id: 2, description: 'Bravo Suite', size: 9 })
    const input = buildPlannerInput([roomA, roomB])
    const game = buildGameContext()

    const selectedRoom = chooseOwnedRoomForSlotGame({
      context: buildOwnedSelectionContext({
        input,
        memberRoomIdByMemberId: new Map([
          [10, roomA.id],
          [11, roomA.id],
          [12, roomB.id],
        ]),
        usageCountByRoomId: new Map([
          [roomA.id, 5],
          [roomB.id, 0],
        ]),
      }),
      game,
      memberIds: [10, 11, 12],
      ownerPriority: (roomId) => {
        if (roomId === roomA.id) {
          return 2
        }

        if (roomId === roomB.id) {
          return 1
        }

        return 0
      },
    })

    expect(selectedRoom?.id).toBe(roomB.id)
  })

  test('filters out missing or ineligible owned rooms before ranking candidates', () => {
    const input = buildPlannerInput([
      buildRoom({ id: 1, description: 'Tiny Suite', size: 2 }),
      buildRoom({ id: 2, description: 'Occupied Suite', size: 8 }),
      buildRoom({ id: 3, description: 'Unavailable Suite', size: 8 }),
    ])

    expect(
      chooseOwnedRoomForSlotGame({
        context: buildOwnedSelectionContext({
          input,
          memberRoomIdByMemberId: new Map([
            [10, 1],
            [11, 2],
            [12, 3],
            [13, 999],
          ]),
          occupiedRoomIds: new Set([2]),
          unavailableRoomIds: [3],
        }),
        game: buildGameContext(),
        memberIds: [10, 11, 12, 13],
        ownerPriority: () => 0,
      }),
    ).toBeNull()
  })
})
