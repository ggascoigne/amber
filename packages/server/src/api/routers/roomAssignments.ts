import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { inRlsTransaction, type TransactionClient } from '../inRlsTransaction'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const conventionCode = process.env.DB_ENV === 'acus' ? 'acus' : 'acnw'

const roomSelect = {
  id: true,
  description: true,
  size: true,
  type: true,
  enabled: true,
  updated: true,
  accessibility: true,
}

const roomAssignmentSelect = {
  id: true,
  gameId: true,
  roomId: true,
  slotId: true,
  year: true,
  isOverride: true,
  source: true,
  assignedByUserId: true,
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
      playerMin: true,
      playerMax: true,
      year: true,
      category: true,
    },
  },
  room: {
    select: roomSelect,
  },
}

const dashboardGameSelect = {
  id: true,
  name: true,
  slotId: true,
  roomId: true,
  year: true,
  playerMin: true,
  playerMax: true,
  category: true,
}

const dashboardMembershipSelect = {
  id: true,
  userId: true,
  year: true,
  attending: true,
  user: {
    select: {
      fullName: true,
    },
  },
}

const dashboardGameAssignmentSelect = {
  memberId: true,
  gameId: true,
  gm: true,
  year: true,
  game: {
    select: {
      id: true,
      slotId: true,
      year: true,
    },
  },
  membership: {
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
  },
}

