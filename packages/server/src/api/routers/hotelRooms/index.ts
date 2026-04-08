import { createHotelRoomRecord, deleteHotelRoomRecord, updateHotelRoomRecord } from './mutations'
import { getHotelRooms } from './queries'
import { createHotelRoomInput, deleteHotelRoomInput, updateHotelRoomInput } from './schemas'

import { inRlsTransaction } from '../../inRlsTransaction'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../../trpc'

export const hotelRoomsRouter = createTRPCRouter({
  getHotelRooms: publicProcedure.query(async ({ ctx }) => inRlsTransaction(ctx, async (tx) => getHotelRooms({ tx }))),

  createHotelRoom: protectedProcedure
    .input(createHotelRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => createHotelRoomRecord({ tx, input }))),

  updateHotelRoom: protectedProcedure
    .input(updateHotelRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => updateHotelRoomRecord({ tx, input }))),

  deleteHotelRoom: protectedProcedure
    .input(deleteHotelRoomInput)
    .mutation(async ({ input, ctx }) => inRlsTransaction(ctx, async (tx) => deleteHotelRoomRecord({ tx, input }))),
})
