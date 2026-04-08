import { describe, expect, test } from 'vitest'

import { createStripeInput } from './schemas'

describe('stripe schemas', () => {
  test('preserves the existing flexible stripe payload shape for persisted webhook data', () => {
    const result = createStripeInput.parse({
      data: {
        id: 'ch_123',
        amount: 4200,
        metadata: {
          userId: '17',
        },
      },
    })

    expect(result).toEqual({
      data: {
        id: 'ch_123',
        amount: 4200,
        metadata: {
          userId: '17',
        },
      },
    })
  })
})
