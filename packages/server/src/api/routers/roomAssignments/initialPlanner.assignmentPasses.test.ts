import { describe, expect, test, vi } from 'vitest'

import type { InitialPlannerInput, InitialPlannerRoom } from './initialPlanner'
import {
  assignPubTheoryException,
  buildSlotAssignmentPasses,
  type SlotAssignmentPass,
} from './initialPlanner.assignmentPasses'
import type { SlotRoomPlanner, SlotRoomSelectionContext } from './initialPlanner.roomSelection'
import type { PlannedGameContext } from './initialPlanner.seed'

const year = 2026

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

const buildGameContext = (overrides: Partial<PlannedGameContext> = {}): PlannedGameContext => ({
  game: {
    id: overrides.game?.id ?? 10,
    name: overrides.game?.name ?? 'Example Game',
    slotId: overrides.game?.slotId ?? 1,
    year: overrides.game?.year ?? year,
    category: overrides.game?.category ?? 'user',
  },
  participantCount: overrides.participantCount ?? 2,
  requiredAccessibility: overrides.requiredAccessibility ?? 'many_stairs',
  gmMemberIds: overrides.gmMemberIds ?? [1],
  playerMemberIds: overrides.playerMemberIds ?? [2],
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

const buildSelectionContext = ({
  input,
  occupiedRoomIds,
}: {
  input: InitialPlannerInput
  occupiedRoomIds?: Set<number>
}): SlotRoomSelectionContext => ({
  input,
  slotId: 1,
  roomsById: new Map(input.rooms.map((room) => [room.id, room])),
  roomAvailabilityByKey: new Map(),
  memberRoomIdByMemberId: new Map(),
  memberRoomIds: new Set(),
  occupiedRoomIds: occupiedRoomIds ?? new Set<number>(),
  usageCountByRoomId: new Map(),
})

const buildRoomPlanner = (overrides: Partial<SlotRoomPlanner> = {}): SlotRoomPlanner => ({
  chooseOwnedRoomForGame: vi.fn(() => null),
  choosePreferredRoomForGame: vi.fn(() => null),
  hasLargerOpenSharedRoom: vi.fn(() => false),
  buildSkipReason: vi.fn(() => 'skip'),
  ...overrides,
})

const getPasses = ({
  roomPlanner,
  roomMemberCountByRoomId,
  memberRoomIds,
}: {
  roomPlanner?: SlotRoomPlanner
  roomMemberCountByRoomId?: Map<number, number>
  memberRoomIds?: Set<number>
} = {}): Array<SlotAssignmentPass> =>
  buildSlotAssignmentPasses({
    roomPlanner: roomPlanner ?? buildRoomPlanner(),
    roomMemberCountByRoomId: roomMemberCountByRoomId ?? new Map<number, number>(),
    memberRoomIds: memberRoomIds ?? new Set<number>(),
  })

describe('buildSlotAssignmentPasses', () => {
  test('player-owned pass defers an exact-fit room when a larger shared room remains open', () => {
    const exactFitRoom = buildRoom({ id: 5, description: 'Player Suite', size: 2 })
    const roomPlanner = buildRoomPlanner({
      chooseOwnedRoomForGame: vi.fn(() => exactFitRoom),
      hasLargerOpenSharedRoom: vi.fn(() => true),
    })
    const [_, playerOwnedPass] = getPasses({
      roomPlanner,
      roomMemberCountByRoomId: new Map([[5, 1]]),
    })
    const game = buildGameContext({
      participantCount: 2,
      playerMemberIds: [42],
    })
    const selectedRoom = playerOwnedPass.selectRoom(game)

    expect(selectedRoom).toBe(exactFitRoom)
    expect(playerOwnedPass.shouldAssignRoom?.({ game, room: exactFitRoom })).toBe(false)
    expect(roomPlanner.chooseOwnedRoomForGame).toHaveBeenCalledWith(
      expect.objectContaining({
        game,
        memberIds: [42],
        ownerPriority: expect.any(Function),
      }),
    )
  })

  test('shared-room pass excludes member rooms and labels ballroom fallbacks distinctly', () => {
    const ballroom = buildRoom({ id: 7, description: 'Cascade Ballroom', type: 'Ballroom', size: 12 })
    const roomPlanner = buildRoomPlanner({
      choosePreferredRoomForGame: vi.fn(({ roomFilter }) => {
        expect(roomFilter(ballroom)).toBe(true)
        expect(roomFilter(buildRoom({ id: 9, description: 'Member Suite' }))).toBe(false)
        return ballroom
      }),
    })
    const [, , sharedRoomPass] = getPasses({
      roomPlanner,
      memberRoomIds: new Set([9]),
    })
    const game = buildGameContext()

    expect(sharedRoomPass.selectRoom(game)).toBe(ballroom)
    expect(sharedRoomPass.buildReason({ game, room: ballroom })).toBe('Shared room fallback (ballroom)')
    expect(roomPlanner.choosePreferredRoomForGame).toHaveBeenCalledWith(
      expect.objectContaining({
        game,
        preferNonBallroom: true,
        roomFilter: expect.any(Function),
      }),
    )
  })
})

describe('assignPubTheoryException', () => {
  test('assigns Pub Theory to Black Rabbit Bar when the room is eligible', () => {
    const blackRabbitBar = buildRoom({ id: 2, description: 'Black Rabbit Bar', type: 'Shared Space', size: 12 })
    const input = buildPlannerInput([buildRoom({ id: 1, description: 'Shared Hall' }), blackRabbitBar])
    const assignRoom = vi.fn()

    assignPubTheoryException({
      games: [
        buildGameContext({ game: { id: 10, name: 'Pub Theory & Game Crawl', slotId: 1, year, category: 'user' } }),
      ],
      input,
      context: buildSelectionContext({
        input,
      }),
      assignedGameIds: new Set<number>(),
      assignRoom,
    })

    expect(assignRoom).toHaveBeenCalledWith({
      game: expect.objectContaining({
        game: expect.objectContaining({ id: 10 }),
      }),
      room: blackRabbitBar,
      reason: 'Black Rabbit Bar fixed exception',
    })
  })

  test('skips the exception when Black Rabbit Bar is already occupied', () => {
    const blackRabbitBar = buildRoom({ id: 2, description: 'Black Rabbit Bar', type: 'Shared Space', size: 12 })
    const input = buildPlannerInput([blackRabbitBar])
    const assignRoom = vi.fn()

    assignPubTheoryException({
      games: [
        buildGameContext({ game: { id: 10, name: 'Pub Theory & Game Crawl', slotId: 1, year, category: 'user' } }),
      ],
      input,
      context: buildSelectionContext({
        input,
        occupiedRoomIds: new Set([2]),
      }),
      assignedGameIds: new Set<number>(),
      assignRoom,
    })

    expect(assignRoom).not.toHaveBeenCalled()
  })
})
