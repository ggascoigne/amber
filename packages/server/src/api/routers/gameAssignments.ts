import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const gameAssignmentInput = z.object({
  gameId: z.number(),
  gm: z.number(),
  memberId: z.number(),
  year: z.number(),
})

const yearInput = z.object({
  year: z.number(),
})

// keep in sync with GameChoiceSelector.tsx
const ANY_GAME_CHOICE_ID = 144

const dashboardGameSelect = {
  id: true,
  name: true,
  slotId: true,
  playerMin: true,
  playerMax: true,
  playerPreference: true,
  message: true,
  returningPlayers: true,
  year: true,
}

const dashboardAssignmentSelect = {
  memberId: true,
  gameId: true,
  gm: true,
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
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
    },
  },
}

const dashboardChoiceSelect = {
  id: true,
  memberId: true,
  gameId: true,
  rank: true,
  slotId: true,
  year: true,
  returningPlayer: true,
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
  game: {
    select: {
      id: true,
      name: true,
      slotId: true,
    },
  },
}

const dashboardSubmissionSelect = {
  id: true,
  memberId: true,
  year: true,
  message: true,
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

  isGameMaster: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const gameAssignments = await tx.gameAssignment.findMany({
          where: {
            gm: { not: 0 },
            membership: {
              userId: input.userId,
              year: input.year,
            },
          },
        })

        return gameAssignments.length > 0
      }),
    ),

  getAssignmentDashboardData: protectedProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const [games, assignments, choices, submissions, memberships] = await Promise.all([
          tx.game.findMany({
            where: { year: input.year },
            select: dashboardGameSelect,
            orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
          }),
          tx.gameAssignment.findMany({
            where: { year: input.year },
            select: dashboardAssignmentSelect,
          }),
          tx.gameChoice.findMany({
            where: { year: input.year },
            select: dashboardChoiceSelect,
          }),
          tx.gameSubmission.findMany({
            where: { year: input.year },
            select: dashboardSubmissionSelect,
          }),
          tx.membership.findMany({
            where: { year: input.year },
            select: dashboardMembershipSelect,
            orderBy: [
              {
                user: {
                  lastName: 'asc',
                },
              },
              {
                user: {
                  firstName: 'asc',
                },
              },
            ],
          }),
        ])

        return {
          games,
          assignments,
          choices,
          submissions,
          memberships,
        }
      }),
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

  createGameAssignment: protectedProcedure.input(gameAssignmentInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const gameAssignment = await tx.gameAssignment.create({
        data: input,
      })
      return { gameAssignment }
    }),
  ),

  deleteGameAssignment: protectedProcedure.input(gameAssignmentInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      // const deleted =
      await tx.gameAssignment.delete({
        where: {
          memberId_gameId_gm_year: {
            memberId: input.memberId,
            gameId: input.gameId,
            gm: input.gm,
            year: input.year,
          },
        },
      })
      return {
        // deletedGameAssignmentId: deleted.id,
      }
    }),
  ),

  updateGameAssignments: protectedProcedure
    .input(
      z.object({
        year: z.number(),
        adds: z.array(gameAssignmentInput),
        removes: z.array(gameAssignmentInput),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deleteTargets = input.removes.map((assignment) => ({
          memberId: assignment.memberId,
          gameId: assignment.gameId,
          gm: assignment.gm,
          year: input.year,
        }))

        const createTargets = input.adds.map((assignment) => ({
          memberId: assignment.memberId,
          gameId: assignment.gameId,
          gm: assignment.gm,
          year: input.year,
        }))

        const deleted = deleteTargets.length
          ? await tx.gameAssignment.deleteMany({
              where: {
                OR: deleteTargets,
              },
            })
          : { count: 0 }

        const created = createTargets.length
          ? await tx.gameAssignment.createMany({
              data: createTargets,
              skipDuplicates: true,
            })
          : { count: 0 }

        return {
          deleted: deleted.count,
          created: created.count,
        }
      }),
    ),

  resetAssignments: protectedProcedure.input(yearInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const deleted = await tx.gameAssignment.deleteMany({
        where: {
          year: input.year,
          gm: { gte: 0 },
        },
      })

      return {
        deleted: deleted.count,
      }
    }),
  ),

  setInitialAssignments: protectedProcedure.input(yearInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const [games, assignments, choices] = await Promise.all([
        tx.game.findMany({
          where: { year: input.year },
          select: { id: true, slotId: true },
        }),
        tx.gameAssignment.findMany({
          where: { year: input.year },
          select: { memberId: true, gameId: true, gm: true },
        }),
        tx.gameChoice.findMany({
          where: { year: input.year, rank: 1, gameId: { not: null } },
          select: { memberId: true, gameId: true },
        }),
      ])

      const slotGameIdSet = new Set(games.filter((game) => (game.slotId ?? 0) > 0).map((game) => game.id))
      const scheduledAssignmentKeys = new Set(
        assignments
          .filter((assignment) => assignment.gm >= 0)
          .map((assignment) => `${assignment.memberId}-${assignment.gameId}`),
      )
      const gmOfferKeys = new Set(
        assignments
          .filter((assignment) => assignment.gm < 0)
          .map((assignment) => `${assignment.memberId}-${assignment.gameId}`),
      )

      const gmAdds = assignments
        .filter(
          (assignment) =>
            assignment.gm < 0 && assignment.gameId !== ANY_GAME_CHOICE_ID && slotGameIdSet.has(assignment.gameId),
        )
        .filter((assignment) => !scheduledAssignmentKeys.has(`${assignment.memberId}-${assignment.gameId}`))
        .map((assignment) => ({
          memberId: assignment.memberId,
          gameId: assignment.gameId,
          gm: Math.abs(assignment.gm),
          year: input.year,
        }))

      const firstChoiceAdds = choices
        .filter(
          (choice) =>
            choice.gameId !== null && choice.gameId !== ANY_GAME_CHOICE_ID && slotGameIdSet.has(choice.gameId),
        )
        .filter((choice) => !scheduledAssignmentKeys.has(`${choice.memberId}-${choice.gameId}`))
        .filter((choice) => !gmOfferKeys.has(`${choice.memberId}-${choice.gameId}`))
        .map((choice) => ({
          memberId: choice.memberId,
          gameId: choice.gameId ?? 0,
          gm: 0,
          year: input.year,
        }))

      const adds = [...gmAdds, ...firstChoiceAdds]
      if (adds.length === 0) {
        return {
          created: 0,
        }
      }

      const created = await tx.gameAssignment.createMany({
        data: adds,
        skipDuplicates: true,
      })

      return {
        created: created.count,
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
