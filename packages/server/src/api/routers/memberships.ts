import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const membershipWithUserAndRoom = {
  user: {
    include: {
      profile: true,
    },
  },
  hotelRoom: true,
}

const membershipWithUser = {
  user: {
    include: {
      profile: true,
    },
  },
}

export const membershipsRouter = createTRPCRouter({
  getMembershipByYearAndId: publicProcedure
    .input(
      z.object({
        year: z.number(),
        userId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.membership.findMany({
          where: {
            year: input.year,
            userId: input.userId,
          },
          include: membershipWithUserAndRoom,
        }),
      ),
    ),

  getMembershipsByYear: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.membership.findMany({
          where: { year: input.year },
          include: membershipWithUserAndRoom,
        }),
      ),
    ),

  getMembershipRoomsByYear: publicProcedure
    .input(
      z.object({
        year: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.membership.findMany({
          where: { year: input.year },
          include: membershipWithUserAndRoom,
        }),
      ),
    ),

  getMembershipsById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.membership.findMany({
          where: { id: input.id },
          include: membershipWithUserAndRoom,
        }),
      ),
    ),

  getMembershipByYearAndRoom: publicProcedure
    .input(
      z.object({
        year: z.number(),
        hotelRoomId: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.membership.findMany({
          where: {
            year: input.year,
            hotelRoomId: input.hotelRoomId,
          },
          include: membershipWithUserAndRoom,
        }),
      ),
    ),

  getAllMembersBy: publicProcedure
    .input(
      z.object({
        year: z.number(),
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findMany({
          where: {
            fullName: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          orderBy: { lastName: 'asc' },
          include: {
            membership: {
              where: {
                attending: true,
                year: input.year,
              },
              include: membershipWithUser,
            },
          },
        }),
      ),
    ),

  createMembership: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        year: z.number(),
        arrivalDate: z.date(),
        departureDate: z.date(),
        attendance: z.string(),
        attending: z.boolean(),
        hotelRoomId: z.number(),
        interestLevel: z.string(),
        message: z.string(),
        offerSubsidy: z.boolean(),
        requestOldPrice: z.boolean(),
        roomPreferenceAndNotes: z.string(),
        roomingPreferences: z.string(),
        roomingWith: z.string(),
        volunteer: z.boolean(),
        slotsAttending: z.string().nullable(),
        cost: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const membership = await tx.membership.create({
          data: input,
        })
        return { membership }
      }),
    ),

  updateMembership: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          arrivalDate: z.date().optional(),
          departureDate: z.date().optional(),
          attendance: z.string().optional(),
          attending: z.boolean().optional(),
          hotelRoomId: z.number().optional(),
          interestLevel: z.string().optional(),
          message: z.string().optional(),
          offerSubsidy: z.boolean().optional(),
          requestOldPrice: z.boolean().optional(),
          roomPreferenceAndNotes: z.string().optional(),
          roomingPreferences: z.string().optional(),
          roomingWith: z.string().optional(),
          volunteer: z.boolean().optional(),
          year: z.number().optional(),
          slotsAttending: z.string().nullable().optional(),
          cost: z.number().optional().nullable(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedMembership = await tx.membership.update({
          where: { id: input.id },
          data: input.data,
        })
        return { membership: updatedMembership }
      }),
    ),

  deleteMembership: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedMembership = await tx.membership.delete({
          where: { id: input.id },
        })
        return {
          deletedMembershipId: deletedMembership.id,
        }
      }),
    ),
})
