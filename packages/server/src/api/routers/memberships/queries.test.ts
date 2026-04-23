import { describe, expect, test, vi } from 'vitest'

import {
  getAllMembersBy,
  getMembershipByYearAndId,
  getMembershipByYearAndRoom,
  getMembershipsById,
  getMembershipsByYear,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createMembershipJoinRow = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 11,
  arrivalDate: new Date('2026-03-01T00:00:00.000Z'),
  attendance: 'full',
  attending: true,
  departureDate: new Date('2026-03-04T00:00:00.000Z'),
  hotelRoomId: 8,
  interestLevel: 'high',
  message: 'Looking forward to the con',
  roomPreferenceAndNotes: 'Near elevators',
  roomingPreferences: 'quiet',
  roomingWith: 'Morgan',
  userId: 4,
  volunteer: false,
  year: 2026,
  offerSubsidy: false,
  requestOldPrice: false,
  slotsAttending: 4,
  cost: 180,
  hotel_room_id: 8,
  hotel_room_description: 'Ballroom Suite',
  hotel_room_gaming_room: true,
  hotel_room_occupancy: 4,
  hotel_room_quantity: 2,
  hotel_room_rate: 120,
  hotel_room_bathroom_type: 'private',
  hotel_room_type: 'suite',
  user_id: 4,
  user_email: 'alex@example.com',
  user_full_name: 'Alex Member',
  user_first_name: 'Alex',
  user_last_name: 'Member',
  user_display_name: 'Alex',
  user_balance: 25,
  profile_id: 31,
  profile_user_id: 4,
  profile_snail_mail_address: '123 Test Ave',
  profile_phone_number: '555-0100',
  profile_room_accessibility_preference: 'accessible',
  ...overrides,
})

const createMembershipsQueriesTx = () => {
  const membershipByYearAndIdRows = [createMembershipJoinRow()]
  const membershipsByYearRows = [createMembershipJoinRow({ id: 12, userId: 5, user_id: 5, profile_id: null })]
  const membershipsByIdRows = [createMembershipJoinRow({ id: 13, userId: 6, user_id: 6, profile_id: null })]
  const membershipByYearAndRoomRows = [
    createMembershipJoinRow({ id: 14, hotelRoomId: 9, hotel_room_id: 9, userId: 7, user_id: 7, profile_id: null }),
  ]

  const queryRawTyped = vi
    .fn()
    .mockResolvedValueOnce(membershipByYearAndIdRows)
    .mockResolvedValueOnce(membershipsByYearRows)
    .mockResolvedValueOnce(membershipsByIdRows)
    .mockResolvedValueOnce(membershipByYearAndRoomRows)

  const users = [
    {
      id: 4,
      email: 'alex@example.com',
      fullName: 'Alex Member',
      firstName: 'Alex',
      lastName: 'Member',
      displayName: 'Alex',
      balance: 25,
    },
  ]
  const profiles = [
    {
      id: 31,
      userId: 4,
      snailMailAddress: '123 Test Ave',
      phoneNumber: '555-0100',
      roomAccessibilityPreference: 'accessible',
    },
  ]
  const memberships = [
    {
      id: 15,
      arrivalDate: new Date('2026-03-01T00:00:00.000Z'),
      attendance: 'full',
      attending: true,
      departureDate: new Date('2026-03-04T00:00:00.000Z'),
      hotelRoomId: 8,
      interestLevel: 'high',
      message: 'Looking forward to the con',
      roomPreferenceAndNotes: 'Near elevators',
      roomingPreferences: 'quiet',
      roomingWith: 'Morgan',
      userId: 4,
      volunteer: false,
      year: 2026,
      offerSubsidy: false,
      requestOldPrice: false,
      slotsAttending: 4,
      cost: 180,
    },
  ]

  const membershipFindMany = vi.fn().mockResolvedValue(memberships)
  const userFindMany = vi.fn().mockResolvedValue(users)
  const profileFindMany = vi.fn().mockResolvedValue(profiles)

  const tx = {
    $queryRawTyped: queryRawTyped,
    membership: {
      findMany: membershipFindMany,
    },
    profile: {
      findMany: profileFindMany,
    },
    user: {
      findMany: userFindMany,
    },
  } as unknown as TransactionClient

  return {
    membershipByYearAndIdRows,
    membershipsByYearRows,
    membershipsByIdRows,
    membershipByYearAndRoomRows,
    users,
    profiles,
    memberships,
    membershipFindMany,
    userFindMany,
    profileFindMany,
    queryRawTyped,
    tx,
  }
}

