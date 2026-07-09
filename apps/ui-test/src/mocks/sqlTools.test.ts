import { beforeEach, describe, expect, test } from 'vitest'

import { createTableFor, fetchArrayData, fetchSingleItem, updateSingleItem, type TableRow } from './sqlTools'

type TestUser = TableRow & {
  firstName: string
  lastName: string
  fullName: string
  email: string
  subscriptionTier: 'free' | 'basic' | 'pro' | 'enterprise'
  active: boolean
}

const tableName = 'test-users'

const setupTestUsers = () =>
  createTableFor<TestUser>({
    tableName,
    data: [
      {
        firstName: 'Anna',
        lastName: 'Zephyr',
        fullName: 'Anna Zephyr',
        email: 'anna@example.com',
        subscriptionTier: 'pro',
        active: true,
      },
      {
        firstName: 'Ben',
        lastName: 'Yellow',
        fullName: 'Ben Yellow',
        email: 'ben@example.com',
        subscriptionTier: 'basic',
        active: false,
      },
      {
        firstName: 'Annette',
        lastName: 'Able',
        fullName: 'Annette Able',
        email: 'annette@example.com',
        subscriptionTier: 'enterprise',
        active: true,
      },
      {
        firstName: 'Chris',
        lastName: 'Able',
        fullName: 'Chris Able',
        email: 'chris@example.com',
        subscriptionTier: 'free',
        active: false,
      },
    ],
  })

describe('in-memory mock table tools', () => {
  beforeEach(() => {
    setupTestUsers()
  })

  test('assigns serial ids for JSON rows', async () => {
    const data = await fetchArrayData<TestUser>(tableName)

    expect(data.rowCount).toBe(4)
    expect(data.rows.map((row) => row.id)).toEqual([1, 2, 3, 4])
  })

  test('filters, sorts, and paginates table data', async () => {
    const data = await fetchArrayData<TestUser>(
      {
        tableName,
        globalFilterFields: ['firstName', 'lastName'],
      },
      {
        pageIndex: 0,
        pageSize: 1,
        sorting: [{ id: 'lastName', desc: false }],
        globalFilter: 'ann',
        filters: [
          {
            id: 'subscriptionTier',
            value: ['pro', 'enterprise'],
          },
        ],
      },
    )

    expect(data.rowCount).toBe(2)
    expect(data.rows).toEqual([
      expect.objectContaining({
        id: 3,
        fullName: 'Annette Able',
      }),
    ])
  })

  test('preserves source order for normal ties and handles punctuation-bearing name ties', async () => {
    createTableFor<TestUser>({
      tableName: 'punctuation-users',
      data: [
        {
          firstName: 'Angel',
          lastName: "O'Connell",
          fullName: "Angel O'Connell",
          email: 'angel.oconnell@example.com',
          subscriptionTier: 'free',
          active: true,
        },
        {
          firstName: 'Angel',
          lastName: 'Mraz',
          fullName: 'Angel Mraz',
          email: 'angel.mraz@example.com',
          subscriptionTier: 'free',
          active: true,
        },
        {
          firstName: 'Ana',
          lastName: 'Langworth',
          fullName: 'Ana Langworth',
          email: 'ana.langworth@example.com',
          subscriptionTier: 'free',
          active: true,
        },
        {
          firstName: 'Ana',
          lastName: 'Lang',
          fullName: 'Ana Lang',
          email: 'ana.lang@example.com',
          subscriptionTier: 'free',
          active: true,
        },
      ],
    })

    const data = await fetchArrayData<TestUser>(
      {
        tableName: 'punctuation-users',
      },
      {
        pageIndex: 0,
        pageSize: 4,
        sorting: [{ id: 'firstName', desc: false }],
        globalFilter: '',
        filters: [],
      },
    )

    expect(data.rows.map((row) => row.fullName)).toEqual(['Ana Langworth', 'Ana Lang', 'Angel Mraz', "Angel O'Connell"])
  })

  test('updates rows in memory while preserving the route id', async () => {
    const updated = await updateSingleItem<TestUser>(tableName, 2, {
      id: 99,
      fullName: 'Ben Updated',
      subscriptionTier: 'enterprise',
    })
    const item = await fetchSingleItem<TestUser>(tableName, 2)

    expect(updated).toEqual(item)
    expect(item).toEqual(
      expect.objectContaining({
        id: 2,
        fullName: 'Ben Updated',
        subscriptionTier: 'enterprise',
      }),
    )
  })
})
