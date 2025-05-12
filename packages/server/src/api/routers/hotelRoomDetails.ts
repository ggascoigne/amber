import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const hotelRoomDetailsRouter = createTRPCRouter({
  getHotelRoomDetails: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.hotelRoomDetails.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          roomType: true,
          comment: true,
          reservedFor: true,
          bathroomType: true,
          gamingRoom: true,
          enabled: true,
          formattedRoomType: true,
          internalRoomType: true,
          reserved: true,
        },
      }),
    ),
  ),

  createHotelRoomDetail: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        roomType: z.string(),
        comment: z.string().optional(),
        reservedFor: z.string().optional(),
        bathroomType: z.string(),
        gamingRoom: z.boolean(),
        enabled: z.boolean(),
        formattedRoomType: z.string().optional(),
        internalRoomType: z.string().optional(),
        reserved: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const hotelRoomDetail = await tx.hotelRoomDetails.create({
          data: {
            name: input.name,
            roomType: input.roomType,
            comment: input.comment ?? '',
            reservedFor: input.reservedFor ?? '',
            bathroomType: input.bathroomType,
            gamingRoom: input.gamingRoom,
            enabled: input.enabled,
            formattedRoomType: input.formattedRoomType ?? '',
            internalRoomType: input.internalRoomType ?? '',
            reserved: input.reserved ?? false,
            version: 1,
          },
        })
        return { hotelRoomDetail }
      }),
    ),

  updateHotelRoomDetail: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
        data: z.object({
          name: z.string().optional(),
          roomType: z.string().optional(),
          comment: z.string().optional(),
          reservedFor: z.string().optional(),
          bathroomType: z.string().optional(),
          gamingRoom: z.boolean().optional(),
          enabled: z.boolean().optional(),
          formattedRoomType: z.string().optional(),
          internalRoomType: z.string().optional(),
          reserved: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedHotelRoomDetail = await tx.hotelRoomDetails.update({
          where: { id: input.id },
          data: input.data,
        })
        return { hotelRoomDetail: updatedHotelRoomDetail }
      }),
    ),

  deleteHotelRoomDetail: protectedProcedure
    .input(
      z.object({
        id: z.bigint(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedHotelRoomDetail = await tx.hotelRoomDetails.delete({
          where: { id: input.id },
        })
        return {
          deletedHotelRoomDetail: deletedHotelRoomDetail.id,
        }
      }),
    ),
})
