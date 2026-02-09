import { describe, expect, test } from 'vitest'

import type { DashboardAssignment, DashboardGame } from './utils'
import { buildAssignmentCountsByGameId } from './utils'

const buildGame = ({ id, playerMin, playerMax }: { id: number; playerMin: number; playerMax: number }) =>
  ({ id, playerMin, playerMax }) as DashboardGame

const buildAssignment = ({
  memberId,
  gameId,
  gm,
  year = 2026,
}: {
  memberId: number
  gameId: number
  gm: number
  year?: number
}) => ({ memberId, gameId, gm, year }) as DashboardAssignment

describe('buildAssignmentCountsByGameId', () => {
  test('discounts gm assignments from overrun shortfall and spaces', () => {
    const games = [buildGame({ id: 1, playerMin: 2, playerMax: 2 }), buildGame({ id: 2, playerMin: 1, playerMax: 3 })]
    const assignments = [
      buildAssignment({ memberId: 1, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 2, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 3, gameId: 1, gm: 0 }),
      buildAssignment({ memberId: 4, gameId: 1, gm: 1 }),
      buildAssignment({ memberId: 5, gameId: 1, gm: 2 }),
      buildAssignment({ memberId: 6, gameId: 1, gm: -1 }),
      buildAssignment({ memberId: 7, gameId: 2, gm: 1 }),
    ]

    const countsByGameId = buildAssignmentCountsByGameId(games, assignments)

    expect(countsByGameId.get(1)).toEqual({
      assignedCount: 5,
      overrun: 1,
      shortfall: 0,
      spaces: 0,
    })
    expect(countsByGameId.get(2)).toEqual({
      assignedCount: 1,
      overrun: 0,
      shortfall: 1,
      spaces: 3,
    })
  })
})
