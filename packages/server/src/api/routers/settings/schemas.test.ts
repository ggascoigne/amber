import { describe, expect, test } from 'vitest'

import { createSettingInput, updateSettingInput } from './schemas'

describe('settings schemas', () => {
  test('preserves required string fields for create input', () => {
    const result = createSettingInput.parse({
      code: 'currentYear',
      type: 'integer',
      value: '2026',
    })

    expect(result).toEqual({
      code: 'currentYear',
      type: 'integer',
      value: '2026',
    })
  })

  test('preserves optional update fields on the existing flat update payload', () => {
    const result = updateSettingInput.parse({
      id: 6,
      value: 'true',
    })

    expect(result).toEqual({
      id: 6,
      value: 'true',
    })
  })
})
