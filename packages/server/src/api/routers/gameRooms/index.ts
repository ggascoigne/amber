import { createGameRoomRecord, deleteGameRoomRecord, updateGameRoomRecord } from './mutations'
import { getGameRoomAndGames, getGameRooms } from './queries'
import { createGameRoomInput, deleteGameRoomInput, getGameRoomAndGamesInput, updateGameRoomInput } from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const gameRoomsRouter = createTRPCRouter({
  getGameRooms: publicProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getGameRooms({ tx }))),

  getGameRoomAndGames: publicProcedure
    .input(getGameRoomAndGamesInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameRoomAndGames({ tx, input }))),

  updateGameRoom: protectedProcedure
    .input(updateGameRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateGameRoomRecord({ tx, input }))),

  createGameRoom: protectedProcedure
    .input(createGameRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createGameRoomRecord({ tx, input }))),

  deleteGameRoom: protectedProcedure
    .input(deleteGameRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteGameRoomRecord({ tx, input }))),
})
