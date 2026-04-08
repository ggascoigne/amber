import { describe, expect, test } from 'vitest'

import { getAllUsersAndProfilesWithQueryInput, updateUserInput } from './schemas'

describe('user schemas', () => {
  test('preserves nullable global filters and mixed filter value types for table queries', () => {
    const result = getAllUsersAndProfilesWithQueryInput.parse({
      sort: [{ id: 'email' }, { id: 'balance', desc: true }],
      columnFilters: [
        { id: 'balance', value: 0 },
        { id: 'displayName', value: false },
      ],
      globalFilter: null,
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    })

    expect(result).toEqual({
      sort: [{ id: 'email' }, { id: 'balance', desc: true }],
      columnFilters: [
        { id: 'balance', value: 0 },
        { id: 'displayName', value: false },
      ],
      globalFilter: null,
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    })
  })

  test('preserves optional user update fields inside the nested data payload', () => {
    const result = updateUserInput.parse({
      id: 12,
      data: {
        email: 'updated@example.com',
        displayName: 'Updated User',
      },
    })

    expect(result).toEqual({
      id: 12,
      data: {
        email: 'updated@example.com',
        displayName: 'Updated User',
      },
    })
  })
})
