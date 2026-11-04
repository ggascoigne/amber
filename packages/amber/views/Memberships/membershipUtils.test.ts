import { describe, expect, test } from 'vitest'

import { getMembershipValidationSchemaNW } from './membershipUtils'
import { Attendance } from '../../utils/selectValues'

describe('getMembershipValidationSchemaNW', () => {
  test('allows administrators to set a subsidized membership amount to zero', async () => {
    await expect(
      getMembershipValidationSchemaNW(true).validateAt('subsidizedAmount', {
        membership: Attendance.Subsidized,
        subsidizedAmount: 0,
      }),
    ).resolves.toBe(0)
  })

  test('keeps the $20 subsidized membership minimum for non-administrators', async () => {
    await expect(
      getMembershipValidationSchemaNW(false).validateAt('subsidizedAmount', {
        membership: Attendance.Subsidized,
        subsidizedAmount: 0,
      }),
    ).rejects.toThrow('Must be at least $20')
  })
})
