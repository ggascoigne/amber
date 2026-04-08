import { applyRoomAssignmentPlanner } from './applyRoomAssignmentPlanner'
import { assignGameRoom } from './assignGameRoom'
import { getRoomAssignmentDashboardSnapshot } from './dashboardSnapshot'
import { getScheduleRoomAssignmentData } from './getScheduleRoomAssignmentData'
import { removeGameRoomAssignment } from './removeGameRoomAssignment'
import { resetRoomAssignments } from './resetRoomAssignments'
import {
  assignGameRoomInput,
  getRoomAssignmentDashboardDataInput,
  getScheduleRoomAssignmentDataInput,
  makeInitialRoomAssignmentsInput,
  recalculateRoomAssignmentsInput,
  removeGameRoomAssignmentInput,
  resetRoomAssignmentsInput,
  upsertMemberRoomAssignmentInput,
  upsertRoomSlotAvailabilityInput,
} from './schemas'
import { upsertMemberRoomAssignment } from './upsertMemberRoomAssignment'
import { upsertRoomSlotAvailability } from './upsertRoomSlotAvailability'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, protectedProcedure } from '../../trpc'

const conventionCode = process.env.DB_ENV === 'acus' ? 'acus' : 'acnw'

export const roomAssignmentsRouter = createTRPCRouter({
  getRoomAssignmentDashboardData: protectedProcedure
    .input(getRoomAssignmentDashboardDataInput)
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => getRoomAssignmentDashboardSnapshot({ tx, year: input.year })),
    ),

  getScheduleRoomAssignmentData: protectedProcedure
    .input(getScheduleRoomAssignmentDataInput)
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => getScheduleRoomAssignmentData({ tx, input, conventionCode })),
    ),

  assignGameRoom: protectedProcedure.input(assignGameRoomInput).mutation(async ({ input, ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      assignGameRoom({
        tx,
        input,
        assignedByUserId: ctx.userId ?? null,
      }),
    ),
  ),

  removeGameRoomAssignment: protectedProcedure
    .input(removeGameRoomAssignmentInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => removeGameRoomAssignment({ tx, input }))),

  upsertRoomSlotAvailability: protectedProcedure
    .input(upsertRoomSlotAvailabilityInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => upsertRoomSlotAvailability({ tx, input }))),

  upsertMemberRoomAssignment: protectedProcedure
    .input(upsertMemberRoomAssignmentInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => upsertMemberRoomAssignment({ tx, input }))),

  resetRoomAssignments: protectedProcedure
    .input(resetRoomAssignmentsInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => resetRoomAssignments({ tx, input }))),

  makeInitialRoomAssignments: protectedProcedure
    .input(makeInitialRoomAssignmentsInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        applyRoomAssignmentPlanner({
          tx,
          input: {
            year: input.year,
            assignedByUserId: ctx.userId ?? null,
            deleteWhere: {
              year: input.year,
              source: 'auto',
            },
          },
        }),
      ),
    ),

  recalculateRoomAssignments: protectedProcedure
    .input(recalculateRoomAssignmentsInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        applyRoomAssignmentPlanner({
          tx,
          input: {
            year: input.year,
            slotId: input.slotId,
            assignedByUserId: ctx.userId ?? null,
            deleteWhere: {
              year: input.year,
              slotId: input.slotId,
              isOverride: false,
            },
          },
        }),
      ),
    ),
})
