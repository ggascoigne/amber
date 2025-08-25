import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const transactionFields = {
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

export const transactionRouter = createTRPCRouter({
  getTransactions: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.transactions.findMany({
        include: transactionFields,
      }),
    ),
  ),

  getTransactionsByYear: publicProcedure.input(z.object({ year: z.number() })).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.transactions.findMany({
        where: { year: input.year },
        include: transactionFields,
      }),
    ),
  ),

  getTransactionsByUser: publicProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.transactions.findMany({
        where: { userId: input.userId },
        include: transactionFields,
      }),
    ),
  ),

  getTransactionsByYearAndUser: publicProcedure
    .input(z.object({ year: z.number(), userId: z.number() }))
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.transactions.findMany({
          where: { year: input.year, userId: input.userId },
          include: transactionFields,
        }),
      ),
    ),

  getTransactionsByYearAndMember: publicProcedure
    .input(z.object({ year: z.number(), memberId: z.number() }))
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.transactions.findMany({
          where: { year: input.year, memberId: input.memberId },
          include: transactionFields,
        }),
      ),
    ),

  createTransaction: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        memberId: z.number().optional(),
        amount: z.number(),
        origin: z.number(),
        stripe: z.boolean().optional(),
        timestamp: z.date().optional(),
        year: z.number(),
        notes: z.string().optional(),
        data: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const transaction = await tx.transactions.create({
          // zod v3 treats any is optional, which isn't what I want here
          data: input as any,
          include: transactionFields,
        })
        return { transaction }
      }),
    ),

  deleteTransaction: protectedProcedure.input(z.object({ id: z.bigint() })).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const deleted = await tx.transactions.delete({
        where: { id: input.id },
      })
      return {
        clientMutationId: null,
        deletedTransactionId: deleted.id,
      }
    }),
  ),

  updateTransaction: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
        data: z.object({
          userId: z.number().optional(),
          memberId: z.number().optional(),
          amount: z.number().optional(),
          origin: z.number().optional(),
          stripe: z.boolean().optional(),
          timestamp: z.date().optional(),
          year: z.number().optional(),
          notes: z.string().optional(),
          data: z.any(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const transaction = await tx.transactions.update({
          where: { id: input.id },
          data: input.data,
          include: transactionFields,
        })
        return { transaction }
      }),
    ),
})
