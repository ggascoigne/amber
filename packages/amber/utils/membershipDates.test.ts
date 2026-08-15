import { describe, expect, it } from 'vitest'

import { normalizeMembershipDatesForPersistence } from './membershipDates'

describe('normalizeMembershipDatesForPersistence', () => {
  it('normalizes arrival and departure without changing other membership values', () => {
    const membership = {
      arrivalDate: '2024-11-06T00:00:00.000-05:00',
      departureDate: '2024-11-10T00:00:00.000-05:00',
      message: 'Keep this value',
    }

    expect(normalizeMembershipDatesForPersistence(membership, 'America/Los_Angeles')).toEqual({
      arrivalDate: new Date('2024-11-06T08:00:00.000Z'),
      departureDate: new Date('2024-11-10T08:00:00.000Z'),
      message: 'Keep this value',
    })
  })
})
