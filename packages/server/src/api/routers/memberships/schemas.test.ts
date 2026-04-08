import { describe, expect, test } from 'vitest'

import { createMembershipInput, updateMembershipInput } from './schemas'

describe('membership schemas', () => {
  test('coerces required membership dates for create input', () => {
    const result = createMembershipInput.parse({
      userId: 4,
      year: 2026,
      arrivalDate: '2026-11-19',
      departureDate: '2026-11-22',
      attendance: 'full',
      attending: true,
      hotelRoomId: 9,
      interestLevel: 'high',
      message: 'Excited to attend',
      offerSubsidy: false,
      requestOldPrice: false,
      roomPreferenceAndNotes: 'Quiet room',
      roomingPreferences: 'Near elevators',
      roomingWith: 'Pat',
      volunteer: true,
      slotsAttending: '1,2,3',
      cost: 225,
    })

    expect(result.arrivalDate).toBeInstanceOf(Date)
    expect(result.departureDate).toBeInstanceOf(Date)
  })

  test('normalizes blank optional membership dates to undefined on update input', () => {
    const result = updateMembershipInput.parse({
      id: 22,
      data: {
        arrivalDate: '',
        departureDate: null,
        message: 'Updated request',
      },
    })

    expect(result).toEqual({
      id: 22,
      data: {
        arrivalDate: undefined,
        departureDate: undefined,
        message: 'Updated request',
      },
    })
  })
})
