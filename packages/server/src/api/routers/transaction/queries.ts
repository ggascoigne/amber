import type {
  GetTransactionsByUserInput,
  GetTransactionsByYearAndMemberInput,
  GetTransactionsByYearAndUserInput,
  GetTransactionsByYearInput,
} from './schemas'

import type { Prisma } from '../../../generated/prisma/client'
import * as transactionSql from '../../../generated/prisma/sql'
import type { TransactionClient } from '../../inRlsTransaction'

export const transactionScalarSelect = {
  id: true,
  userId: true,
  memberId: true,
  year: true,
  timestamp: true,
  amount: true,
  origin: true,
  stripe: true,
  notes: true,
  data: true,
} satisfies Prisma.TransactionsSelect

type TransactionUserResult = Prisma.UserGetPayload<{
  select: {
    id: true
    fullName: true
  }
}>

type TransactionMembershipResult = Prisma.MembershipGetPayload<{
  select: {
    year: true
  }
}>

type TransactionResult = Prisma.TransactionsGetPayload<{
  select: typeof transactionScalarSelect
}> & {
  membership: TransactionMembershipResult | null
  user: TransactionUserResult
  userByOrigin: TransactionUserResult | null
}

type TransactionSqlRow = Omit<transactionSql.getTransactions.Result, 'origin_user_id' | 'membership_year'> & {
  origin_user_id: number | null
  membership_year: number | null
}

const buildTransactions = (rows: Array<TransactionSqlRow>): Array<TransactionResult> =>
  rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    memberId: row.memberId,
    year: row.year,
    timestamp: row.timestamp,
    amount: row.amount,
    origin: row.origin,
    stripe: row.stripe,
    notes: row.notes,
    data: row.data,
    membership:
      row.membership_year === null
        ? null
        : {
            year: row.membership_year,
          },
    user: {
      id: row.user_id,
      fullName: row.user_full_name,
    },
    userByOrigin:
      row.origin_user_id === null
        ? null
        : {
            id: row.origin_user_id,
            fullName: row.origin_user_full_name,
          },
  }))

export const getTransactionById = async ({ tx, id }: { tx: TransactionClient; id: bigint }) =>
  buildTransactions((await tx.$queryRawTyped(transactionSql.getTransactionById(id))) as Array<TransactionSqlRow>)[0] ??
  null

export const getTransactions = async ({ tx }: { tx: TransactionClient }) =>
  buildTransactions((await tx.$queryRawTyped(transactionSql.getTransactions())) as Array<TransactionSqlRow>)

export const getTransactionsByYear = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByYearInput
}) =>
  buildTransactions(
    (await tx.$queryRawTyped(transactionSql.getTransactionsByYear(input.year))) as Array<TransactionSqlRow>,
  )

export const getTransactionsByUser = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByUserInput
}) =>
  buildTransactions(
    (await tx.$queryRawTyped(transactionSql.getTransactionsByUser(input.userId))) as Array<TransactionSqlRow>,
  )

export const getTransactionsByYearAndUser = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByYearAndUserInput
}) =>
  buildTransactions(
    (await tx.$queryRawTyped(
      transactionSql.getTransactionsByYearAndUser(input.year, input.userId),
    )) as Array<TransactionSqlRow>,
  )

export const getTransactionsByYearAndMember = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByYearAndMemberInput
}) =>
  buildTransactions(
    (await tx.$queryRawTyped(
      transactionSql.getTransactionsByYearAndMember(input.year, input.memberId),
    )) as Array<TransactionSqlRow>,
  )
