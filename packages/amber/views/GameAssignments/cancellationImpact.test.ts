import type { GameAssignmentDashboardData } from '@amber/client'
import { describe, expect, test } from 'vitest'

import { buildCancellationImpact } from './cancellationImpact'

const data = {
  games: [
    { id: 1, name: 'Below', slotId: 1, category: 'user', playerMin: 2, playerMax: 4 },
    { id: 2, name: 'At minimum', slotId: 2, category: 'user', playerMin: 2, playerMax: 4 },
    { id: 3, name: 'No Game', slotId: 1, category: 'no_game', playerMin: 0, playerMax: 999 },
    { id: 4, name: 'Cancelled game', slotId: null, category: 'user', playerMin: 2, playerMax: 4 },
  ],
  assignments: [
    { memberId: 1, gameId: 1, gm: 0 },
    { memberId: 2, gameId: 1, gm: 0 },
    { memberId: 1, gameId: 2, gm: 0 },
    { memberId: 3, gameId: 2, gm: 0 },
    { memberId: 4, gameId: 2, gm: 0 },
    { memberId: 1, gameId: 1, gm: 1 },
    { memberId: 2, gameId: 4, gm: 0 },
  ],
} as GameAssignmentDashboardData

describe('buildCancellationImpact', () => {
  test('removes the selected member only from player counts before identifying capacity risks', () => {
    expect(buildCancellationImpact({ data, memberId: 1 })).toEqual({
      belowMinimumGames: [
        {
          gameId: 1,
          gameName: 'Below',
          isAffectedByCancellation: true,
          slotId: 1,
          playerCount: 1,
          playerMin: 2,
          playerMax: 4,
        },
      ],
      atMinimumGames: [
        {
          gameId: 2,
          gameName: 'At minimum',
          isAffectedByCancellation: true,
          slotId: 2,
          playerCount: 2,
          playerMin: 2,
          playerMax: 4,
        },
      ],
    })
  })
})
