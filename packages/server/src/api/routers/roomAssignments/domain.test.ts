import { describe, expect, test } from 'vitest'

import {
  buildRoomSlotConflictKey,
  doesRoomFitGame,
  doesRoomMeetAccessibilityRequirement,
  getMostRestrictiveAccessibility,
} from './domain'

describe('roomAssignments domain helpers', () => {
  test('resolves the most restrictive accessibility from participant values', () => {
    expect(getMostRestrictiveAccessibility(['many_stairs', 'some_stairs', 'accessible'])).toBe('accessible')
    expect(getMostRestrictiveAccessibility(['many_stairs', 'some_stairs'])).toBe('some_stairs')
    expect(getMostRestrictiveAccessibility([])).toBe('many_stairs')
  })

  test('validates room accessibility requirement matching', () => {
    expect(
      doesRoomMeetAccessibilityRequirement({
        roomAccessibility: 'accessible',
        requiredAccessibility: 'some_stairs',
      }),
    ).toBe(true)

    expect(
      doesRoomMeetAccessibilityRequirement({
        roomAccessibility: 'some_stairs',
        requiredAccessibility: 'accessible',
      }),
    ).toBe(false)

    expect(
      doesRoomMeetAccessibilityRequirement({
        roomAccessibility: 'many_stairs',
        requiredAccessibility: 'many_stairs',
      }),
    ).toBe(true)
  })

  test('validates room fit using both capacity and accessibility', () => {
    expect(
      doesRoomFitGame({
        gameSize: 8,
        roomSize: 10,
        roomAccessibility: 'some_stairs',
        requiredAccessibility: 'some_stairs',
      }),
    ).toBe(true)

    expect(
      doesRoomFitGame({
        gameSize: 8,
        roomSize: 7,
        roomAccessibility: 'accessible',
        requiredAccessibility: 'accessible',
      }),
    ).toBe(false)

    expect(
      doesRoomFitGame({
        gameSize: 8,
        roomSize: 10,
        roomAccessibility: 'many_stairs',
        requiredAccessibility: 'accessible',
      }),
    ).toBe(false)
  })

  test('builds a stable room/slot/year conflict key', () => {
    const keyA = buildRoomSlotConflictKey({ year: 2026, slotId: 4, roomId: 17 })
    const keyB = buildRoomSlotConflictKey({ year: 2026, slotId: 4, roomId: 17 })
    const keyC = buildRoomSlotConflictKey({ year: 2026, slotId: 5, roomId: 17 })

    expect(keyA).toBe('2026:4:17')
    expect(keyA).toBe(keyB)
    expect(keyA).not.toBe(keyC)
  })
})
