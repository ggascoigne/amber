import type { RouterInputs, RouterOutputs } from '@amber/server'

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

export type Game = RouterOutputs['games']['getGamesByYear'][0]
export type GameArray = Game[]

export type GameAssignment = RouterOutputs['gameAssignments']['getGameAssignmentsByGameId'][0]
export type Schedule = RouterOutputs['gameAssignments']['getSchedule'][0]
export type CreateGameAssignmentInputType = RouterInputs['gameAssignments']['createGameAssignment']
export type GameAssignmentDashboardData = RouterOutputs['gameAssignments']['getAssignmentDashboardData']
export type GameAssignmentDashboardInput = RouterInputs['gameAssignments']['getAssignmentDashboardData']
export type UpdateGameAssignmentsInput = RouterInputs['gameAssignments']['updateGameAssignments']

export type StripeEntry = RouterOutputs['stripe']['getStripe'][0]

export type Transaction = RouterOutputs['transactions']['getTransactions'][0]

export type GameRoom = RouterOutputs['gameRooms']['getGameRooms'][0]

export type GameChoice = RouterOutputs['gameChoices']['getGameChoices']['gameChoices'][0]
export type GameSubmission = RouterOutputs['gameChoices']['getGameChoices']['gameSubmissions'][0]
export type GameChoicesByYear = RouterOutputs['gameChoices']['getGameChoicesByYear']['gameChoices'][0]
export type GameSubmissionsByYear = RouterOutputs['gameChoices']['getGameChoicesByYear']['gameSubmissions'][0]
export type UpsertGameChoiceBySlotInput = RouterInputs['gameChoices']['upsertGameChoiceBySlot']

export type StripeRecord = RouterOutputs['stripe']['getStripe'][0]
