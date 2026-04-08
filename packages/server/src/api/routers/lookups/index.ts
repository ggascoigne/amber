import {
  createLookupRecord,
  createLookupValueRecord,
  deleteLookupRecord,
  deleteLookupValueRecord,
  updateLookupRecord,
  updateLookupValueRecord,
} from './mutations'
import { getLookups, getLookupValues, getSingleLookupValue } from './queries'
import {
  createLookupInput,
  createLookupValueInput,
  deleteLookupInput,
  deleteLookupValueInput,
  getLookupValuesInput,
  getSingleLookupValueInput,
  updateLookupInput,
  updateLookupValueInput,
} from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const lookupsRouter = createTRPCRouter({
  getLookups: publicProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getLookups({ tx }))),

  getLookupValues: publicProcedure
    .input(getLookupValuesInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getLookupValues({ tx, input }))),

  getSingleLookupValue: publicProcedure
    .input(getSingleLookupValueInput)
    .query(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => getSingleLookupValue({ tx, input }))),

  createLookup: protectedProcedure
    .input(createLookupInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createLookupRecord({ tx, input }))),

  updateLookup: protectedProcedure
    .input(updateLookupInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateLookupRecord({ tx, input }))),

  deleteLookup: protectedProcedure
    .input(deleteLookupInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteLookupRecord({ tx, input }))),

  createLookupValue: protectedProcedure
    .input(createLookupValueInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createLookupValueRecord({ tx, input }))),

  updateLookupValue: protectedProcedure
    .input(updateLookupValueInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateLookupValueRecord({ tx, input }))),

  deleteLookupValue: protectedProcedure
    .input(deleteLookupValueInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteLookupValueRecord({ tx, input }))),
})
