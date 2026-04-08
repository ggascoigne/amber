import { describe, expect, test, vi } from 'vitest'

import { createMembershipRecord, deleteMembershipRecord, updateMembershipRecord } from './mutations'

import type { TransactionClient } from '../../inRlsTransaction'

const createMembershipsMutationsTx = () => {
  const createdMembership = {
    id: 21,
    userId: 4,
    year: 2026,
    arrivalDate: new Date('2026-11-19T00:00:00.000Z'),
    departureDate: new Date('2026-11-22T00:00:00.000Z'),
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
  }
  const updatedMembership = {
    id: 22,
    userId: 5,
    year: 2026,
    attending: false,
    hotelRoomId: 10,
    message: 'Updated request',
    cost: null,
  }
  const deletedMembership = { id: 23 }

  const membershipCreate = vi.fn().mockResolvedValue(createdMembership)
  const membershipUpdate = vi.fn().mockResolvedValue(updatedMembership)
  const membershipDelete = vi.fn().mockResolvedValue(deletedMembership)

  const tx = {
    membership: {
      create: membershipCreate,
      update: membershipUpdate,
      delete: membershipDelete,
    },
  } as unknown as TransactionClient

  return {
    createdMembership,
    updatedMembership,
    membershipCreate,
    membershipDelete,
    membershipUpdate,
    tx,
  }
}

describe('membership mutation helpers', () => {
  test('creates memberships with the existing write payload and wrapped response shape', async () => {
    const fixture = createMembershipsMutationsTx()
    const arrivalDate = new Date('2026-11-19T00:00:00.000Z')
    const departureDate = new Date('2026-11-22T00:00:00.000Z')

    const result = await createMembershipRecord({
      tx: fixture.tx,
      input: {
        userId: 4,
        year: 2026,
        arrivalDate,
        departureDate,
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
      },
    })

    expect(fixture.membershipCreate).toHaveBeenCalledWith({
      data: {
        userId: 4,
        year: 2026,
        arrivalDate,
        departureDate,
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
      },
    })
    expect(result).toEqual({ membership: fixture.createdMembership })
  })

  test('updates memberships by id with the existing partial data payload', async () => {
    const fixture = createMembershipsMutationsTx()

    const result = await updateMembershipRecord({
      tx: fixture.tx,
      input: {
        id: 22,
        data: {
          attending: false,
          hotelRoomId: 10,
          message: 'Updated request',
          cost: null,
        },
      },
    })

    expect(fixture.membershipUpdate).toHaveBeenCalledWith({
      where: { id: 22 },
      data: {
        attending: false,
        hotelRoomId: 10,
        message: 'Updated request',
        cost: null,
      },
    })
    expect(result).toEqual({ membership: fixture.updatedMembership })
  })

  test('deletes memberships and returns only the deleted membership id', async () => {
    const fixture = createMembershipsMutationsTx()

    const result = await deleteMembershipRecord({
      tx: fixture.tx,
      input: { id: 23 },
    })

    expect(fixture.membershipDelete).toHaveBeenCalledWith({
      where: { id: 23 },
    })
    expect(result).toEqual({ deletedMembershipId: 23 })
  })
})
