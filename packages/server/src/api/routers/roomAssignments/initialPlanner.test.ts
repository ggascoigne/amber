import { describe, expect, test } from 'vitest'

import { planInitialRoomAssignments, type InitialPlannerInput, type InitialPlannerRoom } from './initialPlanner'

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

const buildInput = (overrides: Partial<InitialPlannerInput> = {}): InitialPlannerInput => ({
  year,
  games: [],
  rooms: [],
  participants: [],
  roomSlotAvailability: [],
  memberRoomAssignments: [],
  existingAssignments: [],
  ...overrides,
})

describe('planInitialRoomAssignments', () => {
  test('assigns Pub Theory & Game Crawl to Black Rabbit Bar when available', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Shared Hall', type: 'Shared Space', size: 14 }),
          buildRoom({ id: 2, description: 'Black Rabbit Bar', type: 'Shared Space', size: 12 }),
        ],
        games: [
          { id: 10, name: 'Pub Theory & Game Crawl', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Other Game', slotId: 1, year, category: 'user' },
        ],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 3, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
        ],
      }),
    )

    expect(result.assignments).toEqual([
      expect.objectContaining({
        gameId: 10,
        roomDescription: 'Black Rabbit Bar',
        reason: 'Black Rabbit Bar fixed exception',
      }),
      expect.objectContaining({
        gameId: 11,
        roomDescription: 'Shared Hall',
      }),
    ])
  })

  test('falls back from Black Rabbit Bar when that room is unavailable in the slot', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Shared Hall', type: 'Shared Space', size: 14 }),
          buildRoom({ id: 2, description: 'Black Rabbit Bar', type: 'Shared Space', size: 12 }),
        ],
        games: [{ id: 10, name: 'Pub Theory & Game Crawl', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
        ],
        roomSlotAvailability: [{ roomId: 2, slotId: 1, year, isAvailable: false }],
      }),
    )

    expect(result.assignments).toEqual([
      expect.objectContaining({
        gameId: 10,
        roomDescription: 'Shared Hall',
        reason: 'Shared room priority',
      }),
    ])
  })

  test('prefers GM-owned rooms before shared spaces', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Shared Hall', type: 'Shared Space', size: 20 }),
          buildRoom({ id: 2, description: 'GM Suite', type: 'Guest Room', size: 8 }),
        ],
        games: [{ id: 10, name: 'GM Home Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
        ],
        memberRoomAssignments: [{ memberId: 1, roomId: 2, memberName: 'GM One' }],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(
      expect.objectContaining({
        gameId: 10,
        roomId: 2,
        reason: 'GM-owned room preference',
      }),
    )
  })

  test('still prefers a GM-owned exact-fit room over a larger shared room', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Shared Hall', type: 'Shared Space', size: 6 }),
          buildRoom({ id: 2, description: 'GM Suite', type: 'Guest Room', size: 2 }),
        ],
        games: [{ id: 10, name: 'Tight Fit Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
        ],
        memberRoomAssignments: [{ memberId: 1, roomId: 2, memberName: 'GM One' }],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(
      expect.objectContaining({
        gameId: 10,
        roomId: 2,
        reason: 'GM-owned room preference',
      }),
    )
  })

  test('prefers a larger open shared room over an exact-fit player-owned room', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Shared Hall', type: 'Shared Space', size: 6 }),
          buildRoom({ id: 2, description: 'Player Suite', type: 'Guest Room', size: 2 }),
        ],
        games: [{ id: 10, name: 'Tight Fit Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
        ],
        memberRoomAssignments: [{ memberId: 2, roomId: 2, memberName: 'Player One' }],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(
      expect.objectContaining({
        gameId: 10,
        roomId: 1,
        reason: 'Shared room priority',
      }),
    )
  })

  test('avoids the ballroom when a non-ballroom shared room also fits', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Cascade Ballroom', type: 'Ballroom', size: 20 }),
          buildRoom({ id: 2, description: 'Boardroom I', type: 'Shared Space', size: 12 }),
        ],
        games: [{ id: 10, name: 'Small Shared Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'Player One', roomAccessibilityPreference: 'many_stairs' },
        ],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(
      expect.objectContaining({
        roomDescription: 'Boardroom I',
        reason: 'Shared room priority',
      }),
    )
  })

  test('uses least-used shared room across earlier slots when sizes match', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Boardroom I', type: 'Shared Space', size: 10 }),
          buildRoom({ id: 2, description: 'Boardroom II', type: 'Shared Space', size: 10 }),
        ],
        games: [
          { id: 10, name: 'First Slot Game', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Second Slot Game', slotId: 2, year, category: 'user' },
        ],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
        ],
      }),
    )

    expect(result.assignments).toEqual([
      expect.objectContaining({ gameId: 10, roomDescription: 'Boardroom I' }),
      expect.objectContaining({ gameId: 11, roomDescription: 'Boardroom II' }),
    ])
  })

  test('counts existing fixed assignments toward later shared-room balancing', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Boardroom I', type: 'Shared Space', size: 10 }),
          buildRoom({ id: 2, description: 'Boardroom II', type: 'Shared Space', size: 10 }),
        ],
        games: [
          { id: 10, name: 'Locked First Slot Game', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Second Slot Game', slotId: 2, year, category: 'user' },
        ],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
        ],
        existingAssignments: [{ gameId: 10, roomId: 1, slotId: 1, year, isOverride: true, source: 'manual' }],
      }),
    )

    expect(result.assignments).toEqual([expect.objectContaining({ gameId: 11, roomDescription: 'Boardroom II' })])
  })

  test('respects slot availability and reports unused non-member rooms', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Available Hall', type: 'Shared Space', size: 12 }),
          buildRoom({ id: 2, description: 'Unavailable Hall', type: 'Shared Space', size: 12 }),
        ],
        games: [{ id: 10, name: 'Only Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
        ],
        roomSlotAvailability: [{ roomId: 2, slotId: 1, year, isAvailable: false }],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(expect.objectContaining({ roomDescription: 'Available Hall' }))
    expect(result.unmetConstraints).toEqual([])
  })

  test('skips games that cannot fit any enabled room and reports unused shared rooms', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Small Hall', type: 'Shared Space', size: 2 }),
          buildRoom({ id: 2, description: 'Spare Hall', type: 'Shared Space', size: 4 }),
        ],
        games: [{ id: 10, name: 'Huge Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'P1', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 3, gameId: 10, isGm: false, fullName: 'P2', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 4, gameId: 10, isGm: false, fullName: 'P3', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 5, gameId: 10, isGm: false, fullName: 'P4', roomAccessibilityPreference: 'many_stairs' },
        ],
      }),
    )

    expect(result.assignments).toEqual([])
    expect(result.skippedGames).toEqual([
      expect.objectContaining({
        gameId: 10,
        participantCount: 5,
        reason: 'No enabled room can fit 5 participant(s) with many_stairs accessibility.',
      }),
    ])
    expect(result.unmetConstraints).toEqual([
      expect.objectContaining({
        slotId: 1,
        type: 'unused_non_member_room',
        detail: 'Unused non-member rooms in Slot 1: Spare Hall, Small Hall.',
      }),
    ])
  })

  test('reports when higher-priority assignments consume the only eligible room', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [buildRoom({ id: 1, description: 'Only Hall', type: 'Shared Space', size: 4 })],
        games: [
          { id: 10, name: 'Large First Game', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Smaller Second Game', slotId: 1, year, category: 'user' },
        ],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 10, isGm: false, fullName: 'P1', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 3, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
        ],
      }),
    )

    expect(result.assignments).toEqual([expect.objectContaining({ gameId: 10, roomDescription: 'Only Hall' })])
    expect(result.skippedGames).toEqual([
      expect.objectContaining({
        gameId: 11,
        reason: 'No eligible room remained after higher-priority assignments or slot availability constraints.',
      }),
    ])
  })

  test('reports when slot availability removes the only otherwise fitting room', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [buildRoom({ id: 1, description: 'Only Hall', type: 'Shared Space', size: 4 })],
        games: [{ id: 10, name: 'Unavailable Room Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
        ],
        roomSlotAvailability: [{ roomId: 1, slotId: 1, year, isAvailable: false }],
      }),
    )

    expect(result.assignments).toEqual([])
    expect(result.skippedGames).toEqual([
      expect.objectContaining({
        gameId: 10,
        reason: 'No eligible room remained after higher-priority assignments or slot availability constraints.',
      }),
    ])
    expect(result.unmetConstraints).toEqual([])
  })

  test('prefers non-sharing player-owned rooms before shared player-owned rooms', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Solo Suite', type: 'Guest Room', size: 10 }),
          buildRoom({ id: 2, description: 'Shared Suite', type: 'Guest Room', size: 10 }),
        ],
        games: [{ id: 10, name: 'Player Hosted Game', slotId: 1, year, category: 'user' }],
        participants: [
          { memberId: 1, gameId: 10, isGm: false, fullName: 'Solo Owner', roomAccessibilityPreference: 'many_stairs' },
          {
            memberId: 2,
            gameId: 10,
            isGm: false,
            fullName: 'Shared Owner',
            roomAccessibilityPreference: 'many_stairs',
          },
        ],
        memberRoomAssignments: [
          { memberId: 1, roomId: 1, memberName: 'Solo Owner' },
          { memberId: 2, roomId: 2, memberName: 'Shared Owner' },
          { memberId: 3, roomId: 2, memberName: 'Roommate' },
        ],
      }),
    )

    expect(result.assignments).toHaveLength(1)
    expect(result.assignments[0]).toEqual(expect.objectContaining({ roomDescription: 'Solo Suite' }))
  })

  test('treats override assignments as fixed and does not recalculate those games or rooms', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Override Hall', type: 'Shared Space', size: 12 }),
          buildRoom({ id: 2, description: 'Open Hall', type: 'Shared Space', size: 10 }),
        ],
        games: [
          { id: 10, name: 'Override Game', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Planned Game', slotId: 1, year, category: 'user' },
        ],
        participants: [
          { memberId: 1, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 2, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
        ],
        existingAssignments: [{ gameId: 10, roomId: 1, slotId: 1, year, isOverride: true, source: 'manual' }],
      }),
    )

    expect(result.assignments).toEqual([
      expect.objectContaining({
        gameId: 11,
        roomDescription: 'Open Hall',
      }),
    ])
    expect(result.assignments.find((assignment) => assignment.gameId === 10)).toBeUndefined()
  })

  test('balances fallback member room usage instead of always preferring the largest member room', () => {
    const result = planInitialRoomAssignments(
      buildInput({
        rooms: [
          buildRoom({ id: 1, description: 'Large Suite', type: 'Guest Room', size: 10 }),
          buildRoom({ id: 2, description: 'Small Suite', type: 'Guest Room', size: 6 }),
        ],
        games: [
          { id: 10, name: 'First Game', slotId: 1, year, category: 'user' },
          { id: 11, name: 'Second Game', slotId: 2, year, category: 'user' },
        ],
        participants: [
          { memberId: 101, gameId: 10, isGm: true, fullName: 'GM One', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 102, gameId: 10, isGm: false, fullName: 'P1', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 201, gameId: 11, isGm: true, fullName: 'GM Two', roomAccessibilityPreference: 'many_stairs' },
          { memberId: 202, gameId: 11, isGm: false, fullName: 'P2', roomAccessibilityPreference: 'many_stairs' },
        ],
        memberRoomAssignments: [
          { memberId: 301, roomId: 1, memberName: 'Suite One Owner' },
          { memberId: 302, roomId: 2, memberName: 'Suite Two Owner' },
        ],
      }),
    )

    expect(result.assignments).toEqual([
      expect.objectContaining({ gameId: 10, roomDescription: 'Small Suite' }),
      expect.objectContaining({ gameId: 11, roomDescription: 'Large Suite' }),
    ])
  })
})
