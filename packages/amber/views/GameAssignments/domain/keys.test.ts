import { describe, expect, test } from 'vitest'

import { buildAssignmentKeyFromInput, buildAssignmentKeyFromRecord, buildChoiceKey } from './keys'
import { buildAssignment } from './testHelpers'

describe('key builders', () => {
  test('builds stable assignment keys from both input payloads and dashboard records', () => {
    expect(buildAssignmentKeyFromInput({ memberId: 1, gameId: 2, gm: 0, year: 2026 })).toBe('1-2-0-2026')
    expect(buildAssignmentKeyFromRecord(buildAssignment({ memberId: 1, gameId: 2, gm: 0 }))).toBe('1-2-0-2026')
  })

  test('builds stable choice keys', () => {
    expect(buildChoiceKey({ memberId: 5, slotId: 3, rank: 2, year: 2026 })).toBe('5-3-2-2026')
  })
})
