import { describe, expect, test, vi } from 'vitest'

import {
  getTransactions,
  getTransactionsByUser,
  getTransactionsByYear,
  getTransactionsByYearAndMember,
  getTransactionsByYearAndUser,
} from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const expectedTransactionInclude = {
  user: {
    select: {
      fullName: true,
    },
  },
  userByOrigin: {
    select: {
      fullName: true,
    },
  },
  membership: {
    select: {
      year: true,
    },
  },
}

const createTransactionQueriesTx = () => {
  const transactions = [
    {
      id: 17n,
      year: 2026,
      amount: 45,
      userId: 9,
    },
  ]

  const transactionsFindMany = vi.fn().mockResolvedValue(transactions)

  const tx = {
    transactions: {
      findMany: transactionsFindMany,
    },
  } as unknown as TransactionClient

  return {
    transactions,
    transactionsFindMany,
    tx,
  }
}

describe('transaction query helpers', () => {
  test('loads all transactions with the existing related-user and membership include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactions({ tx: fixture.tx })

    expect(fixture.transactionsFindMany).toHaveBeenCalledWith({
      include: expectedTransactionInclude,
    })
    expect(result).toEqual(fixture.transactions)
  })

  test('loads year-scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYear({
      tx: fixture.tx,
      input: { year: 2026 },
    })

    expect(fixture.transactionsFindMany).toHaveBeenCalledWith({
      where: { year: 2026 },
      include: expectedTransactionInclude,
    })
    expect(result).toEqual(fixture.transactions)
  })

  test('loads user-scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByUser({
      tx: fixture.tx,
      input: { userId: 9 },
    })

    expect(fixture.transactionsFindMany).toHaveBeenCalledWith({
      where: { userId: 9 },
      include: expectedTransactionInclude,
    })
    expect(result).toEqual(fixture.transactions)
  })

  test('loads year-and-user scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYearAndUser({
      tx: fixture.tx,
      input: { year: 2026, userId: 9 },
    })

    expect(fixture.transactionsFindMany).toHaveBeenCalledWith({
      where: { year: 2026, userId: 9 },
      include: expectedTransactionInclude,
    })
    expect(result).toEqual(fixture.transactions)
  })

  test('loads year-and-member scoped transactions with the preserved include shape', async () => {
    const fixture = createTransactionQueriesTx()

    const result = await getTransactionsByYearAndMember({
      tx: fixture.tx,
      input: { year: 2026, memberId: 14 },
    })

    expect(fixture.transactionsFindMany).toHaveBeenCalledWith({
      where: { year: 2026, memberId: 14 },
      include: expectedTransactionInclude,
    })
    expect(result).toEqual(fixture.transactions)
  })
})
