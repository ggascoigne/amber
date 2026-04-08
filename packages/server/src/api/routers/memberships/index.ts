import { createMembershipRecord, deleteMembershipRecord, updateMembershipRecord } from './mutations'
import {
  getAllMembersBy,
  getMembershipByYearAndId,
  getMembershipByYearAndRoom,
  getMembershipsById,
  getMembershipsByYear,
} from './queries'
import {
  createMembershipInput,
  deleteMembershipInput,
  getAllMembersByInput,
  getMembershipByYearAndIdInput,
  getMembershipByYearAndRoomInput,
  getMembershipsByIdInput,
  getMembershipsByYearInput,
  updateMembershipInput,
} from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const membershipsRouter = createTRPCRouter({
  getMembershipByYearAndId: publicProcedure
    .input(getMembershipByYearAndIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getMembershipByYearAndId({ tx, input }))),

  getMembershipsByYear: publicProcedure
    .input(getMembershipsByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getMembershipsByYear({ tx, input }))),

  getMembershipRoomsByYear: publicProcedure
    .input(getMembershipsByYearInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getMembershipsByYear({ tx, input }))),

  getMembershipsById: publicProcedure
    .input(getMembershipsByIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getMembershipsById({ tx, input }))),

  getMembershipByYearAndRoom: publicProcedure
    .input(getMembershipByYearAndRoomInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getMembershipByYearAndRoom({ tx, input }))),

  getAllMembersBy: publicProcedure
    .input(getAllMembersByInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getAllMembersBy({ tx, input }))),

  createMembership: protectedProcedure
    .input(createMembershipInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createMembershipRecord({ tx, input }))),

  updateMembership: protectedProcedure
    .input(updateMembershipInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateMembershipRecord({ tx, input }))),

  deleteMembership: protectedProcedure
    .input(deleteMembershipInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteMembershipRecord({ tx, input }))),
})