const getIsRoomAvailable = async ({
  tx,
  roomId,
  slotId,
  year,
  excludeGameId,
}: {
  tx: TransactionClient
  roomId: number
  slotId: number
  year: number
  excludeGameId?: number
}) => {
  const availability = await tx.roomSlotAvailability.findUnique({
    where: {
      roomId_slotId_year: {
        roomId,
        slotId,
        year,
      },
    },
    select: {
      isAvailable: true,
    },
  })

  if (availability && !availability.isAvailable) {
    return false
  }

  const occupiedRoom = await tx.gameRoomAssignment.findFirst({
    where: {
      roomId,
      slotId,
      year,
      isOverride: false,
      gameId: excludeGameId
        ? {
            not: excludeGameId,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  })

  return !occupiedRoom
}

const syncLegacyGameRoomId = async ({ tx, gameId, year }: { tx: TransactionClient; gameId: number; year: number }) => {
  const defaultAssignments = await tx.gameRoomAssignment.findMany({
    where: {
      gameId,
      year,
      isOverride: false,
    },
    select: {
      roomId: true,
    },
    orderBy: {
      id: 'asc',
    },
    take: 2,
  })

  const roomId = defaultAssignments.length === 1 ? (defaultAssignments[0]?.roomId ?? null) : null

  await tx.game.updateMany({
    where: {
      id: gameId,
      year,
    },
    data: {
      roomId,
    },
  })
}

const syncLegacyGameRoomIdsForYear = async ({ tx, year }: { tx: TransactionClient; year: number }) => {
  const games = await tx.game.findMany({
    where: {
      year,
    },
    select: {
      id: true,
    },
  })

  await Promise.all(
    games.map((game) =>
      syncLegacyGameRoomId({
        tx,
        gameId: game.id,
        year,
      }),
    ),
  )
}

export const roomAssignmentsRouter = createTRPCRouter({
  getRoomAssignmentDashboardData: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const [
          games,
          rooms,
          roomAssignments,
          roomSlotAvailability,
          memberRoomAssignments,
          memberships,
          gameAssignments,
        ] = await Promise.all([
          tx.game.findMany({
            where: {
              year: input.year,
            },
            select: dashboardGameSelect,
            orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
          }),
          tx.room.findMany({
            select: roomSelect,
            orderBy: [{ description: 'asc' }],
          }),
          tx.gameRoomAssignment.findMany({
            where: {
              year: input.year,
            },
            select: roomAssignmentSelect,
            orderBy: [{ slotId: 'asc' }, { id: 'asc' }],
          }),
          tx.roomSlotAvailability.findMany({
            where: {
              year: input.year,
            },
            select: {
              roomId: true,
              slotId: true,
              year: true,
              isAvailable: true,
            },
            orderBy: [{ slotId: 'asc' }, { roomId: 'asc' }],
          }),
          tx.memberRoomAssignment.findMany({
            where: {
              year: input.year,
            },
            select: {
              memberId: true,
              roomId: true,
              year: true,
              membership: {
                select: {
                  id: true,
                  user: {
                    select: {
                      fullName: true,
                    },
                  },
                },
              },
              room: {
                select: roomSelect,
              },
            },
            orderBy: [{ roomId: 'asc' }, { memberId: 'asc' }],
          }),
          tx.membership.findMany({
            where: {
              year: input.year,
            },
            select: dashboardMembershipSelect,
            orderBy: [
              {
                user: {
                  fullName: 'asc',
                },
              },
            ],
          }),
          tx.gameAssignment.findMany({
            where: {
              year: input.year,
              gm: {
                gte: 0,
              },
            },
            select: dashboardGameAssignmentSelect,
          }),
        ])

        return {
          games,
          rooms,
          roomAssignments,
          roomSlotAvailability,
          memberRoomAssignments,
          memberships,
          gameAssignments,
        }
      }),
    ),

  getScheduleRoomAssignmentData: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const game = await tx.game.findFirst({
          where: {
            id: input.gameId,
            year: input.year,
          },
          select: {
            id: true,
            name: true,
            slotId: true,
            year: true,
            roomId: true,
            category: true,
          },
        })

        if (!game || !game.slotId) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found for year' })
        }

        const [rooms, slotAssignments, slotAvailability] = await Promise.all([
          tx.room.findMany({
            select: roomSelect,
            orderBy: [{ description: 'asc' }],
          }),
          tx.gameRoomAssignment.findMany({
            where: {
              year: input.year,
              slotId: game.slotId,
              isOverride: false,
            },
            select: {
              id: true,
              gameId: true,
              roomId: true,
              slotId: true,
              year: true,
            },
          }),
          tx.roomSlotAvailability.findMany({
            where: {
              year: input.year,
              slotId: game.slotId,
            },
            select: {
              roomId: true,
              slotId: true,
              isAvailable: true,
            },
          }),
        ])

        const assignedRoomByRoomId = new Map(slotAssignments.map((assignment) => [assignment.roomId, assignment]))
        const availabilityByRoomId = new Map(
          slotAvailability.map((availability) => [availability.roomId, availability]),
        )
        const currentAssignment = slotAssignments.find((assignment) => assignment.gameId === input.gameId) ?? null

        return {
          convention: conventionCode,
          game,
          currentAssignment,
          rooms: rooms.map((room) => ({
            ...room,
            occupiedByGameId: assignedRoomByRoomId.get(room.id)?.gameId ?? null,
            isAvailable: availabilityByRoomId.get(room.id)?.isAvailable ?? true,
          })),
        }
      }),
    ),

  assignGameRoom: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        roomId: z.number(),
        slotId: z.number(),
        year: z.number(),
        isOverride: z.boolean().optional(),
        source: z.enum(['manual', 'auto']).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const wantsOverride = input.isOverride ?? false
        const source = input.source ?? 'manual'

        const [game, room] = await Promise.all([
          tx.game.findUnique({
            where: {
              id: input.gameId,
            },
            select: {
              id: true,
              year: true,
              slotId: true,
            },
          }),
          tx.room.findUnique({
            where: {
              id: input.roomId,
            },
            select: {
              id: true,
            },
          }),
        ])

        if (!game || !game.slotId || game.year !== input.year || game.slotId !== input.slotId) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Room assignment input did not match game year/slot' })
        }

        if (!room) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })
        }

        const roomIsAvailable = await getIsRoomAvailable({
          tx,
          roomId: input.roomId,
          slotId: input.slotId,
          year: input.year,
          excludeGameId: input.gameId,
        })

        let displacedGameIds: Array<number> = []
        if (!wantsOverride && !roomIsAvailable) {
          const displacedAssignments = await tx.gameRoomAssignment.findMany({
            where: {
              roomId: input.roomId,
              slotId: input.slotId,
              year: input.year,
              isOverride: false,
              gameId: {
                not: input.gameId,
              },
            },
            select: {
              gameId: true,
            },
          })
          displacedGameIds = displacedAssignments.map((assignment) => assignment.gameId)

          await tx.gameRoomAssignment.deleteMany({
            where: {
              roomId: input.roomId,
              slotId: input.slotId,
              year: input.year,
              isOverride: false,
              gameId: {
                not: input.gameId,
              },
            },
          })
        }

        if (!wantsOverride) {
          await tx.gameRoomAssignment.deleteMany({
            where: {
              gameId: input.gameId,
              slotId: input.slotId,
              year: input.year,
              isOverride: false,
              roomId: {
                not: input.roomId,
              },
            },
          })
        }

        const assignment = await tx.gameRoomAssignment.upsert({
          where: {
            gameId_roomId_slotId_year_isOverride: {
              gameId: input.gameId,
              roomId: input.roomId,
              slotId: input.slotId,
              year: input.year,
              isOverride: wantsOverride,
            },
          },
          update: {
            source,
            assignedByUserId: ctx.userId ?? null,
          },
          create: {
            gameId: input.gameId,
            roomId: input.roomId,
            slotId: input.slotId,
            year: input.year,
            isOverride: wantsOverride,
            source,
            assignedByUserId: ctx.userId ?? null,
          },
        })

        await syncLegacyGameRoomId({
          tx,
          gameId: input.gameId,
          year: input.year,
        })

        if (displacedGameIds.length > 0) {
          await Promise.all(
            displacedGameIds.map((displacedGameId) =>
              syncLegacyGameRoomId({
                tx,
                gameId: displacedGameId,
                year: input.year,
              }),
            ),
          )
        }

        return {
          assignment,
        }
      }),
    ),

  removeGameRoomAssignment: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const assignment = await tx.gameRoomAssignment.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            gameId: true,
            year: true,
            isOverride: true,
          },
        })

        if (!assignment) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Room assignment not found' })
        }

        await tx.gameRoomAssignment.delete({
          where: {
            id: input.id,
          },
        })

        await syncLegacyGameRoomId({
          tx,
          gameId: assignment.gameId,
          year: assignment.year,
        })

        return {
          deletedRoomAssignmentId: assignment.id,
        }
      }),
    ),

  upsertRoomSlotAvailability: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        slotId: z.number(),
        year: z.number(),
        isAvailable: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const roomSlotAvailability = await tx.roomSlotAvailability.upsert({
          where: {
            roomId_slotId_year: {
              roomId: input.roomId,
              slotId: input.slotId,
              year: input.year,
            },
          },
          update: {
            isAvailable: input.isAvailable,
          },
          create: {
            roomId: input.roomId,
            slotId: input.slotId,
            year: input.year,
            isAvailable: input.isAvailable,
          },
        })

        return {
          roomSlotAvailability,
        }
      }),
    ),

  upsertMemberRoomAssignment: protectedProcedure
    .input(
      z.object({
        memberId: z.number(),
        roomId: z.number().nullable(),
        year: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const membership = await tx.membership.findUnique({
          where: {
            id: input.memberId,
          },
          select: {
            id: true,
            year: true,
          },
        })

        if (!membership || membership.year !== input.year) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Member/year combination was not valid' })
        }

        if (input.roomId === null) {
          const deletedMemberRoomAssignments = await tx.memberRoomAssignment.deleteMany({
            where: {
              memberId: input.memberId,
              year: input.year,
            },
          })

          return {
            deleted: deletedMemberRoomAssignments.count,
            memberRoomAssignment: null,
          }
        }

        const memberRoomAssignment = await tx.memberRoomAssignment.upsert({
          where: {
            memberId_year: {
              memberId: input.memberId,
              year: input.year,
            },
          },
          update: {
            roomId: input.roomId,
          },
          create: {
            memberId: input.memberId,
            year: input.year,
            roomId: input.roomId,
          },
        })

        return {
          deleted: 0,
          memberRoomAssignment,
        }
      }),
    ),

  resetRoomAssignments: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        mode: z.enum(['all', 'auto_only']).default('all'),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedRoomAssignments = await tx.gameRoomAssignment.deleteMany({
          where: {
            year: input.year,
            source: input.mode === 'auto_only' ? 'auto' : undefined,
          },
        })

        await syncLegacyGameRoomIdsForYear({
          tx,
          year: input.year,
        })

        return {
          deleted: deletedRoomAssignments.count,
        }
      }),
    ),
})
