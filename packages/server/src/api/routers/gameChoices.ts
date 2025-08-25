import { z } from 'zod'

import { dbAdmin } from '../../db'
import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const gameSubmissionFields = {
  id: true,
  memberId: true,
  message: true,
  year: true,
}

const gameChoiceFields = {
  id: true,
  memberId: true,
  gameId: true,
  rank: true,
  returningPlayer: true,
  slotId: true,
  year: true,
}

export const gameChoicesRouter = createTRPCRouter({
  // add createGameChoices - have it call the typed query
  getGameChoices: publicProcedure
    .input(z.object({ year: z.number(), memberId: z.number() }))
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameSubmissions = await tx.gameSubmission.findMany({
          where: { memberId: input.memberId, year: input.year },
          select: gameSubmissionFields,
        })
        const gameChoices = await tx.gameChoice.findMany({
          where: { memberId: input.memberId, year: input.year },
          select: gameChoiceFields,
        })
        return { gameSubmissions, gameChoices }
      }),
    ),

  readGameChoice: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.gameChoice.findUnique({
        where: { id: input.id },
        select: gameChoiceFields,
      }),
    ),
  ),

  // TODO: rename this to createInitialGameChoices
  createGameChoices: protectedProcedure
    .input(
      z.object({
        memberId: z.number(),
        year: z.number(),
        noSlots: z.number(),
      }),
    )
    // TODO: does this really need to be run as dbAdmin?
    .mutation(
      async ({ input }) =>
        dbAdmin.$executeRaw`SELECT * FROM create_bare_slot_choices (${input.memberId}::int, ${input.year}::int, ${input.noSlots}::int)`,
    ),

  createGameSubmission: protectedProcedure
    .input(
      z.object({
        memberId: z.number(),
        message: z.string(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameSubmission = await tx.gameSubmission.create({
          data: input,
          select: gameSubmissionFields,
        })
        return { gameSubmission }
      }),
    ),

  updateGameSubmission: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          memberId: z.number().optional(),
          message: z.string().optional(),
          year: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameSubmission = await tx.gameSubmission.update({
          where: { id: input.id },
          data: input.data,
          select: gameSubmissionFields,
        })
        return { gameSubmission }
      }),
    ),

  createGameChoice: protectedProcedure
    .input(
      z.object({
        gameId: z.number().optional(),
        memberId: z.number(),
        rank: z.number(),
        returningPlayer: z.boolean(),
        slotId: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameChoice = await tx.gameChoice.create({
          data: input,
          select: gameChoiceFields,
        })
        return { gameChoice }
      }),
    ),

  updateGameChoice: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          gameId: z.number().nullable(),
          memberId: z.number(),
          rank: z.number(),
          returningPlayer: z.boolean(),
          slotId: z.number(),
          year: z.number(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameChoice = await tx.gameChoice.update({
          where: { id: input.id },
          data: input.data,
          select: gameChoiceFields,
        })
        return { gameChoice }
      }),
    ),
})
