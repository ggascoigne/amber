import { getGameAssignmentDashboardData } from './dashboard'
import { createGameAssignmentRecord, deleteGameAssignmentRecord } from './mutations'
import {
  getGameAssignmentsByGameId,
  getGameAssignmentsByMemberId,
  getGameAssignmentsByYear,
  isGameMaster,
} from './queries'
import { resetGameAssignments } from './reset'
import { getGameAssignmentSchedule } from './schedule'
import {
  createGameAssignmentInput,
  deleteGameAssignmentInput,
  getAssignmentDashboardDataInput,
  getAssignmentSummaryInput,
  getGameAssignmentScheduleInput,
  getGameAssignmentsByGameIdInput,
  getGameAssignmentsByMemberIdInput,
  getGameAssignmentsByYearInput,
  isGameMasterInput,
  resetGameAssignmentsInput,
  setInitialGameAssignmentsInput,
  updateGameAssignmentsInput,
} from './schemas'
import { setInitialGameAssignments } from './setInitial'
import { getGameAssignmentSummary } from './summaryData'
import { updateGameAssignments } from './update'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const gameAssignmentsRouter = createTRPCRouter({
  getGameAssignmentsByYear: publicProcedure
    .input(getGameAssignmentsByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameAssignmentsByYear({ tx, input }))),

  getGameAssignmentsByGameId: publicProcedure
    .input(getGameAssignmentsByGameIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameAssignmentsByGameId({ tx, input }))),

  getGameAssignmentsByMemberId: publicProcedure
    .input(getGameAssignmentsByMemberIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getGameAssignmentsByMemberId({ tx, input }))),

  isGameMaster: publicProcedure
    .input(isGameMasterInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => isGameMaster({ tx, input }))),

  getAssignmentDashboardData: protectedProcedure.input(getAssignmentDashboardDataInput).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      getGameAssignmentDashboardData({
        tx,
        input,
      }),
    ),
  ),

  getAssignmentSummary: protectedProcedure.input(getAssignmentSummaryInput).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      getGameAssignmentSummary({
        tx,
        input,
      }),
    ),
  ),

  createGameAssignment: protectedProcedure
    .input(createGameAssignmentInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createGameAssignmentRecord({ tx, input }))),

  deleteGameAssignment: protectedProcedure
    .input(deleteGameAssignmentInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteGameAssignmentRecord({ tx, input }))),

  updateGameAssignments: protectedProcedure
    .input(updateGameAssignmentsInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateGameAssignments({ tx, input }))),

  resetAssignments: protectedProcedure
    .input(resetGameAssignmentsInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => resetGameAssignments({ tx, input }))),

  setInitialAssignments: protectedProcedure
    .input(setInitialGameAssignmentsInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => setInitialGameAssignments({ tx, input }))),

  // getSchedule: returns games and assignments for a member where gm >= 0
  getSchedule: publicProcedure.input(getGameAssignmentScheduleInput).query(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      getGameAssignmentSchedule({
        tx,
        input,
      }),
    ),
  ),
})
