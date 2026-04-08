import { describe, expect, test, vi } from 'vitest'

import { createTransactionRecord, deleteTransactionRecord, updateTransactionRecord } from './mutations'

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

  const tx = {
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
      include: expectedTransactionInclude,
    })
    expect(result).toEqual({
      transaction: {
        id: 17n,
        year: 2026,
        amount: 45,
        userId: 9,
      },
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
      include: expectedTransactionInclude,
    })
    expect(result).toEqual({
      transaction: {
        id: 19n,
        year: 2026,
        amount: 55,
        userId: 10,
      },
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
