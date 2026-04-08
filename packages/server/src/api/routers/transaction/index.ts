import { createTransactionRecord, deleteTransactionRecord, updateTransactionRecord } from './mutations'
import {
  getTransactions as getTransactionsQuery,
  getTransactionsByUser as getTransactionsByUserQuery,
  getTransactionsByYear as getTransactionsByYearQuery,
  getTransactionsByYearAndMember as getTransactionsByYearAndMemberQuery,
  getTransactionsByYearAndUser as getTransactionsByYearAndUserQuery,
} from './queries'
import {
  createTransactionInput,
  deleteTransactionInput,
  getTransactionsByUserInput,
  getTransactionsByYearAndMemberInput,
  getTransactionsByYearAndUserInput,
  getTransactionsByYearInput,
  updateTransactionInput,
} from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const transactionRouter = createTRPCRouter({
  getTransactions: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) => getTransactionsQuery({ tx })),
  ),

  getTransactionsByYear: publicProcedure
    .input(getTransactionsByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getTransactionsByYearQuery({ tx, input }))),

  getTransactionsByUser: publicProcedure
    .input(getTransactionsByUserInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getTransactionsByUserQuery({ tx, input }))),

  getTransactionsByYearAndUser: publicProcedure
    .input(getTransactionsByYearAndUserInput)
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => getTransactionsByYearAndUserQuery({ tx, input })),
    ),

  getTransactionsByYearAndMember: publicProcedure
    .input(getTransactionsByYearAndMemberInput)
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => getTransactionsByYearAndMemberQuery({ tx, input })),
    ),

  createTransaction: protectedProcedure
    .input(createTransactionInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createTransactionRecord({ tx, input }))),

  deleteTransaction: protectedProcedure
    .input(deleteTransactionInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteTransactionRecord({ tx, input }))),

  updateTransaction: protectedProcedure
    .input(updateTransactionInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateTransactionRecord({ tx, input }))),
})
