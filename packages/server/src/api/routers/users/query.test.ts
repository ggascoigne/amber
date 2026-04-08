import { describe, expect, test } from 'vitest'

import { buildColumnFilter, buildUserOrderBy, buildUserWhere, normaliseFilterValue } from './query'

describe('user query helpers', () => {
  test('normalises supported global filter values', () => {
    expect(normaliseFilterValue('  amber  ')).toBe('amber')
    expect(normaliseFilterValue(42)).toBe('42')
    expect(normaliseFilterValue(false)).toBe('false')
    expect(normaliseFilterValue('   ')).toBeUndefined()
    expect(normaliseFilterValue(undefined)).toBeUndefined()
  })

  test('buildUserOrderBy keeps supported sorts and falls back to defaults', () => {
    expect(buildUserOrderBy()).toEqual([{ lastName: 'asc' }, { firstName: 'asc' }])

    expect(buildUserOrderBy([{ id: 'profile.phoneNumber' }])).toEqual([{ lastName: 'asc' }, { firstName: 'asc' }])

    expect(
      buildUserOrderBy([{ id: 'lastName' }, { desc: true, id: 'balance' }, { id: 'profile.phoneNumber' }]),
    ).toEqual([{ lastName: 'asc' }, { balance: 'desc' }])
  })

  test('buildColumnFilter handles numeric, string, and profile filters', () => {
    expect(buildColumnFilter({ id: 'balance', value: '10' })).toEqual({ balance: 10 })

    expect(buildColumnFilter({ id: 'email', value: '  person@example.com  ' })).toEqual({
      email: {
        contains: 'person@example.com',
        mode: 'insensitive',
      },
    })

    expect(buildColumnFilter({ id: 'phoneNumber', value: '555-0100' })).toEqual({
      profile: {
        some: {
          phoneNumber: {
            contains: '555-0100',
            mode: 'insensitive',
          },
        },
      },
    })

    expect(buildColumnFilter({ id: 'balance', value: 'not-a-number' })).toBeNull()
    expect(buildColumnFilter({ id: 'unknown', value: 'value' })).toBeNull()
  })

  test('buildUserWhere combines column filters with global search', () => {
    expect(
      buildUserWhere({
        columnFilters: [
          { id: 'displayName', value: '  Eric  ' },
          { id: 'snailMailAddress', value: 'Main Street' },
        ],
        globalFilter: ' amber ',
      }),
    ).toEqual({
      AND: [
        {
          displayName: {
            contains: 'Eric',
            mode: 'insensitive',
          },
        },
        {
          profile: {
            some: {
              snailMailAddress: {
                contains: 'Main Street',
                mode: 'insensitive',
              },
            },
          },
        },
      ],
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
    })

    expect(buildUserWhere({ globalFilter: '   ' })).toBeUndefined()
  })
})
