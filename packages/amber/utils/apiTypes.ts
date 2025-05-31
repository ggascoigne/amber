import { CreateMembershipType, UserAndProfile } from '@amber/client'
import { ToFormValues } from 'ui/utils/ts-utils'
import { z } from 'zod'

import { GameFieldsFragment } from '../client-graphql'
import { SlotSummary } from '../views/GameSignup/SlotDetails'

// export type Membership = GqlType<GetMembershipsByYearQuery, ['memberships', 'nodes', number]>

export type MembershipType = ToFormValues<CreateMembershipType> & {
  slotsAttendingData?: boolean[]
}

const userSchema = z
  .union([
    z.object({
      id: z.number(),
      email: z.string(),
      fullName: z.union([z.string(), z.undefined()]).optional().nullable(),
      firstName: z.union([z.string(), z.undefined()]).optional().nullable(),
      lastName: z.union([z.string(), z.undefined()]).optional().nullable(),
      displayName: z.union([z.string(), z.undefined()]).optional().nullable(),
      balance: z.number(),
    }),
    z.undefined(),
  ])
  .optional()
  .nullable()

const hotelRoomSchema = z.object({
  id: z.number(),
  description: z.string(),
  gamingRoom: z.boolean(),
  bathroomType: z.string(),
  occupancy: z.string(),
  rate: z.string(),
  type: z.string(),
  quantity: z.number(),
})

const membershipTypeSchema = z.object({
  id: z.union([z.number(), z.undefined()]),
  arrivalDate: z.string(),
  attendance: z.string(),
  attending: z.boolean(),
  hotelRoomId: z.number(),
  departureDate: z.string(),
  interestLevel: z.string(),
  message: z.string(),
  offerSubsidy: z.boolean(),
  requestOldPrice: z.boolean(),
  roomPreferenceAndNotes: z.string(),
  roomingPreferences: z.string(),
  roomingWith: z.string(),
  userId: z.number(),
  volunteer: z.boolean(),
  year: z.number(),
  slotsAttending: z.union([z.string(), z.undefined()]).optional().nullable(),
  user: userSchema,
  hotelRoom: z
    .union([
      z.object({
        type: z.string(),
      }),
      z.undefined(),
    ])
    .optional()
    .nullable(),
})

export type UserType = UserAndProfile

export type MembershipConfirmationBodyUpdateType = 'new' | 'update' | 'status'

export const membershipConfirmationItemSchema = z.object({
  update: z.union([z.literal('new'), z.literal('update'), z.literal('status')]),
  year: z.number(),
  name: z.string(),
  email: z.string(),
  url: z.string(),
  paymentUrl: z.string(),
  virtual: z.boolean(),
  owed: z.union([z.number(), z.undefined()]).optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  membership: membershipTypeSchema,
  slotDescriptions: z.array(z.string()).optional(),
  room: hotelRoomSchema.optional(),
})

export type MembershipConfirmationItem = z.input<typeof membershipConfirmationItemSchema>

export const membershipConfirmationSchema = z.array(membershipConfirmationItemSchema)

export type MembershipConfirmationBodyInput = z.input<typeof membershipConfirmationSchema>
export type MembershipConfirmationBody = z.output<typeof membershipConfirmationSchema>

// export interface MembershipConfirmationBody {
//   update?: MembershipConfirmationBodyUpdateType
//   year: number
//   name: string
//   email: string
//   url: string
//   paymentUrl: string

//   virtual: boolean
//   owed: number | undefined
//   address?: string
//   phoneNumber?: string
//   membership: MembershipType
//   slotDescriptions?: string[]
//   room?: HotelRoom
// }

export interface MembershipConfirmation {
  type: 'membershipConfirmation'
  body: MembershipConfirmationBodyInput
}

type GameFields = Omit<GameFieldsFragment, 'nodeId' | 'id' | '__typename' | 'gameAssignments'>

export interface GameConfirmationBody {
  update?: boolean
  year: number
  name: string
  email: string
  url: string

  game: GameFields
}

export interface GameConfirmation {
  type: 'gameConfirmation'
  body: GameConfirmationBody
}

export interface GameChoiceConfirmationBody {
  update?: boolean
  year: number
  name: string
  email: string
  url: string

  gameChoiceDetails: Record<number, SlotSummary>
  message?: string
}

export interface GameChoiceConfirmation {
  type: 'gameChoiceConfirmation'
  body: GameChoiceConfirmationBody
}

export type EmailConfirmation = MembershipConfirmation | GameConfirmation | GameChoiceConfirmation
