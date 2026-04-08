import { ensureSpecialGamesForYear } from './ensureSpecial'
import { createGameRecord, deleteGameRecord, updateGameRecord } from './mutations'
import {
  getFirstGameOfSlot,
  getGameById,
  getGamesByAuthor,
  getGamesBySlot,
  getGamesBySlotForSignup,
  getGamesByYear,
  getGamesByYearAndAuthor,
  getSmallGamesByYear,
} from './queries'
import {
  createGameInput,
  deleteGameInput,
  ensureSpecialGamesForYearInput,
  getGameByIdInput,
  getGamesByAuthorInput,
  getGamesBySlotInput,
  getGamesByYearAndAuthorInput,
  getGamesByYearInput,
  updateGameInput,
} from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const gamesRouter = createTRPCRouter({
  getGamesBySlotForSignup: publicProcedure
    .input(getGamesBySlotInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGamesBySlotForSignup({ tx, input }))),
  getGamesBySlot: publicProcedure
    .input(getGamesBySlotInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGamesBySlot({ tx, input }))),

  getGamesByYear: publicProcedure
    .input(getGamesByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGamesByYear({ tx, input }))),

  ensureSpecialGamesForYear: protectedProcedure
    .input(ensureSpecialGamesForYearInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => ensureSpecialGamesForYear({ tx, input }))),

  getSmallGamesByYear: publicProcedure
    .input(getGamesByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getSmallGamesByYear({ tx, input }))),

  getFirstGameOfSlot: publicProcedure
    .input(getGamesByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getFirstGameOfSlot({ tx, input }))),

  getGamesByAuthor: publicProcedure
    .input(getGamesByAuthorInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGamesByAuthor({ tx, input }))),

  getGamesByYearAndAuthor: publicProcedure
    .input(getGamesByYearAndAuthorInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGamesByYearAndAuthor({ tx, input }))),

  getGameById: publicProcedure
    .input(getGameByIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameById({ tx, input }))),

  createGame: protectedProcedure.input(createGameInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const userRoles = ctx.session?.user?.roles ?? []

      return createGameRecord({
        tx,
        input,
        userId: ctx.userId,
        userRoles,
      })
    }),
  ),

  updateGame: protectedProcedure.input(updateGameInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const userRoles = ctx.session?.user?.roles ?? []

      return updateGameRecord({
        tx,
        input,
        userId: ctx.userId,
        userRoles,
      })
    }),
  ),

  deleteGame: protectedProcedure.input(deleteGameInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const userRoles = ctx.session?.user?.roles ?? []

      return deleteGameRecord({
        tx,
        input,
        userId: ctx.userId,
        userRoles,
      })
    }),
  ),
})
