import type {
  GetTransactionsByUserInput,
  GetTransactionsByYearAndMemberInput,
  GetTransactionsByYearAndUserInput,
  GetTransactionsByYearInput,
} from './schemas'

import type { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

export const transactionInclude = {
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
} satisfies Prisma.TransactionsInclude

const getTransactionsWithWhere = ({ tx, where }: { tx: TransactionClient; where?: Prisma.TransactionsWhereInput }) =>
  tx.transactions.findMany({
    ...(where ? { where } : {}),
    include: transactionInclude,
  })

export const getTransactions = ({ tx }: { tx: TransactionClient }) => getTransactionsWithWhere({ tx })

export const getTransactionsByYear = ({ tx, input }: { tx: TransactionClient; input: GetTransactionsByYearInput }) =>
  getTransactionsWithWhere({
    tx,
    where: { year: input.year },
  })

export const getTransactionsByUser = ({ tx, input }: { tx: TransactionClient; input: GetTransactionsByUserInput }) =>
  getTransactionsWithWhere({
    tx,
    where: { userId: input.userId },
  })

export const getTransactionsByYearAndUser = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByYearAndUserInput
}) =>
  getTransactionsWithWhere({
    tx,
    where: { year: input.year, userId: input.userId },
  })

export const getTransactionsByYearAndMember = ({
  tx,
  input,
}: {
  tx: TransactionClient
  input: GetTransactionsByYearAndMemberInput
}) =>
  getTransactionsWithWhere({
    tx,
    where: { year: input.year, memberId: input.memberId },
  })
