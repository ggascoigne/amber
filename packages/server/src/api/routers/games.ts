import { debug } from 'debug'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import type { Prisma } from '../../generated/prisma/client'
import type { TransactionClient } from '../inRlsTransaction'
import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const log = debug('amber:server:api:routers:games')

const checkPermGate = async (
  tx: TransactionClient,
  flagCode: string,
  userRoles: string[],
  userId: number | undefined,
) => {
  const setting = await tx.setting.findFirst({ where: { code: flagCode } })
  const value = setting?.value ?? 'No'

  const isAdmin = userRoles.includes('ROLE_ADMIN')
  const isGameAdmin = userRoles.includes('ROLE_GAME_ADMIN')

  switch (value) {
    case 'Admin':
      return isAdmin
    case 'GameAdmin':
      return isAdmin || isGameAdmin
    case 'GM': {
      if (isAdmin || isGameAdmin) return true
      if (!userId) return false
      const gmAssignments = await tx.gameAssignment.findFirst({
        where: {
          gm: { not: 0 },
          membership: { userId },
        },
      })
      return gmAssignments !== null
    }
    case 'Member':
      return true
    case 'Yes':
      return true
    case 'No':
    default:
      return false
  }
}

type SpecialGameTemplate = Omit<Prisma.GameCreateManyInput, 'slotId' | 'year' | 'category'>

const specialGameTemplateSelect = {
  description: true,
  lateFinish: true,
  lateStart: true,
  name: true,
  playerMax: true,
  playerMin: true,
  roomId: true,
  shortName: true,
  charInstructions: true,
  estimatedLength: true,
  gameContactEmail: true,
  genre: true,
  gmNames: true,
  message: true,
  playerPreference: true,
  playersContactGm: true,
  returningPlayers: true,
  setting: true,
  slotConflicts: true,
  slotPreference: true,
  teenFriendly: true,
  type: true,
  authorId: true,
  full: true,
} satisfies Prisma.GameSelect

const defaultNoGameTemplate: SpecialGameTemplate = {
  description: 'I am taking this slot off.',
  lateFinish: false,
  lateStart: null,
  name: 'No Game',
  playerMax: 999,
  playerMin: 0,
  roomId: null,
  shortName: null,
  charInstructions: '',
  estimatedLength: 'n/a',
  gameContactEmail: '',
  genre: 'other',
  gmNames: null,
  message: '',
  playerPreference: 'Any',
  playersContactGm: false,
  returningPlayers: '',
  setting: '',
  slotConflicts: '',
  slotPreference: 0,
  teenFriendly: true,
  type: 'Other',
  authorId: null,
  full: false,
}

const defaultAnyGameTemplate: SpecialGameTemplate = {
  ...defaultNoGameTemplate,
  description: 'Assign me to any game in this slot.',
  name: 'Any Game',
}

const buildNoGameCreateInput = (
  template: SpecialGameTemplate,
  slotId: number,
  year: number,
): Prisma.GameCreateManyInput => ({
  ...template,
  slotId,
  year,
  category: 'no_game',
})

const buildAnyGameCreateInput = (template: SpecialGameTemplate, year: number): Prisma.GameUncheckedCreateInput => ({
  ...template,
  slotId: null,
  year,
  category: 'any_game',
})

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
            year: input.year,
            OR: [{ slotId: input.slotId }, { category: 'any_game' }],
          },
          orderBy: [{ category: 'asc' }, { name: 'asc' }],
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
            category: 'user',
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
            year: input.year,
          },
          orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
          include: gameWithGmsAndRoom,
        }),
      ),
    ),

  ensureSpecialGamesForYear: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const [slots, existingSpecialGames, noGameTemplates, anyGameTemplate] = await Promise.all([
          tx.slot.findMany({
            select: { id: true },
            orderBy: [{ id: 'asc' }],
          }),
          tx.game.findMany({
            where: {
              year: input.year,
              category: {
                in: ['no_game', 'any_game'],
              },
            },
            select: {
              slotId: true,
              category: true,
            },
          }),
          tx.game.findMany({
            where: {
              category: 'no_game',
              slotId: { not: null },
            },
            select: {
              ...specialGameTemplateSelect,
              slotId: true,
            },
            orderBy: [{ year: 'desc' }, { id: 'desc' }],
          }),
          tx.game.findFirst({
            where: { category: 'any_game' },
            select: specialGameTemplateSelect,
            orderBy: [{ year: 'desc' }, { id: 'desc' }],
          }),
        ])

        const existingNoGameSlotIds = new Set(
          existingSpecialGames
            .filter((game) => game.category === 'no_game' && (game.slotId ?? 0) > 0)
            .map((game) => game.slotId as number),
        )
        const hasAnyGame = existingSpecialGames.some((game) => game.category === 'any_game')

        const noGameTemplateBySlotId = new Map<number, SpecialGameTemplate>()
        noGameTemplates.forEach((game) => {
          if ((game.slotId ?? 0) <= 0 || noGameTemplateBySlotId.has(game.slotId as number)) return
          const { slotId: _slotId, ...template } = game
          noGameTemplateBySlotId.set(game.slotId as number, template)
        })

        const noGameCreates = slots
          .filter((slot) => !existingNoGameSlotIds.has(slot.id))
          .map((slot) =>
            buildNoGameCreateInput(noGameTemplateBySlotId.get(slot.id) ?? defaultNoGameTemplate, slot.id, input.year),
          )

        if (noGameCreates.length) {
          await tx.game.createMany({
            data: noGameCreates,
          })
        }

        let createdAnyGameCount = 0
        if (!hasAnyGame) {
          await tx.game.create({
            data: buildAnyGameCreateInput(anyGameTemplate ?? defaultAnyGameTemplate, input.year),
          })
          createdAnyGameCount = 1
        }

        return {
          createdNoGameCount: noGameCreates.length,
          createdAnyGameCount,
        }
      }),
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
          where: { year: input.year, category: 'user' },
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
            category: 'user',
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
        const userRoles: string[] = ctx.session?.user?.roles ?? []
        const allowed = await checkPermGate(tx, 'flag.allow_game_submission', userRoles, ctx.userId)
        if (!allowed) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Game submission is not currently allowed' })
        }
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
        const userRoles: string[] = ctx.session?.user?.roles ?? []
        const allowed = await checkPermGate(tx, 'flag.allow_game_editing', userRoles, ctx.userId)
        if (!allowed) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Game editing is not currently allowed' })
        }
        const updatedGame = await tx.game.update({
          where: { id: input.id },
          data: {
            ...input.data,
            slotId: input.data.slotId === undefined ? null : input.data.slotId,
          },
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
