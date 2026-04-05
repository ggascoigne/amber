import { z } from 'zod'

const nullableStringSchema = z.string().nullable().optional()
const nullableNumberSchema = z.number().nullable().optional()

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

const membershipSchema = z.object({
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
  cost: z.number().optional().nullable(),
})

export const membershipConfirmationItemSchema = z.object({
  update: z.union([z.literal('new'), z.literal('update'), z.literal('status')]),
  year: z.number(),
  name: z.string(),
  email: z.string(),
  url: z.string(),
  paymentUrl: z.string(),
  virtual: z.boolean(),
  owed: z.number().optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  membership: membershipSchema,
  slotDescriptions: z.array(z.string()).optional(),
  room: hotelRoomSchema.optional(),
})

export const membershipConfirmationBodySchema = z.array(membershipConfirmationItemSchema)

const gameSchema = z.object({
  name: z.string(),
  gmNames: nullableStringSchema,
  type: nullableStringSchema,
  teenFriendly: z.boolean().nullable().optional(),
  description: nullableStringSchema,
  setting: nullableStringSchema,
  charInstructions: nullableStringSchema,
  playerMin: nullableNumberSchema,
  playerMax: nullableNumberSchema,
  playerPreference: nullableStringSchema,
  returningPlayers: nullableStringSchema,
  playersContactGm: z.boolean().nullable().optional(),
  gameContactEmail: nullableStringSchema,
  estimatedLength: nullableStringSchema,
  slotPreference: nullableNumberSchema.or(nullableStringSchema),
  slotConflicts: nullableStringSchema,
  message: nullableStringSchema,
})

export const gameConfirmationBodySchema = z.object({
  update: z.boolean().optional(),
  year: z.number(),
  name: z.string(),
  email: z.string(),
  url: z.string(),
  game: gameSchema,
})

const slotSummarySchema = z.object({
  slotId: z.number(),
  slotDescription: z.string(),
  lines: z.array(
    z.object({
      rank: z.string(),
      description: z.string(),
    }),
  ),
})

export const gameChoiceConfirmationBodySchema = z.object({
  update: z.boolean().optional(),
  year: z.number(),
  name: z.string(),
  email: z.string(),
  url: z.string(),
  gameChoiceDetails: z.record(z.string(), slotSummarySchema),
  message: z.string().optional(),
})

export const gameAssignmentChangeBodySchema = z.object({
  year: z.number(),
  adds: z.array(
    z.object({
      memberId: z.number(),
      gameId: z.number(),
    }),
  ),
  removes: z.array(
    z.object({
      memberId: z.number(),
      gameId: z.number(),
    }),
  ),
})

export const sendEmailInputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('membershipConfirmation'),
    body: membershipConfirmationBodySchema,
  }),
  z.object({
    type: z.literal('gameConfirmation'),
    body: gameConfirmationBodySchema,
  }),
  z.object({
    type: z.literal('gameChoiceConfirmation'),
    body: gameChoiceConfirmationBodySchema,
  }),
  z.object({
    type: z.literal('gameAssignmentChange'),
    body: gameAssignmentChangeBodySchema,
  }),
])

export type MembershipConfirmationBody = z.infer<typeof membershipConfirmationBodySchema>
export type GameConfirmationBody = z.infer<typeof gameConfirmationBodySchema>
export type GameChoiceConfirmationBody = z.infer<typeof gameChoiceConfirmationBodySchema>
export type GameAssignmentChangeBody = z.infer<typeof gameAssignmentChangeBodySchema>
export type SendEmailInput = z.infer<typeof sendEmailInputSchema>
