import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc'

export const hotelRoomsRouter = createTRPCRouter({
  getHotelRooms: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.hotelRoom.findMany({
        orderBy: { type: 'asc' },
        select: {
          id: true,
          description: true,
          gamingRoom: true,
          bathroomType: true,
          occupancy: true,
          rate: true,
          type: true,
          quantity: true,
        },
      }),
    ),
  ),

  createHotelRoom: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        gamingRoom: z.boolean(),
        bathroomType: z.string(),
        occupancy: z.string(),
        rate: z.string(),
        type: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const hotelRoom = await tx.hotelRoom.create({
          data: {
            description: input.description,
            gamingRoom: input.gamingRoom,
            bathroomType: input.bathroomType,
            occupancy: input.occupancy,
            rate: input.rate,
            type: input.type,
            quantity: input.quantity,
          },
        })
        return { hotelRoom }
      }),
    ),

  updateHotelRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          description: z.string().optional(),
          gamingRoom: z.boolean().optional(),
          bathroomType: z.string().optional(),
          occupancy: z.string().optional(),
          rate: z.string().optional(),
          type: z.string().optional(),
          quantity: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedHotelRoom = await tx.hotelRoom.update({
          where: { id: input.id },
          data: input.data,
        })
        return { hotelRoom: updatedHotelRoom }
      }),
    ),

  deleteHotelRoom: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const deletedHotelRoom = await tx.hotelRoom.delete({
          where: { id: input.id },
        })
        return {
          deletedHotelRoomId: deletedHotelRoom.id,
        }
      }),
    ),
})
