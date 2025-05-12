import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const usersRouter = createTRPCRouter({
  // TODO: rename tp getUserAndProfileByEmail
  getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findUnique({
          where: { email: input.email },
          include: {
            profile: true,
          },
        }),
      ),
    ),

  getUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findUnique({
          where: { id: input.id },
        }),
      ),
    ),

  getAllUsers: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.user.findMany({
        orderBy: { lastName: 'asc' },
      }),
    ),
  ),

  getAllUsersAndProfiles: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.user.findMany({
        orderBy: { lastName: 'asc' },
        include: {
          profile: true,
        },
      }),
    ),
  ),

  getAllUsersBy: publicProcedure
    .input(
      z.object({
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
              where: { attending: true },
              select: {
                id: true,
                year: true,
              },
            },
          },
        }),
      ),
    ),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          email: z.string().email().optional(),
          fullName: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          displayName: z.string().optional(),
          balance: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: input.id },
          data: input.data,
        })
        return { user: updatedUser }
      }),
    ),

  createProfile: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        phoneNumber: z.string(),
        snailMailAddress: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const profile = await tx.profile.create({
          data: {
            userId: input.userId,
            phoneNumber: input.phoneNumber,
            snailMailAddress: input.snailMailAddress,
          },
        })
        return { profile }
      }),
    ),

  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          phoneNumber: z.string().optional(),
          snailMailAddress: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedProfile = await tx.profile.update({
          where: { id: input.id },
          data: input.data,
        })
        return { profile: updatedProfile }
      }),
    ),
})
