import { describe, expect, test } from 'vitest'

import { cancelPaymentIntentInput, createPaymentIntentInput, updatePaymentIntentInput } from './schemas'

describe('payments schemas', () => {
  test('preserves the shared amount and optional metadata payload used by payment intent creation', () => {
    const result = createPaymentIntentInput.parse({
      amount: 4200,
      metadata: {
        membershipId: '17',
        paid: true,
        retryCount: 0,
      },
    })

    expect(result).toEqual({
      amount: 4200,
      metadata: {
        membershipId: '17',
        paid: true,
        retryCount: 0,
      },
    })
  })

  test('preserves the existing update payload shape by extending the shared payment intent fields', () => {
    const result = updatePaymentIntentInput.parse({
      amount: 4800,
      paymentIntentId: 'pi_123',
    })

    expect(result).toEqual({
      amount: 4800,
      paymentIntentId: 'pi_123',
    })
  })

  test('requires the existing non-empty payment intent id for cancel requests', () => {
    const result = cancelPaymentIntentInput.parse({
      paymentIntentId: 'pi_456',
    })

    expect(result).toEqual({
      paymentIntentId: 'pi_456',
    })
  })
})
