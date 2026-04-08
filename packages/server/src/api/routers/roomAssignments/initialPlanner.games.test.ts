import { describe, expect, test } from 'vitest'

import { buildPlannedGamesBySlotId } from './initialPlanner.games'

describe('buildPlannedGamesBySlotId', () => {
  test('filters to current-year user games and groups participant context by slot', () => {
    const result = buildPlannedGamesBySlotId({
      year: 2026,
      games: [
        { id: 10, name: 'Alpha Game', slotId: 1, year: 2026, category: 'user' },
        { id: 11, name: 'Bravo Game', slotId: 1, year: 2026, category: 'staff' },
        { id: 12, name: 'Charlie Game', slotId: 2, year: 2025, category: 'user' },
        { id: 13, name: 'Delta Game', slotId: 2, year: 2026, category: 'user' },
      ],
      participants: [
        {
          memberId: 1,
          gameId: 10,
          isGm: true,
          fullName: 'GM One',
          roomAccessibilityPreference: 'some_stairs',
        },
        {
          memberId: 2,
          gameId: 10,
          isGm: false,
          fullName: 'Player One',
          roomAccessibilityPreference: 'accessible',
        },
        {
          memberId: 3,
          gameId: 11,
          isGm: true,
          fullName: 'Filtered Staff GM',
          roomAccessibilityPreference: 'many_stairs',
        },
      ],
    })

    expect([...result.keys()]).toEqual([1, 2])
    expect(result.get(1)).toEqual([
      {
        game: { id: 10, name: 'Alpha Game', slotId: 1, year: 2026, category: 'user' },
        participantCount: 2,
        requiredAccessibility: 'accessible',
        gmMemberIds: [1],
        playerMemberIds: [2],
      },
    ])
    expect(result.get(2)).toEqual([
      {
        game: { id: 13, name: 'Delta Game', slotId: 2, year: 2026, category: 'user' },
        participantCount: 0,
        requiredAccessibility: 'many_stairs',
        gmMemberIds: [],
        playerMemberIds: [],
      },
    ])
  })
})
