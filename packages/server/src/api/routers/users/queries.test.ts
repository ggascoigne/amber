import { describe, expect, test, vi } from 'vitest'

import {
  getAllUsers,
  getAllUsersAndProfiles,
  getAllUsersAndProfilesWithQuery,
  getAllUsersBy,
  getUser,
  getUserAndProfile,
  getUserByEmail,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createUsersQueriesTx = () => {
  const userByEmail = { id: 1, email: 'alex@example.com', profile: [{ id: 10 }] }
  const userAndProfile = { id: 2, email: 'jordan@example.com', profile: [{ id: 11 }] }
  const user = { id: 3, email: 'sam@example.com' }
  const allUsers = [{ id: 4, lastName: 'Amber' }]
  const allUsersAndProfiles = [{ id: 5, lastName: 'Bravo', profile: [{ id: 12 }] }]
  const pagedUsers = [{ id: 6, lastName: 'Clark', profile: [{ id: 13 }] }]
  const searchedUsers = [{ id: 7, fullName: 'Alex Member', membership: [{ id: 14, year: 2026 }] }]
  const rowCount = 27

  const userFindUnique = vi
    .fn()
    .mockResolvedValueOnce(userByEmail)
    .mockResolvedValueOnce(userAndProfile)
    .mockResolvedValueOnce(user)
  const userFindMany = vi
    .fn()
    .mockResolvedValueOnce(allUsers)
    .mockResolvedValueOnce(allUsersAndProfiles)
    .mockResolvedValueOnce(pagedUsers)
    .mockResolvedValueOnce(searchedUsers)
  const userCount = vi.fn().mockResolvedValue(rowCount)

  const tx = {
    user: {
      findUnique: userFindUnique,
      findMany: userFindMany,
      count: userCount,
    },
  } as unknown as TransactionClient

  return {
    allUsers,
    allUsersAndProfiles,
    pagedUsers,
    rowCount,
    searchedUsers,
    tx,
    user,
    userAndProfile,
    userByEmail,
    userCount,
    userFindMany,
    userFindUnique,
  }
}

describe('user query helpers', () => {
  test('loads email and id lookups with the preserved profile include shape', async () => {
    const fixture = createUsersQueriesTx()

    const userByEmailResult = await getUserByEmail({
      tx: fixture.tx,
      input: { email: 'alex@example.com' },
    })
    const userAndProfileResult = await getUserAndProfile({
      tx: fixture.tx,
      input: { id: 2 },
    })
    const userResult = await getUser({
      tx: fixture.tx,
      input: { id: 3 },
    })

    expect(fixture.userFindUnique).toHaveBeenNthCalledWith(1, {
      where: { email: 'alex@example.com' },
      include: { profile: true },
    })
    expect(fixture.userFindUnique).toHaveBeenNthCalledWith(2, {
      where: { id: 2 },
      include: { profile: true },
    })
    expect(fixture.userFindUnique).toHaveBeenNthCalledWith(3, {
      where: { id: 3 },
    })
    expect(userByEmailResult).toEqual(fixture.userByEmail)
    expect(userAndProfileResult).toEqual(fixture.userAndProfile)
    expect(userResult).toEqual(fixture.user)
  })

  test('loads ordered user lists with and without profiles using the preserved last-name sort', async () => {
    const fixture = createUsersQueriesTx()

    const allUsersResult = await getAllUsers({ tx: fixture.tx })
    const allUsersAndProfilesResult = await getAllUsersAndProfiles({ tx: fixture.tx })

    expect(fixture.userFindMany).toHaveBeenNthCalledWith(1, {
      orderBy: { lastName: 'asc' },
    })
    expect(fixture.userFindMany).toHaveBeenNthCalledWith(2, {
      orderBy: { lastName: 'asc' },
      include: { profile: true },
    })
    expect(allUsersResult).toEqual(fixture.allUsers)
    expect(allUsersAndProfilesResult).toEqual(fixture.allUsersAndProfiles)
  })

  test('loads paged user/profile lists with the existing filter, sort, and count contract', async () => {
    const fixture = createUsersQueriesTx()

    await getAllUsers({ tx: fixture.tx })
    await getAllUsersAndProfiles({ tx: fixture.tx })

    const result = await getAllUsersAndProfilesWithQuery({
      tx: fixture.tx,
      input: {
        sort: [{ desc: true, id: 'email' }],
        columnFilters: [{ id: 'balance', value: '10' }],
        globalFilter: ' amber ',
        pagination: {
          pageIndex: 2,
          pageSize: 5,
        },
      },
    })

    expect(fixture.userCount).toHaveBeenCalledWith({
      where: {
        AND: [{ balance: 10 }],
        OR: [
          {
            fullName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            displayName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            profile: {
              some: {
                OR: [
                  {
                    phoneNumber: {
                      contains: 'amber',
                      mode: 'insensitive',
                    },
                  },
                  {
                    snailMailAddress: {
                      contains: 'amber',
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    })
    expect(fixture.userFindMany).toHaveBeenNthCalledWith(3, {
      include: { profile: true },
      orderBy: [{ email: 'desc' }],
      where: {
        AND: [{ balance: 10 }],
        OR: [
          {
            fullName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            displayName: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: 'amber',
              mode: 'insensitive',
            },
          },
          {
            profile: {
              some: {
                OR: [
                  {
                    phoneNumber: {
                      contains: 'amber',
                      mode: 'insensitive',
                    },
                  },
                  {
                    snailMailAddress: {
                      contains: 'amber',
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      skip: 10,
      take: 5,
    })
    expect(result).toEqual({
      data: fixture.pagedUsers,
      rowCount: fixture.rowCount,
    })
  })

  test('loads name-filtered users with the existing attending-membership summary include', async () => {
    const fixture = createUsersQueriesTx()

    await getAllUsers({ tx: fixture.tx })
    await getAllUsersAndProfiles({ tx: fixture.tx })
    await getAllUsersAndProfilesWithQuery({ tx: fixture.tx })

    const result = await getAllUsersBy({
      tx: fixture.tx,
      input: { query: 'Alex' },
    })

    expect(fixture.userFindMany).toHaveBeenNthCalledWith(4, {
      where: {
        fullName: {
          contains: 'Alex',
          mode: 'insensitive',
        },
      },
      orderBy: { lastName: 'asc' },
      include: {
        membership: {
          where: { attending: true },
          select: {
            id: true,
            year: true,
          },
        },
      },
    })
    expect(result).toEqual(fixture.searchedUsers)
  })
})
