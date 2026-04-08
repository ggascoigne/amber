import { createProfileRecord, updateProfileRecord, updateUserRecord } from './mutations'
import {
  getAllUsers,
  getAllUsersAndProfiles,
  getAllUsersAndProfilesWithQuery,
  getAllUsersBy,
  getUser,
  getUserAndProfile,
  getUserByEmail,
} from './queries'
import {
  createProfileInput,
  getAllUsersAndProfilesWithQueryInput,
  getAllUsersByInput,
  getUserByEmailInput,
  getUserByIdInput,
  updateProfileInput,
  updateUserInput,
} from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, protectedProcedure } from '../../trpc'

export const usersRouter = createTRPCRouter({
  // TODO: rename tp getUserAndProfileByEmail
  getUserByEmail: protectedProcedure
    .input(getUserByEmailInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getUserByEmail({ tx, input }))),

  getUserAndProfile: protectedProcedure
    .input(getUserByIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getUserAndProfile({ tx, input }))),

  getUser: protectedProcedure
    .input(getUserByIdInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getUser({ tx, input }))),

  getAllUsers: protectedProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getAllUsers({ tx }))),

  getAllUsersAndProfiles: protectedProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) => getAllUsersAndProfiles({ tx })),
  ),

  getAllUsersAndProfiles2: protectedProcedure
    .input(getAllUsersAndProfilesWithQueryInput.optional())
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => getAllUsersAndProfilesWithQuery({ tx, input })),
    ),

  getAllUsersBy: protectedProcedure
    .input(getAllUsersByInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getAllUsersBy({ tx, input }))),

  updateUser: protectedProcedure
    .input(updateUserInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateUserRecord({ tx, input }))),

  createProfile: protectedProcedure
    .input(createProfileInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createProfileRecord({ tx, input }))),

  updateProfile: protectedProcedure
    .input(updateProfileInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateProfileRecord({ tx, input }))),
})
