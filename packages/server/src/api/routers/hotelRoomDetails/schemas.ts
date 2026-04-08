import { z } from 'zod'

export const hotelRoomDetailDataInput = z.object({
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
})

export const createHotelRoomDetailInput = hotelRoomDetailDataInput

export const updateHotelRoomDetailInput = z.object({
  id: z.bigint(),
  data: hotelRoomDetailDataInput.partial(),
})

export const deleteHotelRoomDetailInput = z.object({
  id: z.bigint(),
})

export type CreateHotelRoomDetailInput = z.infer<typeof createHotelRoomDetailInput>
export type UpdateHotelRoomDetailInput = z.infer<typeof updateHotelRoomDetailInput>
export type DeleteHotelRoomDetailInput = z.infer<typeof deleteHotelRoomDetailInput>
