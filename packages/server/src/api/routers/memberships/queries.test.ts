import { describe, expect, test, vi } from 'vitest'

import {
  getAllMembersBy,
  getMembershipByYearAndId,
  getMembershipByYearAndRoom,
  getMembershipsById,
  getMembershipsByYear,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createMembershipsQueriesTx = () => {
  const membershipByYearAndId = [{ id: 11, year: 2026, userId: 4 }]
  const membershipsByYear = [{ id: 12, year: 2026, userId: 5 }]
  const membershipsById = [{ id: 13, year: 2026, userId: 6 }]
  const membershipByYearAndRoom = [{ id: 14, year: 2026, hotelRoomId: 8 }]
  const users = [{ id: 4, fullName: 'Alex Member', membership: [{ id: 15, year: 2026, attending: true }] }]

  const membershipFindMany = vi
    .fn()
    .mockResolvedValueOnce(membershipByYearAndId)
    .mockResolvedValueOnce(membershipsByYear)
    .mockResolvedValueOnce(membershipsById)
    .mockResolvedValueOnce(membershipByYearAndRoom)

  const userFindMany = vi.fn().mockResolvedValue(users)

  const tx = {
    membership: {
      findMany: membershipFindMany,
    },
    user: {
      findMany: userFindMany,
    },
  } as unknown as TransactionClient

  return {
    membershipByYearAndId,
    membershipsByYear,
    membershipsById,
    membershipByYearAndRoom,
    users,
    membershipFindMany,
    userFindMany,
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

    expect(fixture.membershipFindMany).toHaveBeenNthCalledWith(1, {
      where: {
        year: 2026,
        userId: 4,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        hotelRoom: true,
      },
    })
    expect(result).toEqual(fixture.membershipByYearAndId)
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

    expect(fixture.membershipFindMany).toHaveBeenNthCalledWith(2, {
      where: { year: 2026 },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        hotelRoom: true,
      },
    })
    expect(fixture.membershipFindMany).toHaveBeenNthCalledWith(3, {
      where: { id: 13 },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        hotelRoom: true,
      },
    })
    expect(membershipsByYearResult).toEqual(fixture.membershipsByYear)
    expect(membershipsByIdResult).toEqual(fixture.membershipsById)
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

    expect(fixture.membershipFindMany).toHaveBeenNthCalledWith(4, {
      where: {
        year: 2026,
        hotelRoomId: 8,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        hotelRoom: true,
      },
    })
    expect(result).toEqual(fixture.membershipByYearAndRoom)
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
      include: {
        membership: {
          where: {
            attending: true,
            year: 2026,
          },
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    })
    expect(result).toEqual(fixture.users)
  })
})
