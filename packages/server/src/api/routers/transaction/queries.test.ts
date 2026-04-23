import { describe, expect, test, vi } from 'vitest'

import {
  getTransactions,
  getTransactionsByUser,
  getTransactionsByYear,
  getTransactionsByYearAndMember,
  getTransactionsByYearAndUser,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const createTransactionSqlRow = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 17n,
  userId: 9,
  memberId: 14,
  year: 2026,
  timestamp: new Date('2026-01-01T10:00:00.000Z'),
  amount: 45,
  origin: 3,
  stripe: true,
  notes: 'badge purchase',
  data: { source: 'import' },
  user_id: 9,
  user_full_name: 'Alex Member',
  origin_user_id: 3,
  origin_user_full_name: 'Pat Admin',
  membership_year: 2026,
  ...overrides,
})

const createTransactionQueriesTx = () => {
  const transactions = [createTransactionSqlRow()]
  const queryRawTyped = vi.fn().mockResolvedValue(transactions)

  const tx = {
    $queryRawTyped: queryRawTyped,
  } as unknown as TransactionClient

  return {
    transactions,
    queryRawTyped,
    tx,
  }
}

const expectedTransactions = [
  {
    id: 17n,
    userId: 9,
    memberId: 14,
    year: 2026,
    timestamp: new Date('2026-01-01T10:00:00.000Z'),
    amount: 45,
    origin: 3,
    stripe: true,
    notes: 'badge purchase',
    data: { source: 'import' },
    membership: {
      year: 2026,
    },
    user: {
      id: 9,
      fullName: 'Alex Member',
    },
    userByOrigin: {
      id: 3,
      fullName: 'Pat Admin',
    },
  },
]

describe('transaction query helpers', () => {
  test('loads all transactions with the existing related-user and membership include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactions({ tx: fixture.tx })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTransactions)
  })

  test('loads year-scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTransactions)
  })

  test('loads user-scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByUser({
      tx: fixture.tx,
      input: { userId: 9 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTransactions)
  })

  test('loads year-and-user scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYearAndUser({
      tx: fixture.tx,
      input: { year: 2026, userId: 9 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTransactions)
  })

  test('loads year-and-member scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYearAndMember({
      tx: fixture.tx,
      input: { year: 2026, memberId: 14 },
    })

    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expectedTransactions)
  })
})
