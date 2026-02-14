/* eslint-disable @typescript-eslint/naming-convention */
import { debug } from 'debug'
import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

const log = debug('amber:server:api:routers:lookups')

const lookup_default = {
  codeMaximum: null,
  codeMinimum: null,
  codeScale: null,
  codeType: 'string',
  internationalize: false,
  ordering: 'sequencer',
  valueMaximum: null,
  valueMinimum: null,
  valueScale: null,
  valueType: 'string',
}

export const lookupsRouter = createTRPCRouter({
  getLookups: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.lookup.findMany({
        orderBy: { realm: 'asc' },
        include: {
          lookupValue: {
            orderBy: { sequencer: 'asc' },
          },
        },
      }),
    ),
  ),

  getLookupValues: publicProcedure
    .input(
      z.object({
        realm: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.lookup.findMany({
          where: { realm: input.realm },
          include: {
            lookupValue: {
              orderBy: { value: 'asc' },
            },
          },
        }),
      ),
    ),

  getSingleLookupValue: publicProcedure
    .input(
      z.object({
        realm: z.string(),
        code: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.lookup.findMany({
          where: { realm: input.realm },
          include: {
            lookupValue: {
              where: { code: input.code },
            },
          },
        }),
      ),
    ),

  createLookup: protectedProcedure
    .input(
      z.object({
        realm: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const lookup = await tx.lookup.create({
          data: {
            realm: input.realm,
            ...lookup_default,
          },
        })
        log('createLookup', lookup)
        return { lookup, update: false }
      }),
    ),

  updateLookup: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        realm: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedLookup = await tx.lookup.update({
          where: { id: input.id },
          data: {
            realm: input.realm,
          },
        })
        log('updateLookup', updatedLookup)
        return { lookup: updatedLookup, update: true }
      }),
    ),

  deleteLookup: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedLookup = await tx.lookup.delete({
          where: { id: input.id },
        })
        log('deleteLookup', deletedLookup)
        return {
          deletedLookupId: deletedLookup.id,
        }
      }),
    ),

  createLookupValue: protectedProcedure
    .input(
      z.object({
        lookupId: z.number(),
        code: z.string(),
        sequencer: z.number(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const lookupValue = await tx.lookupValue.create({
          data: {
            lookupId: input.lookupId,
            code: input.code,
            sequencer: input.sequencer,
            value: input.value,
            numericSequencer: 0,
            stringSequencer: '_',
          },
        })
        log('createLookupValue', lookupValue)
        return { lookupValue, update: false }
      }),
    ),

  updateLookupValue: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        sequencer: z.number().optional(),
        value: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedLookupValue = await tx.lookupValue.update({
          where: { id: input.id },
          data: {
            code: input.code,
            sequencer: input.sequencer,
            value: input.value,
          },
        })
        log('updateLookupValue', updatedLookupValue)
        return { lookupValue: updatedLookupValue, update: true }
      }),
    ),

  deleteLookupValue: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedLookupValue = await tx.lookupValue.delete({
          where: { id: input.id },
        })
        log('deleteLookupValue', deletedLookupValue)
        return {
          deletedLookupValueId: deletedLookupValue.id,
        }
      }),
    ),
})
