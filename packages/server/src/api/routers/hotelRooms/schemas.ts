import { z } from 'zod'

export const hotelRoomDataInput = z.object({
  description: z.string(),
  gamingRoom: z.boolean(),
  bathroomType: z.string(),
  occupancy: z.string(),
  rate: z.string(),
  type: z.string(),
  quantity: z.number(),
})

export const createHotelRoomInput = hotelRoomDataInput

export const updateHotelRoomInput = z.object({
  id: z.number(),
  data: hotelRoomDataInput.partial(),
})

export const deleteHotelRoomInput = z.object({
  id: z.number(),
})

export type CreateHotelRoomInput = z.infer<typeof createHotelRoomInput>
export type UpdateHotelRoomInput = z.infer<typeof updateHotelRoomInput>
export type DeleteHotelRoomInput = z.infer<typeof deleteHotelRoomInput>
