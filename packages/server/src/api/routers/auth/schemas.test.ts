import { describe, expect, test } from 'vitest'

import { getRolesInput } from './schemas'

describe('auth schemas', () => {
  test('requires the existing non-empty token payload for role lookups', () => {
    const result = getRolesInput.parse({
      token: 'Bearer test-token',
    })

    expect(result).toEqual({
      token: 'Bearer test-token',
    })
  })
})
