import { describe, expect, test } from 'vitest'

import { buildInitialGameAssignments } from './initial'

describe('initial game assignment helper', () => {
  test('builds GM and first-choice assignments while preserving special-game rules', () => {
    const assignments = buildInitialGameAssignments({
      assignments: [
        { memberId: 1, gameId: 101, gm: -2 },
        { memberId: 2, gameId: 101, gm: -1 },
        { memberId: 2, gameId: 101, gm: 0 },
        { memberId: 3, gameId: 104, gm: -4 },
        { memberId: 4, gameId: 101, gm: -1 },
      ],
      choices: [
        { memberId: 4, gameId: 101, slotId: 1 },
        { memberId: 5, gameId: 102, slotId: 1 },
        { memberId: 6, gameId: 103, slotId: 1 },
        { memberId: 7, gameId: 104, slotId: 2 },
        { memberId: 8, gameId: 999, slotId: 1 },
        { memberId: 9, gameId: null, slotId: 1 },
      ],
      games: [
        { id: 101, slotId: 1, category: 'user' },
        { id: 102, slotId: 1, category: 'no_game' },
        { id: 103, slotId: null, category: 'any_game' },
        { id: 104, slotId: null, category: 'user' },
      ],
      year: 2026,
    })

    expect(assignments).toEqual([
      { memberId: 1, gameId: 101, gm: 2, year: 2026 },
      { memberId: 4, gameId: 101, gm: 1, year: 2026 },
      { memberId: 5, gameId: 102, gm: 0, year: 2026 },
    ])
  })

  test('skips no-game choices when the selected slot has no slot-specific no-game record', () => {
    const assignments = buildInitialGameAssignments({
      assignments: [],
      choices: [{ memberId: 10, gameId: 201, slotId: 2 }],
      games: [
        { id: 201, slotId: 1, category: 'no_game' },
        { id: 202, slotId: 1, category: 'user' },
      ],
      year: 2026,
    })

    expect(assignments).toEqual([])
  })
})
