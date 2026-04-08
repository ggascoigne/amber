import { z } from 'zod'

const normalizeMembershipDateInput = (value: unknown) =>
  value === '' || value === null || value === undefined ? undefined : value

export const membershipDateInput = z.preprocess(normalizeMembershipDateInput, z.coerce.date())
export const membershipDateInputOptional = z.preprocess(normalizeMembershipDateInput, z.coerce.date().optional())

export const getMembershipByYearAndIdInput = z.object({
  year: z.number(),
  userId: z.number(),
})

export const getMembershipsByYearInput = z.object({
  year: z.number(),
})

export const getMembershipsByIdInput = z.object({
  id: z.number(),
})

export const getMembershipByYearAndRoomInput = z.object({
  year: z.number(),
  hotelRoomId: z.number(),
})

export const getAllMembersByInput = z.object({
  year: z.number(),
  query: z.string(),
})

export const createMembershipDataInput = z.object({
  userId: z.number(),
  year: z.number(),
  arrivalDate: membershipDateInput,
  departureDate: membershipDateInput,
  attendance: z.string(),
  attending: z.boolean(),
  hotelRoomId: z.number(),
  interestLevel: z.string(),
  message: z.string(),
  offerSubsidy: z.boolean(),
  requestOldPrice: z.boolean(),
  roomPreferenceAndNotes: z.string(),
  roomingPreferences: z.string(),
  roomingWith: z.string(),
  volunteer: z.boolean(),
  slotsAttending: z.string().nullable(),
  cost: z.number().optional().nullable(),
})

export const updateMembershipDataInput = z.object({
  arrivalDate: membershipDateInputOptional,
  departureDate: membershipDateInputOptional,
  attendance: z.string().optional(),
  attending: z.boolean().optional(),
  hotelRoomId: z.number().optional(),
  interestLevel: z.string().optional(),
  message: z.string().optional(),
  offerSubsidy: z.boolean().optional(),
  requestOldPrice: z.boolean().optional(),
  roomPreferenceAndNotes: z.string().optional(),
  roomingPreferences: z.string().optional(),
  roomingWith: z.string().optional(),
  volunteer: z.boolean().optional(),
  year: z.number().optional(),
  slotsAttending: z.string().nullable().optional(),
  cost: z.number().optional().nullable(),
})

export const createMembershipInput = createMembershipDataInput

export const updateMembershipInput = z.object({
  id: z.number(),
  data: updateMembershipDataInput,
})

export const deleteMembershipInput = z.object({
  id: z.number(),
})

export type GetMembershipByYearAndIdInput = z.infer<typeof getMembershipByYearAndIdInput>
export type GetMembershipsByYearInput = z.infer<typeof getMembershipsByYearInput>
export type GetMembershipsByIdInput = z.infer<typeof getMembershipsByIdInput>
export type GetMembershipByYearAndRoomInput = z.infer<typeof getMembershipByYearAndRoomInput>
export type GetAllMembersByInput = z.infer<typeof getAllMembersByInput>
export type CreateMembershipInput = z.infer<typeof createMembershipInput>
export type UpdateMembershipInput = z.infer<typeof updateMembershipInput>
export type DeleteMembershipInput = z.infer<typeof deleteMembershipInput>
