import {
  createBareSlotChoices,
  createGameChoiceRecord,
  createGameSubmissionRecord,
  updateGameChoiceRecord,
  updateGameSubmissionRecord,
  upsertGameChoiceBySlotRecord,
} from './mutations'
import { getGameChoiceById, getGameChoices, getGameChoicesByYear } from './queries'
import {
  createGameChoiceInput,
  createGameChoicesInput,
  createGameSubmissionInput,
  getGameChoicesByYearInput,
  getGameChoicesInput,
  readGameChoiceInput,
  updateGameChoiceInput,
  updateGameSubmissionInput,
  upsertGameChoiceBySlotInput,
} from './schemas'

import { dbAdmin } from '../../../db'
import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const gameChoicesRouter = createTRPCRouter({
  // add createGameChoices - have it call the typed query
  getGameChoices: publicProcedure
    .input(getGameChoicesInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameChoices({ tx, input }))),

  getGameChoicesByYear: protectedProcedure
    .input(getGameChoicesByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameChoicesByYear({ tx, input }))),

  readGameChoice: publicProcedure
    .input(readGameChoiceInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameChoiceById({ tx, input }))),

  // TODO: rename this to createInitialGameChoices
  createGameChoices: protectedProcedure
    .input(createGameChoicesInput)
    // TODO: does this really need to be run as dbAdmin?
    .mutation(async ({ input }) => createBareSlotChoices({ db: dbAdmin, input })),

  createGameSubmission: protectedProcedure
    .input(createGameSubmissionInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createGameSubmissionRecord({ tx, input }))),

  updateGameSubmission: protectedProcedure
    .input(updateGameSubmissionInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateGameSubmissionRecord({ tx, input }))),

  createGameChoice: protectedProcedure
    .input(createGameChoiceInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createGameChoiceRecord({ tx, input }))),

  updateGameChoice: protectedProcedure
    .input(updateGameChoiceInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateGameChoiceRecord({ tx, input }))),

  upsertGameChoiceBySlot: protectedProcedure
    .input(upsertGameChoiceBySlotInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => upsertGameChoiceBySlotRecord({ tx, input })),
    ),
})
