import { describe, expect, test } from 'vitest'

import { getGameAssignmentsByYearInput, updateGameAssignmentsInput } from './schemas'

describe('game assignment schemas', () => {
  test('preserves the shared year-only payload used by dashboard, summary, reset, and initial-assignment flows', () => {
    const result = getGameAssignmentsByYearInput.parse({
      year: 2026,
    })

    expect(result).toEqual({
      year: 2026,
    })
  })

  test('preserves the existing nested assignment records on bulk update payloads', () => {
    const result = updateGameAssignmentsInput.parse({
      year: 2026,
      adds: [{ memberId: 41, gameId: 11, gm: 0, year: 2026 }],
      removes: [{ memberId: 42, gameId: 12, gm: -1, year: 2026 }],
    })

    expect(result).toEqual({
      year: 2026,
      adds: [{ memberId: 41, gameId: 11, gm: 0, year: 2026 }],
      removes: [{ memberId: 42, gameId: 12, gm: -1, year: 2026 }],
    })
  })
})
