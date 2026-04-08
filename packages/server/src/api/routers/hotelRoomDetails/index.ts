import { createHotelRoomDetailRecord, deleteHotelRoomDetailRecord, updateHotelRoomDetailRecord } from './mutations'
import { getHotelRoomDetails } from './queries'
import { createHotelRoomDetailInput, deleteHotelRoomDetailInput, updateHotelRoomDetailInput } from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const hotelRoomDetailsRouter = createTRPCRouter({
  getHotelRoomDetails: publicProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) => getHotelRoomDetails({ tx })),
  ),

  createHotelRoomDetail: protectedProcedure
    .input(createHotelRoomDetailInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => createHotelRoomDetailRecord({ tx, input })),
    ),

  updateHotelRoomDetail: protectedProcedure
    .input(updateHotelRoomDetailInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => updateHotelRoomDetailRecord({ tx, input })),
    ),

  deleteHotelRoomDetail: protectedProcedure
    .input(deleteHotelRoomDetailInput)
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => deleteHotelRoomDetailRecord({ tx, input })),
    ),
})
