import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

// // Adjust this include as needed for your Prisma schema
// const gameAssignmentWithGame = {
//   game: true,
//   // add other relations if needed
// }

export const gameAssignmentsRouter = createTRPCRouter({
  getGameAssignmentsByYear: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.gameAssignment.findMany({
          where: { year: input.year },
          // include: gameAssignmentWithGame,
        }),
      ),
    ),

  getGameAssignmentsByGameId: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.gameAssignment.findMany({
          where: { gameId: input.gameId },
          // include: gameAssignmentWithGame,
        }),
      ),
    ),

  getGameAssignmentsByMemberId: publicProcedure
    .input(
      z.object({
        memberId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.gameAssignment.findMany({
          where: { memberId: input.memberId },
          // include: gameAssignmentWithGame,
        }),
      ),
    ),

  // updateGameAssignmentById: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.number(),
  //       data: z.object({
  //         gm: z.number().optional(),
  //         // add other updatable fields as needed
  //       }),
  //     }),
  //   )
  //   .mutation(async ({ input, ctx }) =>
  //     inRlsTransaction(ctx, async (tx) => {
  //       const updated = await tx.gameAssignment.update({
  //         where: { id: input.id },
  //         data: input.data,
  //       })
  //       return { gameAssignment: updated }
  //     }),
  //   ),

  createGameAssignment: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        gm: z.number(),
        memberId: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameAssignment = await tx.gameAssignment.create({
          data: input,
        })
        return { gameAssignment }
      }),
    ),

  deleteGameAssignment: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        gm: z.number(),
        memberId: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        // const deleted =
        await tx.gameAssignment.delete({
          where: {
            memberId_gameId_gm_year: undefined,
            gameId: input.gameId,
            gm: input.gm,
            memberId: input.memberId,
            year: input.year,
          },
        })
        return {
          // deletedGameAssignmentId: deleted.id,
        }
      }),
    ),

  // getSchedule: returns games and assignments for a member where gm >= 0
  getSchedule: publicProcedure
    .input(
      z.object({
        memberId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.gameAssignment.findMany({
          where: {
            memberId: input.memberId,
            gm: { gte: 0 },
          },
          include: {
            game: {
              include: {
                room: {
                  select: {
                    description: true,
                  },
                },
                gameAssignment: {
                  where: { gm: { gte: 0 } },
                  select: {
                    gameId: true,
                    gm: true,
                    memberId: true,
                    year: true,
                    membership: {
                      select: {
                        user: {
                          select: {
                            email: true,
                            fullName: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            // add other includes if needed
          },
        }),
      ),
    ),
})
