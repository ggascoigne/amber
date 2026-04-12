import { describe, expect, test } from 'vitest'

import { buildSlotAssignmentScope } from './assignmentScope'
import { buildAssignment, buildGame } from './testHelpers'

describe('buildSlotAssignmentScope', () => {
  test('includes slot-matched games plus any-game entries when requested', () => {
    const games = [
      buildGame({ id: 1, playerMin: 2, playerMax: 4, slotId: 1, category: 'user' }),
      buildGame({ id: 2, playerMin: 2, playerMax: 4, slotId: 2, category: 'user' }),
      buildGame({ id: 3, playerMin: 0, playerMax: 4, slotId: 2, category: 'no_game' }),
      buildGame({ id: 4, playerMin: 0, playerMax: 99, slotId: null, category: 'any_game' }),
    ]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 2, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 3, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 4, gm: 1 }),
      buildAssignment({ memberId: 4, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 5, gameId: 2, gm: -1 }),
    ]

    const scope = buildSlotAssignmentScope({
      games,
      assignments,
      slotFilterId: 2,
      includeAnyGame: true,
    })

    expect(scope.filteredSlotGames.map((game) => game.id)).toEqual([2, 3, 4])
    expect(Array.from(scope.slotGameIdSet)).toEqual([2, 3, 4])
    expect(scope.scheduledAssignments.map((assignment) => assignment.memberId)).toEqual([1, 2, 3])
  })

  test('can restrict the scope to scheduled user games only', () => {
    const games = [
      buildGame({ id: 1, playerMin: 2, playerMax: 4, slotId: 1, category: 'user' }),
      buildGame({ id: 2, playerMin: 2, playerMax: 4, slotId: 1, category: 'no_game' }),
      buildGame({ id: 3, playerMin: 2, playerMax: 4, slotId: null, category: 'any_game' }),
      buildGame({ id: 4, playerMin: 2, playerMax: 4, slotId: 2, category: 'user' }),
    ]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 2, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 3, gm: 0 }),
      buildAssignment({ memberId: 4, gameId: 4, gm: 1 }),
      buildAssignment({ memberId: 5, gameId: 4, gm: -1 }),
    ]

    const scope = buildSlotAssignmentScope({
      games,
      assignments,
      slotFilterId: null,
      userGamesOnly: true,
    })

    expect(scope.filteredSlotGames.map((game) => game.id)).toEqual([1, 4])
    expect(Array.from(scope.slotGameIdSet)).toEqual([1, 4])
    expect(scope.scheduledAssignments.map((assignment) => assignment.memberId)).toEqual([1, 4])
  })
})
