import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

// const roomWithGames = {
//   id: true,
//   description: true,
//   size: true,
//   type: true,
//   updated: true,
//   games: {
//     select: {
//       id: true,
//       name: true,
//       slotId: true,
//       gmNames: true,
//     },
//   },
// }

export const gameRoomsRouter = createTRPCRouter({
  getGameRooms: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.room.findMany({
        select: {
          id: true,
          description: true,
          size: true,
          type: true,
          updated: true,
        },
      }),
    ),
  ),

  getGameRoomAndGames: publicProcedure.input(z.object({ year: z.number().optional() })).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.room.findMany({
        select: {
          id: true,
          description: true,
          game: {
            where: input.year ? { year: input.year } : {},
            orderBy: { slotId: 'asc' },
            select: {
              id: true,
              name: true,
              slotId: true,
              gmNames: true,
            },
          },
        },
      }),
    ),
  ),

  updateGameRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          description: z.string().optional(),
          size: z.number().optional(),
          type: z.string().optional(),
          updated: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const room = await tx.room.update({
          where: { id: input.id },
          data: input.data,
          select: {
            id: true,
            description: true,
            size: true,
            type: true,
            updated: true,
          },
        })
        return { room }
      }),
    ),

  createGameRoom: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        size: z.number(),
        type: z.string(),
        updated: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const room = await tx.room.create({
          data: {
            description: input.description,
            size: input.size,
            type: input.type,
            updated: input.updated ?? false,
          },
        })
        return { room }
      }),
    ),

  deleteGameRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedRoom = await tx.room.delete({
          where: { id: input.id },
        })
        return {
          deletedRoomId: deletedRoom.id,
        }
      }),
    ),
})
