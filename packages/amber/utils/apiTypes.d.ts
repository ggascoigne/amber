import { GqlType, ToFormValues } from './ts-utils'

import { GameFieldsFragment, GetMembershipsByYearQuery } from '../client'
import { SlotSummary } from '../pages/GameSignup/SlotDetails'
import { HotelRoom } from '../pages/HotelRoomTypes/HotelRoomTypes'

export type Membership = GqlType<GetMembershipsByYearQuery, ['memberships', 'nodes', number]>

export type MembershipType = ToFormValues<Membership> & {
  slotsAttendingData?: boolean[]
}

export interface MembershipConfirmationBody {
  update?: boolean
  year: number
  name: string
  email: string
  url: string

  virtual: boolean
  owed: number | undefined
  address?: string
  phoneNumber?: string
  membership: MembershipType
  slotDescriptions?: string[]
  room?: HotelRoom
}

export interface MembershipConfirmation {
  type: 'membershipConfirmation'
  body: MembershipConfirmationBody
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
