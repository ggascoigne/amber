import { describe, expect, test } from 'vitest'

import { buildPlannerInputFromSnapshot } from './plannerInput'
import type { RoomAssignmentPlannerSnapshot } from './plannerInput'

const plannerData: RoomAssignmentPlannerSnapshot = {
  games: [
    {
      id: 10,
      name: 'Alpha Game',
      slotId: 1,
      year: 2026,
      category: 'user',
    },
    {
      id: 11,
      name: 'Bravo Game',
      slotId: 2,
      year: 2026,
      category: 'user',
    },
    {
      id: 12,
      name: 'No Slot Game',
      slotId: null,
      year: 2026,
      category: 'user',
    },
  ],
  rooms: [
    {
      id: 5,
      description: 'Boardroom',
      size: 8,
      type: 'ballroom',
      enabled: true,
      accessibility: 'accessible',
    },
  ],
  roomAssignments: [
    {
      gameId: 10,
      roomId: 5,
      slotId: 1,
      year: 2026,
      isOverride: false,
      source: 'auto',
    },
    {
      gameId: 11,
      roomId: 5,
      slotId: 2,
      year: 2026,
      isOverride: true,
      source: 'manual',
    },
  ],
  roomSlotAvailability: [
    {
      roomId: 5,
      slotId: 1,
      year: 2026,
      isAvailable: true,
    },
  ],
  memberRoomAssignments: [
    {
      memberId: 20,
      roomId: 5,
      membership: {
        user: {
          fullName: null,
        },
      },
    },
  ],
  gameAssignments: [
    {
      memberId: 20,
      gameId: 10,
      gm: 1,
      membership: {
        user: {
          fullName: null,
          profile: [{ roomAccessibilityPreference: 'some_stairs' }],
        },
      },
    },
    {
      memberId: 21,
      gameId: 11,
      gm: 0,
      membership: {
        user: {
          fullName: 'Pat Player',
          profile: [],
        },
      },
    },
  ],
}

describe('buildPlannerInputFromSnapshot', () => {
  test('filters to slotted games and narrows by slot when requested', () => {
    const result = buildPlannerInputFromSnapshot({
      plannerData,
      year: 2026,
      slotId: 1,
    })

    expect(result.games).toEqual([
      {
        id: 10,
        name: 'Alpha Game',
        slotId: 1,
        year: 2026,
        category: 'user',
      },
    ])
  })

  test('maps participant and assignment fields with preserved fallbacks', () => {
    const result = buildPlannerInputFromSnapshot({
      plannerData,
      year: 2026,
    })

    expect(result.participants).toEqual([
      {
        memberId: 20,
        gameId: 10,
        isGm: true,
        fullName: 'Unknown member',
        roomAccessibilityPreference: 'some_stairs',
      },
      {
        memberId: 21,
        gameId: 11,
        isGm: false,
        fullName: 'Pat Player',
        roomAccessibilityPreference: null,
      },
    ])
    expect(result.memberRoomAssignments).toEqual([
      {
        memberId: 20,
        roomId: 5,
        memberName: 'Unknown member',
      },
    ])
    expect(result.existingAssignments).toEqual([
      {
        gameId: 10,
        roomId: 5,
        slotId: 1,
        year: 2026,
        isOverride: false,
        source: 'auto',
      },
      {
        gameId: 11,
        roomId: 5,
        slotId: 2,
        year: 2026,
        isOverride: true,
        source: 'manual',
      },
    ])
  })
})
