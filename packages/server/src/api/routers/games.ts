import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

// You may want to adjust includes/fragments as needed
export const gameWithGmsAndRoom = {
  // id: true,
  // name: true,
  // gmNames: true,
  // description: true,
  // genre: true,
  // type: true,
  // setting: true,
  // charInstructions: true,
  // playerMax: true,
  // playerMin: true,
  // playerPreference: true,
  // returningPlayers: true,
  // playersContactGm: true,
  // gameContactEmail: true,
  // estimatedLength: true,
  // slotPreference: true,
  // lateStart: true,
  // lateFinish: true,
  // slotConflicts: true,
  // message: true,
  // slotId: true,
  // teenFriendly: true,
  // year: true,
  // full: true,
  // roomId: true,
  room: {
    select: {
      description: true,
    },
  },
  gameAssignment: {
    where: { gm: { lt: 0 } },
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
}

export const gamesRouter = createTRPCRouter({
  // ...existing code...
  getGamesBySlotForSignup: publicProcedure
    .input(
      z.object({
        year: z.number(),
        slotId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: {
            OR: [
              {
                AND: [{ OR: [{ year: input.year }, { year: 0 }] }, { slotId: input.slotId }],
              },
              {
                AND: [{ year: 0 }, { slotId: null }],
              },
            ],
          },
          orderBy: [{ year: 'desc' }, { slotId: 'asc' }, { name: 'asc' }],
          include: gameWithGmsAndRoom,
        }),
      ),
    ),
  // ...existing code...
  getGamesBySlot: publicProcedure
    .input(
      z.object({
        year: z.number(),
        slotId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: {
            year: input.year,
            slotId: input.slotId,
          },
          orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  getGamesByYear: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: {
            OR: [{ OR: [{ year: input.year }, { year: 0 }] }, { year: 0 }],
          },
          orderBy: [{ year: 'desc' }, { slotId: 'asc' }, { name: 'asc' }],
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  getSmallGamesByYear: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: { year: input.year },
          orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
          take: 1,
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  getFirstGameOfSlot: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: {
            slotId: 1,
            year: input.year,
          },
          orderBy: [{ name: 'asc' }],
          take: 1,
          include: {
            ...gameWithGmsAndRoom,
            gameAssignment: {
              where: { gm: { lt: 0 } },
              include: {
                membership: {
                  include: {
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
        }),
      ),
    ),

  getGamesByAuthor: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: { authorId: input.id },
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  getGamesByYearAndAuthor: publicProcedure
    .input(
      z.object({
        year: z.number(),
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findMany({
          where: {
            authorId: input.id,
            year: input.year,
          },
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  getGameById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.game.findUnique({
          where: { id: input.id },
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  createGame: protectedProcedure
    .input(
      z.object({
        charInstructions: z.string(),
        description: z.string(),
        estimatedLength: z.string(),
        full: z.boolean().optional(),
        gameContactEmail: z.string(),
        genre: z.string(),
        gmNames: z.string().nullable().optional(),
        lateFinish: z.boolean().nullable().optional(),
        lateStart: z.string().nullable().optional(),
        message: z.string(),
        name: z.string(),
        playerMax: z.number(),
        playerMin: z.number(),
        playerPreference: z.string(),
        playersContactGm: z.boolean(),
        returningPlayers: z.string(),
        roomId: z.number().nullable().optional(),
        setting: z.string(),
        shortName: z.string().nullable().optional(),
        slotConflicts: z.string(),
        slotId: z.number().nullable().optional(),
        slotPreference: z.number(),
        teenFriendly: z.boolean(),
        type: z.string(),
        year: z.number(),
        authorId: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const game = await tx.game.create({
          data: input,
        })
        return { game }
      }),
    ),

  updateGame: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          charInstructions: z.string().optional(),
          description: z.string().optional(),
          estimatedLength: z.string().optional(),
          full: z.boolean().optional(),
          gameContactEmail: z.string().optional(),
          genre: z.string().optional(),
          gmNames: z.string().nullable().optional(),
          lateFinish: z.boolean().nullable().optional(),
          lateStart: z.string().nullable().optional(),
          message: z.string().optional(),
          name: z.string().optional(),
          playerMax: z.number().optional(),
          playerMin: z.number().optional(),
          playerPreference: z.string().optional(),
          playersContactGm: z.boolean().optional(),
          returningPlayers: z.string().optional(),
          roomId: z.number().nullable().optional(),
          setting: z.string().optional(),
          shortName: z.string().nullable().optional(),
          slotConflicts: z.string().optional(),
          slotId: z.number().nullable().optional(),
          slotPreference: z.number().optional(),
          teenFriendly: z.boolean().optional(),
          type: z.string().optional(),
          year: z.number().optional(),
          authorId: z.number().nullable().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedGame = await tx.game.update({
          where: { id: input.id },
          data: input.data,
        })
        return { game: updatedGame }
      }),
    ),

  deleteGame: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedGame = await tx.game.delete({
          where: { id: input.id },
        })
        return {
          deletedGameId: deletedGame.id,
        }
      }),
    ),
})