describe('membership query helpers', () => {
  test('loads a user membership by year with the preserved user-profile and hotel-room include shape', async () => {
    const fixture = createMembershipsQueriesTx()

    const result = await getMembershipByYearAndId({
      tx: fixture.tx,
      input: { year: 2026, userId: 4 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      {
        id: 11,
        arrivalDate: new Date('2026-03-01T00:00:00.000Z'),
        attendance: 'full',
        attending: true,
        departureDate: new Date('2026-03-04T00:00:00.000Z'),
        hotelRoomId: 8,
        interestLevel: 'high',
        message: 'Looking forward to the con',
        roomPreferenceAndNotes: 'Near elevators',
        roomingPreferences: 'quiet',
        roomingWith: 'Morgan',
        userId: 4,
        volunteer: false,
        year: 2026,
        offerSubsidy: false,
        requestOldPrice: false,
        slotsAttending: 4,
        cost: 180,
        hotelRoom: {
          id: 8,
          description: 'Ballroom Suite',
          gamingRoom: true,
          occupancy: 4,
          quantity: 2,
          rate: 120,
          bathroomType: 'private',
          type: 'suite',
        },
        user: {
          id: 4,
          email: 'alex@example.com',
          fullName: 'Alex Member',
          firstName: 'Alex',
          lastName: 'Member',
          displayName: 'Alex',
          balance: 25,
          profile: [
            {
              id: 31,
              userId: 4,
              snailMailAddress: '123 Test Ave',
              phoneNumber: '555-0100',
              roomAccessibilityPreference: 'accessible',
            },
          ],
        },
      },
    ])
  })

  test('loads year-wide and id-specific membership lists with the existing room include', async () => {
    const fixture = createMembershipsQueriesTx()

    await getMembershipByYearAndId({
      tx: fixture.tx,
      input: { year: 2026, userId: 4 },
    })

    const membershipsByYearResult = await getMembershipsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })
    const membershipsByIdResult = await getMembershipsById({
      tx: fixture.tx,
      input: { id: 13 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(3)
    expect(membershipsByYearResult).toMatchObject([{ id: 12, year: 2026, userId: 5 }])
    expect(membershipsByIdResult).toMatchObject([{ id: 13, year: 2026, userId: 6 }])
  })

  test('loads room memberships by year with the existing year-plus-room filter', async () => {
    const fixture = createMembershipsQueriesTx()

    await getMembershipByYearAndId({
      tx: fixture.tx,
      input: { year: 2026, userId: 4 },
    })
    await getMembershipsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })
    await getMembershipsById({
      tx: fixture.tx,
      input: { id: 13 },
    })

    const result = await getMembershipByYearAndRoom({
      tx: fixture.tx,
      input: { year: 2026, hotelRoomId: 8 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(4)
    expect(result).toMatchObject([{ id: 14, hotelRoomId: 9, year: 2026, userId: 7 }])
  })

  test('loads members by name query with the existing attending-membership include shape', async () => {
    const fixture = createMembershipsQueriesTx()

    const result = await getAllMembersBy({
      tx: fixture.tx,
      input: { year: 2026, query: 'Alex' },
    })

    expect(fixture.userFindMany).toHaveBeenCalledWith({
      where: {
        fullName: {
          contains: 'Alex',
          mode: 'insensitive',
        },
      },
      orderBy: { lastName: 'asc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        displayName: true,
        balance: true,
      },
    })
    expect(fixture.profileFindMany).toHaveBeenCalledWith({
      where: {
        userId: {
          in: [4],
        },
      },
    })
    expect(fixture.membershipFindMany).toHaveBeenCalledWith({
      where: {
        attending: true,
        year: 2026,
        userId: {
          in: [4],
        },
      },
      select: {
        id: true,
        arrivalDate: true,
        attendance: true,
        attending: true,
        departureDate: true,
        hotelRoomId: true,
        interestLevel: true,
        message: true,
        roomPreferenceAndNotes: true,
        roomingPreferences: true,
        roomingWith: true,
        userId: true,
        volunteer: true,
        year: true,
        offerSubsidy: true,
        requestOldPrice: true,
        slotsAttending: true,
        cost: true,
      },
    })
    expect(result).toEqual([
      {
        ...fixture.users[0],
        profile: fixture.profiles,
        membership: [
          {
            ...fixture.memberships[0],
            user: {
              ...fixture.users[0],
              profile: fixture.profiles,
            },
          },
        ],
      },
    ])
  })
})
