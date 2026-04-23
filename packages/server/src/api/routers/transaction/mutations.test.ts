import { describe, expect, test, vi } from 'vitest'

import { createTransactionRecord, deleteTransactionRecord, updateTransactionRecord } from './mutations'
import { transactionScalarSelect } from './queries'

import type { TransactionClient } from '../../inRlsTransaction'

const transactionSqlResult = {
  id: 19n,
  userId: 10,
  memberId: 14,
  year: 2026,
  timestamp: new Date('2026-01-01T10:00:00.000Z'),
  amount: 55,
  origin: 3,
  stripe: true,
  notes: 'manual adjustment',
  data: { source: 'import' },
  membership: {
    year: 2026,
  },
  user: {
    id: 10,
    fullName: 'Alex Member',
  },
  userByOrigin: {
    id: 3,
    fullName: 'Pat Admin',
  },
}

const createTransactionMutationsTx = () => {
  const transactionCreate = vi.fn().mockResolvedValue({
    id: 17n,
    year: 2026,
    amount: 45,
    userId: 9,
  })
  const transactionDelete = vi.fn().mockResolvedValue({ id: 18n })
  const transactionUpdate = vi.fn().mockResolvedValue({
    id: 19n,
    year: 2026,
    amount: 55,
    userId: 10,
  })
  const queryRawTyped = vi.fn().mockResolvedValue([
    {
      id: 19n,
      userId: 10,
      memberId: 14,
      year: 2026,
      timestamp: new Date('2026-01-01T10:00:00.000Z'),
      amount: 55,
      origin: 3,
      stripe: true,
      notes: 'manual adjustment',
      data: { source: 'import' },
      user_id: 10,
      user_full_name: 'Alex Member',
      origin_user_id: 3,
      origin_user_full_name: 'Pat Admin',
      membership_year: 2026,
    },
  ])

  const tx = {
    $queryRawTyped: queryRawTyped,
    transactions: {
      create: transactionCreate,
      delete: transactionDelete,
      update: transactionUpdate,
    },
  } as unknown as TransactionClient

  return {
    transactionCreate,
    transactionDelete,
    transactionUpdate,
    queryRawTyped,
    tx,
  }
}

describe('transaction mutation helpers', () => {
  test('creates transactions with the existing include-backed response shape', async () => {
    const fixture = createTransactionMutationsTx()

    const result = await createTransactionRecord({
      tx: fixture.tx,
      input: {
        userId: 9,
        memberId: 14,
        amount: 45,
        origin: 3,
        stripe: true,
        timestamp: new Date('2026-01-01T10:00:00.000Z'),
        year: 2026,
        notes: 'badge purchase',
        data: { source: 'import' },
      },
    })

    expect(fixture.transactionCreate).toHaveBeenCalledWith({
      data: {
        userId: 9,
        memberId: 14,
        amount: 45,
        origin: 3,
        stripe: true,
        timestamp: new Date('2026-01-01T10:00:00.000Z'),
        year: 2026,
        notes: 'badge purchase',
        data: { source: 'import' },
      },
      select: transactionScalarSelect,
    })
    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      transaction: transactionSqlResult,
    })
  })

  test('updates transactions by id with the existing partial payload and include shape', async () => {
    const fixture = createTransactionMutationsTx()

    const result = await updateTransactionRecord({
      tx: fixture.tx,
      input: {
        id: 19n,
        data: {
          amount: 55,
          notes: 'manual adjustment',
        },
      },
    })

    expect(fixture.transactionUpdate).toHaveBeenCalledWith({
      where: { id: 19n },
      data: {
        amount: 55,
        notes: 'manual adjustment',
      },
      select: transactionScalarSelect,
    })
    expect(fixture.queryRawTyped).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      transaction: transactionSqlResult,
    })
  })

  test('deletes transactions and preserves the legacy clientMutationId response field', async () => {
    const fixture = createTransactionMutationsTx()

    const result = await deleteTransactionRecord({
      tx: fixture.tx,
      input: { id: 18n },
    })

    expect(fixture.transactionDelete).toHaveBeenCalledWith({
      where: { id: 18n },
    })
    expect(result).toEqual({
      clientMutationId: null,
      deletedTransactionId: 18n,
    })
  })
})
