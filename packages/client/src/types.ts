import { RouterInputs, RouterOutputs } from '@amber/server'

export type ToFormValues<T extends { id?: number | bigint }> = Omit<T, 'id'> & Partial<Pick<T, 'id'>>

export type HotelRoom = RouterOutputs['hotelRooms']['getHotelRooms'][0]
export type HotelRoomEditorType = ToFormValues<HotelRoom>
// export type CreateHotelRoomInputType = RouterInputs['hotelRooms']['createHotelRoom']

export type HotelRoomDetails = RouterOutputs['hotelRoomDetails']['getHotelRoomDetails'][0]
export type HotelRoomDetailsEditorType = ToFormValues<HotelRoomDetails>

export type Lookup = RouterOutputs['lookups']['getLookups'][0]
export type LookupValue = RouterOutputs['lookups']['getLookupValues'][0]

export type MembershipAndUserAndRoom = RouterOutputs['memberships']['getMembershipsByYear'][0]
export type CreateMembershipInputType = RouterInputs['memberships']['createMembership']
export type CreateMembershipOutputType = RouterOutputs['memberships']['createMembership']['membership']
export type CreateMembershipType = ToFormValues<CreateMembershipOutputType>

export type UserMembership = RouterOutputs['memberships']['getAllMembersBy'][0]
export type UserAndShortMembership = RouterOutputs['users']['getAllUsersBy'][0]

export type Setting = RouterOutputs['settings']['getSettings'][0]

export type Slot = RouterOutputs['slots']['getSlots'][0]

export type User = RouterOutputs['users']['getAllUsers'][0]
export type UserAndProfile = RouterOutputs['users']['getAllUsersAndProfiles'][0]
