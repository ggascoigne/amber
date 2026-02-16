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

const dashboardGameSelect = {
  id: true,
  name: true,
  slotId: true,
  category: true,
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
      category: true,
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
      category: true,
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

const assignmentSummaryGameSelect = {
  id: true,
  name: true,
  slotId: true,
  category: true,
  playerMin: true,
  playerMax: true,
}

const assignmentSummaryMembershipSelect = {
  id: true,
  user: {
    select: {
      fullName: true,
      firstName: true,
      lastName: true,
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

  getAssignmentSummary: protectedProcedure.input(yearInput).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) => {
      const [slots, memberships, games, assignments] = await Promise.all([
        tx.slot.findMany({
          select: { id: true },
          orderBy: [{ id: 'asc' }],
        }),
        tx.membership.findMany({
          where: { year: input.year, attending: true },
          select: assignmentSummaryMembershipSelect,
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
        tx.game.findMany({
          where: { year: input.year },
          select: assignmentSummaryGameSelect,
          orderBy: [{ slotId: 'asc' }, { name: 'asc' }],
        }),
        tx.gameAssignment.findMany({
          where: { year: input.year, gm: { gte: 0 } },
          select: {
            memberId: true,
            gameId: true,
            gm: true,
            membership: {
              select: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
            game: {
              select: assignmentSummaryGameSelect,
            },
          },
        }),
      ])

      const slotIds = slots.map((slot) => slot.id)
      const assignedSlotIdsByMemberId = new Map<number, Set<number>>()
      const scheduledCountsByGameId = new Map<number, { gmCount: number; playerCount: number }>()

      assignments.forEach((assignment) => {
        const slotId = assignment.game.slotId ?? 0
        if (slotId > 0) {
          const assignedSlotIds = assignedSlotIdsByMemberId.get(assignment.memberId) ?? new Set<number>()
          assignedSlotIds.add(slotId)
          assignedSlotIdsByMemberId.set(assignment.memberId, assignedSlotIds)
        }

        const scheduledCounts = scheduledCountsByGameId.get(assignment.gameId) ?? { gmCount: 0, playerCount: 0 }
        if (assignment.gm === 0) {
          scheduledCounts.playerCount += 1
        } else {
          scheduledCounts.gmCount += 1
        }
        scheduledCountsByGameId.set(assignment.gameId, scheduledCounts)
      })

      const missingAssignments = memberships
        .map((membership) => {
          const assignedSlotIds = assignedSlotIdsByMemberId.get(membership.id) ?? new Set<number>()
          const missingSlots = slotIds.filter((slotId) => !assignedSlotIds.has(slotId))
          return {
            memberId: membership.id,
            memberName: membership.user.fullName ?? 'Unknown member',
            missingSlots,
          }
        })
        .filter((entry) => entry.missingSlots.length > 0)

      const anyGameAssignments = assignments
        .filter((assignment) => assignment.game.category === 'any_game')
        .map((assignment) => ({
          memberId: assignment.memberId,
          memberName: assignment.membership.user.fullName ?? 'Unknown member',
          gameName: assignment.game.name,
          assignmentRole: assignment.gm === 0 ? 'Player' : 'GM',
        }))
        .sort((left, right) => left.memberName.localeCompare(right.memberName))

      const noGameRoleMismatches = games
        .filter(
          (game) =>
            game.category === 'no_game' && (game.slotId ?? 0) > 0 && game.name.trim().toLowerCase() !== 'no game',
        )
        .map((game) => {
          const scheduledCounts = scheduledCountsByGameId.get(game.id) ?? { gmCount: 0, playerCount: 0 }
          return {
            gameId: game.id,
            gameName: game.name,
            slotId: game.slotId as number,
            gmCount: scheduledCounts.gmCount,
            playerCount: scheduledCounts.playerCount,
          }
        })
        .filter(
          (entry) => (entry.gmCount === 0 && entry.playerCount > 0) || (entry.gmCount > 0 && entry.playerCount === 0),
        )
        .sort((left, right) => left.slotId - right.slotId)

      const belowMinimumGames = games
        .filter((game) => game.category === 'user')
        .map((game) => {
          const scheduledCounts = scheduledCountsByGameId.get(game.id) ?? { gmCount: 0, playerCount: 0 }
          return {
            gameId: game.id,
            gameName: game.name,
            slotId: game.slotId,
            playerCount: scheduledCounts.playerCount,
            playerMin: game.playerMin,
            playerMax: game.playerMax,
          }
        })
        .filter((entry) => entry.playerCount < entry.playerMin)
        .sort((left, right) => {
          const leftSlotId = left.slotId ?? Number.MAX_SAFE_INTEGER
          const rightSlotId = right.slotId ?? Number.MAX_SAFE_INTEGER
          if (leftSlotId !== rightSlotId) return leftSlotId - rightSlotId
          return left.gameName.localeCompare(right.gameName)
        })

      const overCapGames = games
        .filter((game) => game.category === 'user')
        .map((game) => {
          const scheduledCounts = scheduledCountsByGameId.get(game.id) ?? { gmCount: 0, playerCount: 0 }
          return {
            gameId: game.id,
            gameName: game.name,
            slotId: game.slotId,
            playerCount: scheduledCounts.playerCount,
            playerMin: game.playerMin,
            playerMax: game.playerMax,
          }
        })
        .filter((entry) => entry.playerCount > entry.playerMax)
        .sort((left, right) => {
          const leftSlotId = left.slotId ?? Number.MAX_SAFE_INTEGER
          const rightSlotId = right.slotId ?? Number.MAX_SAFE_INTEGER
          if (leftSlotId !== rightSlotId) return leftSlotId - rightSlotId
          return left.gameName.localeCompare(right.gameName)
        })

      return {
        missingAssignments,
        anyGameAssignments,
        noGameRoleMismatches,
        belowMinimumGames,
        overCapGames,
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
          select: { id: true, slotId: true, category: true },
        }),
        tx.gameAssignment.findMany({
          where: { year: input.year },
          select: { memberId: true, gameId: true, gm: true },
        }),
        tx.gameChoice.findMany({
          where: { year: input.year, rank: 1, gameId: { not: null } },
          select: { memberId: true, gameId: true, slotId: true },
        }),
      ])

      const gameById = new Map(games.map((game) => [game.id, game]))
      const slotGameIdSet = new Set(
        games.filter((game) => game.category === 'user' && (game.slotId ?? 0) > 0).map((game) => game.id),
      )
      const noGameIdBySlotId = new Map(
        games
          .filter((game) => game.category === 'no_game' && (game.slotId ?? 0) > 0)
          .map((game) => [game.slotId as number, game.id]),
      )
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
        .filter((assignment) => {
          if (assignment.gm >= 0) return false
          const assignmentGame = gameById.get(assignment.gameId)
          if (!assignmentGame) return false
          return assignmentGame.category === 'user' && slotGameIdSet.has(assignment.gameId)
        })
        .filter((assignment) => !scheduledAssignmentKeys.has(`${assignment.memberId}-${assignment.gameId}`))
        .map((assignment) => ({
          memberId: assignment.memberId,
          gameId: assignment.gameId,
          gm: Math.abs(assignment.gm),
          year: input.year,
        }))

      const firstChoiceAdds = choices
        .map((choice) => {
          if (choice.gameId === null) return null
          const selectedGame = gameById.get(choice.gameId)
          if (!selectedGame) return null

          if (selectedGame.category === 'any_game') return null

          if (selectedGame.category === 'no_game') {
            const noGameId = noGameIdBySlotId.get(choice.slotId)
            if (!noGameId) return null
            return {
              memberId: choice.memberId,
              gameId: noGameId,
            }
          }

          if (!slotGameIdSet.has(selectedGame.id)) return null
          return {
            memberId: choice.memberId,
            gameId: selectedGame.id,
          }
        })
        .filter(
          (choice): choice is { memberId: number; gameId: number } =>
            !!choice && !scheduledAssignmentKeys.has(`${choice.memberId}-${choice.gameId}`),
        )
        .filter((choice) => !gmOfferKeys.has(`${choice.memberId}-${choice.gameId}`))
        .map((choice) => ({
          memberId: choice.memberId,
          gameId: choice.gameId,
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
