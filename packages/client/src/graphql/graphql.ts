/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: { input: any; output: any }
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: any; output: any }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any }
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: { input: string; output: string }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: { [key: string]: any }; output: { [key: string]: any } }
}

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>
}

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>
}

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** All input for the `createBareSlotChoices` mutation. */
export type CreateBareSlotChoicesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  noSlots?: InputMaybe<Scalars['Int']['input']>
  yearNo?: InputMaybe<Scalars['Int']['input']>
}

/** The output of our `createBareSlotChoices` mutation. */
export type CreateBareSlotChoicesPayload = {
  __typename: 'CreateBareSlotChoicesPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** All input for the create `GameAssignment` mutation. */
export type CreateGameAssignmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `GameAssignment` to be created by this mutation. */
  gameAssignment: GameAssignmentInput
}

/** The output of our create `GameAssignment` mutation. */
export type CreateGameAssignmentPayload = {
  __typename: 'CreateGameAssignmentPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Game` that is related to this `GameAssignment`. */
  game?: Maybe<Game>
  /** The `GameAssignment` that was created by this mutation. */
  gameAssignment?: Maybe<GameAssignment>
  /** An edge for our `GameAssignment`. May be used by Relay 1. */
  gameAssignmentEdge?: Maybe<GameAssignmentsEdge>
  /** Reads a single `Membership` that is related to this `GameAssignment`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `GameAssignment` mutation. */
export type CreateGameAssignmentPayloadGameAssignmentEdgeArgs = {
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

/** All input for the create `GameChoice` mutation. */
export type CreateGameChoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `GameChoice` to be created by this mutation. */
  gameChoice: GameChoiceInput
}

/** The output of our create `GameChoice` mutation. */
export type CreateGameChoicePayload = {
  __typename: 'CreateGameChoicePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Game` that is related to this `GameChoice`. */
  game?: Maybe<Game>
  /** The `GameChoice` that was created by this mutation. */
  gameChoice?: Maybe<GameChoice>
  /** An edge for our `GameChoice`. May be used by Relay 1. */
  gameChoiceEdge?: Maybe<GameChoicesEdge>
  /** Reads a single `Membership` that is related to this `GameChoice`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Slot` that is related to this `GameChoice`. */
  slot?: Maybe<Slot>
}

/** The output of our create `GameChoice` mutation. */
export type CreateGameChoicePayloadGameChoiceEdgeArgs = {
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

/** All input for the create `Game` mutation. */
export type CreateGameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Game` to be created by this mutation. */
  game: GameInput
}

/** The output of our create `Game` mutation. */
export type CreateGamePayload = {
  __typename: 'CreateGamePayload'
  /** Reads a single `User` that is related to this `Game`. */
  author?: Maybe<User>
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Game` that was created by this mutation. */
  game?: Maybe<Game>
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Room` that is related to this `Game`. */
  room?: Maybe<Room>
  /** Reads a single `Slot` that is related to this `Game`. */
  slot?: Maybe<Slot>
}

/** The output of our create `Game` mutation. */
export type CreateGamePayloadGameEdgeArgs = {
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** All input for the create `GameSubmission` mutation. */
export type CreateGameSubmissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `GameSubmission` to be created by this mutation. */
  gameSubmission: GameSubmissionInput
}

/** The output of our create `GameSubmission` mutation. */
export type CreateGameSubmissionPayload = {
  __typename: 'CreateGameSubmissionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `GameSubmission` that was created by this mutation. */
  gameSubmission?: Maybe<GameSubmission>
  /** An edge for our `GameSubmission`. May be used by Relay 1. */
  gameSubmissionEdge?: Maybe<GameSubmissionsEdge>
  /** Reads a single `Membership` that is related to this `GameSubmission`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `GameSubmission` mutation. */
export type CreateGameSubmissionPayloadGameSubmissionEdgeArgs = {
  orderBy?: InputMaybe<Array<GameSubmissionsOrderBy>>
}

/** All input for the create `HotelRoomDetail` mutation. */
export type CreateHotelRoomDetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `HotelRoomDetail` to be created by this mutation. */
  hotelRoomDetail: HotelRoomDetailInput
}

/** The output of our create `HotelRoomDetail` mutation. */
export type CreateHotelRoomDetailPayload = {
  __typename: 'CreateHotelRoomDetailPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `HotelRoomDetail` that was created by this mutation. */
  hotelRoomDetail?: Maybe<HotelRoomDetail>
  /** An edge for our `HotelRoomDetail`. May be used by Relay 1. */
  hotelRoomDetailEdge?: Maybe<HotelRoomDetailsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `HotelRoomDetail` mutation. */
export type CreateHotelRoomDetailPayloadHotelRoomDetailEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomDetailsOrderBy>>
}

/** All input for the create `HotelRoom` mutation. */
export type CreateHotelRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `HotelRoom` to be created by this mutation. */
  hotelRoom: HotelRoomInput
}

/** The output of our create `HotelRoom` mutation. */
export type CreateHotelRoomPayload = {
  __typename: 'CreateHotelRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `HotelRoom` that was created by this mutation. */
  hotelRoom?: Maybe<HotelRoom>
  /** An edge for our `HotelRoom`. May be used by Relay 1. */
  hotelRoomEdge?: Maybe<HotelRoomsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `HotelRoom` mutation. */
export type CreateHotelRoomPayloadHotelRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomsOrderBy>>
}

/** All input for the create `Lookup` mutation. */
export type CreateLookupInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Lookup` to be created by this mutation. */
  lookup: LookupInput
}

/** The output of our create `Lookup` mutation. */
export type CreateLookupPayload = {
  __typename: 'CreateLookupPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Lookup` that was created by this mutation. */
  lookup?: Maybe<Lookup>
  /** An edge for our `Lookup`. May be used by Relay 1. */
  lookupEdge?: Maybe<LookupsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `Lookup` mutation. */
export type CreateLookupPayloadLookupEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupsOrderBy>>
}

/** All input for the create `LookupValue` mutation. */
export type CreateLookupValueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `LookupValue` to be created by this mutation. */
  lookupValue: LookupValueInput
}

/** The output of our create `LookupValue` mutation. */
export type CreateLookupValuePayload = {
  __typename: 'CreateLookupValuePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Lookup` that is related to this `LookupValue`. */
  lookup?: Maybe<Lookup>
  /** The `LookupValue` that was created by this mutation. */
  lookupValue?: Maybe<LookupValue>
  /** An edge for our `LookupValue`. May be used by Relay 1. */
  lookupValueEdge?: Maybe<LookupValuesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our create `LookupValue` mutation. */
export type CreateLookupValuePayloadLookupValueEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupValuesOrderBy>>
}

/** All input for the create `Membership` mutation. */
export type CreateMembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Membership` to be created by this mutation. */
  membership: MembershipInput
}

/** The output of our create `Membership` mutation. */
export type CreateMembershipPayload = {
  __typename: 'CreateMembershipPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `HotelRoom` that is related to this `Membership`. */
  hotelRoom?: Maybe<HotelRoom>
  /** The `Membership` that was created by this mutation. */
  membership?: Maybe<Membership>
  /** An edge for our `Membership`. May be used by Relay 1. */
  membershipEdge?: Maybe<MembershipsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Membership`. */
  user?: Maybe<User>
}

/** The output of our create `Membership` mutation. */
export type CreateMembershipPayloadMembershipEdgeArgs = {
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

/** All input for the create `Profile` mutation. */
export type CreateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Profile` to be created by this mutation. */
  profile: ProfileInput
}

/** The output of our create `Profile` mutation. */
export type CreateProfilePayload = {
  __typename: 'CreateProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Profile` that was created by this mutation. */
  profile?: Maybe<Profile>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  user?: Maybe<User>
}

/** The output of our create `Profile` mutation. */
export type CreateProfilePayloadProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>
}

/** All input for the create `Role` mutation. */
export type CreateRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Role` to be created by this mutation. */
  role: RoleInput
}

/** The output of our create `Role` mutation. */
export type CreateRolePayload = {
  __typename: 'CreateRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Role` that was created by this mutation. */
  role?: Maybe<Role>
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RolesEdge>
}

/** The output of our create `Role` mutation. */
export type CreateRolePayloadRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<RolesOrderBy>>
}

/** All input for the create `Room` mutation. */
export type CreateRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Room` to be created by this mutation. */
  room: RoomInput
}

/** The output of our create `Room` mutation. */
export type CreateRoomPayload = {
  __typename: 'CreateRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Room` that was created by this mutation. */
  room?: Maybe<Room>
  /** An edge for our `Room`. May be used by Relay 1. */
  roomEdge?: Maybe<RoomsEdge>
}

/** The output of our create `Room` mutation. */
export type CreateRoomPayloadRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<RoomsOrderBy>>
}

/** All input for the create `Setting` mutation. */
export type CreateSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Setting` to be created by this mutation. */
  setting: SettingInput
}

/** The output of our create `Setting` mutation. */
export type CreateSettingPayload = {
  __typename: 'CreateSettingPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Setting` that was created by this mutation. */
  setting?: Maybe<Setting>
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingsEdge>
}

/** The output of our create `Setting` mutation. */
export type CreateSettingPayloadSettingEdgeArgs = {
  orderBy?: InputMaybe<Array<SettingsOrderBy>>
}

/** All input for the create `ShirtOrder` mutation. */
export type CreateShirtOrderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `ShirtOrder` to be created by this mutation. */
  shirtOrder: ShirtOrderInput
}

/** All input for the create `ShirtOrderItem` mutation. */
export type CreateShirtOrderItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `ShirtOrderItem` to be created by this mutation. */
  shirtOrderItem: ShirtOrderItemInput
}

/** The output of our create `ShirtOrderItem` mutation. */
export type CreateShirtOrderItemPayload = {
  __typename: 'CreateShirtOrderItemPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`. */
  order?: Maybe<ShirtOrder>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrderItem` that was created by this mutation. */
  shirtOrderItem?: Maybe<ShirtOrderItem>
  /** An edge for our `ShirtOrderItem`. May be used by Relay 1. */
  shirtOrderItemEdge?: Maybe<ShirtOrderItemsEdge>
}

/** The output of our create `ShirtOrderItem` mutation. */
export type CreateShirtOrderItemPayloadShirtOrderItemEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrderItemsOrderBy>>
}

/** The output of our create `ShirtOrder` mutation. */
export type CreateShirtOrderPayload = {
  __typename: 'CreateShirtOrderPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrder` that was created by this mutation. */
  shirtOrder?: Maybe<ShirtOrder>
  /** An edge for our `ShirtOrder`. May be used by Relay 1. */
  shirtOrderEdge?: Maybe<ShirtOrdersEdge>
  /** Reads a single `User` that is related to this `ShirtOrder`. */
  user?: Maybe<User>
}

/** The output of our create `ShirtOrder` mutation. */
export type CreateShirtOrderPayloadShirtOrderEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrdersOrderBy>>
}

/** All input for the create `Slot` mutation. */
export type CreateSlotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Slot` to be created by this mutation. */
  slot: SlotInput
}

/** The output of our create `Slot` mutation. */
export type CreateSlotPayload = {
  __typename: 'CreateSlotPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Slot` that was created by this mutation. */
  slot?: Maybe<Slot>
  /** An edge for our `Slot`. May be used by Relay 1. */
  slotEdge?: Maybe<SlotsEdge>
}

/** The output of our create `Slot` mutation. */
export type CreateSlotPayloadSlotEdgeArgs = {
  orderBy?: InputMaybe<Array<SlotsOrderBy>>
}

/** All input for the create `Stripe` mutation. */
export type CreateStripeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Stripe` to be created by this mutation. */
  stripe: StripeInput
}

/** The output of our create `Stripe` mutation. */
export type CreateStripePayload = {
  __typename: 'CreateStripePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Stripe` that was created by this mutation. */
  stripe?: Maybe<Stripe>
  /** An edge for our `Stripe`. May be used by Relay 1. */
  stripeEdge?: Maybe<StripesEdge>
}

/** The output of our create `Stripe` mutation. */
export type CreateStripePayloadStripeEdgeArgs = {
  orderBy?: InputMaybe<Array<StripesOrderBy>>
}

/** All input for the create `Transaction` mutation. */
export type CreateTransactionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `Transaction` to be created by this mutation. */
  transaction: TransactionInput
}

/** The output of our create `Transaction` mutation. */
export type CreateTransactionPayload = {
  __typename: 'CreateTransactionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Membership` that is related to this `Transaction`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Transaction` that was created by this mutation. */
  transaction?: Maybe<Transaction>
  /** An edge for our `Transaction`. May be used by Relay 1. */
  transactionEdge?: Maybe<TransactionsEdge>
  /** Reads a single `User` that is related to this `Transaction`. */
  user?: Maybe<User>
  /** Reads a single `User` that is related to this `Transaction`. */
  userByOrigin?: Maybe<User>
}

/** The output of our create `Transaction` mutation. */
export type CreateTransactionPayloadTransactionEdgeArgs = {
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `User` to be created by this mutation. */
  user: UserInput
}

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename: 'CreateUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
}

/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>
}

/** All input for the create `UserRole` mutation. */
export type CreateUserRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The `UserRole` to be created by this mutation. */
  userRole: UserRoleInput
}

/** The output of our create `UserRole` mutation. */
export type CreateUserRolePayload = {
  __typename: 'CreateUserRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Role` that is related to this `UserRole`. */
  role?: Maybe<Role>
  /** Reads a single `User` that is related to this `UserRole`. */
  user?: Maybe<User>
  /** The `UserRole` that was created by this mutation. */
  userRole?: Maybe<UserRole>
  /** An edge for our `UserRole`. May be used by Relay 1. */
  userRoleEdge?: Maybe<UserRolesEdge>
}

/** The output of our create `UserRole` mutation. */
export type CreateUserRolePayloadUserRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>
}

/** All input for the `deleteGameAssignmentByNodeId` mutation. */
export type DeleteGameAssignmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameAssignment` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteGameAssignment` mutation. */
export type DeleteGameAssignmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  gameId: Scalars['Int']['input']
  gm: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
}

/** The output of our delete `GameAssignment` mutation. */
export type DeleteGameAssignmentPayload = {
  __typename: 'DeleteGameAssignmentPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedGameAssignmentNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `Game` that is related to this `GameAssignment`. */
  game?: Maybe<Game>
  /** The `GameAssignment` that was deleted by this mutation. */
  gameAssignment?: Maybe<GameAssignment>
  /** An edge for our `GameAssignment`. May be used by Relay 1. */
  gameAssignmentEdge?: Maybe<GameAssignmentsEdge>
  /** Reads a single `Membership` that is related to this `GameAssignment`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `GameAssignment` mutation. */
export type DeleteGameAssignmentPayloadGameAssignmentEdgeArgs = {
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

/** All input for the `deleteGameByNodeId` mutation. */
export type DeleteGameByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Game` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteGameChoiceByNodeId` mutation. */
export type DeleteGameChoiceByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameChoice` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteGameChoice` mutation. */
export type DeleteGameChoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `GameChoice` mutation. */
export type DeleteGameChoicePayload = {
  __typename: 'DeleteGameChoicePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedGameChoiceNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `Game` that is related to this `GameChoice`. */
  game?: Maybe<Game>
  /** The `GameChoice` that was deleted by this mutation. */
  gameChoice?: Maybe<GameChoice>
  /** An edge for our `GameChoice`. May be used by Relay 1. */
  gameChoiceEdge?: Maybe<GameChoicesEdge>
  /** Reads a single `Membership` that is related to this `GameChoice`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Slot` that is related to this `GameChoice`. */
  slot?: Maybe<Slot>
}

/** The output of our delete `GameChoice` mutation. */
export type DeleteGameChoicePayloadGameChoiceEdgeArgs = {
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

/** All input for the `deleteGame` mutation. */
export type DeleteGameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Game` mutation. */
export type DeleteGamePayload = {
  __typename: 'DeleteGamePayload'
  /** Reads a single `User` that is related to this `Game`. */
  author?: Maybe<User>
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedGameNodeId?: Maybe<Scalars['ID']['output']>
  /** The `Game` that was deleted by this mutation. */
  game?: Maybe<Game>
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Room` that is related to this `Game`. */
  room?: Maybe<Room>
  /** Reads a single `Slot` that is related to this `Game`. */
  slot?: Maybe<Slot>
}

/** The output of our delete `Game` mutation. */
export type DeleteGamePayloadGameEdgeArgs = {
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** All input for the `deleteGameSubmissionByNodeId` mutation. */
export type DeleteGameSubmissionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameSubmission` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteGameSubmission` mutation. */
export type DeleteGameSubmissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `GameSubmission` mutation. */
export type DeleteGameSubmissionPayload = {
  __typename: 'DeleteGameSubmissionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedGameSubmissionNodeId?: Maybe<Scalars['ID']['output']>
  /** The `GameSubmission` that was deleted by this mutation. */
  gameSubmission?: Maybe<GameSubmission>
  /** An edge for our `GameSubmission`. May be used by Relay 1. */
  gameSubmissionEdge?: Maybe<GameSubmissionsEdge>
  /** Reads a single `Membership` that is related to this `GameSubmission`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `GameSubmission` mutation. */
export type DeleteGameSubmissionPayloadGameSubmissionEdgeArgs = {
  orderBy?: InputMaybe<Array<GameSubmissionsOrderBy>>
}

/** All input for the `deleteHotelRoomByNodeId` mutation. */
export type DeleteHotelRoomByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `HotelRoom` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteHotelRoomDetailByNodeId` mutation. */
export type DeleteHotelRoomDetailByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `HotelRoomDetail` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteHotelRoomDetail` mutation. */
export type DeleteHotelRoomDetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['BigInt']['input']
}

/** The output of our delete `HotelRoomDetail` mutation. */
export type DeleteHotelRoomDetailPayload = {
  __typename: 'DeleteHotelRoomDetailPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedHotelRoomDetailNodeId?: Maybe<Scalars['ID']['output']>
  /** The `HotelRoomDetail` that was deleted by this mutation. */
  hotelRoomDetail?: Maybe<HotelRoomDetail>
  /** An edge for our `HotelRoomDetail`. May be used by Relay 1. */
  hotelRoomDetailEdge?: Maybe<HotelRoomDetailsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `HotelRoomDetail` mutation. */
export type DeleteHotelRoomDetailPayloadHotelRoomDetailEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomDetailsOrderBy>>
}

/** All input for the `deleteHotelRoom` mutation. */
export type DeleteHotelRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `HotelRoom` mutation. */
export type DeleteHotelRoomPayload = {
  __typename: 'DeleteHotelRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedHotelRoomNodeId?: Maybe<Scalars['ID']['output']>
  /** The `HotelRoom` that was deleted by this mutation. */
  hotelRoom?: Maybe<HotelRoom>
  /** An edge for our `HotelRoom`. May be used by Relay 1. */
  hotelRoomEdge?: Maybe<HotelRoomsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `HotelRoom` mutation. */
export type DeleteHotelRoomPayloadHotelRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomsOrderBy>>
}

/** All input for the `deleteLookupByNodeId` mutation. */
export type DeleteLookupByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Lookup` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteLookupByRealm` mutation. */
export type DeleteLookupByRealmInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  realm: Scalars['String']['input']
}

/** All input for the `deleteLookup` mutation. */
export type DeleteLookupInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Lookup` mutation. */
export type DeleteLookupPayload = {
  __typename: 'DeleteLookupPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedLookupNodeId?: Maybe<Scalars['ID']['output']>
  /** The `Lookup` that was deleted by this mutation. */
  lookup?: Maybe<Lookup>
  /** An edge for our `Lookup`. May be used by Relay 1. */
  lookupEdge?: Maybe<LookupsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `Lookup` mutation. */
export type DeleteLookupPayloadLookupEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupsOrderBy>>
}

/** All input for the `deleteLookupValueByLookupIdAndCode` mutation. */
export type DeleteLookupValueByLookupIdAndCodeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  code: Scalars['String']['input']
  lookupId: Scalars['Int']['input']
}

/** All input for the `deleteLookupValueByNodeId` mutation. */
export type DeleteLookupValueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `LookupValue` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteLookupValue` mutation. */
export type DeleteLookupValueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `LookupValue` mutation. */
export type DeleteLookupValuePayload = {
  __typename: 'DeleteLookupValuePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedLookupValueNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `Lookup` that is related to this `LookupValue`. */
  lookup?: Maybe<Lookup>
  /** The `LookupValue` that was deleted by this mutation. */
  lookupValue?: Maybe<LookupValue>
  /** An edge for our `LookupValue`. May be used by Relay 1. */
  lookupValueEdge?: Maybe<LookupValuesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our delete `LookupValue` mutation. */
export type DeleteLookupValuePayloadLookupValueEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupValuesOrderBy>>
}

/** All input for the `deleteMembershipByNodeId` mutation. */
export type DeleteMembershipByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Membership` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteMembership` mutation. */
export type DeleteMembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Membership` mutation. */
export type DeleteMembershipPayload = {
  __typename: 'DeleteMembershipPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedMembershipNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `HotelRoom` that is related to this `Membership`. */
  hotelRoom?: Maybe<HotelRoom>
  /** The `Membership` that was deleted by this mutation. */
  membership?: Maybe<Membership>
  /** An edge for our `Membership`. May be used by Relay 1. */
  membershipEdge?: Maybe<MembershipsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Membership`. */
  user?: Maybe<User>
}

/** The output of our delete `Membership` mutation. */
export type DeleteMembershipPayloadMembershipEdgeArgs = {
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

/** All input for the `deleteProfileByNodeId` mutation. */
export type DeleteProfileByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Profile` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteProfile` mutation. */
export type DeleteProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayload = {
  __typename: 'DeleteProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedProfileNodeId?: Maybe<Scalars['ID']['output']>
  /** The `Profile` that was deleted by this mutation. */
  profile?: Maybe<Profile>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  user?: Maybe<User>
}

/** The output of our delete `Profile` mutation. */
export type DeleteProfilePayloadProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>
}

/** All input for the `deleteRoleByAuthority` mutation. */
export type DeleteRoleByAuthorityInput = {
  authority: Scalars['String']['input']
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
}

/** All input for the `deleteRoleByNodeId` mutation. */
export type DeleteRoleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Role` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteRole` mutation. */
export type DeleteRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Role` mutation. */
export type DeleteRolePayload = {
  __typename: 'DeleteRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedRoleNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Role` that was deleted by this mutation. */
  role?: Maybe<Role>
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RolesEdge>
}

/** The output of our delete `Role` mutation. */
export type DeleteRolePayloadRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<RolesOrderBy>>
}

/** All input for the `deleteRoomByNodeId` mutation. */
export type DeleteRoomByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Room` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteRoom` mutation. */
export type DeleteRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Room` mutation. */
export type DeleteRoomPayload = {
  __typename: 'DeleteRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedRoomNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Room` that was deleted by this mutation. */
  room?: Maybe<Room>
  /** An edge for our `Room`. May be used by Relay 1. */
  roomEdge?: Maybe<RoomsEdge>
}

/** The output of our delete `Room` mutation. */
export type DeleteRoomPayloadRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<RoomsOrderBy>>
}

/** All input for the `deleteSettingByNodeId` mutation. */
export type DeleteSettingByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Setting` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteSetting` mutation. */
export type DeleteSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Setting` mutation. */
export type DeleteSettingPayload = {
  __typename: 'DeleteSettingPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedSettingNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Setting` that was deleted by this mutation. */
  setting?: Maybe<Setting>
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingsEdge>
}

/** The output of our delete `Setting` mutation. */
export type DeleteSettingPayloadSettingEdgeArgs = {
  orderBy?: InputMaybe<Array<SettingsOrderBy>>
}

/** All input for the `deleteShirtOrderByNodeId` mutation. */
export type DeleteShirtOrderByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `ShirtOrder` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteShirtOrder` mutation. */
export type DeleteShirtOrderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** All input for the `deleteShirtOrderItemByNodeId` mutation. */
export type DeleteShirtOrderItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `ShirtOrderItem` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteShirtOrderItem` mutation. */
export type DeleteShirtOrderItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `ShirtOrderItem` mutation. */
export type DeleteShirtOrderItemPayload = {
  __typename: 'DeleteShirtOrderItemPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedShirtOrderItemNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`. */
  order?: Maybe<ShirtOrder>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrderItem` that was deleted by this mutation. */
  shirtOrderItem?: Maybe<ShirtOrderItem>
  /** An edge for our `ShirtOrderItem`. May be used by Relay 1. */
  shirtOrderItemEdge?: Maybe<ShirtOrderItemsEdge>
}

/** The output of our delete `ShirtOrderItem` mutation. */
export type DeleteShirtOrderItemPayloadShirtOrderItemEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrderItemsOrderBy>>
}

/** The output of our delete `ShirtOrder` mutation. */
export type DeleteShirtOrderPayload = {
  __typename: 'DeleteShirtOrderPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedShirtOrderNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrder` that was deleted by this mutation. */
  shirtOrder?: Maybe<ShirtOrder>
  /** An edge for our `ShirtOrder`. May be used by Relay 1. */
  shirtOrderEdge?: Maybe<ShirtOrdersEdge>
  /** Reads a single `User` that is related to this `ShirtOrder`. */
  user?: Maybe<User>
}

/** The output of our delete `ShirtOrder` mutation. */
export type DeleteShirtOrderPayloadShirtOrderEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrdersOrderBy>>
}

/** All input for the `deleteSlotByNodeId` mutation. */
export type DeleteSlotByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Slot` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteSlot` mutation. */
export type DeleteSlotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Slot` mutation. */
export type DeleteSlotPayload = {
  __typename: 'DeleteSlotPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedSlotNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Slot` that was deleted by this mutation. */
  slot?: Maybe<Slot>
  /** An edge for our `Slot`. May be used by Relay 1. */
  slotEdge?: Maybe<SlotsEdge>
}

/** The output of our delete `Slot` mutation. */
export type DeleteSlotPayloadSlotEdgeArgs = {
  orderBy?: InputMaybe<Array<SlotsOrderBy>>
}

/** All input for the `deleteStripeByNodeId` mutation. */
export type DeleteStripeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Stripe` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteStripe` mutation. */
export type DeleteStripeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `Stripe` mutation. */
export type DeleteStripePayload = {
  __typename: 'DeleteStripePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedStripeNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Stripe` that was deleted by this mutation. */
  stripe?: Maybe<Stripe>
  /** An edge for our `Stripe`. May be used by Relay 1. */
  stripeEdge?: Maybe<StripesEdge>
}

/** The output of our delete `Stripe` mutation. */
export type DeleteStripePayloadStripeEdgeArgs = {
  orderBy?: InputMaybe<Array<StripesOrderBy>>
}

/** All input for the `deleteTransactionByNodeId` mutation. */
export type DeleteTransactionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Transaction` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteTransaction` mutation. */
export type DeleteTransactionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['BigInt']['input']
}

/** The output of our delete `Transaction` mutation. */
export type DeleteTransactionPayload = {
  __typename: 'DeleteTransactionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedTransactionNodeId?: Maybe<Scalars['ID']['output']>
  /** Reads a single `Membership` that is related to this `Transaction`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Transaction` that was deleted by this mutation. */
  transaction?: Maybe<Transaction>
  /** An edge for our `Transaction`. May be used by Relay 1. */
  transactionEdge?: Maybe<TransactionsEdge>
  /** Reads a single `User` that is related to this `Transaction`. */
  user?: Maybe<User>
  /** Reads a single `User` that is related to this `Transaction`. */
  userByOrigin?: Maybe<User>
}

/** The output of our delete `Transaction` mutation. */
export type DeleteTransactionPayloadTransactionEdgeArgs = {
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

/** All input for the `deleteUserByEmail` mutation. */
export type DeleteUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
}

/** All input for the `deleteUserByNodeId` mutation. */
export type DeleteUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
}

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename: 'DeleteUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedUserNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
}

/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>
}

/** All input for the `deleteUserRoleByNodeId` mutation. */
export type DeleteUserRoleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `UserRole` to be deleted. */
  nodeId: Scalars['ID']['input']
}

/** All input for the `deleteUserRole` mutation. */
export type DeleteUserRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  roleId: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}

/** The output of our delete `UserRole` mutation. */
export type DeleteUserRolePayload = {
  __typename: 'DeleteUserRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  deletedUserRoleNodeId?: Maybe<Scalars['ID']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Role` that is related to this `UserRole`. */
  role?: Maybe<Role>
  /** Reads a single `User` that is related to this `UserRole`. */
  user?: Maybe<User>
  /** The `UserRole` that was deleted by this mutation. */
  userRole?: Maybe<UserRole>
  /** An edge for our `UserRole`. May be used by Relay 1. */
  userRoleEdge?: Maybe<UserRolesEdge>
}

/** The output of our delete `UserRole` mutation. */
export type DeleteUserRolePayloadUserRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

/** All input for the `fTruncateTables` mutation. */
export type FTruncateTablesInput = {
  _username?: InputMaybe<Scalars['String']['input']>
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
}

/** The output of our `fTruncateTables` mutation. */
export type FTruncateTablesPayload = {
  __typename: 'FTruncateTablesPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** A filter to be used against Float fields. All fields are combined with a logical ‘and.’ */
export type FloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Float']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Float']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Float']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Float']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Float']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Float']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Float']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>
}

export type Game = Node & {
  __typename: 'Game'
  /** Reads a single `User` that is related to this `Game`. */
  author?: Maybe<User>
  authorId?: Maybe<Scalars['Int']['output']>
  charInstructions: Scalars['String']['output']
  description: Scalars['String']['output']
  estimatedLength: Scalars['String']['output']
  full?: Maybe<Scalars['Boolean']['output']>
  /** Reads and enables pagination through a set of `GameAssignment`. */
  gameAssignments: GameAssignmentsConnection
  /** Reads and enables pagination through a set of `GameChoice`. */
  gameChoices: GameChoicesConnection
  gameContactEmail: Scalars['String']['output']
  genre: Scalars['String']['output']
  gmNames?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  lateFinish?: Maybe<Scalars['Boolean']['output']>
  lateStart?: Maybe<Scalars['String']['output']>
  message: Scalars['String']['output']
  name: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  playerMax: Scalars['Int']['output']
  playerMin: Scalars['Int']['output']
  playerPreference: Scalars['String']['output']
  playersContactGm: Scalars['Boolean']['output']
  returningPlayers: Scalars['String']['output']
  /** Reads a single `Room` that is related to this `Game`. */
  room?: Maybe<Room>
  roomId?: Maybe<Scalars['Int']['output']>
  setting: Scalars['String']['output']
  shortName?: Maybe<Scalars['String']['output']>
  /** Reads a single `Slot` that is related to this `Game`. */
  slot?: Maybe<Slot>
  slotConflicts: Scalars['String']['output']
  slotId?: Maybe<Scalars['Int']['output']>
  slotPreference: Scalars['Int']['output']
  teenFriendly: Scalars['Boolean']['output']
  type: Scalars['String']['output']
  year: Scalars['Int']['output']
}

export type GameGameAssignmentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameAssignmentCondition>
  filter?: InputMaybe<GameAssignmentFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

export type GameGameChoicesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameChoiceCondition>
  filter?: InputMaybe<GameChoiceFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

export type GameAssignment = Node & {
  __typename: 'GameAssignment'
  /** Reads a single `Game` that is related to this `GameAssignment`. */
  game?: Maybe<Game>
  gameId: Scalars['Int']['output']
  gm: Scalars['Int']['output']
  /** Reads a single `Membership` that is related to this `GameAssignment`. */
  member?: Maybe<Membership>
  memberId: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  year: Scalars['Int']['output']
}

/**
 * A condition to be used against `GameAssignment` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type GameAssignmentCondition = {
  /** Checks for equality with the object’s `gameId` field. */
  gameId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `gm` field. */
  gm?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `memberId` field. */
  memberId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `GameAssignment` object types. All fields are combined with a logical ‘and.’ */
export type GameAssignmentFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GameAssignmentFilter>>
  /** Filter by the object’s `gameId` field. */
  gameId?: InputMaybe<IntFilter>
  /** Filter by the object’s `gm` field. */
  gm?: InputMaybe<IntFilter>
  /** Filter by the object’s `memberId` field. */
  memberId?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<GameAssignmentFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GameAssignmentFilter>>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `GameAssignment` */
export type GameAssignmentInput = {
  gameId: Scalars['Int']['input']
  gm: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `GameAssignment`. Fields that are set will be updated. */
export type GameAssignmentPatch = {
  gameId?: InputMaybe<Scalars['Int']['input']>
  gm?: InputMaybe<Scalars['Int']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `GameAssignment` values. */
export type GameAssignmentsConnection = {
  __typename: 'GameAssignmentsConnection'
  /** A list of edges which contains the `GameAssignment` and cursor to aid in pagination. */
  edges: Array<GameAssignmentsEdge>
  /** A list of `GameAssignment` objects. */
  nodes: Array<Maybe<GameAssignment>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `GameAssignment` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `GameAssignment` edge in the connection. */
export type GameAssignmentsEdge = {
  __typename: 'GameAssignmentsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `GameAssignment` at the end of the edge. */
  node?: Maybe<GameAssignment>
}

/** Methods to use when ordering `GameAssignment`. */
export enum GameAssignmentsOrderBy {
  GameByGameIdAuthorIdAsc = 'GAME_BY_GAME_ID__AUTHOR_ID_ASC',
  GameByGameIdAuthorIdDesc = 'GAME_BY_GAME_ID__AUTHOR_ID_DESC',
  GameByGameIdCharInstructionsAsc = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC',
  GameByGameIdCharInstructionsDesc = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC',
  GameByGameIdDescriptionAsc = 'GAME_BY_GAME_ID__DESCRIPTION_ASC',
  GameByGameIdDescriptionDesc = 'GAME_BY_GAME_ID__DESCRIPTION_DESC',
  GameByGameIdEstimatedLengthAsc = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC',
  GameByGameIdEstimatedLengthDesc = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC',
  GameByGameIdFullAsc = 'GAME_BY_GAME_ID__FULL_ASC',
  GameByGameIdFullDesc = 'GAME_BY_GAME_ID__FULL_DESC',
  GameByGameIdGameContactEmailAsc = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC',
  GameByGameIdGameContactEmailDesc = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC',
  GameByGameIdGenreAsc = 'GAME_BY_GAME_ID__GENRE_ASC',
  GameByGameIdGenreDesc = 'GAME_BY_GAME_ID__GENRE_DESC',
  GameByGameIdGmNamesAsc = 'GAME_BY_GAME_ID__GM_NAMES_ASC',
  GameByGameIdGmNamesDesc = 'GAME_BY_GAME_ID__GM_NAMES_DESC',
  GameByGameIdIdAsc = 'GAME_BY_GAME_ID__ID_ASC',
  GameByGameIdIdDesc = 'GAME_BY_GAME_ID__ID_DESC',
  GameByGameIdLateFinishAsc = 'GAME_BY_GAME_ID__LATE_FINISH_ASC',
  GameByGameIdLateFinishDesc = 'GAME_BY_GAME_ID__LATE_FINISH_DESC',
  GameByGameIdLateStartAsc = 'GAME_BY_GAME_ID__LATE_START_ASC',
  GameByGameIdLateStartDesc = 'GAME_BY_GAME_ID__LATE_START_DESC',
  GameByGameIdMessageAsc = 'GAME_BY_GAME_ID__MESSAGE_ASC',
  GameByGameIdMessageDesc = 'GAME_BY_GAME_ID__MESSAGE_DESC',
  GameByGameIdNameAsc = 'GAME_BY_GAME_ID__NAME_ASC',
  GameByGameIdNameDesc = 'GAME_BY_GAME_ID__NAME_DESC',
  GameByGameIdPlayersContactGmAsc = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC',
  GameByGameIdPlayersContactGmDesc = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC',
  GameByGameIdPlayerMaxAsc = 'GAME_BY_GAME_ID__PLAYER_MAX_ASC',
  GameByGameIdPlayerMaxDesc = 'GAME_BY_GAME_ID__PLAYER_MAX_DESC',
  GameByGameIdPlayerMinAsc = 'GAME_BY_GAME_ID__PLAYER_MIN_ASC',
  GameByGameIdPlayerMinDesc = 'GAME_BY_GAME_ID__PLAYER_MIN_DESC',
  GameByGameIdPlayerPreferenceAsc = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC',
  GameByGameIdPlayerPreferenceDesc = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC',
  GameByGameIdReturningPlayersAsc = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC',
  GameByGameIdReturningPlayersDesc = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC',
  GameByGameIdRoomIdAsc = 'GAME_BY_GAME_ID__ROOM_ID_ASC',
  GameByGameIdRoomIdDesc = 'GAME_BY_GAME_ID__ROOM_ID_DESC',
  GameByGameIdSettingAsc = 'GAME_BY_GAME_ID__SETTING_ASC',
  GameByGameIdSettingDesc = 'GAME_BY_GAME_ID__SETTING_DESC',
  GameByGameIdShortNameAsc = 'GAME_BY_GAME_ID__SHORT_NAME_ASC',
  GameByGameIdShortNameDesc = 'GAME_BY_GAME_ID__SHORT_NAME_DESC',
  GameByGameIdSlotConflictsAsc = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC',
  GameByGameIdSlotConflictsDesc = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC',
  GameByGameIdSlotIdAsc = 'GAME_BY_GAME_ID__SLOT_ID_ASC',
  GameByGameIdSlotIdDesc = 'GAME_BY_GAME_ID__SLOT_ID_DESC',
  GameByGameIdSlotPreferenceAsc = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC',
  GameByGameIdSlotPreferenceDesc = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC',
  GameByGameIdTeenFriendlyAsc = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC',
  GameByGameIdTeenFriendlyDesc = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC',
  GameByGameIdTypeAsc = 'GAME_BY_GAME_ID__TYPE_ASC',
  GameByGameIdTypeDesc = 'GAME_BY_GAME_ID__TYPE_DESC',
  GameByGameIdYearAsc = 'GAME_BY_GAME_ID__YEAR_ASC',
  GameByGameIdYearDesc = 'GAME_BY_GAME_ID__YEAR_DESC',
  GameIdAsc = 'GAME_ID_ASC',
  GameIdDesc = 'GAME_ID_DESC',
  GmAsc = 'GM_ASC',
  GmDesc = 'GM_DESC',
  MembershipByMemberIdArrivalDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
  MembershipByMemberIdArrivalDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
  MembershipByMemberIdAttendanceAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
  MembershipByMemberIdAttendanceDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
  MembershipByMemberIdAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
  MembershipByMemberIdAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
  MembershipByMemberIdDepartureDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
  MembershipByMemberIdDepartureDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
  MembershipByMemberIdHotelRoomIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
  MembershipByMemberIdHotelRoomIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
  MembershipByMemberIdIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
  MembershipByMemberIdIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
  MembershipByMemberIdInterestLevelAsc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
  MembershipByMemberIdInterestLevelDesc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
  MembershipByMemberIdMessageAsc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
  MembershipByMemberIdMessageDesc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
  MembershipByMemberIdOfferSubsidyAsc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
  MembershipByMemberIdOfferSubsidyDesc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
  MembershipByMemberIdRequestOldPriceAsc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
  MembershipByMemberIdRequestOldPriceDesc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
  MembershipByMemberIdRoomingPreferencesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
  MembershipByMemberIdRoomingPreferencesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
  MembershipByMemberIdRoomingWithAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
  MembershipByMemberIdRoomingWithDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
  MembershipByMemberIdRoomPreferenceAndNotesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
  MembershipByMemberIdRoomPreferenceAndNotesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
  MembershipByMemberIdSlotsAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_ASC',
  MembershipByMemberIdSlotsAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_DESC',
  MembershipByMemberIdUserIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
  MembershipByMemberIdUserIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
  MembershipByMemberIdVolunteerAsc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
  MembershipByMemberIdVolunteerDesc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
  MembershipByMemberIdYearAsc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
  MembershipByMemberIdYearDesc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
  MemberIdAsc = 'MEMBER_ID_ASC',
  MemberIdDesc = 'MEMBER_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

export type GameChoice = Node & {
  __typename: 'GameChoice'
  /** Reads a single `Game` that is related to this `GameChoice`. */
  game?: Maybe<Game>
  gameId?: Maybe<Scalars['Int']['output']>
  id: Scalars['Int']['output']
  /** Reads a single `Membership` that is related to this `GameChoice`. */
  member?: Maybe<Membership>
  memberId: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  rank: Scalars['Int']['output']
  returningPlayer: Scalars['Boolean']['output']
  /** Reads a single `Slot` that is related to this `GameChoice`. */
  slot?: Maybe<Slot>
  slotId: Scalars['Int']['output']
  year: Scalars['Int']['output']
}

/**
 * A condition to be used against `GameChoice` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GameChoiceCondition = {
  /** Checks for equality with the object’s `gameId` field. */
  gameId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `memberId` field. */
  memberId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `rank` field. */
  rank?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `returningPlayer` field. */
  returningPlayer?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `slotId` field. */
  slotId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `GameChoice` object types. All fields are combined with a logical ‘and.’ */
export type GameChoiceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GameChoiceFilter>>
  /** Filter by the object’s `gameId` field. */
  gameId?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `memberId` field. */
  memberId?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<GameChoiceFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GameChoiceFilter>>
  /** Filter by the object’s `rank` field. */
  rank?: InputMaybe<IntFilter>
  /** Filter by the object’s `returningPlayer` field. */
  returningPlayer?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `slotId` field. */
  slotId?: InputMaybe<IntFilter>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `GameChoice` */
export type GameChoiceInput = {
  gameId?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  memberId: Scalars['Int']['input']
  rank: Scalars['Int']['input']
  returningPlayer: Scalars['Boolean']['input']
  slotId: Scalars['Int']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `GameChoice`. Fields that are set will be updated. */
export type GameChoicePatch = {
  gameId?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  rank?: InputMaybe<Scalars['Int']['input']>
  returningPlayer?: InputMaybe<Scalars['Boolean']['input']>
  slotId?: InputMaybe<Scalars['Int']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `GameChoice` values. */
export type GameChoicesConnection = {
  __typename: 'GameChoicesConnection'
  /** A list of edges which contains the `GameChoice` and cursor to aid in pagination. */
  edges: Array<GameChoicesEdge>
  /** A list of `GameChoice` objects. */
  nodes: Array<Maybe<GameChoice>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `GameChoice` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `GameChoice` edge in the connection. */
export type GameChoicesEdge = {
  __typename: 'GameChoicesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `GameChoice` at the end of the edge. */
  node?: Maybe<GameChoice>
}

/** Methods to use when ordering `GameChoice`. */
export enum GameChoicesOrderBy {
  GameByGameIdAuthorIdAsc = 'GAME_BY_GAME_ID__AUTHOR_ID_ASC',
  GameByGameIdAuthorIdDesc = 'GAME_BY_GAME_ID__AUTHOR_ID_DESC',
  GameByGameIdCharInstructionsAsc = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC',
  GameByGameIdCharInstructionsDesc = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC',
  GameByGameIdDescriptionAsc = 'GAME_BY_GAME_ID__DESCRIPTION_ASC',
  GameByGameIdDescriptionDesc = 'GAME_BY_GAME_ID__DESCRIPTION_DESC',
  GameByGameIdEstimatedLengthAsc = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC',
  GameByGameIdEstimatedLengthDesc = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC',
  GameByGameIdFullAsc = 'GAME_BY_GAME_ID__FULL_ASC',
  GameByGameIdFullDesc = 'GAME_BY_GAME_ID__FULL_DESC',
  GameByGameIdGameContactEmailAsc = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC',
  GameByGameIdGameContactEmailDesc = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC',
  GameByGameIdGenreAsc = 'GAME_BY_GAME_ID__GENRE_ASC',
  GameByGameIdGenreDesc = 'GAME_BY_GAME_ID__GENRE_DESC',
  GameByGameIdGmNamesAsc = 'GAME_BY_GAME_ID__GM_NAMES_ASC',
  GameByGameIdGmNamesDesc = 'GAME_BY_GAME_ID__GM_NAMES_DESC',
  GameByGameIdIdAsc = 'GAME_BY_GAME_ID__ID_ASC',
  GameByGameIdIdDesc = 'GAME_BY_GAME_ID__ID_DESC',
  GameByGameIdLateFinishAsc = 'GAME_BY_GAME_ID__LATE_FINISH_ASC',
  GameByGameIdLateFinishDesc = 'GAME_BY_GAME_ID__LATE_FINISH_DESC',
  GameByGameIdLateStartAsc = 'GAME_BY_GAME_ID__LATE_START_ASC',
  GameByGameIdLateStartDesc = 'GAME_BY_GAME_ID__LATE_START_DESC',
  GameByGameIdMessageAsc = 'GAME_BY_GAME_ID__MESSAGE_ASC',
  GameByGameIdMessageDesc = 'GAME_BY_GAME_ID__MESSAGE_DESC',
  GameByGameIdNameAsc = 'GAME_BY_GAME_ID__NAME_ASC',
  GameByGameIdNameDesc = 'GAME_BY_GAME_ID__NAME_DESC',
  GameByGameIdPlayersContactGmAsc = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC',
  GameByGameIdPlayersContactGmDesc = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC',
  GameByGameIdPlayerMaxAsc = 'GAME_BY_GAME_ID__PLAYER_MAX_ASC',
  GameByGameIdPlayerMaxDesc = 'GAME_BY_GAME_ID__PLAYER_MAX_DESC',
  GameByGameIdPlayerMinAsc = 'GAME_BY_GAME_ID__PLAYER_MIN_ASC',
  GameByGameIdPlayerMinDesc = 'GAME_BY_GAME_ID__PLAYER_MIN_DESC',
  GameByGameIdPlayerPreferenceAsc = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC',
  GameByGameIdPlayerPreferenceDesc = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC',
  GameByGameIdReturningPlayersAsc = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC',
  GameByGameIdReturningPlayersDesc = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC',
  GameByGameIdRoomIdAsc = 'GAME_BY_GAME_ID__ROOM_ID_ASC',
  GameByGameIdRoomIdDesc = 'GAME_BY_GAME_ID__ROOM_ID_DESC',
  GameByGameIdSettingAsc = 'GAME_BY_GAME_ID__SETTING_ASC',
  GameByGameIdSettingDesc = 'GAME_BY_GAME_ID__SETTING_DESC',
  GameByGameIdShortNameAsc = 'GAME_BY_GAME_ID__SHORT_NAME_ASC',
  GameByGameIdShortNameDesc = 'GAME_BY_GAME_ID__SHORT_NAME_DESC',
  GameByGameIdSlotConflictsAsc = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC',
  GameByGameIdSlotConflictsDesc = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC',
  GameByGameIdSlotIdAsc = 'GAME_BY_GAME_ID__SLOT_ID_ASC',
  GameByGameIdSlotIdDesc = 'GAME_BY_GAME_ID__SLOT_ID_DESC',
  GameByGameIdSlotPreferenceAsc = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC',
  GameByGameIdSlotPreferenceDesc = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC',
  GameByGameIdTeenFriendlyAsc = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC',
  GameByGameIdTeenFriendlyDesc = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC',
  GameByGameIdTypeAsc = 'GAME_BY_GAME_ID__TYPE_ASC',
  GameByGameIdTypeDesc = 'GAME_BY_GAME_ID__TYPE_DESC',
  GameByGameIdYearAsc = 'GAME_BY_GAME_ID__YEAR_ASC',
  GameByGameIdYearDesc = 'GAME_BY_GAME_ID__YEAR_DESC',
  GameIdAsc = 'GAME_ID_ASC',
  GameIdDesc = 'GAME_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MembershipByMemberIdArrivalDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
  MembershipByMemberIdArrivalDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
  MembershipByMemberIdAttendanceAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
  MembershipByMemberIdAttendanceDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
  MembershipByMemberIdAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
  MembershipByMemberIdAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
  MembershipByMemberIdDepartureDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
  MembershipByMemberIdDepartureDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
  MembershipByMemberIdHotelRoomIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
  MembershipByMemberIdHotelRoomIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
  MembershipByMemberIdIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
  MembershipByMemberIdIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
  MembershipByMemberIdInterestLevelAsc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
  MembershipByMemberIdInterestLevelDesc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
  MembershipByMemberIdMessageAsc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
  MembershipByMemberIdMessageDesc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
  MembershipByMemberIdOfferSubsidyAsc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
  MembershipByMemberIdOfferSubsidyDesc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
  MembershipByMemberIdRequestOldPriceAsc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
  MembershipByMemberIdRequestOldPriceDesc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
  MembershipByMemberIdRoomingPreferencesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
  MembershipByMemberIdRoomingPreferencesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
  MembershipByMemberIdRoomingWithAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
  MembershipByMemberIdRoomingWithDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
  MembershipByMemberIdRoomPreferenceAndNotesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
  MembershipByMemberIdRoomPreferenceAndNotesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
  MembershipByMemberIdSlotsAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_ASC',
  MembershipByMemberIdSlotsAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_DESC',
  MembershipByMemberIdUserIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
  MembershipByMemberIdUserIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
  MembershipByMemberIdVolunteerAsc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
  MembershipByMemberIdVolunteerDesc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
  MembershipByMemberIdYearAsc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
  MembershipByMemberIdYearDesc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
  MemberIdAsc = 'MEMBER_ID_ASC',
  MemberIdDesc = 'MEMBER_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RankAsc = 'RANK_ASC',
  RankDesc = 'RANK_DESC',
  ReturningPlayerAsc = 'RETURNING_PLAYER_ASC',
  ReturningPlayerDesc = 'RETURNING_PLAYER_DESC',
  SlotBySlotIdDayAsc = 'SLOT_BY_SLOT_ID__DAY_ASC',
  SlotBySlotIdDayDesc = 'SLOT_BY_SLOT_ID__DAY_DESC',
  SlotBySlotIdFormattedDateAsc = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC',
  SlotBySlotIdFormattedDateDesc = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC',
  SlotBySlotIdIdAsc = 'SLOT_BY_SLOT_ID__ID_ASC',
  SlotBySlotIdIdDesc = 'SLOT_BY_SLOT_ID__ID_DESC',
  SlotBySlotIdLengthAsc = 'SLOT_BY_SLOT_ID__LENGTH_ASC',
  SlotBySlotIdLengthDesc = 'SLOT_BY_SLOT_ID__LENGTH_DESC',
  SlotBySlotIdSlotAsc = 'SLOT_BY_SLOT_ID__SLOT_ASC',
  SlotBySlotIdSlotDesc = 'SLOT_BY_SLOT_ID__SLOT_DESC',
  SlotBySlotIdTimeAsc = 'SLOT_BY_SLOT_ID__TIME_ASC',
  SlotBySlotIdTimeDesc = 'SLOT_BY_SLOT_ID__TIME_DESC',
  SlotIdAsc = 'SLOT_ID_ASC',
  SlotIdDesc = 'SLOT_ID_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

/** A condition to be used against `Game` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type GameCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `charInstructions` field. */
  charInstructions?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `estimatedLength` field. */
  estimatedLength?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `full` field. */
  full?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `gameContactEmail` field. */
  gameContactEmail?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `genre` field. */
  genre?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `gmNames` field. */
  gmNames?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `lateFinish` field. */
  lateFinish?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `lateStart` field. */
  lateStart?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `playerMax` field. */
  playerMax?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `playerMin` field. */
  playerMin?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `playerPreference` field. */
  playerPreference?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `playersContactGm` field. */
  playersContactGm?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `returningPlayers` field. */
  returningPlayers?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `roomId` field. */
  roomId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `setting` field. */
  setting?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `shortName` field. */
  shortName?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `slotConflicts` field. */
  slotConflicts?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `slotId` field. */
  slotId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `slotPreference` field. */
  slotPreference?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `teenFriendly` field. */
  teenFriendly?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Game` object types. All fields are combined with a logical ‘and.’ */
export type GameFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GameFilter>>
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<IntFilter>
  /** Filter by the object’s `charInstructions` field. */
  charInstructions?: InputMaybe<StringFilter>
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>
  /** Filter by the object’s `estimatedLength` field. */
  estimatedLength?: InputMaybe<StringFilter>
  /** Filter by the object’s `full` field. */
  full?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `gameContactEmail` field. */
  gameContactEmail?: InputMaybe<StringFilter>
  /** Filter by the object’s `genre` field. */
  genre?: InputMaybe<StringFilter>
  /** Filter by the object’s `gmNames` field. */
  gmNames?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `lateFinish` field. */
  lateFinish?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `lateStart` field. */
  lateStart?: InputMaybe<StringFilter>
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<GameFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GameFilter>>
  /** Filter by the object’s `playerMax` field. */
  playerMax?: InputMaybe<IntFilter>
  /** Filter by the object’s `playerMin` field. */
  playerMin?: InputMaybe<IntFilter>
  /** Filter by the object’s `playerPreference` field. */
  playerPreference?: InputMaybe<StringFilter>
  /** Filter by the object’s `playersContactGm` field. */
  playersContactGm?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `returningPlayers` field. */
  returningPlayers?: InputMaybe<StringFilter>
  /** Filter by the object’s `roomId` field. */
  roomId?: InputMaybe<IntFilter>
  /** Filter by the object’s `setting` field. */
  setting?: InputMaybe<StringFilter>
  /** Filter by the object’s `shortName` field. */
  shortName?: InputMaybe<StringFilter>
  /** Filter by the object’s `slotConflicts` field. */
  slotConflicts?: InputMaybe<StringFilter>
  /** Filter by the object’s `slotId` field. */
  slotId?: InputMaybe<IntFilter>
  /** Filter by the object’s `slotPreference` field. */
  slotPreference?: InputMaybe<IntFilter>
  /** Filter by the object’s `teenFriendly` field. */
  teenFriendly?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `Game` */
export type GameInput = {
  authorId?: InputMaybe<Scalars['Int']['input']>
  charInstructions: Scalars['String']['input']
  description: Scalars['String']['input']
  estimatedLength: Scalars['String']['input']
  full?: InputMaybe<Scalars['Boolean']['input']>
  gameContactEmail: Scalars['String']['input']
  genre: Scalars['String']['input']
  gmNames?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  lateFinish?: InputMaybe<Scalars['Boolean']['input']>
  lateStart?: InputMaybe<Scalars['String']['input']>
  message: Scalars['String']['input']
  name: Scalars['String']['input']
  playerMax: Scalars['Int']['input']
  playerMin: Scalars['Int']['input']
  playerPreference: Scalars['String']['input']
  playersContactGm: Scalars['Boolean']['input']
  returningPlayers: Scalars['String']['input']
  roomId?: InputMaybe<Scalars['Int']['input']>
  setting: Scalars['String']['input']
  shortName?: InputMaybe<Scalars['String']['input']>
  slotConflicts: Scalars['String']['input']
  slotId?: InputMaybe<Scalars['Int']['input']>
  slotPreference: Scalars['Int']['input']
  teenFriendly: Scalars['Boolean']['input']
  type: Scalars['String']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `Game`. Fields that are set will be updated. */
export type GamePatch = {
  authorId?: InputMaybe<Scalars['Int']['input']>
  charInstructions?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  estimatedLength?: InputMaybe<Scalars['String']['input']>
  full?: InputMaybe<Scalars['Boolean']['input']>
  gameContactEmail?: InputMaybe<Scalars['String']['input']>
  genre?: InputMaybe<Scalars['String']['input']>
  gmNames?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  lateFinish?: InputMaybe<Scalars['Boolean']['input']>
  lateStart?: InputMaybe<Scalars['String']['input']>
  message?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  playerMax?: InputMaybe<Scalars['Int']['input']>
  playerMin?: InputMaybe<Scalars['Int']['input']>
  playerPreference?: InputMaybe<Scalars['String']['input']>
  playersContactGm?: InputMaybe<Scalars['Boolean']['input']>
  returningPlayers?: InputMaybe<Scalars['String']['input']>
  roomId?: InputMaybe<Scalars['Int']['input']>
  setting?: InputMaybe<Scalars['String']['input']>
  shortName?: InputMaybe<Scalars['String']['input']>
  slotConflicts?: InputMaybe<Scalars['String']['input']>
  slotId?: InputMaybe<Scalars['Int']['input']>
  slotPreference?: InputMaybe<Scalars['Int']['input']>
  teenFriendly?: InputMaybe<Scalars['Boolean']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

export type GameSubmission = Node & {
  __typename: 'GameSubmission'
  id: Scalars['Int']['output']
  /** Reads a single `Membership` that is related to this `GameSubmission`. */
  member?: Maybe<Membership>
  memberId: Scalars['Int']['output']
  message: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  year: Scalars['Int']['output']
}

/**
 * A condition to be used against `GameSubmission` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type GameSubmissionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `memberId` field. */
  memberId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `GameSubmission` object types. All fields are combined with a logical ‘and.’ */
export type GameSubmissionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GameSubmissionFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `memberId` field. */
  memberId?: InputMaybe<IntFilter>
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<GameSubmissionFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GameSubmissionFilter>>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `GameSubmission` */
export type GameSubmissionInput = {
  id?: InputMaybe<Scalars['Int']['input']>
  memberId: Scalars['Int']['input']
  message: Scalars['String']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `GameSubmission`. Fields that are set will be updated. */
export type GameSubmissionPatch = {
  id?: InputMaybe<Scalars['Int']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  message?: InputMaybe<Scalars['String']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `GameSubmission` values. */
export type GameSubmissionsConnection = {
  __typename: 'GameSubmissionsConnection'
  /** A list of edges which contains the `GameSubmission` and cursor to aid in pagination. */
  edges: Array<GameSubmissionsEdge>
  /** A list of `GameSubmission` objects. */
  nodes: Array<Maybe<GameSubmission>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `GameSubmission` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `GameSubmission` edge in the connection. */
export type GameSubmissionsEdge = {
  __typename: 'GameSubmissionsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `GameSubmission` at the end of the edge. */
  node?: Maybe<GameSubmission>
}

/** Methods to use when ordering `GameSubmission`. */
export enum GameSubmissionsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MembershipByMemberIdArrivalDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
  MembershipByMemberIdArrivalDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
  MembershipByMemberIdAttendanceAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
  MembershipByMemberIdAttendanceDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
  MembershipByMemberIdAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
  MembershipByMemberIdAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
  MembershipByMemberIdDepartureDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
  MembershipByMemberIdDepartureDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
  MembershipByMemberIdHotelRoomIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
  MembershipByMemberIdHotelRoomIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
  MembershipByMemberIdIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
  MembershipByMemberIdIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
  MembershipByMemberIdInterestLevelAsc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
  MembershipByMemberIdInterestLevelDesc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
  MembershipByMemberIdMessageAsc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
  MembershipByMemberIdMessageDesc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
  MembershipByMemberIdOfferSubsidyAsc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
  MembershipByMemberIdOfferSubsidyDesc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
  MembershipByMemberIdRequestOldPriceAsc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
  MembershipByMemberIdRequestOldPriceDesc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
  MembershipByMemberIdRoomingPreferencesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
  MembershipByMemberIdRoomingPreferencesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
  MembershipByMemberIdRoomingWithAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
  MembershipByMemberIdRoomingWithDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
  MembershipByMemberIdRoomPreferenceAndNotesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
  MembershipByMemberIdRoomPreferenceAndNotesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
  MembershipByMemberIdSlotsAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_ASC',
  MembershipByMemberIdSlotsAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_DESC',
  MembershipByMemberIdUserIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
  MembershipByMemberIdUserIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
  MembershipByMemberIdVolunteerAsc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
  MembershipByMemberIdVolunteerDesc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
  MembershipByMemberIdYearAsc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
  MembershipByMemberIdYearDesc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
  MemberIdAsc = 'MEMBER_ID_ASC',
  MemberIdDesc = 'MEMBER_ID_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

/** A connection to a list of `Game` values. */
export type GamesConnection = {
  __typename: 'GamesConnection'
  /** A list of edges which contains the `Game` and cursor to aid in pagination. */
  edges: Array<GamesEdge>
  /** A list of `Game` objects. */
  nodes: Array<Maybe<Game>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Game` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Game` edge in the connection. */
export type GamesEdge = {
  __typename: 'GamesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Game` at the end of the edge. */
  node?: Maybe<Game>
}

/** Methods to use when ordering `Game`. */
export enum GamesOrderBy {
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  CharInstructionsAsc = 'CHAR_INSTRUCTIONS_ASC',
  CharInstructionsDesc = 'CHAR_INSTRUCTIONS_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  EstimatedLengthAsc = 'ESTIMATED_LENGTH_ASC',
  EstimatedLengthDesc = 'ESTIMATED_LENGTH_DESC',
  FullAsc = 'FULL_ASC',
  FullDesc = 'FULL_DESC',
  GameAssignmentsByGameIdCountAsc = 'GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_ASC',
  GameAssignmentsByGameIdCountDesc = 'GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_DESC',
  GameChoicesByGameIdCountAsc = 'GAME_CHOICES_BY_GAME_ID__COUNT_ASC',
  GameChoicesByGameIdCountDesc = 'GAME_CHOICES_BY_GAME_ID__COUNT_DESC',
  GameContactEmailAsc = 'GAME_CONTACT_EMAIL_ASC',
  GameContactEmailDesc = 'GAME_CONTACT_EMAIL_DESC',
  GenreAsc = 'GENRE_ASC',
  GenreDesc = 'GENRE_DESC',
  GmNamesAsc = 'GM_NAMES_ASC',
  GmNamesDesc = 'GM_NAMES_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LateFinishAsc = 'LATE_FINISH_ASC',
  LateFinishDesc = 'LATE_FINISH_DESC',
  LateStartAsc = 'LATE_START_ASC',
  LateStartDesc = 'LATE_START_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PlayersContactGmAsc = 'PLAYERS_CONTACT_GM_ASC',
  PlayersContactGmDesc = 'PLAYERS_CONTACT_GM_DESC',
  PlayerMaxAsc = 'PLAYER_MAX_ASC',
  PlayerMaxDesc = 'PLAYER_MAX_DESC',
  PlayerMinAsc = 'PLAYER_MIN_ASC',
  PlayerMinDesc = 'PLAYER_MIN_DESC',
  PlayerPreferenceAsc = 'PLAYER_PREFERENCE_ASC',
  PlayerPreferenceDesc = 'PLAYER_PREFERENCE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ReturningPlayersAsc = 'RETURNING_PLAYERS_ASC',
  ReturningPlayersDesc = 'RETURNING_PLAYERS_DESC',
  RoomByRoomIdDescriptionAsc = 'ROOM_BY_ROOM_ID__DESCRIPTION_ASC',
  RoomByRoomIdDescriptionDesc = 'ROOM_BY_ROOM_ID__DESCRIPTION_DESC',
  RoomByRoomIdIdAsc = 'ROOM_BY_ROOM_ID__ID_ASC',
  RoomByRoomIdIdDesc = 'ROOM_BY_ROOM_ID__ID_DESC',
  RoomByRoomIdSizeAsc = 'ROOM_BY_ROOM_ID__SIZE_ASC',
  RoomByRoomIdSizeDesc = 'ROOM_BY_ROOM_ID__SIZE_DESC',
  RoomByRoomIdTypeAsc = 'ROOM_BY_ROOM_ID__TYPE_ASC',
  RoomByRoomIdTypeDesc = 'ROOM_BY_ROOM_ID__TYPE_DESC',
  RoomByRoomIdUpdatedAsc = 'ROOM_BY_ROOM_ID__UPDATED_ASC',
  RoomByRoomIdUpdatedDesc = 'ROOM_BY_ROOM_ID__UPDATED_DESC',
  RoomIdAsc = 'ROOM_ID_ASC',
  RoomIdDesc = 'ROOM_ID_DESC',
  SettingAsc = 'SETTING_ASC',
  SettingDesc = 'SETTING_DESC',
  ShortNameAsc = 'SHORT_NAME_ASC',
  ShortNameDesc = 'SHORT_NAME_DESC',
  SlotBySlotIdDayAsc = 'SLOT_BY_SLOT_ID__DAY_ASC',
  SlotBySlotIdDayDesc = 'SLOT_BY_SLOT_ID__DAY_DESC',
  SlotBySlotIdFormattedDateAsc = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC',
  SlotBySlotIdFormattedDateDesc = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC',
  SlotBySlotIdIdAsc = 'SLOT_BY_SLOT_ID__ID_ASC',
  SlotBySlotIdIdDesc = 'SLOT_BY_SLOT_ID__ID_DESC',
  SlotBySlotIdLengthAsc = 'SLOT_BY_SLOT_ID__LENGTH_ASC',
  SlotBySlotIdLengthDesc = 'SLOT_BY_SLOT_ID__LENGTH_DESC',
  SlotBySlotIdSlotAsc = 'SLOT_BY_SLOT_ID__SLOT_ASC',
  SlotBySlotIdSlotDesc = 'SLOT_BY_SLOT_ID__SLOT_DESC',
  SlotBySlotIdTimeAsc = 'SLOT_BY_SLOT_ID__TIME_ASC',
  SlotBySlotIdTimeDesc = 'SLOT_BY_SLOT_ID__TIME_DESC',
  SlotConflictsAsc = 'SLOT_CONFLICTS_ASC',
  SlotConflictsDesc = 'SLOT_CONFLICTS_DESC',
  SlotIdAsc = 'SLOT_ID_ASC',
  SlotIdDesc = 'SLOT_ID_DESC',
  SlotPreferenceAsc = 'SLOT_PREFERENCE_ASC',
  SlotPreferenceDesc = 'SLOT_PREFERENCE_DESC',
  TeenFriendlyAsc = 'TEEN_FRIENDLY_ASC',
  TeenFriendlyDesc = 'TEEN_FRIENDLY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UserByAuthorIdAmountOwedAsc = 'USER_BY_AUTHOR_ID__AMOUNT_OWED_ASC',
  UserByAuthorIdAmountOwedDesc = 'USER_BY_AUTHOR_ID__AMOUNT_OWED_DESC',
  UserByAuthorIdDisplayNameAsc = 'USER_BY_AUTHOR_ID__DISPLAY_NAME_ASC',
  UserByAuthorIdDisplayNameDesc = 'USER_BY_AUTHOR_ID__DISPLAY_NAME_DESC',
  UserByAuthorIdEmailAsc = 'USER_BY_AUTHOR_ID__EMAIL_ASC',
  UserByAuthorIdEmailDesc = 'USER_BY_AUTHOR_ID__EMAIL_DESC',
  UserByAuthorIdFirstNameAsc = 'USER_BY_AUTHOR_ID__FIRST_NAME_ASC',
  UserByAuthorIdFirstNameDesc = 'USER_BY_AUTHOR_ID__FIRST_NAME_DESC',
  UserByAuthorIdFullNameAsc = 'USER_BY_AUTHOR_ID__FULL_NAME_ASC',
  UserByAuthorIdFullNameDesc = 'USER_BY_AUTHOR_ID__FULL_NAME_DESC',
  UserByAuthorIdIdAsc = 'USER_BY_AUTHOR_ID__ID_ASC',
  UserByAuthorIdIdDesc = 'USER_BY_AUTHOR_ID__ID_DESC',
  UserByAuthorIdLastNameAsc = 'USER_BY_AUTHOR_ID__LAST_NAME_ASC',
  UserByAuthorIdLastNameDesc = 'USER_BY_AUTHOR_ID__LAST_NAME_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

export type HotelRoom = Node & {
  __typename: 'HotelRoom'
  bathroomType: Scalars['String']['output']
  description: Scalars['String']['output']
  gamingRoom: Scalars['Boolean']['output']
  id: Scalars['Int']['output']
  /** Reads and enables pagination through a set of `Membership`. */
  memberships: MembershipsConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  occupancy: Scalars['String']['output']
  quantity: Scalars['Int']['output']
  rate: Scalars['String']['output']
  type: Scalars['String']['output']
}

export type HotelRoomMembershipsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<MembershipCondition>
  filter?: InputMaybe<MembershipFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

/**
 * A condition to be used against `HotelRoom` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type HotelRoomCondition = {
  /** Checks for equality with the object’s `bathroomType` field. */
  bathroomType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `gamingRoom` field. */
  gamingRoom?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `occupancy` field. */
  occupancy?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `quantity` field. */
  quantity?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `rate` field. */
  rate?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>
}

export type HotelRoomDetail = Node & {
  __typename: 'HotelRoomDetail'
  bathroomType: Scalars['String']['output']
  comment: Scalars['String']['output']
  enabled: Scalars['Boolean']['output']
  formattedRoomType: Scalars['String']['output']
  gamingRoom: Scalars['Boolean']['output']
  id: Scalars['BigInt']['output']
  internalRoomType: Scalars['String']['output']
  name: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  reserved: Scalars['Boolean']['output']
  reservedFor: Scalars['String']['output']
  roomType: Scalars['String']['output']
  version: Scalars['BigInt']['output']
}

/**
 * A condition to be used against `HotelRoomDetail` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type HotelRoomDetailCondition = {
  /** Checks for equality with the object’s `bathroomType` field. */
  bathroomType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `comment` field. */
  comment?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `enabled` field. */
  enabled?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `formattedRoomType` field. */
  formattedRoomType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `gamingRoom` field. */
  gamingRoom?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['BigInt']['input']>
  /** Checks for equality with the object’s `internalRoomType` field. */
  internalRoomType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `reserved` field. */
  reserved?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `reservedFor` field. */
  reservedFor?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `roomType` field. */
  roomType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `version` field. */
  version?: InputMaybe<Scalars['BigInt']['input']>
}

/** A filter to be used against `HotelRoomDetail` object types. All fields are combined with a logical ‘and.’ */
export type HotelRoomDetailFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<HotelRoomDetailFilter>>
  /** Filter by the object’s `bathroomType` field. */
  bathroomType?: InputMaybe<StringFilter>
  /** Filter by the object’s `comment` field. */
  comment?: InputMaybe<StringFilter>
  /** Filter by the object’s `enabled` field. */
  enabled?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `formattedRoomType` field. */
  formattedRoomType?: InputMaybe<StringFilter>
  /** Filter by the object’s `gamingRoom` field. */
  gamingRoom?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<BigIntFilter>
  /** Filter by the object’s `internalRoomType` field. */
  internalRoomType?: InputMaybe<StringFilter>
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<HotelRoomDetailFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<HotelRoomDetailFilter>>
  /** Filter by the object’s `reserved` field. */
  reserved?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `reservedFor` field. */
  reservedFor?: InputMaybe<StringFilter>
  /** Filter by the object’s `roomType` field. */
  roomType?: InputMaybe<StringFilter>
  /** Filter by the object’s `version` field. */
  version?: InputMaybe<BigIntFilter>
}

/** An input for mutations affecting `HotelRoomDetail` */
export type HotelRoomDetailInput = {
  bathroomType: Scalars['String']['input']
  comment: Scalars['String']['input']
  enabled: Scalars['Boolean']['input']
  formattedRoomType: Scalars['String']['input']
  gamingRoom: Scalars['Boolean']['input']
  id?: InputMaybe<Scalars['BigInt']['input']>
  internalRoomType: Scalars['String']['input']
  name: Scalars['String']['input']
  reserved: Scalars['Boolean']['input']
  reservedFor: Scalars['String']['input']
  roomType: Scalars['String']['input']
  version: Scalars['BigInt']['input']
}

/** Represents an update to a `HotelRoomDetail`. Fields that are set will be updated. */
export type HotelRoomDetailPatch = {
  bathroomType?: InputMaybe<Scalars['String']['input']>
  comment?: InputMaybe<Scalars['String']['input']>
  enabled?: InputMaybe<Scalars['Boolean']['input']>
  formattedRoomType?: InputMaybe<Scalars['String']['input']>
  gamingRoom?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['BigInt']['input']>
  internalRoomType?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  reserved?: InputMaybe<Scalars['Boolean']['input']>
  reservedFor?: InputMaybe<Scalars['String']['input']>
  roomType?: InputMaybe<Scalars['String']['input']>
  version?: InputMaybe<Scalars['BigInt']['input']>
}

/** A connection to a list of `HotelRoomDetail` values. */
export type HotelRoomDetailsConnection = {
  __typename: 'HotelRoomDetailsConnection'
  /** A list of edges which contains the `HotelRoomDetail` and cursor to aid in pagination. */
  edges: Array<HotelRoomDetailsEdge>
  /** A list of `HotelRoomDetail` objects. */
  nodes: Array<Maybe<HotelRoomDetail>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `HotelRoomDetail` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `HotelRoomDetail` edge in the connection. */
export type HotelRoomDetailsEdge = {
  __typename: 'HotelRoomDetailsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `HotelRoomDetail` at the end of the edge. */
  node?: Maybe<HotelRoomDetail>
}

/** Methods to use when ordering `HotelRoomDetail`. */
export enum HotelRoomDetailsOrderBy {
  BathroomTypeAsc = 'BATHROOM_TYPE_ASC',
  BathroomTypeDesc = 'BATHROOM_TYPE_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  EnabledAsc = 'ENABLED_ASC',
  EnabledDesc = 'ENABLED_DESC',
  FormattedRoomTypeAsc = 'FORMATTED_ROOM_TYPE_ASC',
  FormattedRoomTypeDesc = 'FORMATTED_ROOM_TYPE_DESC',
  GamingRoomAsc = 'GAMING_ROOM_ASC',
  GamingRoomDesc = 'GAMING_ROOM_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InternalRoomTypeAsc = 'INTERNAL_ROOM_TYPE_ASC',
  InternalRoomTypeDesc = 'INTERNAL_ROOM_TYPE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ReservedAsc = 'RESERVED_ASC',
  ReservedDesc = 'RESERVED_DESC',
  ReservedForAsc = 'RESERVED_FOR_ASC',
  ReservedForDesc = 'RESERVED_FOR_DESC',
  RoomTypeAsc = 'ROOM_TYPE_ASC',
  RoomTypeDesc = 'ROOM_TYPE_DESC',
  VersionAsc = 'VERSION_ASC',
  VersionDesc = 'VERSION_DESC',
}

/** A filter to be used against `HotelRoom` object types. All fields are combined with a logical ‘and.’ */
export type HotelRoomFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<HotelRoomFilter>>
  /** Filter by the object’s `bathroomType` field. */
  bathroomType?: InputMaybe<StringFilter>
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>
  /** Filter by the object’s `gamingRoom` field. */
  gamingRoom?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<HotelRoomFilter>
  /** Filter by the object’s `occupancy` field. */
  occupancy?: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<HotelRoomFilter>>
  /** Filter by the object’s `quantity` field. */
  quantity?: InputMaybe<IntFilter>
  /** Filter by the object’s `rate` field. */
  rate?: InputMaybe<StringFilter>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>
}

/** An input for mutations affecting `HotelRoom` */
export type HotelRoomInput = {
  bathroomType: Scalars['String']['input']
  description: Scalars['String']['input']
  gamingRoom: Scalars['Boolean']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  occupancy: Scalars['String']['input']
  quantity: Scalars['Int']['input']
  rate: Scalars['String']['input']
  type: Scalars['String']['input']
}

/** Represents an update to a `HotelRoom`. Fields that are set will be updated. */
export type HotelRoomPatch = {
  bathroomType?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  gamingRoom?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  occupancy?: InputMaybe<Scalars['String']['input']>
  quantity?: InputMaybe<Scalars['Int']['input']>
  rate?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

/** A connection to a list of `HotelRoom` values. */
export type HotelRoomsConnection = {
  __typename: 'HotelRoomsConnection'
  /** A list of edges which contains the `HotelRoom` and cursor to aid in pagination. */
  edges: Array<HotelRoomsEdge>
  /** A list of `HotelRoom` objects. */
  nodes: Array<Maybe<HotelRoom>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `HotelRoom` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `HotelRoom` edge in the connection. */
export type HotelRoomsEdge = {
  __typename: 'HotelRoomsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `HotelRoom` at the end of the edge. */
  node?: Maybe<HotelRoom>
}

/** Methods to use when ordering `HotelRoom`. */
export enum HotelRoomsOrderBy {
  BathroomTypeAsc = 'BATHROOM_TYPE_ASC',
  BathroomTypeDesc = 'BATHROOM_TYPE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  GamingRoomAsc = 'GAMING_ROOM_ASC',
  GamingRoomDesc = 'GAMING_ROOM_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MembershipsByHotelRoomIdCountAsc = 'MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_ASC',
  MembershipsByHotelRoomIdCountDesc = 'MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_DESC',
  Natural = 'NATURAL',
  OccupancyAsc = 'OCCUPANCY_ASC',
  OccupancyDesc = 'OCCUPANCY_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  QuantityAsc = 'QUANTITY_ASC',
  QuantityDesc = 'QUANTITY_DESC',
  RateAsc = 'RATE_ASC',
  RateDesc = 'RATE_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
}

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>
}

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']['input']>>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>
}

export type Lookup = Node & {
  __typename: 'Lookup'
  codeMaximum?: Maybe<Scalars['String']['output']>
  codeMinimum?: Maybe<Scalars['String']['output']>
  codeScale?: Maybe<Scalars['Int']['output']>
  codeType: Scalars['String']['output']
  id: Scalars['Int']['output']
  internationalize: Scalars['Boolean']['output']
  /** Reads and enables pagination through a set of `LookupValue`. */
  lookupValues: LookupValuesConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  ordering: Scalars['String']['output']
  realm: Scalars['String']['output']
  valueMaximum?: Maybe<Scalars['String']['output']>
  valueMinimum?: Maybe<Scalars['String']['output']>
  valueScale?: Maybe<Scalars['Int']['output']>
  valueType: Scalars['String']['output']
}

export type LookupLookupValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<LookupValueCondition>
  filter?: InputMaybe<LookupValueFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<LookupValuesOrderBy>>
}

/** A condition to be used against `Lookup` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LookupCondition = {
  /** Checks for equality with the object’s `codeMaximum` field. */
  codeMaximum?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `codeMinimum` field. */
  codeMinimum?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `codeScale` field. */
  codeScale?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `codeType` field. */
  codeType?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `internationalize` field. */
  internationalize?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `ordering` field. */
  ordering?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `realm` field. */
  realm?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `valueMaximum` field. */
  valueMaximum?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `valueMinimum` field. */
  valueMinimum?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `valueScale` field. */
  valueScale?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `valueType` field. */
  valueType?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `Lookup` object types. All fields are combined with a logical ‘and.’ */
export type LookupFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LookupFilter>>
  /** Filter by the object’s `codeMaximum` field. */
  codeMaximum?: InputMaybe<StringFilter>
  /** Filter by the object’s `codeMinimum` field. */
  codeMinimum?: InputMaybe<StringFilter>
  /** Filter by the object’s `codeScale` field. */
  codeScale?: InputMaybe<IntFilter>
  /** Filter by the object’s `codeType` field. */
  codeType?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `internationalize` field. */
  internationalize?: InputMaybe<BooleanFilter>
  /** Negates the expression. */
  not?: InputMaybe<LookupFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LookupFilter>>
  /** Filter by the object’s `ordering` field. */
  ordering?: InputMaybe<StringFilter>
  /** Filter by the object’s `realm` field. */
  realm?: InputMaybe<StringFilter>
  /** Filter by the object’s `valueMaximum` field. */
  valueMaximum?: InputMaybe<StringFilter>
  /** Filter by the object’s `valueMinimum` field. */
  valueMinimum?: InputMaybe<StringFilter>
  /** Filter by the object’s `valueScale` field. */
  valueScale?: InputMaybe<IntFilter>
  /** Filter by the object’s `valueType` field. */
  valueType?: InputMaybe<StringFilter>
}

/** An input for mutations affecting `Lookup` */
export type LookupInput = {
  codeMaximum?: InputMaybe<Scalars['String']['input']>
  codeMinimum?: InputMaybe<Scalars['String']['input']>
  codeScale?: InputMaybe<Scalars['Int']['input']>
  codeType: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  internationalize: Scalars['Boolean']['input']
  ordering: Scalars['String']['input']
  realm: Scalars['String']['input']
  valueMaximum?: InputMaybe<Scalars['String']['input']>
  valueMinimum?: InputMaybe<Scalars['String']['input']>
  valueScale?: InputMaybe<Scalars['Int']['input']>
  valueType: Scalars['String']['input']
}

/** Represents an update to a `Lookup`. Fields that are set will be updated. */
export type LookupPatch = {
  codeMaximum?: InputMaybe<Scalars['String']['input']>
  codeMinimum?: InputMaybe<Scalars['String']['input']>
  codeScale?: InputMaybe<Scalars['Int']['input']>
  codeType?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  internationalize?: InputMaybe<Scalars['Boolean']['input']>
  ordering?: InputMaybe<Scalars['String']['input']>
  realm?: InputMaybe<Scalars['String']['input']>
  valueMaximum?: InputMaybe<Scalars['String']['input']>
  valueMinimum?: InputMaybe<Scalars['String']['input']>
  valueScale?: InputMaybe<Scalars['Int']['input']>
  valueType?: InputMaybe<Scalars['String']['input']>
}

export type LookupValue = Node & {
  __typename: 'LookupValue'
  code: Scalars['String']['output']
  id: Scalars['Int']['output']
  /** Reads a single `Lookup` that is related to this `LookupValue`. */
  lookup?: Maybe<Lookup>
  lookupId: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  numericSequencer: Scalars['BigFloat']['output']
  sequencer: Scalars['Int']['output']
  stringSequencer: Scalars['String']['output']
  value: Scalars['String']['output']
}

/**
 * A condition to be used against `LookupValue` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type LookupValueCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `lookupId` field. */
  lookupId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `numericSequencer` field. */
  numericSequencer?: InputMaybe<Scalars['BigFloat']['input']>
  /** Checks for equality with the object’s `sequencer` field. */
  sequencer?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `stringSequencer` field. */
  stringSequencer?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `LookupValue` object types. All fields are combined with a logical ‘and.’ */
export type LookupValueFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LookupValueFilter>>
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `lookupId` field. */
  lookupId?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<LookupValueFilter>
  /** Filter by the object’s `numericSequencer` field. */
  numericSequencer?: InputMaybe<BigFloatFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LookupValueFilter>>
  /** Filter by the object’s `sequencer` field. */
  sequencer?: InputMaybe<IntFilter>
  /** Filter by the object’s `stringSequencer` field. */
  stringSequencer?: InputMaybe<StringFilter>
  /** Filter by the object’s `value` field. */
  value?: InputMaybe<StringFilter>
}

/** An input for mutations affecting `LookupValue` */
export type LookupValueInput = {
  code: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  lookupId: Scalars['Int']['input']
  numericSequencer: Scalars['BigFloat']['input']
  sequencer: Scalars['Int']['input']
  stringSequencer: Scalars['String']['input']
  value: Scalars['String']['input']
}

/** Represents an update to a `LookupValue`. Fields that are set will be updated. */
export type LookupValuePatch = {
  code?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  lookupId?: InputMaybe<Scalars['Int']['input']>
  numericSequencer?: InputMaybe<Scalars['BigFloat']['input']>
  sequencer?: InputMaybe<Scalars['Int']['input']>
  stringSequencer?: InputMaybe<Scalars['String']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

/** A connection to a list of `LookupValue` values. */
export type LookupValuesConnection = {
  __typename: 'LookupValuesConnection'
  /** A list of edges which contains the `LookupValue` and cursor to aid in pagination. */
  edges: Array<LookupValuesEdge>
  /** A list of `LookupValue` objects. */
  nodes: Array<Maybe<LookupValue>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `LookupValue` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `LookupValue` edge in the connection. */
export type LookupValuesEdge = {
  __typename: 'LookupValuesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `LookupValue` at the end of the edge. */
  node?: Maybe<LookupValue>
}

/** Methods to use when ordering `LookupValue`. */
export enum LookupValuesOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LookupByLookupIdCodeMaximumAsc = 'LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_ASC',
  LookupByLookupIdCodeMaximumDesc = 'LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_DESC',
  LookupByLookupIdCodeMinimumAsc = 'LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_ASC',
  LookupByLookupIdCodeMinimumDesc = 'LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_DESC',
  LookupByLookupIdCodeScaleAsc = 'LOOKUP_BY_LOOKUP_ID__CODE_SCALE_ASC',
  LookupByLookupIdCodeScaleDesc = 'LOOKUP_BY_LOOKUP_ID__CODE_SCALE_DESC',
  LookupByLookupIdCodeTypeAsc = 'LOOKUP_BY_LOOKUP_ID__CODE_TYPE_ASC',
  LookupByLookupIdCodeTypeDesc = 'LOOKUP_BY_LOOKUP_ID__CODE_TYPE_DESC',
  LookupByLookupIdIdAsc = 'LOOKUP_BY_LOOKUP_ID__ID_ASC',
  LookupByLookupIdIdDesc = 'LOOKUP_BY_LOOKUP_ID__ID_DESC',
  LookupByLookupIdInternationalizeAsc = 'LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_ASC',
  LookupByLookupIdInternationalizeDesc = 'LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_DESC',
  LookupByLookupIdOrderingAsc = 'LOOKUP_BY_LOOKUP_ID__ORDERING_ASC',
  LookupByLookupIdOrderingDesc = 'LOOKUP_BY_LOOKUP_ID__ORDERING_DESC',
  LookupByLookupIdRealmAsc = 'LOOKUP_BY_LOOKUP_ID__REALM_ASC',
  LookupByLookupIdRealmDesc = 'LOOKUP_BY_LOOKUP_ID__REALM_DESC',
  LookupByLookupIdValueMaximumAsc = 'LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_ASC',
  LookupByLookupIdValueMaximumDesc = 'LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_DESC',
  LookupByLookupIdValueMinimumAsc = 'LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_ASC',
  LookupByLookupIdValueMinimumDesc = 'LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_DESC',
  LookupByLookupIdValueScaleAsc = 'LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_ASC',
  LookupByLookupIdValueScaleDesc = 'LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_DESC',
  LookupByLookupIdValueTypeAsc = 'LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_ASC',
  LookupByLookupIdValueTypeDesc = 'LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_DESC',
  LookupIdAsc = 'LOOKUP_ID_ASC',
  LookupIdDesc = 'LOOKUP_ID_DESC',
  Natural = 'NATURAL',
  NumericSequencerAsc = 'NUMERIC_SEQUENCER_ASC',
  NumericSequencerDesc = 'NUMERIC_SEQUENCER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SequencerAsc = 'SEQUENCER_ASC',
  SequencerDesc = 'SEQUENCER_DESC',
  StringSequencerAsc = 'STRING_SEQUENCER_ASC',
  StringSequencerDesc = 'STRING_SEQUENCER_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
}

/** A connection to a list of `Lookup` values. */
export type LookupsConnection = {
  __typename: 'LookupsConnection'
  /** A list of edges which contains the `Lookup` and cursor to aid in pagination. */
  edges: Array<LookupsEdge>
  /** A list of `Lookup` objects. */
  nodes: Array<Maybe<Lookup>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Lookup` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Lookup` edge in the connection. */
export type LookupsEdge = {
  __typename: 'LookupsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Lookup` at the end of the edge. */
  node?: Maybe<Lookup>
}

/** Methods to use when ordering `Lookup`. */
export enum LookupsOrderBy {
  CodeMaximumAsc = 'CODE_MAXIMUM_ASC',
  CodeMaximumDesc = 'CODE_MAXIMUM_DESC',
  CodeMinimumAsc = 'CODE_MINIMUM_ASC',
  CodeMinimumDesc = 'CODE_MINIMUM_DESC',
  CodeScaleAsc = 'CODE_SCALE_ASC',
  CodeScaleDesc = 'CODE_SCALE_DESC',
  CodeTypeAsc = 'CODE_TYPE_ASC',
  CodeTypeDesc = 'CODE_TYPE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InternationalizeAsc = 'INTERNATIONALIZE_ASC',
  InternationalizeDesc = 'INTERNATIONALIZE_DESC',
  LookupValuesByLookupIdCountAsc = 'LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_ASC',
  LookupValuesByLookupIdCountDesc = 'LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_DESC',
  Natural = 'NATURAL',
  OrderingAsc = 'ORDERING_ASC',
  OrderingDesc = 'ORDERING_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RealmAsc = 'REALM_ASC',
  RealmDesc = 'REALM_DESC',
  ValueMaximumAsc = 'VALUE_MAXIMUM_ASC',
  ValueMaximumDesc = 'VALUE_MAXIMUM_DESC',
  ValueMinimumAsc = 'VALUE_MINIMUM_ASC',
  ValueMinimumDesc = 'VALUE_MINIMUM_DESC',
  ValueScaleAsc = 'VALUE_SCALE_ASC',
  ValueScaleDesc = 'VALUE_SCALE_DESC',
  ValueTypeAsc = 'VALUE_TYPE_ASC',
  ValueTypeDesc = 'VALUE_TYPE_DESC',
}

export type Membership = Node & {
  __typename: 'Membership'
  arrivalDate: Scalars['Datetime']['output']
  attendance: Scalars['String']['output']
  attending: Scalars['Boolean']['output']
  departureDate: Scalars['Datetime']['output']
  /** Reads and enables pagination through a set of `GameAssignment`. */
  gameAssignmentsByMemberId: GameAssignmentsConnection
  /** Reads and enables pagination through a set of `GameChoice`. */
  gameChoicesByMemberId: GameChoicesConnection
  /** Reads and enables pagination through a set of `GameSubmission`. */
  gameSubmissionsByMemberId: GameSubmissionsConnection
  /** Reads a single `HotelRoom` that is related to this `Membership`. */
  hotelRoom?: Maybe<HotelRoom>
  hotelRoomId: Scalars['Int']['output']
  id: Scalars['Int']['output']
  interestLevel: Scalars['String']['output']
  message: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  offerSubsidy: Scalars['Boolean']['output']
  requestOldPrice: Scalars['Boolean']['output']
  roomPreferenceAndNotes: Scalars['String']['output']
  roomingPreferences: Scalars['String']['output']
  roomingWith: Scalars['String']['output']
  slotsAttending?: Maybe<Scalars['String']['output']>
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByMemberId: TransactionsConnection
  /** Reads a single `User` that is related to this `Membership`. */
  user?: Maybe<User>
  userId: Scalars['Int']['output']
  volunteer: Scalars['Boolean']['output']
  year: Scalars['Int']['output']
}

export type MembershipGameAssignmentsByMemberIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameAssignmentCondition>
  filter?: InputMaybe<GameAssignmentFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

export type MembershipGameChoicesByMemberIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameChoiceCondition>
  filter?: InputMaybe<GameChoiceFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

export type MembershipGameSubmissionsByMemberIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameSubmissionCondition>
  filter?: InputMaybe<GameSubmissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameSubmissionsOrderBy>>
}

export type MembershipTransactionsByMemberIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<TransactionCondition>
  filter?: InputMaybe<TransactionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

/**
 * A condition to be used against `Membership` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MembershipCondition = {
  /** Checks for equality with the object’s `arrivalDate` field. */
  arrivalDate?: InputMaybe<Scalars['Datetime']['input']>
  /** Checks for equality with the object’s `attendance` field. */
  attendance?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `attending` field. */
  attending?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `departureDate` field. */
  departureDate?: InputMaybe<Scalars['Datetime']['input']>
  /** Checks for equality with the object’s `hotelRoomId` field. */
  hotelRoomId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `interestLevel` field. */
  interestLevel?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `offerSubsidy` field. */
  offerSubsidy?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `requestOldPrice` field. */
  requestOldPrice?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `roomPreferenceAndNotes` field. */
  roomPreferenceAndNotes?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `roomingPreferences` field. */
  roomingPreferences?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `roomingWith` field. */
  roomingWith?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `slotsAttending` field. */
  slotsAttending?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `volunteer` field. */
  volunteer?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Membership` object types. All fields are combined with a logical ‘and.’ */
export type MembershipFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<MembershipFilter>>
  /** Filter by the object’s `arrivalDate` field. */
  arrivalDate?: InputMaybe<DatetimeFilter>
  /** Filter by the object’s `attendance` field. */
  attendance?: InputMaybe<StringFilter>
  /** Filter by the object’s `attending` field. */
  attending?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `departureDate` field. */
  departureDate?: InputMaybe<DatetimeFilter>
  /** Filter by the object’s `hotelRoomId` field. */
  hotelRoomId?: InputMaybe<IntFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `interestLevel` field. */
  interestLevel?: InputMaybe<StringFilter>
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<MembershipFilter>
  /** Filter by the object’s `offerSubsidy` field. */
  offerSubsidy?: InputMaybe<BooleanFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<MembershipFilter>>
  /** Filter by the object’s `requestOldPrice` field. */
  requestOldPrice?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `roomPreferenceAndNotes` field. */
  roomPreferenceAndNotes?: InputMaybe<StringFilter>
  /** Filter by the object’s `roomingPreferences` field. */
  roomingPreferences?: InputMaybe<StringFilter>
  /** Filter by the object’s `roomingWith` field. */
  roomingWith?: InputMaybe<StringFilter>
  /** Filter by the object’s `slotsAttending` field. */
  slotsAttending?: InputMaybe<StringFilter>
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>
  /** Filter by the object’s `volunteer` field. */
  volunteer?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `Membership` */
export type MembershipInput = {
  arrivalDate: Scalars['Datetime']['input']
  attendance: Scalars['String']['input']
  attending: Scalars['Boolean']['input']
  departureDate: Scalars['Datetime']['input']
  hotelRoomId: Scalars['Int']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  interestLevel: Scalars['String']['input']
  message: Scalars['String']['input']
  offerSubsidy: Scalars['Boolean']['input']
  requestOldPrice: Scalars['Boolean']['input']
  roomPreferenceAndNotes: Scalars['String']['input']
  roomingPreferences: Scalars['String']['input']
  roomingWith: Scalars['String']['input']
  slotsAttending?: InputMaybe<Scalars['String']['input']>
  userId: Scalars['Int']['input']
  volunteer: Scalars['Boolean']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `Membership`. Fields that are set will be updated. */
export type MembershipPatch = {
  arrivalDate?: InputMaybe<Scalars['Datetime']['input']>
  attendance?: InputMaybe<Scalars['String']['input']>
  attending?: InputMaybe<Scalars['Boolean']['input']>
  departureDate?: InputMaybe<Scalars['Datetime']['input']>
  hotelRoomId?: InputMaybe<Scalars['Int']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  interestLevel?: InputMaybe<Scalars['String']['input']>
  message?: InputMaybe<Scalars['String']['input']>
  offerSubsidy?: InputMaybe<Scalars['Boolean']['input']>
  requestOldPrice?: InputMaybe<Scalars['Boolean']['input']>
  roomPreferenceAndNotes?: InputMaybe<Scalars['String']['input']>
  roomingPreferences?: InputMaybe<Scalars['String']['input']>
  roomingWith?: InputMaybe<Scalars['String']['input']>
  slotsAttending?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['Int']['input']>
  volunteer?: InputMaybe<Scalars['Boolean']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `Membership` values. */
export type MembershipsConnection = {
  __typename: 'MembershipsConnection'
  /** A list of edges which contains the `Membership` and cursor to aid in pagination. */
  edges: Array<MembershipsEdge>
  /** A list of `Membership` objects. */
  nodes: Array<Maybe<Membership>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Membership` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Membership` edge in the connection. */
export type MembershipsEdge = {
  __typename: 'MembershipsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Membership` at the end of the edge. */
  node?: Maybe<Membership>
}

/** Methods to use when ordering `Membership`. */
export enum MembershipsOrderBy {
  ArrivalDateAsc = 'ARRIVAL_DATE_ASC',
  ArrivalDateDesc = 'ARRIVAL_DATE_DESC',
  AttendanceAsc = 'ATTENDANCE_ASC',
  AttendanceDesc = 'ATTENDANCE_DESC',
  AttendingAsc = 'ATTENDING_ASC',
  AttendingDesc = 'ATTENDING_DESC',
  DepartureDateAsc = 'DEPARTURE_DATE_ASC',
  DepartureDateDesc = 'DEPARTURE_DATE_DESC',
  GameAssignmentsByMemberIdCountAsc = 'GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_ASC',
  GameAssignmentsByMemberIdCountDesc = 'GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_DESC',
  GameChoicesByMemberIdCountAsc = 'GAME_CHOICES_BY_MEMBER_ID__COUNT_ASC',
  GameChoicesByMemberIdCountDesc = 'GAME_CHOICES_BY_MEMBER_ID__COUNT_DESC',
  GameSubmissionsByMemberIdCountAsc = 'GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_ASC',
  GameSubmissionsByMemberIdCountDesc = 'GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_DESC',
  HotelRoomByHotelRoomIdBathroomTypeAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_ASC',
  HotelRoomByHotelRoomIdBathroomTypeDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_DESC',
  HotelRoomByHotelRoomIdDescriptionAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_ASC',
  HotelRoomByHotelRoomIdDescriptionDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_DESC',
  HotelRoomByHotelRoomIdGamingRoomAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_ASC',
  HotelRoomByHotelRoomIdGamingRoomDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_DESC',
  HotelRoomByHotelRoomIdIdAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_ASC',
  HotelRoomByHotelRoomIdIdDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_DESC',
  HotelRoomByHotelRoomIdOccupancyAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_ASC',
  HotelRoomByHotelRoomIdOccupancyDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_DESC',
  HotelRoomByHotelRoomIdQuantityAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_ASC',
  HotelRoomByHotelRoomIdQuantityDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_DESC',
  HotelRoomByHotelRoomIdRateAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_ASC',
  HotelRoomByHotelRoomIdRateDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_DESC',
  HotelRoomByHotelRoomIdTypeAsc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_ASC',
  HotelRoomByHotelRoomIdTypeDesc = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_DESC',
  HotelRoomIdAsc = 'HOTEL_ROOM_ID_ASC',
  HotelRoomIdDesc = 'HOTEL_ROOM_ID_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  InterestLevelAsc = 'INTEREST_LEVEL_ASC',
  InterestLevelDesc = 'INTEREST_LEVEL_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  Natural = 'NATURAL',
  OfferSubsidyAsc = 'OFFER_SUBSIDY_ASC',
  OfferSubsidyDesc = 'OFFER_SUBSIDY_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RequestOldPriceAsc = 'REQUEST_OLD_PRICE_ASC',
  RequestOldPriceDesc = 'REQUEST_OLD_PRICE_DESC',
  RoomingPreferencesAsc = 'ROOMING_PREFERENCES_ASC',
  RoomingPreferencesDesc = 'ROOMING_PREFERENCES_DESC',
  RoomingWithAsc = 'ROOMING_WITH_ASC',
  RoomingWithDesc = 'ROOMING_WITH_DESC',
  RoomPreferenceAndNotesAsc = 'ROOM_PREFERENCE_AND_NOTES_ASC',
  RoomPreferenceAndNotesDesc = 'ROOM_PREFERENCE_AND_NOTES_DESC',
  SlotsAttendingAsc = 'SLOTS_ATTENDING_ASC',
  SlotsAttendingDesc = 'SLOTS_ATTENDING_DESC',
  TransactionsByMemberIdCountAsc = 'TRANSACTIONS_BY_MEMBER_ID__COUNT_ASC',
  TransactionsByMemberIdCountDesc = 'TRANSACTIONS_BY_MEMBER_ID__COUNT_DESC',
  UserByUserIdAmountOwedAsc = 'USER_BY_USER_ID__AMOUNT_OWED_ASC',
  UserByUserIdAmountOwedDesc = 'USER_BY_USER_ID__AMOUNT_OWED_DESC',
  UserByUserIdDisplayNameAsc = 'USER_BY_USER_ID__DISPLAY_NAME_ASC',
  UserByUserIdDisplayNameDesc = 'USER_BY_USER_ID__DISPLAY_NAME_DESC',
  UserByUserIdEmailAsc = 'USER_BY_USER_ID__EMAIL_ASC',
  UserByUserIdEmailDesc = 'USER_BY_USER_ID__EMAIL_DESC',
  UserByUserIdFirstNameAsc = 'USER_BY_USER_ID__FIRST_NAME_ASC',
  UserByUserIdFirstNameDesc = 'USER_BY_USER_ID__FIRST_NAME_DESC',
  UserByUserIdFullNameAsc = 'USER_BY_USER_ID__FULL_NAME_ASC',
  UserByUserIdFullNameDesc = 'USER_BY_USER_ID__FULL_NAME_DESC',
  UserByUserIdIdAsc = 'USER_BY_USER_ID__ID_ASC',
  UserByUserIdIdDesc = 'USER_BY_USER_ID__ID_DESC',
  UserByUserIdLastNameAsc = 'USER_BY_USER_ID__LAST_NAME_ASC',
  UserByUserIdLastNameDesc = 'USER_BY_USER_ID__LAST_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  VolunteerAsc = 'VOLUNTEER_ASC',
  VolunteerDesc = 'VOLUNTEER_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename: 'Mutation'
  createBareSlotChoices?: Maybe<CreateBareSlotChoicesPayload>
  /** Creates a single `Game`. */
  createGame?: Maybe<CreateGamePayload>
  /** Creates a single `GameAssignment`. */
  createGameAssignment?: Maybe<CreateGameAssignmentPayload>
  /** Creates a single `GameChoice`. */
  createGameChoice?: Maybe<CreateGameChoicePayload>
  /** Creates a single `GameSubmission`. */
  createGameSubmission?: Maybe<CreateGameSubmissionPayload>
  /** Creates a single `HotelRoom`. */
  createHotelRoom?: Maybe<CreateHotelRoomPayload>
  /** Creates a single `HotelRoomDetail`. */
  createHotelRoomDetail?: Maybe<CreateHotelRoomDetailPayload>
  /** Creates a single `Lookup`. */
  createLookup?: Maybe<CreateLookupPayload>
  /** Creates a single `LookupValue`. */
  createLookupValue?: Maybe<CreateLookupValuePayload>
  /** Creates a single `Membership`. */
  createMembership?: Maybe<CreateMembershipPayload>
  /** Creates a single `Profile`. */
  createProfile?: Maybe<CreateProfilePayload>
  /** Creates a single `Role`. */
  createRole?: Maybe<CreateRolePayload>
  /** Creates a single `Room`. */
  createRoom?: Maybe<CreateRoomPayload>
  /** Creates a single `Setting`. */
  createSetting?: Maybe<CreateSettingPayload>
  /** Creates a single `ShirtOrder`. */
  createShirtOrder?: Maybe<CreateShirtOrderPayload>
  /** Creates a single `ShirtOrderItem`. */
  createShirtOrderItem?: Maybe<CreateShirtOrderItemPayload>
  /** Creates a single `Slot`. */
  createSlot?: Maybe<CreateSlotPayload>
  /** Creates a single `Stripe`. */
  createStripe?: Maybe<CreateStripePayload>
  /** Creates a single `Transaction`. */
  createTransaction?: Maybe<CreateTransactionPayload>
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>
  /** Creates a single `UserRole`. */
  createUserRole?: Maybe<CreateUserRolePayload>
  /** Deletes a single `Game` using a unique key. */
  deleteGame?: Maybe<DeleteGamePayload>
  /** Deletes a single `GameAssignment` using a unique key. */
  deleteGameAssignment?: Maybe<DeleteGameAssignmentPayload>
  /** Deletes a single `GameAssignment` using its globally unique id. */
  deleteGameAssignmentByNodeId?: Maybe<DeleteGameAssignmentPayload>
  /** Deletes a single `Game` using its globally unique id. */
  deleteGameByNodeId?: Maybe<DeleteGamePayload>
  /** Deletes a single `GameChoice` using a unique key. */
  deleteGameChoice?: Maybe<DeleteGameChoicePayload>
  /** Deletes a single `GameChoice` using its globally unique id. */
  deleteGameChoiceByNodeId?: Maybe<DeleteGameChoicePayload>
  /** Deletes a single `GameSubmission` using a unique key. */
  deleteGameSubmission?: Maybe<DeleteGameSubmissionPayload>
  /** Deletes a single `GameSubmission` using its globally unique id. */
  deleteGameSubmissionByNodeId?: Maybe<DeleteGameSubmissionPayload>
  /** Deletes a single `HotelRoom` using a unique key. */
  deleteHotelRoom?: Maybe<DeleteHotelRoomPayload>
  /** Deletes a single `HotelRoom` using its globally unique id. */
  deleteHotelRoomByNodeId?: Maybe<DeleteHotelRoomPayload>
  /** Deletes a single `HotelRoomDetail` using a unique key. */
  deleteHotelRoomDetail?: Maybe<DeleteHotelRoomDetailPayload>
  /** Deletes a single `HotelRoomDetail` using its globally unique id. */
  deleteHotelRoomDetailByNodeId?: Maybe<DeleteHotelRoomDetailPayload>
  /** Deletes a single `Lookup` using a unique key. */
  deleteLookup?: Maybe<DeleteLookupPayload>
  /** Deletes a single `Lookup` using its globally unique id. */
  deleteLookupByNodeId?: Maybe<DeleteLookupPayload>
  /** Deletes a single `Lookup` using a unique key. */
  deleteLookupByRealm?: Maybe<DeleteLookupPayload>
  /** Deletes a single `LookupValue` using a unique key. */
  deleteLookupValue?: Maybe<DeleteLookupValuePayload>
  /** Deletes a single `LookupValue` using a unique key. */
  deleteLookupValueByLookupIdAndCode?: Maybe<DeleteLookupValuePayload>
  /** Deletes a single `LookupValue` using its globally unique id. */
  deleteLookupValueByNodeId?: Maybe<DeleteLookupValuePayload>
  /** Deletes a single `Membership` using a unique key. */
  deleteMembership?: Maybe<DeleteMembershipPayload>
  /** Deletes a single `Membership` using its globally unique id. */
  deleteMembershipByNodeId?: Maybe<DeleteMembershipPayload>
  /** Deletes a single `Profile` using a unique key. */
  deleteProfile?: Maybe<DeleteProfilePayload>
  /** Deletes a single `Profile` using its globally unique id. */
  deleteProfileByNodeId?: Maybe<DeleteProfilePayload>
  /** Deletes a single `Role` using a unique key. */
  deleteRole?: Maybe<DeleteRolePayload>
  /** Deletes a single `Role` using a unique key. */
  deleteRoleByAuthority?: Maybe<DeleteRolePayload>
  /** Deletes a single `Role` using its globally unique id. */
  deleteRoleByNodeId?: Maybe<DeleteRolePayload>
  /** Deletes a single `Room` using a unique key. */
  deleteRoom?: Maybe<DeleteRoomPayload>
  /** Deletes a single `Room` using its globally unique id. */
  deleteRoomByNodeId?: Maybe<DeleteRoomPayload>
  /** Deletes a single `Setting` using a unique key. */
  deleteSetting?: Maybe<DeleteSettingPayload>
  /** Deletes a single `Setting` using its globally unique id. */
  deleteSettingByNodeId?: Maybe<DeleteSettingPayload>
  /** Deletes a single `ShirtOrder` using a unique key. */
  deleteShirtOrder?: Maybe<DeleteShirtOrderPayload>
  /** Deletes a single `ShirtOrder` using its globally unique id. */
  deleteShirtOrderByNodeId?: Maybe<DeleteShirtOrderPayload>
  /** Deletes a single `ShirtOrderItem` using a unique key. */
  deleteShirtOrderItem?: Maybe<DeleteShirtOrderItemPayload>
  /** Deletes a single `ShirtOrderItem` using its globally unique id. */
  deleteShirtOrderItemByNodeId?: Maybe<DeleteShirtOrderItemPayload>
  /** Deletes a single `Slot` using a unique key. */
  deleteSlot?: Maybe<DeleteSlotPayload>
  /** Deletes a single `Slot` using its globally unique id. */
  deleteSlotByNodeId?: Maybe<DeleteSlotPayload>
  /** Deletes a single `Stripe` using a unique key. */
  deleteStripe?: Maybe<DeleteStripePayload>
  /** Deletes a single `Stripe` using its globally unique id. */
  deleteStripeByNodeId?: Maybe<DeleteStripePayload>
  /** Deletes a single `Transaction` using a unique key. */
  deleteTransaction?: Maybe<DeleteTransactionPayload>
  /** Deletes a single `Transaction` using its globally unique id. */
  deleteTransactionByNodeId?: Maybe<DeleteTransactionPayload>
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>
  /** Deletes a single `User` using a unique key. */
  deleteUserByEmail?: Maybe<DeleteUserPayload>
  /** Deletes a single `User` using its globally unique id. */
  deleteUserByNodeId?: Maybe<DeleteUserPayload>
  /** Deletes a single `UserRole` using a unique key. */
  deleteUserRole?: Maybe<DeleteUserRolePayload>
  /** Deletes a single `UserRole` using its globally unique id. */
  deleteUserRoleByNodeId?: Maybe<DeleteUserRolePayload>
  fTruncateTables?: Maybe<FTruncateTablesPayload>
  slotGmGame?: Maybe<SlotGmGamePayload>
  /** Updates a single `Game` using a unique key and a patch. */
  updateGame?: Maybe<UpdateGamePayload>
  /** Updates a single `GameAssignment` using a unique key and a patch. */
  updateGameAssignment?: Maybe<UpdateGameAssignmentPayload>
  /** Updates a single `GameAssignment` using its globally unique id and a patch. */
  updateGameAssignmentByNodeId?: Maybe<UpdateGameAssignmentPayload>
  /** Updates a single `Game` using its globally unique id and a patch. */
  updateGameByNodeId?: Maybe<UpdateGamePayload>
  /** Updates a single `GameChoice` using a unique key and a patch. */
  updateGameChoice?: Maybe<UpdateGameChoicePayload>
  /** Updates a single `GameChoice` using its globally unique id and a patch. */
  updateGameChoiceByNodeId?: Maybe<UpdateGameChoicePayload>
  /** Updates a single `GameSubmission` using a unique key and a patch. */
  updateGameSubmission?: Maybe<UpdateGameSubmissionPayload>
  /** Updates a single `GameSubmission` using its globally unique id and a patch. */
  updateGameSubmissionByNodeId?: Maybe<UpdateGameSubmissionPayload>
  /** Updates a single `HotelRoom` using a unique key and a patch. */
  updateHotelRoom?: Maybe<UpdateHotelRoomPayload>
  /** Updates a single `HotelRoom` using its globally unique id and a patch. */
  updateHotelRoomByNodeId?: Maybe<UpdateHotelRoomPayload>
  /** Updates a single `HotelRoomDetail` using a unique key and a patch. */
  updateHotelRoomDetail?: Maybe<UpdateHotelRoomDetailPayload>
  /** Updates a single `HotelRoomDetail` using its globally unique id and a patch. */
  updateHotelRoomDetailByNodeId?: Maybe<UpdateHotelRoomDetailPayload>
  /** Updates a single `Lookup` using a unique key and a patch. */
  updateLookup?: Maybe<UpdateLookupPayload>
  /** Updates a single `Lookup` using its globally unique id and a patch. */
  updateLookupByNodeId?: Maybe<UpdateLookupPayload>
  /** Updates a single `Lookup` using a unique key and a patch. */
  updateLookupByRealm?: Maybe<UpdateLookupPayload>
  /** Updates a single `LookupValue` using a unique key and a patch. */
  updateLookupValue?: Maybe<UpdateLookupValuePayload>
  /** Updates a single `LookupValue` using a unique key and a patch. */
  updateLookupValueByLookupIdAndCode?: Maybe<UpdateLookupValuePayload>
  /** Updates a single `LookupValue` using its globally unique id and a patch. */
  updateLookupValueByNodeId?: Maybe<UpdateLookupValuePayload>
  /** Updates a single `Membership` using a unique key and a patch. */
  updateMembership?: Maybe<UpdateMembershipPayload>
  /** Updates a single `Membership` using its globally unique id and a patch. */
  updateMembershipByNodeId?: Maybe<UpdateMembershipPayload>
  /** Updates a single `Profile` using a unique key and a patch. */
  updateProfile?: Maybe<UpdateProfilePayload>
  /** Updates a single `Profile` using its globally unique id and a patch. */
  updateProfileByNodeId?: Maybe<UpdateProfilePayload>
  /** Updates a single `Role` using a unique key and a patch. */
  updateRole?: Maybe<UpdateRolePayload>
  /** Updates a single `Role` using a unique key and a patch. */
  updateRoleByAuthority?: Maybe<UpdateRolePayload>
  /** Updates a single `Role` using its globally unique id and a patch. */
  updateRoleByNodeId?: Maybe<UpdateRolePayload>
  /** Updates a single `Room` using a unique key and a patch. */
  updateRoom?: Maybe<UpdateRoomPayload>
  /** Updates a single `Room` using its globally unique id and a patch. */
  updateRoomByNodeId?: Maybe<UpdateRoomPayload>
  /** Updates a single `Setting` using a unique key and a patch. */
  updateSetting?: Maybe<UpdateSettingPayload>
  /** Updates a single `Setting` using its globally unique id and a patch. */
  updateSettingByNodeId?: Maybe<UpdateSettingPayload>
  /** Updates a single `ShirtOrder` using a unique key and a patch. */
  updateShirtOrder?: Maybe<UpdateShirtOrderPayload>
  /** Updates a single `ShirtOrder` using its globally unique id and a patch. */
  updateShirtOrderByNodeId?: Maybe<UpdateShirtOrderPayload>
  /** Updates a single `ShirtOrderItem` using a unique key and a patch. */
  updateShirtOrderItem?: Maybe<UpdateShirtOrderItemPayload>
  /** Updates a single `ShirtOrderItem` using its globally unique id and a patch. */
  updateShirtOrderItemByNodeId?: Maybe<UpdateShirtOrderItemPayload>
  /** Updates a single `Slot` using a unique key and a patch. */
  updateSlot?: Maybe<UpdateSlotPayload>
  /** Updates a single `Slot` using its globally unique id and a patch. */
  updateSlotByNodeId?: Maybe<UpdateSlotPayload>
  /** Updates a single `Stripe` using a unique key and a patch. */
  updateStripe?: Maybe<UpdateStripePayload>
  /** Updates a single `Stripe` using its globally unique id and a patch. */
  updateStripeByNodeId?: Maybe<UpdateStripePayload>
  /** Updates a single `Transaction` using a unique key and a patch. */
  updateTransaction?: Maybe<UpdateTransactionPayload>
  /** Updates a single `Transaction` using its globally unique id and a patch. */
  updateTransactionByNodeId?: Maybe<UpdateTransactionPayload>
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByEmail?: Maybe<UpdateUserPayload>
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserByNodeId?: Maybe<UpdateUserPayload>
  /** Updates a single `UserRole` using a unique key and a patch. */
  updateUserRole?: Maybe<UpdateUserRolePayload>
  /** Updates a single `UserRole` using its globally unique id and a patch. */
  updateUserRoleByNodeId?: Maybe<UpdateUserRolePayload>
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateBareSlotChoicesArgs = {
  input: CreateBareSlotChoicesInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGameArgs = {
  input: CreateGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGameAssignmentArgs = {
  input: CreateGameAssignmentInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGameChoiceArgs = {
  input: CreateGameChoiceInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateGameSubmissionArgs = {
  input: CreateGameSubmissionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateHotelRoomArgs = {
  input: CreateHotelRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateHotelRoomDetailArgs = {
  input: CreateHotelRoomDetailInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateLookupArgs = {
  input: CreateLookupInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateLookupValueArgs = {
  input: CreateLookupValueInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMembershipArgs = {
  input: CreateMembershipInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProfileArgs = {
  input: CreateProfileInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRoleArgs = {
  input: CreateRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateRoomArgs = {
  input: CreateRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSettingArgs = {
  input: CreateSettingInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateShirtOrderArgs = {
  input: CreateShirtOrderInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateShirtOrderItemArgs = {
  input: CreateShirtOrderItemInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSlotArgs = {
  input: CreateSlotInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateStripeArgs = {
  input: CreateStripeInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserRoleArgs = {
  input: CreateUserRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameArgs = {
  input: DeleteGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameAssignmentArgs = {
  input: DeleteGameAssignmentInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameAssignmentByNodeIdArgs = {
  input: DeleteGameAssignmentByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameByNodeIdArgs = {
  input: DeleteGameByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameChoiceArgs = {
  input: DeleteGameChoiceInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameChoiceByNodeIdArgs = {
  input: DeleteGameChoiceByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameSubmissionArgs = {
  input: DeleteGameSubmissionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteGameSubmissionByNodeIdArgs = {
  input: DeleteGameSubmissionByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHotelRoomArgs = {
  input: DeleteHotelRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHotelRoomByNodeIdArgs = {
  input: DeleteHotelRoomByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHotelRoomDetailArgs = {
  input: DeleteHotelRoomDetailInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteHotelRoomDetailByNodeIdArgs = {
  input: DeleteHotelRoomDetailByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupArgs = {
  input: DeleteLookupInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupByNodeIdArgs = {
  input: DeleteLookupByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupByRealmArgs = {
  input: DeleteLookupByRealmInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupValueArgs = {
  input: DeleteLookupValueInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupValueByLookupIdAndCodeArgs = {
  input: DeleteLookupValueByLookupIdAndCodeInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLookupValueByNodeIdArgs = {
  input: DeleteLookupValueByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMembershipArgs = {
  input: DeleteMembershipInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMembershipByNodeIdArgs = {
  input: DeleteMembershipByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProfileArgs = {
  input: DeleteProfileInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProfileByNodeIdArgs = {
  input: DeleteProfileByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleArgs = {
  input: DeleteRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleByAuthorityArgs = {
  input: DeleteRoleByAuthorityInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoleByNodeIdArgs = {
  input: DeleteRoleByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoomArgs = {
  input: DeleteRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteRoomByNodeIdArgs = {
  input: DeleteRoomByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSettingArgs = {
  input: DeleteSettingInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSettingByNodeIdArgs = {
  input: DeleteSettingByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShirtOrderArgs = {
  input: DeleteShirtOrderInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShirtOrderByNodeIdArgs = {
  input: DeleteShirtOrderByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShirtOrderItemArgs = {
  input: DeleteShirtOrderItemInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShirtOrderItemByNodeIdArgs = {
  input: DeleteShirtOrderItemByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSlotArgs = {
  input: DeleteSlotInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSlotByNodeIdArgs = {
  input: DeleteSlotByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteStripeArgs = {
  input: DeleteStripeInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteStripeByNodeIdArgs = {
  input: DeleteStripeByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTransactionArgs = {
  input: DeleteTransactionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTransactionByNodeIdArgs = {
  input: DeleteTransactionByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByEmailArgs = {
  input: DeleteUserByEmailInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByNodeIdArgs = {
  input: DeleteUserByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserRoleArgs = {
  input: DeleteUserRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserRoleByNodeIdArgs = {
  input: DeleteUserRoleByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationFTruncateTablesArgs = {
  input: FTruncateTablesInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationSlotGmGameArgs = {
  input: SlotGmGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameArgs = {
  input: UpdateGameInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameAssignmentArgs = {
  input: UpdateGameAssignmentInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameAssignmentByNodeIdArgs = {
  input: UpdateGameAssignmentByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameByNodeIdArgs = {
  input: UpdateGameByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameChoiceArgs = {
  input: UpdateGameChoiceInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameChoiceByNodeIdArgs = {
  input: UpdateGameChoiceByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameSubmissionArgs = {
  input: UpdateGameSubmissionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateGameSubmissionByNodeIdArgs = {
  input: UpdateGameSubmissionByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHotelRoomArgs = {
  input: UpdateHotelRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHotelRoomByNodeIdArgs = {
  input: UpdateHotelRoomByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHotelRoomDetailArgs = {
  input: UpdateHotelRoomDetailInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateHotelRoomDetailByNodeIdArgs = {
  input: UpdateHotelRoomDetailByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupArgs = {
  input: UpdateLookupInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupByNodeIdArgs = {
  input: UpdateLookupByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupByRealmArgs = {
  input: UpdateLookupByRealmInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupValueArgs = {
  input: UpdateLookupValueInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupValueByLookupIdAndCodeArgs = {
  input: UpdateLookupValueByLookupIdAndCodeInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLookupValueByNodeIdArgs = {
  input: UpdateLookupValueByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMembershipArgs = {
  input: UpdateMembershipInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMembershipByNodeIdArgs = {
  input: UpdateMembershipByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProfileByNodeIdArgs = {
  input: UpdateProfileByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleByAuthorityArgs = {
  input: UpdateRoleByAuthorityInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoleByNodeIdArgs = {
  input: UpdateRoleByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoomArgs = {
  input: UpdateRoomInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateRoomByNodeIdArgs = {
  input: UpdateRoomByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSettingArgs = {
  input: UpdateSettingInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSettingByNodeIdArgs = {
  input: UpdateSettingByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShirtOrderArgs = {
  input: UpdateShirtOrderInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShirtOrderByNodeIdArgs = {
  input: UpdateShirtOrderByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShirtOrderItemArgs = {
  input: UpdateShirtOrderItemInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShirtOrderItemByNodeIdArgs = {
  input: UpdateShirtOrderItemByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSlotArgs = {
  input: UpdateSlotInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSlotByNodeIdArgs = {
  input: UpdateSlotByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateStripeArgs = {
  input: UpdateStripeInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateStripeByNodeIdArgs = {
  input: UpdateStripeByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTransactionByNodeIdArgs = {
  input: UpdateTransactionByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByEmailArgs = {
  input: UpdateUserByEmailInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByNodeIdArgs = {
  input: UpdateUserByNodeIdInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserRoleArgs = {
  input: UpdateUserRoleInput
}

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserRoleByNodeIdArgs = {
  input: UpdateUserRoleByNodeIdInput
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename: 'PageInfo'
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output']
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output']
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>
}

export type Profile = Node & {
  __typename: 'Profile'
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  phoneNumber?: Maybe<Scalars['String']['output']>
  snailMailAddress?: Maybe<Scalars['String']['output']>
  /** Reads a single `User` that is related to this `Profile`. */
  user?: Maybe<User>
  userId: Scalars['Int']['output']
}

/** A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProfileCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `phoneNumber` field. */
  phoneNumber?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `snailMailAddress` field. */
  snailMailAddress?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Profile` object types. All fields are combined with a logical ‘and.’ */
export type ProfileFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProfileFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<ProfileFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProfileFilter>>
  /** Filter by the object’s `phoneNumber` field. */
  phoneNumber?: InputMaybe<StringFilter>
  /** Filter by the object’s `snailMailAddress` field. */
  snailMailAddress?: InputMaybe<StringFilter>
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `Profile` */
export type ProfileInput = {
  id?: InputMaybe<Scalars['Int']['input']>
  phoneNumber?: InputMaybe<Scalars['String']['input']>
  snailMailAddress?: InputMaybe<Scalars['String']['input']>
  userId: Scalars['Int']['input']
}

/** Represents an update to a `Profile`. Fields that are set will be updated. */
export type ProfilePatch = {
  id?: InputMaybe<Scalars['Int']['input']>
  phoneNumber?: InputMaybe<Scalars['String']['input']>
  snailMailAddress?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `Profile` values. */
export type ProfilesConnection = {
  __typename: 'ProfilesConnection'
  /** A list of edges which contains the `Profile` and cursor to aid in pagination. */
  edges: Array<ProfilesEdge>
  /** A list of `Profile` objects. */
  nodes: Array<Maybe<Profile>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Profile` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Profile` edge in the connection. */
export type ProfilesEdge = {
  __typename: 'ProfilesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Profile` at the end of the edge. */
  node?: Maybe<Profile>
}

/** Methods to use when ordering `Profile`. */
export enum ProfilesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PhoneNumberAsc = 'PHONE_NUMBER_ASC',
  PhoneNumberDesc = 'PHONE_NUMBER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SnailMailAddressAsc = 'SNAIL_MAIL_ADDRESS_ASC',
  SnailMailAddressDesc = 'SNAIL_MAIL_ADDRESS_DESC',
  UserByUserIdAmountOwedAsc = 'USER_BY_USER_ID__AMOUNT_OWED_ASC',
  UserByUserIdAmountOwedDesc = 'USER_BY_USER_ID__AMOUNT_OWED_DESC',
  UserByUserIdDisplayNameAsc = 'USER_BY_USER_ID__DISPLAY_NAME_ASC',
  UserByUserIdDisplayNameDesc = 'USER_BY_USER_ID__DISPLAY_NAME_DESC',
  UserByUserIdEmailAsc = 'USER_BY_USER_ID__EMAIL_ASC',
  UserByUserIdEmailDesc = 'USER_BY_USER_ID__EMAIL_DESC',
  UserByUserIdFirstNameAsc = 'USER_BY_USER_ID__FIRST_NAME_ASC',
  UserByUserIdFirstNameDesc = 'USER_BY_USER_ID__FIRST_NAME_DESC',
  UserByUserIdFullNameAsc = 'USER_BY_USER_ID__FULL_NAME_ASC',
  UserByUserIdFullNameDesc = 'USER_BY_USER_ID__FULL_NAME_DESC',
  UserByUserIdIdAsc = 'USER_BY_USER_ID__ID_ASC',
  UserByUserIdIdDesc = 'USER_BY_USER_ID__ID_DESC',
  UserByUserIdLastNameAsc = 'USER_BY_USER_ID__LAST_NAME_ASC',
  UserByUserIdLastNameDesc = 'USER_BY_USER_ID__LAST_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename: 'Query'
  currentUserId?: Maybe<Scalars['Int']['output']>
  currentUserIsAdmin?: Maybe<Scalars['Boolean']['output']>
  game?: Maybe<Game>
  gameAssignment?: Maybe<GameAssignment>
  /** Reads a single `GameAssignment` using its globally unique `ID`. */
  gameAssignmentByNodeId?: Maybe<GameAssignment>
  /** Reads and enables pagination through a set of `GameAssignment`. */
  gameAssignments?: Maybe<GameAssignmentsConnection>
  /** Reads a single `Game` using its globally unique `ID`. */
  gameByNodeId?: Maybe<Game>
  gameChoice?: Maybe<GameChoice>
  /** Reads a single `GameChoice` using its globally unique `ID`. */
  gameChoiceByNodeId?: Maybe<GameChoice>
  /** Reads and enables pagination through a set of `GameChoice`. */
  gameChoices?: Maybe<GameChoicesConnection>
  gameSubmission?: Maybe<GameSubmission>
  /** Reads a single `GameSubmission` using its globally unique `ID`. */
  gameSubmissionByNodeId?: Maybe<GameSubmission>
  /** Reads and enables pagination through a set of `GameSubmission`. */
  gameSubmissions?: Maybe<GameSubmissionsConnection>
  /** Reads and enables pagination through a set of `Game`. */
  games?: Maybe<GamesConnection>
  hotelRoom?: Maybe<HotelRoom>
  /** Reads a single `HotelRoom` using its globally unique `ID`. */
  hotelRoomByNodeId?: Maybe<HotelRoom>
  hotelRoomDetail?: Maybe<HotelRoomDetail>
  /** Reads a single `HotelRoomDetail` using its globally unique `ID`. */
  hotelRoomDetailByNodeId?: Maybe<HotelRoomDetail>
  /** Reads and enables pagination through a set of `HotelRoomDetail`. */
  hotelRoomDetails?: Maybe<HotelRoomDetailsConnection>
  /** Reads and enables pagination through a set of `HotelRoom`. */
  hotelRooms?: Maybe<HotelRoomsConnection>
  lookup?: Maybe<Lookup>
  /** Reads a single `Lookup` using its globally unique `ID`. */
  lookupByNodeId?: Maybe<Lookup>
  lookupByRealm?: Maybe<Lookup>
  lookupValue?: Maybe<LookupValue>
  lookupValueByLookupIdAndCode?: Maybe<LookupValue>
  /** Reads a single `LookupValue` using its globally unique `ID`. */
  lookupValueByNodeId?: Maybe<LookupValue>
  /** Reads and enables pagination through a set of `LookupValue`. */
  lookupValues?: Maybe<LookupValuesConnection>
  /** Reads and enables pagination through a set of `Lookup`. */
  lookups?: Maybe<LookupsConnection>
  membership?: Maybe<Membership>
  /** Reads a single `Membership` using its globally unique `ID`. */
  membershipByNodeId?: Maybe<Membership>
  /** Reads and enables pagination through a set of `Membership`. */
  memberships?: Maybe<MembershipsConnection>
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output']
  profile?: Maybe<Profile>
  /** Reads a single `Profile` using its globally unique `ID`. */
  profileByNodeId?: Maybe<Profile>
  /** Reads and enables pagination through a set of `Profile`. */
  profiles?: Maybe<ProfilesConnection>
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query
  role?: Maybe<Role>
  roleByAuthority?: Maybe<Role>
  /** Reads a single `Role` using its globally unique `ID`. */
  roleByNodeId?: Maybe<Role>
  /** Reads and enables pagination through a set of `Role`. */
  roles?: Maybe<RolesConnection>
  room?: Maybe<Room>
  /** Reads a single `Room` using its globally unique `ID`. */
  roomByNodeId?: Maybe<Room>
  /** Reads and enables pagination through a set of `Room`. */
  rooms?: Maybe<RoomsConnection>
  setting?: Maybe<Setting>
  /** Reads a single `Setting` using its globally unique `ID`. */
  settingByNodeId?: Maybe<Setting>
  /** Reads and enables pagination through a set of `Setting`. */
  settings?: Maybe<SettingsConnection>
  shirtOrder?: Maybe<ShirtOrder>
  /** Reads a single `ShirtOrder` using its globally unique `ID`. */
  shirtOrderByNodeId?: Maybe<ShirtOrder>
  shirtOrderItem?: Maybe<ShirtOrderItem>
  /** Reads a single `ShirtOrderItem` using its globally unique `ID`. */
  shirtOrderItemByNodeId?: Maybe<ShirtOrderItem>
  /** Reads and enables pagination through a set of `ShirtOrderItem`. */
  shirtOrderItems?: Maybe<ShirtOrderItemsConnection>
  /** Reads and enables pagination through a set of `ShirtOrder`. */
  shirtOrders?: Maybe<ShirtOrdersConnection>
  slot?: Maybe<Slot>
  /** Reads a single `Slot` using its globally unique `ID`. */
  slotByNodeId?: Maybe<Slot>
  /** Reads and enables pagination through a set of `Slot`. */
  slots?: Maybe<SlotsConnection>
  stripe?: Maybe<Stripe>
  /** Reads a single `Stripe` using its globally unique `ID`. */
  stripeByNodeId?: Maybe<Stripe>
  /** Reads and enables pagination through a set of `Stripe`. */
  stripes?: Maybe<StripesConnection>
  transaction?: Maybe<Transaction>
  /** Reads a single `Transaction` using its globally unique `ID`. */
  transactionByNodeId?: Maybe<Transaction>
  /** Reads and enables pagination through a set of `Transaction`. */
  transactions?: Maybe<TransactionsConnection>
  user?: Maybe<User>
  userByEmail?: Maybe<User>
  /** Reads a single `User` using its globally unique `ID`. */
  userByNodeId?: Maybe<User>
  userRole?: Maybe<UserRole>
  /** Reads a single `UserRole` using its globally unique `ID`. */
  userRoleByNodeId?: Maybe<UserRole>
  /** Reads and enables pagination through a set of `UserRole`. */
  userRoles?: Maybe<UserRolesConnection>
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>
}

/** The root query type which gives access points into the data universe. */
export type QueryGameArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameAssignmentArgs = {
  gameId: Scalars['Int']['input']
  gm: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameAssignmentByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameAssignmentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameAssignmentCondition>
  filter?: InputMaybe<GameAssignmentFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryGameByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameChoiceArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameChoiceByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameChoicesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameChoiceCondition>
  filter?: InputMaybe<GameChoiceFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryGameSubmissionArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameSubmissionByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryGameSubmissionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameSubmissionCondition>
  filter?: InputMaybe<GameSubmissionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameSubmissionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryGamesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameCondition>
  filter?: InputMaybe<GameFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomDetailArgs = {
  id: Scalars['BigInt']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomDetailByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomDetailsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<HotelRoomDetailCondition>
  filter?: InputMaybe<HotelRoomDetailFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<HotelRoomDetailsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryHotelRoomsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<HotelRoomCondition>
  filter?: InputMaybe<HotelRoomFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<HotelRoomsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupByRealmArgs = {
  realm: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupValueArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupValueByLookupIdAndCodeArgs = {
  code: Scalars['String']['input']
  lookupId: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupValueByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupValuesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<LookupValueCondition>
  filter?: InputMaybe<LookupValueFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<LookupValuesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryLookupsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<LookupCondition>
  filter?: InputMaybe<LookupFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<LookupsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryMembershipArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryMembershipByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryMembershipsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<MembershipCondition>
  filter?: InputMaybe<MembershipFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryProfileArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryProfileByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ProfileCondition>
  filter?: InputMaybe<ProfileFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryRoleArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryRoleByAuthorityArgs = {
  authority: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryRoleByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<RoleCondition>
  filter?: InputMaybe<RoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<RolesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryRoomArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryRoomByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryRoomsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<RoomCondition>
  filter?: InputMaybe<RoomFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<RoomsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QuerySettingArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySettingByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySettingsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<SettingCondition>
  filter?: InputMaybe<SettingFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SettingsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrderArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrderByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrderItemArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrderItemByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrderItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ShirtOrderItemCondition>
  filter?: InputMaybe<ShirtOrderItemFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ShirtOrderItemsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryShirtOrdersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ShirtOrderCondition>
  filter?: InputMaybe<ShirtOrderFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ShirtOrdersOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QuerySlotArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySlotByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QuerySlotsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<SlotCondition>
  filter?: InputMaybe<SlotFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<SlotsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryStripeArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryStripeByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryStripesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<StripeCondition>
  filter?: InputMaybe<StripeFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<StripesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryTransactionArgs = {
  id: Scalars['BigInt']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryTransactionByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<TransactionCondition>
  filter?: InputMaybe<TransactionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  id: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserByEmailArgs = {
  email: Scalars['String']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserRoleArgs = {
  roleId: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserRoleByNodeIdArgs = {
  nodeId: Scalars['ID']['input']
}

/** The root query type which gives access points into the data universe. */
export type QueryUserRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<UserRoleCondition>
  filter?: InputMaybe<UserRoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<UserCondition>
  filter?: InputMaybe<UserFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<UsersOrderBy>>
}

export type Role = Node & {
  __typename: 'Role'
  authority: Scalars['String']['output']
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads and enables pagination through a set of `UserRole`. */
  userRoles: UserRolesConnection
}

export type RoleUserRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<UserRoleCondition>
  filter?: InputMaybe<UserRoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

/** A condition to be used against `Role` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type RoleCondition = {
  /** Checks for equality with the object’s `authority` field. */
  authority?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Role` object types. All fields are combined with a logical ‘and.’ */
export type RoleFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<RoleFilter>>
  /** Filter by the object’s `authority` field. */
  authority?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<RoleFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<RoleFilter>>
}

/** An input for mutations affecting `Role` */
export type RoleInput = {
  authority: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
}

/** Represents an update to a `Role`. Fields that are set will be updated. */
export type RolePatch = {
  authority?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `Role` values. */
export type RolesConnection = {
  __typename: 'RolesConnection'
  /** A list of edges which contains the `Role` and cursor to aid in pagination. */
  edges: Array<RolesEdge>
  /** A list of `Role` objects. */
  nodes: Array<Maybe<Role>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Role` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Role` edge in the connection. */
export type RolesEdge = {
  __typename: 'RolesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Role` at the end of the edge. */
  node?: Maybe<Role>
}

/** Methods to use when ordering `Role`. */
export enum RolesOrderBy {
  AuthorityAsc = 'AUTHORITY_ASC',
  AuthorityDesc = 'AUTHORITY_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserRolesByRoleIdCountAsc = 'USER_ROLES_BY_ROLE_ID__COUNT_ASC',
  UserRolesByRoleIdCountDesc = 'USER_ROLES_BY_ROLE_ID__COUNT_DESC',
}

export type Room = Node & {
  __typename: 'Room'
  description: Scalars['String']['output']
  /** Reads and enables pagination through a set of `Game`. */
  games: GamesConnection
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  size: Scalars['Int']['output']
  type: Scalars['String']['output']
  updated: Scalars['Boolean']['output']
}

export type RoomGamesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameCondition>
  filter?: InputMaybe<GameFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** A condition to be used against `Room` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type RoomCondition = {
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `updated` field. */
  updated?: InputMaybe<Scalars['Boolean']['input']>
}

/** A filter to be used against `Room` object types. All fields are combined with a logical ‘and.’ */
export type RoomFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<RoomFilter>>
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<RoomFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<RoomFilter>>
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<IntFilter>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>
  /** Filter by the object’s `updated` field. */
  updated?: InputMaybe<BooleanFilter>
}

/** An input for mutations affecting `Room` */
export type RoomInput = {
  description: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  size: Scalars['Int']['input']
  type: Scalars['String']['input']
  updated: Scalars['Boolean']['input']
}

/** Represents an update to a `Room`. Fields that are set will be updated. */
export type RoomPatch = {
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  size?: InputMaybe<Scalars['Int']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  updated?: InputMaybe<Scalars['Boolean']['input']>
}

/** A connection to a list of `Room` values. */
export type RoomsConnection = {
  __typename: 'RoomsConnection'
  /** A list of edges which contains the `Room` and cursor to aid in pagination. */
  edges: Array<RoomsEdge>
  /** A list of `Room` objects. */
  nodes: Array<Maybe<Room>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Room` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Room` edge in the connection. */
export type RoomsEdge = {
  __typename: 'RoomsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Room` at the end of the edge. */
  node?: Maybe<Room>
}

/** Methods to use when ordering `Room`. */
export enum RoomsOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  GamesByRoomIdCountAsc = 'GAMES_BY_ROOM_ID__COUNT_ASC',
  GamesByRoomIdCountDesc = 'GAMES_BY_ROOM_ID__COUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  UpdatedAsc = 'UPDATED_ASC',
  UpdatedDesc = 'UPDATED_DESC',
}

export type Setting = Node & {
  __typename: 'Setting'
  code: Scalars['String']['output']
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  type: Scalars['String']['output']
  value: Scalars['String']['output']
}

/** A condition to be used against `Setting` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SettingCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `value` field. */
  value?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `Setting` object types. All fields are combined with a logical ‘and.’ */
export type SettingFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SettingFilter>>
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<SettingFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SettingFilter>>
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>
  /** Filter by the object’s `value` field. */
  value?: InputMaybe<StringFilter>
}

/** An input for mutations affecting `Setting` */
export type SettingInput = {
  code: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  type: Scalars['String']['input']
  value: Scalars['String']['input']
}

/** Represents an update to a `Setting`. Fields that are set will be updated. */
export type SettingPatch = {
  code?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  type?: InputMaybe<Scalars['String']['input']>
  value?: InputMaybe<Scalars['String']['input']>
}

/** A connection to a list of `Setting` values. */
export type SettingsConnection = {
  __typename: 'SettingsConnection'
  /** A list of edges which contains the `Setting` and cursor to aid in pagination. */
  edges: Array<SettingsEdge>
  /** A list of `Setting` objects. */
  nodes: Array<Maybe<Setting>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Setting` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Setting` edge in the connection. */
export type SettingsEdge = {
  __typename: 'SettingsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Setting` at the end of the edge. */
  node?: Maybe<Setting>
}

/** Methods to use when ordering `Setting`. */
export enum SettingsOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
}

export type ShirtOrder = Node & {
  __typename: 'ShirtOrder'
  deliveryMethod: Scalars['String']['output']
  id: Scalars['Int']['output']
  message: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads and enables pagination through a set of `ShirtOrderItem`. */
  shirtOrderItemsByOrderId: ShirtOrderItemsConnection
  /** Reads a single `User` that is related to this `ShirtOrder`. */
  user?: Maybe<User>
  userId: Scalars['Int']['output']
  year: Scalars['Int']['output']
}

export type ShirtOrderShirtOrderItemsByOrderIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ShirtOrderItemCondition>
  filter?: InputMaybe<ShirtOrderItemFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ShirtOrderItemsOrderBy>>
}

/**
 * A condition to be used against `ShirtOrder` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ShirtOrderCondition = {
  /** Checks for equality with the object’s `deliveryMethod` field. */
  deliveryMethod?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `ShirtOrder` object types. All fields are combined with a logical ‘and.’ */
export type ShirtOrderFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ShirtOrderFilter>>
  /** Filter by the object’s `deliveryMethod` field. */
  deliveryMethod?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `message` field. */
  message?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<ShirtOrderFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ShirtOrderFilter>>
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `ShirtOrder` */
export type ShirtOrderInput = {
  deliveryMethod: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  message: Scalars['String']['input']
  userId: Scalars['Int']['input']
  year: Scalars['Int']['input']
}

export type ShirtOrderItem = Node & {
  __typename: 'ShirtOrderItem'
  id: Scalars['Int']['output']
  itemsIdx?: Maybe<Scalars['Int']['output']>
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`. */
  order?: Maybe<ShirtOrder>
  orderId: Scalars['Int']['output']
  quantity: Scalars['Int']['output']
  size: Scalars['String']['output']
  style: Scalars['String']['output']
}

/**
 * A condition to be used against `ShirtOrderItem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ShirtOrderItemCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `itemsIdx` field. */
  itemsIdx?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `orderId` field. */
  orderId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `quantity` field. */
  quantity?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `style` field. */
  style?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `ShirtOrderItem` object types. All fields are combined with a logical ‘and.’ */
export type ShirtOrderItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ShirtOrderItemFilter>>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `itemsIdx` field. */
  itemsIdx?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<ShirtOrderItemFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ShirtOrderItemFilter>>
  /** Filter by the object’s `orderId` field. */
  orderId?: InputMaybe<IntFilter>
  /** Filter by the object’s `quantity` field. */
  quantity?: InputMaybe<IntFilter>
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<StringFilter>
  /** Filter by the object’s `style` field. */
  style?: InputMaybe<StringFilter>
}

/** An input for mutations affecting `ShirtOrderItem` */
export type ShirtOrderItemInput = {
  id?: InputMaybe<Scalars['Int']['input']>
  itemsIdx?: InputMaybe<Scalars['Int']['input']>
  orderId: Scalars['Int']['input']
  quantity: Scalars['Int']['input']
  size: Scalars['String']['input']
  style: Scalars['String']['input']
}

/** Represents an update to a `ShirtOrderItem`. Fields that are set will be updated. */
export type ShirtOrderItemPatch = {
  id?: InputMaybe<Scalars['Int']['input']>
  itemsIdx?: InputMaybe<Scalars['Int']['input']>
  orderId?: InputMaybe<Scalars['Int']['input']>
  quantity?: InputMaybe<Scalars['Int']['input']>
  size?: InputMaybe<Scalars['String']['input']>
  style?: InputMaybe<Scalars['String']['input']>
}

/** A connection to a list of `ShirtOrderItem` values. */
export type ShirtOrderItemsConnection = {
  __typename: 'ShirtOrderItemsConnection'
  /** A list of edges which contains the `ShirtOrderItem` and cursor to aid in pagination. */
  edges: Array<ShirtOrderItemsEdge>
  /** A list of `ShirtOrderItem` objects. */
  nodes: Array<Maybe<ShirtOrderItem>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ShirtOrderItem` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `ShirtOrderItem` edge in the connection. */
export type ShirtOrderItemsEdge = {
  __typename: 'ShirtOrderItemsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `ShirtOrderItem` at the end of the edge. */
  node?: Maybe<ShirtOrderItem>
}

/** Methods to use when ordering `ShirtOrderItem`. */
export enum ShirtOrderItemsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ItemsIdxAsc = 'ITEMS_IDX_ASC',
  ItemsIdxDesc = 'ITEMS_IDX_DESC',
  Natural = 'NATURAL',
  OrderIdAsc = 'ORDER_ID_ASC',
  OrderIdDesc = 'ORDER_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  QuantityAsc = 'QUANTITY_ASC',
  QuantityDesc = 'QUANTITY_DESC',
  ShirtOrderByOrderIdDeliveryMethodAsc = 'SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_ASC',
  ShirtOrderByOrderIdDeliveryMethodDesc = 'SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_DESC',
  ShirtOrderByOrderIdIdAsc = 'SHIRT_ORDER_BY_ORDER_ID__ID_ASC',
  ShirtOrderByOrderIdIdDesc = 'SHIRT_ORDER_BY_ORDER_ID__ID_DESC',
  ShirtOrderByOrderIdMessageAsc = 'SHIRT_ORDER_BY_ORDER_ID__MESSAGE_ASC',
  ShirtOrderByOrderIdMessageDesc = 'SHIRT_ORDER_BY_ORDER_ID__MESSAGE_DESC',
  ShirtOrderByOrderIdUserIdAsc = 'SHIRT_ORDER_BY_ORDER_ID__USER_ID_ASC',
  ShirtOrderByOrderIdUserIdDesc = 'SHIRT_ORDER_BY_ORDER_ID__USER_ID_DESC',
  ShirtOrderByOrderIdYearAsc = 'SHIRT_ORDER_BY_ORDER_ID__YEAR_ASC',
  ShirtOrderByOrderIdYearDesc = 'SHIRT_ORDER_BY_ORDER_ID__YEAR_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StyleAsc = 'STYLE_ASC',
  StyleDesc = 'STYLE_DESC',
}

/** Represents an update to a `ShirtOrder`. Fields that are set will be updated. */
export type ShirtOrderPatch = {
  deliveryMethod?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  message?: InputMaybe<Scalars['String']['input']>
  userId?: InputMaybe<Scalars['Int']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `ShirtOrder` values. */
export type ShirtOrdersConnection = {
  __typename: 'ShirtOrdersConnection'
  /** A list of edges which contains the `ShirtOrder` and cursor to aid in pagination. */
  edges: Array<ShirtOrdersEdge>
  /** A list of `ShirtOrder` objects. */
  nodes: Array<Maybe<ShirtOrder>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `ShirtOrder` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `ShirtOrder` edge in the connection. */
export type ShirtOrdersEdge = {
  __typename: 'ShirtOrdersEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `ShirtOrder` at the end of the edge. */
  node?: Maybe<ShirtOrder>
}

/** Methods to use when ordering `ShirtOrder`. */
export enum ShirtOrdersOrderBy {
  DeliveryMethodAsc = 'DELIVERY_METHOD_ASC',
  DeliveryMethodDesc = 'DELIVERY_METHOD_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ShirtOrderItemsByOrderIdCountAsc = 'SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_ASC',
  ShirtOrderItemsByOrderIdCountDesc = 'SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_DESC',
  UserByUserIdAmountOwedAsc = 'USER_BY_USER_ID__AMOUNT_OWED_ASC',
  UserByUserIdAmountOwedDesc = 'USER_BY_USER_ID__AMOUNT_OWED_DESC',
  UserByUserIdDisplayNameAsc = 'USER_BY_USER_ID__DISPLAY_NAME_ASC',
  UserByUserIdDisplayNameDesc = 'USER_BY_USER_ID__DISPLAY_NAME_DESC',
  UserByUserIdEmailAsc = 'USER_BY_USER_ID__EMAIL_ASC',
  UserByUserIdEmailDesc = 'USER_BY_USER_ID__EMAIL_DESC',
  UserByUserIdFirstNameAsc = 'USER_BY_USER_ID__FIRST_NAME_ASC',
  UserByUserIdFirstNameDesc = 'USER_BY_USER_ID__FIRST_NAME_DESC',
  UserByUserIdFullNameAsc = 'USER_BY_USER_ID__FULL_NAME_ASC',
  UserByUserIdFullNameDesc = 'USER_BY_USER_ID__FULL_NAME_DESC',
  UserByUserIdIdAsc = 'USER_BY_USER_ID__ID_ASC',
  UserByUserIdIdDesc = 'USER_BY_USER_ID__ID_DESC',
  UserByUserIdLastNameAsc = 'USER_BY_USER_ID__LAST_NAME_ASC',
  UserByUserIdLastNameDesc = 'USER_BY_USER_ID__LAST_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

export type Slot = Node & {
  __typename: 'Slot'
  day: Scalars['String']['output']
  formattedDate: Scalars['String']['output']
  /** Reads and enables pagination through a set of `GameChoice`. */
  gameChoices: GameChoicesConnection
  /** Reads and enables pagination through a set of `Game`. */
  games: GamesConnection
  id: Scalars['Int']['output']
  length: Scalars['String']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  slot: Scalars['Int']['output']
  time: Scalars['String']['output']
}

export type SlotGameChoicesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameChoiceCondition>
  filter?: InputMaybe<GameChoiceFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

export type SlotGamesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameCondition>
  filter?: InputMaybe<GameFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** A condition to be used against `Slot` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SlotCondition = {
  /** Checks for equality with the object’s `day` field. */
  day?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `formattedDate` field. */
  formattedDate?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `length` field. */
  length?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `slot` field. */
  slot?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `time` field. */
  time?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `Slot` object types. All fields are combined with a logical ‘and.’ */
export type SlotFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SlotFilter>>
  /** Filter by the object’s `day` field. */
  day?: InputMaybe<StringFilter>
  /** Filter by the object’s `formattedDate` field. */
  formattedDate?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `length` field. */
  length?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<SlotFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SlotFilter>>
  /** Filter by the object’s `slot` field. */
  slot?: InputMaybe<IntFilter>
  /** Filter by the object’s `time` field. */
  time?: InputMaybe<StringFilter>
}

/** All input for the `slotGmGame` mutation. */
export type SlotGmGameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  slotId?: InputMaybe<Scalars['Int']['input']>
  yearno?: InputMaybe<Scalars['Int']['input']>
}

/** The output of our `slotGmGame` mutation. */
export type SlotGmGamePayload = {
  __typename: 'SlotGmGamePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  integer?: Maybe<Scalars['Int']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** An input for mutations affecting `Slot` */
export type SlotInput = {
  day: Scalars['String']['input']
  formattedDate: Scalars['String']['input']
  id?: InputMaybe<Scalars['Int']['input']>
  length: Scalars['String']['input']
  slot: Scalars['Int']['input']
  time: Scalars['String']['input']
}

/** Represents an update to a `Slot`. Fields that are set will be updated. */
export type SlotPatch = {
  day?: InputMaybe<Scalars['String']['input']>
  formattedDate?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  length?: InputMaybe<Scalars['String']['input']>
  slot?: InputMaybe<Scalars['Int']['input']>
  time?: InputMaybe<Scalars['String']['input']>
}

/** A connection to a list of `Slot` values. */
export type SlotsConnection = {
  __typename: 'SlotsConnection'
  /** A list of edges which contains the `Slot` and cursor to aid in pagination. */
  edges: Array<SlotsEdge>
  /** A list of `Slot` objects. */
  nodes: Array<Maybe<Slot>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Slot` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Slot` edge in the connection. */
export type SlotsEdge = {
  __typename: 'SlotsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Slot` at the end of the edge. */
  node?: Maybe<Slot>
}

/** Methods to use when ordering `Slot`. */
export enum SlotsOrderBy {
  DayAsc = 'DAY_ASC',
  DayDesc = 'DAY_DESC',
  FormattedDateAsc = 'FORMATTED_DATE_ASC',
  FormattedDateDesc = 'FORMATTED_DATE_DESC',
  GamesBySlotIdCountAsc = 'GAMES_BY_SLOT_ID__COUNT_ASC',
  GamesBySlotIdCountDesc = 'GAMES_BY_SLOT_ID__COUNT_DESC',
  GameChoicesBySlotIdCountAsc = 'GAME_CHOICES_BY_SLOT_ID__COUNT_ASC',
  GameChoicesBySlotIdCountDesc = 'GAME_CHOICES_BY_SLOT_ID__COUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LengthAsc = 'LENGTH_ASC',
  LengthDesc = 'LENGTH_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SlotAsc = 'SLOT_ASC',
  SlotDesc = 'SLOT_DESC',
  TimeAsc = 'TIME_ASC',
  TimeDesc = 'TIME_DESC',
}

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>
}

export type Stripe = Node & {
  __typename: 'Stripe'
  data: Scalars['JSON']['output']
  id: Scalars['Int']['output']
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
}

/** A condition to be used against `Stripe` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type StripeCondition = {
  /** Checks for equality with the object’s `data` field. */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Stripe` object types. All fields are combined with a logical ‘and.’ */
export type StripeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<StripeFilter>>
  /** Filter by the object’s `data` field. */
  data?: InputMaybe<JsonFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<StripeFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<StripeFilter>>
}

/** An input for mutations affecting `Stripe` */
export type StripeInput = {
  data: Scalars['JSON']['input']
  id?: InputMaybe<Scalars['Int']['input']>
}

/** Represents an update to a `Stripe`. Fields that are set will be updated. */
export type StripePatch = {
  data?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `Stripe` values. */
export type StripesConnection = {
  __typename: 'StripesConnection'
  /** A list of edges which contains the `Stripe` and cursor to aid in pagination. */
  edges: Array<StripesEdge>
  /** A list of `Stripe` objects. */
  nodes: Array<Maybe<Stripe>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Stripe` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Stripe` edge in the connection. */
export type StripesEdge = {
  __typename: 'StripesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Stripe` at the end of the edge. */
  node?: Maybe<Stripe>
}

/** Methods to use when ordering `Stripe`. */
export enum StripesOrderBy {
  DataAsc = 'DATA_ASC',
  DataDesc = 'DATA_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
}

export type Transaction = Node & {
  __typename: 'Transaction'
  amount: Scalars['Float']['output']
  data: Scalars['JSON']['output']
  id: Scalars['BigInt']['output']
  /** Reads a single `Membership` that is related to this `Transaction`. */
  member?: Maybe<Membership>
  memberId?: Maybe<Scalars['Int']['output']>
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  notes: Scalars['String']['output']
  origin?: Maybe<Scalars['Int']['output']>
  stripe: Scalars['Boolean']['output']
  timestamp: Scalars['Datetime']['output']
  /** Reads a single `User` that is related to this `Transaction`. */
  user?: Maybe<User>
  /** Reads a single `User` that is related to this `Transaction`. */
  userByOrigin?: Maybe<User>
  userId: Scalars['Int']['output']
  year: Scalars['Int']['output']
}

/**
 * A condition to be used against `Transaction` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TransactionCondition = {
  /** Checks for equality with the object’s `amount` field. */
  amount?: InputMaybe<Scalars['Float']['input']>
  /** Checks for equality with the object’s `data` field. */
  data?: InputMaybe<Scalars['JSON']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['BigInt']['input']>
  /** Checks for equality with the object’s `memberId` field. */
  memberId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `notes` field. */
  notes?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `origin` field. */
  origin?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `stripe` field. */
  stripe?: InputMaybe<Scalars['Boolean']['input']>
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: InputMaybe<Scalars['Datetime']['input']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `year` field. */
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `Transaction` object types. All fields are combined with a logical ‘and.’ */
export type TransactionFilter = {
  /** Filter by the object’s `amount` field. */
  amount?: InputMaybe<FloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TransactionFilter>>
  /** Filter by the object’s `data` field. */
  data?: InputMaybe<JsonFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<BigIntFilter>
  /** Filter by the object’s `memberId` field. */
  memberId?: InputMaybe<IntFilter>
  /** Negates the expression. */
  not?: InputMaybe<TransactionFilter>
  /** Filter by the object’s `notes` field. */
  notes?: InputMaybe<StringFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TransactionFilter>>
  /** Filter by the object’s `origin` field. */
  origin?: InputMaybe<IntFilter>
  /** Filter by the object’s `stripe` field. */
  stripe?: InputMaybe<BooleanFilter>
  /** Filter by the object’s `timestamp` field. */
  timestamp?: InputMaybe<DatetimeFilter>
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>
  /** Filter by the object’s `year` field. */
  year?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `Transaction` */
export type TransactionInput = {
  amount: Scalars['Float']['input']
  data: Scalars['JSON']['input']
  id?: InputMaybe<Scalars['BigInt']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  origin?: InputMaybe<Scalars['Int']['input']>
  stripe?: InputMaybe<Scalars['Boolean']['input']>
  timestamp?: InputMaybe<Scalars['Datetime']['input']>
  userId: Scalars['Int']['input']
  year: Scalars['Int']['input']
}

/** Represents an update to a `Transaction`. Fields that are set will be updated. */
export type TransactionPatch = {
  amount?: InputMaybe<Scalars['Float']['input']>
  data?: InputMaybe<Scalars['JSON']['input']>
  id?: InputMaybe<Scalars['BigInt']['input']>
  memberId?: InputMaybe<Scalars['Int']['input']>
  notes?: InputMaybe<Scalars['String']['input']>
  origin?: InputMaybe<Scalars['Int']['input']>
  stripe?: InputMaybe<Scalars['Boolean']['input']>
  timestamp?: InputMaybe<Scalars['Datetime']['input']>
  userId?: InputMaybe<Scalars['Int']['input']>
  year?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `Transaction` values. */
export type TransactionsConnection = {
  __typename: 'TransactionsConnection'
  /** A list of edges which contains the `Transaction` and cursor to aid in pagination. */
  edges: Array<TransactionsEdge>
  /** A list of `Transaction` objects. */
  nodes: Array<Maybe<Transaction>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `Transaction` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `Transaction` edge in the connection. */
export type TransactionsEdge = {
  __typename: 'TransactionsEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `Transaction` at the end of the edge. */
  node?: Maybe<Transaction>
}

/** Methods to use when ordering `Transaction`. */
export enum TransactionsOrderBy {
  AmountAsc = 'AMOUNT_ASC',
  AmountDesc = 'AMOUNT_DESC',
  DataAsc = 'DATA_ASC',
  DataDesc = 'DATA_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  MembershipByMemberIdArrivalDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
  MembershipByMemberIdArrivalDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
  MembershipByMemberIdAttendanceAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
  MembershipByMemberIdAttendanceDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
  MembershipByMemberIdAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
  MembershipByMemberIdAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
  MembershipByMemberIdDepartureDateAsc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
  MembershipByMemberIdDepartureDateDesc = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
  MembershipByMemberIdHotelRoomIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
  MembershipByMemberIdHotelRoomIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
  MembershipByMemberIdIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
  MembershipByMemberIdIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
  MembershipByMemberIdInterestLevelAsc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
  MembershipByMemberIdInterestLevelDesc = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
  MembershipByMemberIdMessageAsc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
  MembershipByMemberIdMessageDesc = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
  MembershipByMemberIdOfferSubsidyAsc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
  MembershipByMemberIdOfferSubsidyDesc = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
  MembershipByMemberIdRequestOldPriceAsc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
  MembershipByMemberIdRequestOldPriceDesc = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
  MembershipByMemberIdRoomingPreferencesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
  MembershipByMemberIdRoomingPreferencesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
  MembershipByMemberIdRoomingWithAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
  MembershipByMemberIdRoomingWithDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
  MembershipByMemberIdRoomPreferenceAndNotesAsc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
  MembershipByMemberIdRoomPreferenceAndNotesDesc = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
  MembershipByMemberIdSlotsAttendingAsc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_ASC',
  MembershipByMemberIdSlotsAttendingDesc = 'MEMBERSHIP_BY_MEMBER_ID__SLOTS_ATTENDING_DESC',
  MembershipByMemberIdUserIdAsc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
  MembershipByMemberIdUserIdDesc = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
  MembershipByMemberIdVolunteerAsc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
  MembershipByMemberIdVolunteerDesc = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
  MembershipByMemberIdYearAsc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
  MembershipByMemberIdYearDesc = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
  MemberIdAsc = 'MEMBER_ID_ASC',
  MemberIdDesc = 'MEMBER_ID_DESC',
  Natural = 'NATURAL',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  OriginAsc = 'ORIGIN_ASC',
  OriginDesc = 'ORIGIN_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StripeAsc = 'STRIPE_ASC',
  StripeDesc = 'STRIPE_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  UserByOriginAmountOwedAsc = 'USER_BY_ORIGIN__AMOUNT_OWED_ASC',
  UserByOriginAmountOwedDesc = 'USER_BY_ORIGIN__AMOUNT_OWED_DESC',
  UserByOriginDisplayNameAsc = 'USER_BY_ORIGIN__DISPLAY_NAME_ASC',
  UserByOriginDisplayNameDesc = 'USER_BY_ORIGIN__DISPLAY_NAME_DESC',
  UserByOriginEmailAsc = 'USER_BY_ORIGIN__EMAIL_ASC',
  UserByOriginEmailDesc = 'USER_BY_ORIGIN__EMAIL_DESC',
  UserByOriginFirstNameAsc = 'USER_BY_ORIGIN__FIRST_NAME_ASC',
  UserByOriginFirstNameDesc = 'USER_BY_ORIGIN__FIRST_NAME_DESC',
  UserByOriginFullNameAsc = 'USER_BY_ORIGIN__FULL_NAME_ASC',
  UserByOriginFullNameDesc = 'USER_BY_ORIGIN__FULL_NAME_DESC',
  UserByOriginIdAsc = 'USER_BY_ORIGIN__ID_ASC',
  UserByOriginIdDesc = 'USER_BY_ORIGIN__ID_DESC',
  UserByOriginLastNameAsc = 'USER_BY_ORIGIN__LAST_NAME_ASC',
  UserByOriginLastNameDesc = 'USER_BY_ORIGIN__LAST_NAME_DESC',
  UserByUserIdAmountOwedAsc = 'USER_BY_USER_ID__AMOUNT_OWED_ASC',
  UserByUserIdAmountOwedDesc = 'USER_BY_USER_ID__AMOUNT_OWED_DESC',
  UserByUserIdDisplayNameAsc = 'USER_BY_USER_ID__DISPLAY_NAME_ASC',
  UserByUserIdDisplayNameDesc = 'USER_BY_USER_ID__DISPLAY_NAME_DESC',
  UserByUserIdEmailAsc = 'USER_BY_USER_ID__EMAIL_ASC',
  UserByUserIdEmailDesc = 'USER_BY_USER_ID__EMAIL_DESC',
  UserByUserIdFirstNameAsc = 'USER_BY_USER_ID__FIRST_NAME_ASC',
  UserByUserIdFirstNameDesc = 'USER_BY_USER_ID__FIRST_NAME_DESC',
  UserByUserIdFullNameAsc = 'USER_BY_USER_ID__FULL_NAME_ASC',
  UserByUserIdFullNameDesc = 'USER_BY_USER_ID__FULL_NAME_DESC',
  UserByUserIdIdAsc = 'USER_BY_USER_ID__ID_ASC',
  UserByUserIdIdDesc = 'USER_BY_USER_ID__ID_DESC',
  UserByUserIdLastNameAsc = 'USER_BY_USER_ID__LAST_NAME_ASC',
  UserByUserIdLastNameDesc = 'USER_BY_USER_ID__LAST_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  YearAsc = 'YEAR_ASC',
  YearDesc = 'YEAR_DESC',
}

/** All input for the `updateGameAssignmentByNodeId` mutation. */
export type UpdateGameAssignmentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameAssignment` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `GameAssignment` being updated. */
  patch: GameAssignmentPatch
}

/** All input for the `updateGameAssignment` mutation. */
export type UpdateGameAssignmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  gameId: Scalars['Int']['input']
  gm: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `GameAssignment` being updated. */
  patch: GameAssignmentPatch
}

/** The output of our update `GameAssignment` mutation. */
export type UpdateGameAssignmentPayload = {
  __typename: 'UpdateGameAssignmentPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Game` that is related to this `GameAssignment`. */
  game?: Maybe<Game>
  /** The `GameAssignment` that was updated by this mutation. */
  gameAssignment?: Maybe<GameAssignment>
  /** An edge for our `GameAssignment`. May be used by Relay 1. */
  gameAssignmentEdge?: Maybe<GameAssignmentsEdge>
  /** Reads a single `Membership` that is related to this `GameAssignment`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `GameAssignment` mutation. */
export type UpdateGameAssignmentPayloadGameAssignmentEdgeArgs = {
  orderBy?: InputMaybe<Array<GameAssignmentsOrderBy>>
}

/** All input for the `updateGameByNodeId` mutation. */
export type UpdateGameByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Game` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Game` being updated. */
  patch: GamePatch
}

/** All input for the `updateGameChoiceByNodeId` mutation. */
export type UpdateGameChoiceByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameChoice` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `GameChoice` being updated. */
  patch: GameChoicePatch
}

/** All input for the `updateGameChoice` mutation. */
export type UpdateGameChoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `GameChoice` being updated. */
  patch: GameChoicePatch
}

/** The output of our update `GameChoice` mutation. */
export type UpdateGameChoicePayload = {
  __typename: 'UpdateGameChoicePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Game` that is related to this `GameChoice`. */
  game?: Maybe<Game>
  /** The `GameChoice` that was updated by this mutation. */
  gameChoice?: Maybe<GameChoice>
  /** An edge for our `GameChoice`. May be used by Relay 1. */
  gameChoiceEdge?: Maybe<GameChoicesEdge>
  /** Reads a single `Membership` that is related to this `GameChoice`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Slot` that is related to this `GameChoice`. */
  slot?: Maybe<Slot>
}

/** The output of our update `GameChoice` mutation. */
export type UpdateGameChoicePayloadGameChoiceEdgeArgs = {
  orderBy?: InputMaybe<Array<GameChoicesOrderBy>>
}

/** All input for the `updateGame` mutation. */
export type UpdateGameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Game` being updated. */
  patch: GamePatch
}

/** The output of our update `Game` mutation. */
export type UpdateGamePayload = {
  __typename: 'UpdateGamePayload'
  /** Reads a single `User` that is related to this `Game`. */
  author?: Maybe<User>
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Game` that was updated by this mutation. */
  game?: Maybe<Game>
  /** An edge for our `Game`. May be used by Relay 1. */
  gameEdge?: Maybe<GamesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Room` that is related to this `Game`. */
  room?: Maybe<Room>
  /** Reads a single `Slot` that is related to this `Game`. */
  slot?: Maybe<Slot>
}

/** The output of our update `Game` mutation. */
export type UpdateGamePayloadGameEdgeArgs = {
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

/** All input for the `updateGameSubmissionByNodeId` mutation. */
export type UpdateGameSubmissionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `GameSubmission` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `GameSubmission` being updated. */
  patch: GameSubmissionPatch
}

/** All input for the `updateGameSubmission` mutation. */
export type UpdateGameSubmissionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `GameSubmission` being updated. */
  patch: GameSubmissionPatch
}

/** The output of our update `GameSubmission` mutation. */
export type UpdateGameSubmissionPayload = {
  __typename: 'UpdateGameSubmissionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `GameSubmission` that was updated by this mutation. */
  gameSubmission?: Maybe<GameSubmission>
  /** An edge for our `GameSubmission`. May be used by Relay 1. */
  gameSubmissionEdge?: Maybe<GameSubmissionsEdge>
  /** Reads a single `Membership` that is related to this `GameSubmission`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `GameSubmission` mutation. */
export type UpdateGameSubmissionPayloadGameSubmissionEdgeArgs = {
  orderBy?: InputMaybe<Array<GameSubmissionsOrderBy>>
}

/** All input for the `updateHotelRoomByNodeId` mutation. */
export type UpdateHotelRoomByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `HotelRoom` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `HotelRoom` being updated. */
  patch: HotelRoomPatch
}

/** All input for the `updateHotelRoomDetailByNodeId` mutation. */
export type UpdateHotelRoomDetailByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `HotelRoomDetail` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `HotelRoomDetail` being updated. */
  patch: HotelRoomDetailPatch
}

/** All input for the `updateHotelRoomDetail` mutation. */
export type UpdateHotelRoomDetailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['BigInt']['input']
  /** An object where the defined keys will be set on the `HotelRoomDetail` being updated. */
  patch: HotelRoomDetailPatch
}

/** The output of our update `HotelRoomDetail` mutation. */
export type UpdateHotelRoomDetailPayload = {
  __typename: 'UpdateHotelRoomDetailPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `HotelRoomDetail` that was updated by this mutation. */
  hotelRoomDetail?: Maybe<HotelRoomDetail>
  /** An edge for our `HotelRoomDetail`. May be used by Relay 1. */
  hotelRoomDetailEdge?: Maybe<HotelRoomDetailsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `HotelRoomDetail` mutation. */
export type UpdateHotelRoomDetailPayloadHotelRoomDetailEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomDetailsOrderBy>>
}

/** All input for the `updateHotelRoom` mutation. */
export type UpdateHotelRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `HotelRoom` being updated. */
  patch: HotelRoomPatch
}

/** The output of our update `HotelRoom` mutation. */
export type UpdateHotelRoomPayload = {
  __typename: 'UpdateHotelRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `HotelRoom` that was updated by this mutation. */
  hotelRoom?: Maybe<HotelRoom>
  /** An edge for our `HotelRoom`. May be used by Relay 1. */
  hotelRoomEdge?: Maybe<HotelRoomsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `HotelRoom` mutation. */
export type UpdateHotelRoomPayloadHotelRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<HotelRoomsOrderBy>>
}

/** All input for the `updateLookupByNodeId` mutation. */
export type UpdateLookupByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Lookup` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Lookup` being updated. */
  patch: LookupPatch
}

/** All input for the `updateLookupByRealm` mutation. */
export type UpdateLookupByRealmInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** An object where the defined keys will be set on the `Lookup` being updated. */
  patch: LookupPatch
  realm: Scalars['String']['input']
}

/** All input for the `updateLookup` mutation. */
export type UpdateLookupInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Lookup` being updated. */
  patch: LookupPatch
}

/** The output of our update `Lookup` mutation. */
export type UpdateLookupPayload = {
  __typename: 'UpdateLookupPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Lookup` that was updated by this mutation. */
  lookup?: Maybe<Lookup>
  /** An edge for our `Lookup`. May be used by Relay 1. */
  lookupEdge?: Maybe<LookupsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `Lookup` mutation. */
export type UpdateLookupPayloadLookupEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupsOrderBy>>
}

/** All input for the `updateLookupValueByLookupIdAndCode` mutation. */
export type UpdateLookupValueByLookupIdAndCodeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  code: Scalars['String']['input']
  lookupId: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `LookupValue` being updated. */
  patch: LookupValuePatch
}

/** All input for the `updateLookupValueByNodeId` mutation. */
export type UpdateLookupValueByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `LookupValue` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `LookupValue` being updated. */
  patch: LookupValuePatch
}

/** All input for the `updateLookupValue` mutation. */
export type UpdateLookupValueInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `LookupValue` being updated. */
  patch: LookupValuePatch
}

/** The output of our update `LookupValue` mutation. */
export type UpdateLookupValuePayload = {
  __typename: 'UpdateLookupValuePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Lookup` that is related to this `LookupValue`. */
  lookup?: Maybe<Lookup>
  /** The `LookupValue` that was updated by this mutation. */
  lookupValue?: Maybe<LookupValue>
  /** An edge for our `LookupValue`. May be used by Relay 1. */
  lookupValueEdge?: Maybe<LookupValuesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
}

/** The output of our update `LookupValue` mutation. */
export type UpdateLookupValuePayloadLookupValueEdgeArgs = {
  orderBy?: InputMaybe<Array<LookupValuesOrderBy>>
}

/** All input for the `updateMembershipByNodeId` mutation. */
export type UpdateMembershipByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Membership` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Membership` being updated. */
  patch: MembershipPatch
}

/** All input for the `updateMembership` mutation. */
export type UpdateMembershipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Membership` being updated. */
  patch: MembershipPatch
}

/** The output of our update `Membership` mutation. */
export type UpdateMembershipPayload = {
  __typename: 'UpdateMembershipPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `HotelRoom` that is related to this `Membership`. */
  hotelRoom?: Maybe<HotelRoom>
  /** The `Membership` that was updated by this mutation. */
  membership?: Maybe<Membership>
  /** An edge for our `Membership`. May be used by Relay 1. */
  membershipEdge?: Maybe<MembershipsEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Membership`. */
  user?: Maybe<User>
}

/** The output of our update `Membership` mutation. */
export type UpdateMembershipPayloadMembershipEdgeArgs = {
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

/** All input for the `updateProfileByNodeId` mutation. */
export type UpdateProfileByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Profile` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch
}

/** All input for the `updateProfile` mutation. */
export type UpdateProfileInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Profile` being updated. */
  patch: ProfilePatch
}

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayload = {
  __typename: 'UpdateProfilePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** The `Profile` that was updated by this mutation. */
  profile?: Maybe<Profile>
  /** An edge for our `Profile`. May be used by Relay 1. */
  profileEdge?: Maybe<ProfilesEdge>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `User` that is related to this `Profile`. */
  user?: Maybe<User>
}

/** The output of our update `Profile` mutation. */
export type UpdateProfilePayloadProfileEdgeArgs = {
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>
}

/** All input for the `updateRoleByAuthority` mutation. */
export type UpdateRoleByAuthorityInput = {
  authority: Scalars['String']['input']
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** An object where the defined keys will be set on the `Role` being updated. */
  patch: RolePatch
}

/** All input for the `updateRoleByNodeId` mutation. */
export type UpdateRoleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Role` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Role` being updated. */
  patch: RolePatch
}

/** All input for the `updateRole` mutation. */
export type UpdateRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Role` being updated. */
  patch: RolePatch
}

/** The output of our update `Role` mutation. */
export type UpdateRolePayload = {
  __typename: 'UpdateRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Role` that was updated by this mutation. */
  role?: Maybe<Role>
  /** An edge for our `Role`. May be used by Relay 1. */
  roleEdge?: Maybe<RolesEdge>
}

/** The output of our update `Role` mutation. */
export type UpdateRolePayloadRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<RolesOrderBy>>
}

/** All input for the `updateRoomByNodeId` mutation. */
export type UpdateRoomByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Room` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Room` being updated. */
  patch: RoomPatch
}

/** All input for the `updateRoom` mutation. */
export type UpdateRoomInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Room` being updated. */
  patch: RoomPatch
}

/** The output of our update `Room` mutation. */
export type UpdateRoomPayload = {
  __typename: 'UpdateRoomPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Room` that was updated by this mutation. */
  room?: Maybe<Room>
  /** An edge for our `Room`. May be used by Relay 1. */
  roomEdge?: Maybe<RoomsEdge>
}

/** The output of our update `Room` mutation. */
export type UpdateRoomPayloadRoomEdgeArgs = {
  orderBy?: InputMaybe<Array<RoomsOrderBy>>
}

/** All input for the `updateSettingByNodeId` mutation. */
export type UpdateSettingByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Setting` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Setting` being updated. */
  patch: SettingPatch
}

/** All input for the `updateSetting` mutation. */
export type UpdateSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Setting` being updated. */
  patch: SettingPatch
}

/** The output of our update `Setting` mutation. */
export type UpdateSettingPayload = {
  __typename: 'UpdateSettingPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Setting` that was updated by this mutation. */
  setting?: Maybe<Setting>
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingsEdge>
}

/** The output of our update `Setting` mutation. */
export type UpdateSettingPayloadSettingEdgeArgs = {
  orderBy?: InputMaybe<Array<SettingsOrderBy>>
}

/** All input for the `updateShirtOrderByNodeId` mutation. */
export type UpdateShirtOrderByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `ShirtOrder` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `ShirtOrder` being updated. */
  patch: ShirtOrderPatch
}

/** All input for the `updateShirtOrder` mutation. */
export type UpdateShirtOrderInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `ShirtOrder` being updated. */
  patch: ShirtOrderPatch
}

/** All input for the `updateShirtOrderItemByNodeId` mutation. */
export type UpdateShirtOrderItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `ShirtOrderItem` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `ShirtOrderItem` being updated. */
  patch: ShirtOrderItemPatch
}

/** All input for the `updateShirtOrderItem` mutation. */
export type UpdateShirtOrderItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `ShirtOrderItem` being updated. */
  patch: ShirtOrderItemPatch
}

/** The output of our update `ShirtOrderItem` mutation. */
export type UpdateShirtOrderItemPayload = {
  __typename: 'UpdateShirtOrderItemPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`. */
  order?: Maybe<ShirtOrder>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrderItem` that was updated by this mutation. */
  shirtOrderItem?: Maybe<ShirtOrderItem>
  /** An edge for our `ShirtOrderItem`. May be used by Relay 1. */
  shirtOrderItemEdge?: Maybe<ShirtOrderItemsEdge>
}

/** The output of our update `ShirtOrderItem` mutation. */
export type UpdateShirtOrderItemPayloadShirtOrderItemEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrderItemsOrderBy>>
}

/** The output of our update `ShirtOrder` mutation. */
export type UpdateShirtOrderPayload = {
  __typename: 'UpdateShirtOrderPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `ShirtOrder` that was updated by this mutation. */
  shirtOrder?: Maybe<ShirtOrder>
  /** An edge for our `ShirtOrder`. May be used by Relay 1. */
  shirtOrderEdge?: Maybe<ShirtOrdersEdge>
  /** Reads a single `User` that is related to this `ShirtOrder`. */
  user?: Maybe<User>
}

/** The output of our update `ShirtOrder` mutation. */
export type UpdateShirtOrderPayloadShirtOrderEdgeArgs = {
  orderBy?: InputMaybe<Array<ShirtOrdersOrderBy>>
}

/** All input for the `updateSlotByNodeId` mutation. */
export type UpdateSlotByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Slot` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Slot` being updated. */
  patch: SlotPatch
}

/** All input for the `updateSlot` mutation. */
export type UpdateSlotInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Slot` being updated. */
  patch: SlotPatch
}

/** The output of our update `Slot` mutation. */
export type UpdateSlotPayload = {
  __typename: 'UpdateSlotPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Slot` that was updated by this mutation. */
  slot?: Maybe<Slot>
  /** An edge for our `Slot`. May be used by Relay 1. */
  slotEdge?: Maybe<SlotsEdge>
}

/** The output of our update `Slot` mutation. */
export type UpdateSlotPayloadSlotEdgeArgs = {
  orderBy?: InputMaybe<Array<SlotsOrderBy>>
}

/** All input for the `updateStripeByNodeId` mutation. */
export type UpdateStripeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Stripe` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Stripe` being updated. */
  patch: StripePatch
}

/** All input for the `updateStripe` mutation. */
export type UpdateStripeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `Stripe` being updated. */
  patch: StripePatch
}

/** The output of our update `Stripe` mutation. */
export type UpdateStripePayload = {
  __typename: 'UpdateStripePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Stripe` that was updated by this mutation. */
  stripe?: Maybe<Stripe>
  /** An edge for our `Stripe`. May be used by Relay 1. */
  stripeEdge?: Maybe<StripesEdge>
}

/** The output of our update `Stripe` mutation. */
export type UpdateStripePayloadStripeEdgeArgs = {
  orderBy?: InputMaybe<Array<StripesOrderBy>>
}

/** All input for the `updateTransactionByNodeId` mutation. */
export type UpdateTransactionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `Transaction` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `Transaction` being updated. */
  patch: TransactionPatch
}

/** All input for the `updateTransaction` mutation. */
export type UpdateTransactionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['BigInt']['input']
  /** An object where the defined keys will be set on the `Transaction` being updated. */
  patch: TransactionPatch
}

/** The output of our update `Transaction` mutation. */
export type UpdateTransactionPayload = {
  __typename: 'UpdateTransactionPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Reads a single `Membership` that is related to this `Transaction`. */
  member?: Maybe<Membership>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `Transaction` that was updated by this mutation. */
  transaction?: Maybe<Transaction>
  /** An edge for our `Transaction`. May be used by Relay 1. */
  transactionEdge?: Maybe<TransactionsEdge>
  /** Reads a single `User` that is related to this `Transaction`. */
  user?: Maybe<User>
  /** Reads a single `User` that is related to this `Transaction`. */
  userByOrigin?: Maybe<User>
}

/** The output of our update `Transaction` mutation. */
export type UpdateTransactionPayloadTransactionEdgeArgs = {
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

/** All input for the `updateUserByEmail` mutation. */
export type UpdateUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch
}

/** All input for the `updateUserByNodeId` mutation. */
export type UpdateUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch
}

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  id: Scalars['Int']['input']
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch
}

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename: 'UpdateUserPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>
}

/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>
}

/** All input for the `updateUserRoleByNodeId` mutation. */
export type UpdateUserRoleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** The globally unique `ID` which will identify a single `UserRole` to be updated. */
  nodeId: Scalars['ID']['input']
  /** An object where the defined keys will be set on the `UserRole` being updated. */
  patch: UserRolePatch
}

/** All input for the `updateUserRole` mutation. */
export type UpdateUserRoleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>
  /** An object where the defined keys will be set on the `UserRole` being updated. */
  patch: UserRolePatch
  roleId: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}

/** The output of our update `UserRole` mutation. */
export type UpdateUserRolePayload = {
  __typename: 'UpdateUserRolePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>
  /** Reads a single `Role` that is related to this `UserRole`. */
  role?: Maybe<Role>
  /** Reads a single `User` that is related to this `UserRole`. */
  user?: Maybe<User>
  /** The `UserRole` that was updated by this mutation. */
  userRole?: Maybe<UserRole>
  /** An edge for our `UserRole`. May be used by Relay 1. */
  userRoleEdge?: Maybe<UserRolesEdge>
}

/** The output of our update `UserRole` mutation. */
export type UpdateUserRolePayloadUserRoleEdgeArgs = {
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

export type User = Node & {
  __typename: 'User'
  amountOwed: Scalars['Float']['output']
  /** Reads and enables pagination through a set of `Game`. */
  authoredGames: GamesConnection
  displayName?: Maybe<Scalars['String']['output']>
  email: Scalars['String']['output']
  firstName?: Maybe<Scalars['String']['output']>
  fullName?: Maybe<Scalars['String']['output']>
  id: Scalars['Int']['output']
  lastName?: Maybe<Scalars['String']['output']>
  /** Reads and enables pagination through a set of `Membership`. */
  memberships: MembershipsConnection
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads and enables pagination through a set of `Profile`. */
  profiles: ProfilesConnection
  /** Reads and enables pagination through a set of `ShirtOrder`. */
  shirtOrders: ShirtOrdersConnection
  /** Reads and enables pagination through a set of `Transaction`. */
  transactions: TransactionsConnection
  /** Reads and enables pagination through a set of `Transaction`. */
  transactionsByOrigin: TransactionsConnection
  /** Reads and enables pagination through a set of `UserRole`. */
  userRoles: UserRolesConnection
}

export type UserAuthoredGamesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<GameCondition>
  filter?: InputMaybe<GameFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<GamesOrderBy>>
}

export type UserMembershipsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<MembershipCondition>
  filter?: InputMaybe<MembershipFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<MembershipsOrderBy>>
}

export type UserProfilesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ProfileCondition>
  filter?: InputMaybe<ProfileFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ProfilesOrderBy>>
}

export type UserShirtOrdersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<ShirtOrderCondition>
  filter?: InputMaybe<ShirtOrderFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<ShirtOrdersOrderBy>>
}

export type UserTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<TransactionCondition>
  filter?: InputMaybe<TransactionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

export type UserTransactionsByOriginArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<TransactionCondition>
  filter?: InputMaybe<TransactionFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<TransactionsOrderBy>>
}

export type UserUserRolesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>
  before?: InputMaybe<Scalars['Cursor']['input']>
  condition?: InputMaybe<UserRoleCondition>
  filter?: InputMaybe<UserRoleFilter>
  first?: InputMaybe<Scalars['Int']['input']>
  last?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  orderBy?: InputMaybe<Array<UserRolesOrderBy>>
}

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `amountOwed` field. */
  amountOwed?: InputMaybe<Scalars['Float']['input']>
  /** Checks for equality with the object’s `displayName` field. */
  displayName?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `fullName` field. */
  fullName?: InputMaybe<Scalars['String']['input']>
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: InputMaybe<Scalars['String']['input']>
}

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Filter by the object’s `amountOwed` field. */
  amountOwed?: InputMaybe<FloatFilter>
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserFilter>>
  /** Filter by the object’s `displayName` field. */
  displayName?: InputMaybe<StringFilter>
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>
  /** Filter by the object’s `firstName` field. */
  firstName?: InputMaybe<StringFilter>
  /** Filter by the object’s `fullName` field. */
  fullName?: InputMaybe<StringFilter>
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<IntFilter>
  /** Filter by the object’s `lastName` field. */
  lastName?: InputMaybe<StringFilter>
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>
}

/** An input for mutations affecting `User` */
export type UserInput = {
  amountOwed?: InputMaybe<Scalars['Float']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
  email: Scalars['String']['input']
  firstName?: InputMaybe<Scalars['String']['input']>
  fullName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  amountOwed?: InputMaybe<Scalars['Float']['input']>
  displayName?: InputMaybe<Scalars['String']['input']>
  email?: InputMaybe<Scalars['String']['input']>
  firstName?: InputMaybe<Scalars['String']['input']>
  fullName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['Int']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export type UserRole = Node & {
  __typename: 'UserRole'
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output']
  /** Reads a single `Role` that is related to this `UserRole`. */
  role?: Maybe<Role>
  roleId: Scalars['Int']['output']
  /** Reads a single `User` that is related to this `UserRole`. */
  user?: Maybe<User>
  userId: Scalars['Int']['output']
}

/**
 * A condition to be used against `UserRole` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type UserRoleCondition = {
  /** Checks for equality with the object’s `roleId` field. */
  roleId?: InputMaybe<Scalars['Int']['input']>
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>
}

/** A filter to be used against `UserRole` object types. All fields are combined with a logical ‘and.’ */
export type UserRoleFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserRoleFilter>>
  /** Negates the expression. */
  not?: InputMaybe<UserRoleFilter>
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserRoleFilter>>
  /** Filter by the object’s `roleId` field. */
  roleId?: InputMaybe<IntFilter>
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<IntFilter>
}

/** An input for mutations affecting `UserRole` */
export type UserRoleInput = {
  roleId: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}

/** Represents an update to a `UserRole`. Fields that are set will be updated. */
export type UserRolePatch = {
  roleId?: InputMaybe<Scalars['Int']['input']>
  userId?: InputMaybe<Scalars['Int']['input']>
}

/** A connection to a list of `UserRole` values. */
export type UserRolesConnection = {
  __typename: 'UserRolesConnection'
  /** A list of edges which contains the `UserRole` and cursor to aid in pagination. */
  edges: Array<UserRolesEdge>
  /** A list of `UserRole` objects. */
  nodes: Array<Maybe<UserRole>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `UserRole` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `UserRole` edge in the connection. */
export type UserRolesEdge = {
  __typename: 'UserRolesEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `UserRole` at the end of the edge. */
  node?: Maybe<UserRole>
}

/** Methods to use when ordering `UserRole`. */
export enum UserRolesOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RoleByRoleIdAuthorityAsc = 'ROLE_BY_ROLE_ID__AUTHORITY_ASC',
  RoleByRoleIdAuthorityDesc = 'ROLE_BY_ROLE_ID__AUTHORITY_DESC',
  RoleByRoleIdIdAsc = 'ROLE_BY_ROLE_ID__ID_ASC',
  RoleByRoleIdIdDesc = 'ROLE_BY_ROLE_ID__ID_DESC',
  RoleIdAsc = 'ROLE_ID_ASC',
  RoleIdDesc = 'ROLE_ID_DESC',
  UserByUserIdAmountOwedAsc = 'USER_BY_USER_ID__AMOUNT_OWED_ASC',
  UserByUserIdAmountOwedDesc = 'USER_BY_USER_ID__AMOUNT_OWED_DESC',
  UserByUserIdDisplayNameAsc = 'USER_BY_USER_ID__DISPLAY_NAME_ASC',
  UserByUserIdDisplayNameDesc = 'USER_BY_USER_ID__DISPLAY_NAME_DESC',
  UserByUserIdEmailAsc = 'USER_BY_USER_ID__EMAIL_ASC',
  UserByUserIdEmailDesc = 'USER_BY_USER_ID__EMAIL_DESC',
  UserByUserIdFirstNameAsc = 'USER_BY_USER_ID__FIRST_NAME_ASC',
  UserByUserIdFirstNameDesc = 'USER_BY_USER_ID__FIRST_NAME_DESC',
  UserByUserIdFullNameAsc = 'USER_BY_USER_ID__FULL_NAME_ASC',
  UserByUserIdFullNameDesc = 'USER_BY_USER_ID__FULL_NAME_DESC',
  UserByUserIdIdAsc = 'USER_BY_USER_ID__ID_ASC',
  UserByUserIdIdDesc = 'USER_BY_USER_ID__ID_DESC',
  UserByUserIdLastNameAsc = 'USER_BY_USER_ID__LAST_NAME_ASC',
  UserByUserIdLastNameDesc = 'USER_BY_USER_ID__LAST_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename: 'UsersConnection'
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>
  /** Information to aid in pagination. */
  pageInfo: PageInfo
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output']
}

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename: 'UsersEdge'
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>
  /** The `User` at the end of the edge. */
  node?: Maybe<User>
}

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  AmountOwedAsc = 'AMOUNT_OWED_ASC',
  AmountOwedDesc = 'AMOUNT_OWED_DESC',
  DisplayNameAsc = 'DISPLAY_NAME_ASC',
  DisplayNameDesc = 'DISPLAY_NAME_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  FirstNameAsc = 'FIRST_NAME_ASC',
  FirstNameDesc = 'FIRST_NAME_DESC',
  FullNameAsc = 'FULL_NAME_ASC',
  FullNameDesc = 'FULL_NAME_DESC',
  GamesByAuthorIdCountAsc = 'GAMES_BY_AUTHOR_ID__COUNT_ASC',
  GamesByAuthorIdCountDesc = 'GAMES_BY_AUTHOR_ID__COUNT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LastNameAsc = 'LAST_NAME_ASC',
  LastNameDesc = 'LAST_NAME_DESC',
  MembershipsByUserIdCountAsc = 'MEMBERSHIPS_BY_USER_ID__COUNT_ASC',
  MembershipsByUserIdCountDesc = 'MEMBERSHIPS_BY_USER_ID__COUNT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProfilesByUserIdCountAsc = 'PROFILES_BY_USER_ID__COUNT_ASC',
  ProfilesByUserIdCountDesc = 'PROFILES_BY_USER_ID__COUNT_DESC',
  ShirtOrdersByUserIdCountAsc = 'SHIRT_ORDERS_BY_USER_ID__COUNT_ASC',
  ShirtOrdersByUserIdCountDesc = 'SHIRT_ORDERS_BY_USER_ID__COUNT_DESC',
  TransactionsByOriginCountAsc = 'TRANSACTIONS_BY_ORIGIN__COUNT_ASC',
  TransactionsByOriginCountDesc = 'TRANSACTIONS_BY_ORIGIN__COUNT_DESC',
  TransactionsByUserIdCountAsc = 'TRANSACTIONS_BY_USER_ID__COUNT_ASC',
  TransactionsByUserIdCountDesc = 'TRANSACTIONS_BY_USER_ID__COUNT_DESC',
  UserRolesByUserIdCountAsc = 'USER_ROLES_BY_USER_ID__COUNT_ASC',
  UserRolesByUserIdCountDesc = 'USER_ROLES_BY_USER_ID__COUNT_DESC',
}

export type GetGamesBySlotForSignupQueryVariables = Exact<{
  year: Scalars['Int']['input']
  slotId: Scalars['Int']['input']
}>

export type GetGamesBySlotForSignupQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    edges: Array<{
      __typename: 'GamesEdge'
      node?: {
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        room?: { __typename: 'Room'; description: string } | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
      } | null
    }>
  } | null
}

export type GetGamesBySlotQueryVariables = Exact<{
  year: Scalars['Int']['input']
  slotId: Scalars['Int']['input']
}>

export type GetGamesBySlotQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    edges: Array<{
      __typename: 'GamesEdge'
      node?: {
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        room?: { __typename: 'Room'; description: string } | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
      } | null
    }>
  } | null
}

export type GetGamesByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetGamesByYearQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    edges: Array<{
      __typename: 'GamesEdge'
      node?: {
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        room?: {
          __typename: 'Room'
          description: string
          id: number
          size: number
          type: string
          updated: boolean
        } | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
      } | null
    }>
  } | null
}

export type GetSmallGamesByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetSmallGamesByYearQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    edges: Array<{
      __typename: 'GamesEdge'
      node?: {
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        room?: { __typename: 'Room'; description: string } | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
      } | null
    }>
  } | null
}

export type UpdateGameByNodeIdMutationVariables = Exact<{
  input: UpdateGameByNodeIdInput
}>

export type UpdateGameByNodeIdMutation = {
  __typename: 'Mutation'
  updateGameByNodeId?: {
    __typename: 'UpdateGamePayload'
    game?: {
      __typename: 'Game'
      nodeId: string
      id: number
      name: string
      gmNames?: string | null
      description: string
      genre: string
      type: string
      setting: string
      charInstructions: string
      playerMax: number
      playerMin: number
      playerPreference: string
      returningPlayers: string
      playersContactGm: boolean
      gameContactEmail: string
      estimatedLength: string
      slotPreference: number
      lateStart?: string | null
      lateFinish?: boolean | null
      slotConflicts: string
      message: string
      slotId?: number | null
      teenFriendly: boolean
      year: number
      full?: boolean | null
      roomId?: number | null
      room?: { __typename: 'Room'; description: string } | null
      gameAssignments: {
        __typename: 'GameAssignmentsConnection'
        nodes: Array<{
          __typename: 'GameAssignment'
          gameId: number
          gm: number
          memberId: number
          nodeId: string
          year: number
          member?: {
            __typename: 'Membership'
            user?: { __typename: 'User'; email: string; fullName?: string | null } | null
          } | null
        } | null>
      }
    } | null
  } | null
}

export type UpdateGameMutationVariables = Exact<{
  input: UpdateGameInput
}>

export type UpdateGameMutation = {
  __typename: 'Mutation'
  updateGame?: {
    __typename: 'UpdateGamePayload'
    game?: {
      __typename: 'Game'
      nodeId: string
      id: number
      name: string
      gmNames?: string | null
      description: string
      genre: string
      type: string
      setting: string
      charInstructions: string
      playerMax: number
      playerMin: number
      playerPreference: string
      returningPlayers: string
      playersContactGm: boolean
      gameContactEmail: string
      estimatedLength: string
      slotPreference: number
      lateStart?: string | null
      lateFinish?: boolean | null
      slotConflicts: string
      message: string
      slotId?: number | null
      teenFriendly: boolean
      year: number
      full?: boolean | null
      roomId?: number | null
      room?: { __typename: 'Room'; description: string } | null
      gameAssignments: {
        __typename: 'GameAssignmentsConnection'
        nodes: Array<{
          __typename: 'GameAssignment'
          gameId: number
          gm: number
          memberId: number
          nodeId: string
          year: number
          member?: {
            __typename: 'Membership'
            user?: { __typename: 'User'; email: string; fullName?: string | null } | null
          } | null
        } | null>
      }
    } | null
  } | null
}

export type CreateGameMutationVariables = Exact<{
  input: CreateGameInput
}>

export type CreateGameMutation = {
  __typename: 'Mutation'
  createGame?: {
    __typename: 'CreateGamePayload'
    game?: {
      __typename: 'Game'
      nodeId: string
      id: number
      name: string
      gmNames?: string | null
      description: string
      genre: string
      type: string
      setting: string
      charInstructions: string
      playerMax: number
      playerMin: number
      playerPreference: string
      returningPlayers: string
      playersContactGm: boolean
      gameContactEmail: string
      estimatedLength: string
      slotPreference: number
      lateStart?: string | null
      lateFinish?: boolean | null
      slotConflicts: string
      message: string
      slotId?: number | null
      teenFriendly: boolean
      year: number
      full?: boolean | null
      roomId?: number | null
      room?: { __typename: 'Room'; description: string } | null
      gameAssignments: {
        __typename: 'GameAssignmentsConnection'
        nodes: Array<{
          __typename: 'GameAssignment'
          gameId: number
          gm: number
          memberId: number
          nodeId: string
          year: number
          member?: {
            __typename: 'Membership'
            user?: { __typename: 'User'; email: string; fullName?: string | null } | null
          } | null
        } | null>
      }
    } | null
  } | null
}

export type DeleteGameMutationVariables = Exact<{
  input: DeleteGameInput
}>

export type DeleteGameMutation = {
  __typename: 'Mutation'
  deleteGame?: {
    __typename: 'DeleteGamePayload'
    clientMutationId?: string | null
    deletedGameNodeId?: string | null
  } | null
}

export type GetFirstGameOfSlotQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetFirstGameOfSlotQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    nodes: Array<{
      __typename: 'Game'
      nodeId: string
      id: number
      name: string
      gmNames?: string | null
      description: string
      genre: string
      type: string
      setting: string
      charInstructions: string
      playerMax: number
      playerMin: number
      playerPreference: string
      returningPlayers: string
      playersContactGm: boolean
      gameContactEmail: string
      estimatedLength: string
      slotPreference: number
      lateStart?: string | null
      lateFinish?: boolean | null
      slotConflicts: string
      message: string
      slotId?: number | null
      teenFriendly: boolean
      year: number
      full?: boolean | null
      roomId?: number | null
      gameAssignments: {
        __typename: 'GameAssignmentsConnection'
        nodes: Array<{
          __typename: 'GameAssignment'
          nodeId: string
          gm: number
          member?: {
            __typename: 'Membership'
            user?: { __typename: 'User'; email: string; fullName?: string | null } | null
          } | null
        } | null>
      }
      room?: { __typename: 'Room'; description: string } | null
    } | null>
  } | null
}

export type GetGamesByAuthorQueryVariables = Exact<{
  id: Scalars['Int']['input']
}>

export type GetGamesByAuthorQuery = {
  __typename: 'Query'
  user?: {
    __typename: 'User'
    authoredGames: {
      __typename: 'GamesConnection'
      nodes: Array<{
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        room?: { __typename: 'Room'; description: string } | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
      } | null>
    }
  } | null
}

export type GetGamesByYearAndAuthorQueryVariables = Exact<{
  year: Scalars['Int']['input']
  id: Scalars['Int']['input']
}>

export type GetGamesByYearAndAuthorQuery = {
  __typename: 'Query'
  games?: {
    __typename: 'GamesConnection'
    nodes: Array<{
      __typename: 'Game'
      nodeId: string
      id: number
      name: string
      gmNames?: string | null
      description: string
      genre: string
      type: string
      setting: string
      charInstructions: string
      playerMax: number
      playerMin: number
      playerPreference: string
      returningPlayers: string
      playersContactGm: boolean
      gameContactEmail: string
      estimatedLength: string
      slotPreference: number
      lateStart?: string | null
      lateFinish?: boolean | null
      slotConflicts: string
      message: string
      slotId?: number | null
      teenFriendly: boolean
      year: number
      full?: boolean | null
      roomId?: number | null
      room?: { __typename: 'Room'; description: string } | null
      gameAssignments: {
        __typename: 'GameAssignmentsConnection'
        nodes: Array<{
          __typename: 'GameAssignment'
          gameId: number
          gm: number
          memberId: number
          nodeId: string
          year: number
          member?: {
            __typename: 'Membership'
            user?: { __typename: 'User'; email: string; fullName?: string | null } | null
          } | null
        } | null>
      }
    } | null>
  } | null
}

export type GetGameByIdQueryVariables = Exact<{
  id: Scalars['Int']['input']
}>

export type GetGameByIdQuery = {
  __typename: 'Query'
  game?: {
    __typename: 'Game'
    nodeId: string
    id: number
    name: string
    gmNames?: string | null
    description: string
    genre: string
    type: string
    setting: string
    charInstructions: string
    playerMax: number
    playerMin: number
    playerPreference: string
    returningPlayers: string
    playersContactGm: boolean
    gameContactEmail: string
    estimatedLength: string
    slotPreference: number
    lateStart?: string | null
    lateFinish?: boolean | null
    slotConflicts: string
    message: string
    slotId?: number | null
    teenFriendly: boolean
    year: number
    full?: boolean | null
    roomId?: number | null
    room?: { __typename: 'Room'; description: string } | null
    gameAssignments: {
      __typename: 'GameAssignmentsConnection'
      nodes: Array<{
        __typename: 'GameAssignment'
        gameId: number
        gm: number
        memberId: number
        nodeId: string
        year: number
        member?: {
          __typename: 'Membership'
          user?: { __typename: 'User'; email: string; fullName?: string | null } | null
        } | null
      } | null>
    }
  } | null
}

export type GameAssignmentFieldsFragment = {
  __typename: 'GameAssignment'
  gameId: number
  gm: number
  memberId: number
  nodeId: string
  year: number
}

export type GetGameAssignmentsByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetGameAssignmentsByYearQuery = {
  __typename: 'Query'
  gameAssignments?: {
    __typename: 'GameAssignmentsConnection'
    nodes: Array<{
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
    } | null>
  } | null
}

export type GetGameAssignmentsByGameIdQueryVariables = Exact<{
  gameId: Scalars['Int']['input']
}>

export type GetGameAssignmentsByGameIdQuery = {
  __typename: 'Query'
  gameAssignments?: {
    __typename: 'GameAssignmentsConnection'
    nodes: Array<{
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
    } | null>
  } | null
}

export type GetGameAssignmentsByMemberIdQueryVariables = Exact<{
  memberId: Scalars['Int']['input']
}>

export type GetGameAssignmentsByMemberIdQuery = {
  __typename: 'Query'
  gameAssignments?: {
    __typename: 'GameAssignmentsConnection'
    nodes: Array<{
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
    } | null>
  } | null
}

export type UpdateGameAssignmentByNodeIdMutationVariables = Exact<{
  input: UpdateGameAssignmentByNodeIdInput
}>

export type UpdateGameAssignmentByNodeIdMutation = {
  __typename: 'Mutation'
  updateGameAssignmentByNodeId?: {
    __typename: 'UpdateGameAssignmentPayload'
    gameAssignment?: {
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
    } | null
  } | null
}

export type CreateGameAssignmentMutationVariables = Exact<{
  input: CreateGameAssignmentInput
}>

export type CreateGameAssignmentMutation = {
  __typename: 'Mutation'
  createGameAssignment?: {
    __typename: 'CreateGameAssignmentPayload'
    gameAssignment?: {
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
    } | null
  } | null
}

export type DeleteGameAssignmentMutationVariables = Exact<{
  input: DeleteGameAssignmentByNodeIdInput
}>

export type DeleteGameAssignmentMutation = {
  __typename: 'Mutation'
  deleteGameAssignmentByNodeId?: {
    __typename: 'DeleteGameAssignmentPayload'
    clientMutationId?: string | null
    deletedGameAssignmentNodeId?: string | null
  } | null
}

export type GetScheduleQueryVariables = Exact<{
  memberId: Scalars['Int']['input']
}>

export type GetScheduleQuery = {
  __typename: 'Query'
  gameAssignments?: {
    __typename: 'GameAssignmentsConnection'
    nodes: Array<{
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
      game?: {
        __typename: 'Game'
        nodeId: string
        id: number
        name: string
        gmNames?: string | null
        description: string
        genre: string
        type: string
        setting: string
        charInstructions: string
        playerMax: number
        playerMin: number
        playerPreference: string
        returningPlayers: string
        playersContactGm: boolean
        gameContactEmail: string
        estimatedLength: string
        slotPreference: number
        lateStart?: string | null
        lateFinish?: boolean | null
        slotConflicts: string
        message: string
        slotId?: number | null
        teenFriendly: boolean
        year: number
        full?: boolean | null
        roomId?: number | null
        gameAssignments: {
          __typename: 'GameAssignmentsConnection'
          nodes: Array<{
            __typename: 'GameAssignment'
            gameId: number
            gm: number
            memberId: number
            nodeId: string
            year: number
            member?: {
              __typename: 'Membership'
              user?: { __typename: 'User'; email: string; fullName?: string | null } | null
            } | null
          } | null>
        }
        room?: { __typename: 'Room'; description: string } | null
      } | null
    } | null>
  } | null
}

export type GameSubmissionFieldsFragment = {
  __typename: 'GameSubmission'
  id: number
  memberId: number
  message: string
  nodeId: string
  year: number
}

export type GameChoiceFieldsFragment = {
  __typename: 'GameChoice'
  gameId?: number | null
  id: number
  memberId: number
  nodeId: string
  rank: number
  returningPlayer: boolean
  slotId: number
  year: number
}

export type CreateGameChoicesMutationVariables = Exact<{
  year: Scalars['Int']['input']
  slots: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
}>

export type CreateGameChoicesMutation = {
  __typename: 'Mutation'
  createBareSlotChoices?: { __typename: 'CreateBareSlotChoicesPayload'; clientMutationId?: string | null } | null
}

export type GetGameChoicesQueryVariables = Exact<{
  year: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
}>

export type GetGameChoicesQuery = {
  __typename: 'Query'
  gameSubmissions?: {
    __typename: 'GameSubmissionsConnection'
    nodes: Array<{
      __typename: 'GameSubmission'
      id: number
      memberId: number
      message: string
      nodeId: string
      year: number
    } | null>
  } | null
  gameChoices?: {
    __typename: 'GameChoicesConnection'
    nodes: Array<{
      __typename: 'GameChoice'
      gameId?: number | null
      id: number
      memberId: number
      nodeId: string
      rank: number
      returningPlayer: boolean
      slotId: number
      year: number
    } | null>
  } | null
}

export type ReadGameChoiceQueryVariables = Exact<{
  id: Scalars['Int']['input']
}>

export type ReadGameChoiceQuery = {
  __typename: 'Query'
  gameChoice?: {
    __typename: 'GameChoice'
    gameId?: number | null
    id: number
    memberId: number
    nodeId: string
    rank: number
    returningPlayer: boolean
    slotId: number
    year: number
  } | null
}

export type CreateGameSubmissionMutationVariables = Exact<{
  input: CreateGameSubmissionInput
}>

export type CreateGameSubmissionMutation = {
  __typename: 'Mutation'
  createGameSubmission?: {
    __typename: 'CreateGameSubmissionPayload'
    clientMutationId?: string | null
    gameSubmission?: {
      __typename: 'GameSubmission'
      id: number
      memberId: number
      message: string
      nodeId: string
      year: number
    } | null
  } | null
}

export type UpdateGameSubmissionByNodeIdMutationVariables = Exact<{
  input: UpdateGameSubmissionByNodeIdInput
}>

export type UpdateGameSubmissionByNodeIdMutation = {
  __typename: 'Mutation'
  updateGameSubmissionByNodeId?: {
    __typename: 'UpdateGameSubmissionPayload'
    clientMutationId?: string | null
    gameSubmission?: {
      __typename: 'GameSubmission'
      id: number
      memberId: number
      message: string
      nodeId: string
      year: number
    } | null
  } | null
}

export type CreateGameChoiceMutationVariables = Exact<{
  input: CreateGameChoiceInput
}>

export type CreateGameChoiceMutation = {
  __typename: 'Mutation'
  createGameChoice?: {
    __typename: 'CreateGameChoicePayload'
    clientMutationId?: string | null
    gameChoice?: {
      __typename: 'GameChoice'
      gameId?: number | null
      id: number
      memberId: number
      nodeId: string
      rank: number
      returningPlayer: boolean
      slotId: number
      year: number
    } | null
  } | null
}

export type UpdateGameChoiceByNodeIdMutationVariables = Exact<{
  input: UpdateGameChoiceByNodeIdInput
}>

export type UpdateGameChoiceByNodeIdMutation = {
  __typename: 'Mutation'
  updateGameChoiceByNodeId?: {
    __typename: 'UpdateGameChoicePayload'
    clientMutationId?: string | null
    gameChoice?: {
      __typename: 'GameChoice'
      gameId?: number | null
      id: number
      memberId: number
      nodeId: string
      rank: number
      returningPlayer: boolean
      slotId: number
      year: number
    } | null
  } | null
}

export type GameFieldsFragment = {
  __typename: 'Game'
  nodeId: string
  id: number
  name: string
  gmNames?: string | null
  description: string
  genre: string
  type: string
  setting: string
  charInstructions: string
  playerMax: number
  playerMin: number
  playerPreference: string
  returningPlayers: string
  playersContactGm: boolean
  gameContactEmail: string
  estimatedLength: string
  slotPreference: number
  lateStart?: string | null
  lateFinish?: boolean | null
  slotConflicts: string
  message: string
  slotId?: number | null
  teenFriendly: boolean
  year: number
  full?: boolean | null
  roomId?: number | null
  room?: { __typename: 'Room'; description: string } | null
}

export type AssignmentFieldsFragment = {
  __typename: 'GameAssignment'
  gameId: number
  gm: number
  memberId: number
  nodeId: string
  year: number
  member?: {
    __typename: 'Membership'
    user?: { __typename: 'User'; email: string; fullName?: string | null } | null
  } | null
}

export type GameGmsFragment = {
  __typename: 'Game'
  gameAssignments: {
    __typename: 'GameAssignmentsConnection'
    nodes: Array<{
      __typename: 'GameAssignment'
      gameId: number
      gm: number
      memberId: number
      nodeId: string
      year: number
      member?: {
        __typename: 'Membership'
        user?: { __typename: 'User'; email: string; fullName?: string | null } | null
      } | null
    } | null>
  }
}

export type GameRoomFieldsFragment = {
  __typename: 'Room'
  id: number
  description: string
  size: number
  type: string
  updated: boolean
}

export type GetGameRoomsQueryVariables = Exact<{ [key: string]: never }>

export type GetGameRoomsQuery = {
  __typename: 'Query'
  rooms?: {
    __typename: 'RoomsConnection'
    nodes: Array<{
      __typename: 'Room'
      id: number
      description: string
      size: number
      type: string
      updated: boolean
    } | null>
  } | null
}

export type UpdateGameRoomMutationVariables = Exact<{
  input: UpdateRoomInput
}>

export type UpdateGameRoomMutation = {
  __typename: 'Mutation'
  updateRoom?: {
    __typename: 'UpdateRoomPayload'
    room?: { __typename: 'Room'; id: number; description: string; size: number; type: string; updated: boolean } | null
  } | null
}

export type CreateGameRoomMutationVariables = Exact<{
  input: CreateRoomInput
}>

export type CreateGameRoomMutation = {
  __typename: 'Mutation'
  createRoom?: {
    __typename: 'CreateRoomPayload'
    room?: { __typename: 'Room'; id: number; description: string; size: number; type: string; updated: boolean } | null
  } | null
}

export type DeleteGameRoomMutationVariables = Exact<{
  input: DeleteRoomInput
}>

export type DeleteGameRoomMutation = {
  __typename: 'Mutation'
  deleteRoom?: {
    __typename: 'DeleteRoomPayload'
    clientMutationId?: string | null
    deletedRoomNodeId?: string | null
  } | null
}

export type GetGameRoomAndGamesQueryVariables = Exact<{
  year?: InputMaybe<Scalars['Int']['input']>
}>

export type GetGameRoomAndGamesQuery = {
  __typename: 'Query'
  rooms?: {
    __typename: 'RoomsConnection'
    nodes: Array<{
      __typename: 'Room'
      id: number
      description: string
      games: {
        __typename: 'GamesConnection'
        nodes: Array<{
          __typename: 'Game'
          id: number
          name: string
          slotId?: number | null
          gmNames?: string | null
        } | null>
      }
    } | null>
  } | null
}

export type HotelRoomFieldsFragment = {
  __typename: 'HotelRoom'
  id: number
  nodeId: string
  description: string
  gamingRoom: boolean
  bathroomType: string
  occupancy: string
  rate: string
  type: string
  quantity: number
}

export type GetHotelRoomsQueryVariables = Exact<{ [key: string]: never }>

export type GetHotelRoomsQuery = {
  __typename: 'Query'
  hotelRooms?: {
    __typename: 'HotelRoomsConnection'
    edges: Array<{
      __typename: 'HotelRoomsEdge'
      node?: {
        __typename: 'HotelRoom'
        id: number
        nodeId: string
        description: string
        gamingRoom: boolean
        bathroomType: string
        occupancy: string
        rate: string
        type: string
        quantity: number
      } | null
    }>
  } | null
}

export type UpdateHotelRoomByNodeIdMutationVariables = Exact<{
  input: UpdateHotelRoomByNodeIdInput
}>

export type UpdateHotelRoomByNodeIdMutation = {
  __typename: 'Mutation'
  updateHotelRoomByNodeId?: {
    __typename: 'UpdateHotelRoomPayload'
    hotelRoom?: {
      __typename: 'HotelRoom'
      id: number
      nodeId: string
      description: string
      gamingRoom: boolean
      bathroomType: string
      occupancy: string
      rate: string
      type: string
      quantity: number
    } | null
  } | null
}

export type CreateHotelRoomMutationVariables = Exact<{
  input: CreateHotelRoomInput
}>

export type CreateHotelRoomMutation = {
  __typename: 'Mutation'
  createHotelRoom?: {
    __typename: 'CreateHotelRoomPayload'
    hotelRoom?: {
      __typename: 'HotelRoom'
      id: number
      nodeId: string
      description: string
      gamingRoom: boolean
      bathroomType: string
      occupancy: string
      rate: string
      type: string
      quantity: number
    } | null
  } | null
}

export type DeleteHotelRoomMutationVariables = Exact<{
  input: DeleteHotelRoomInput
}>

export type DeleteHotelRoomMutation = {
  __typename: 'Mutation'
  deleteHotelRoom?: {
    __typename: 'DeleteHotelRoomPayload'
    clientMutationId?: string | null
    deletedHotelRoomNodeId?: string | null
  } | null
}

export type HotelRoomDetailsFieldsFragment = {
  __typename: 'HotelRoomDetail'
  id: any
  nodeId: string
  name: string
  roomType: string
  comment: string
  reservedFor: string
  bathroomType: string
  gamingRoom: boolean
  enabled: boolean
  formattedRoomType: string
  internalRoomType: string
  reserved: boolean
}

export type GetHotelRoomDetailsQueryVariables = Exact<{ [key: string]: never }>

export type GetHotelRoomDetailsQuery = {
  __typename: 'Query'
  hotelRoomDetails?: {
    __typename: 'HotelRoomDetailsConnection'
    edges: Array<{
      __typename: 'HotelRoomDetailsEdge'
      node?: {
        __typename: 'HotelRoomDetail'
        id: any
        nodeId: string
        name: string
        roomType: string
        comment: string
        reservedFor: string
        bathroomType: string
        gamingRoom: boolean
        enabled: boolean
        formattedRoomType: string
        internalRoomType: string
        reserved: boolean
      } | null
    }>
  } | null
}

export type UpdateHotelRoomDetailByNodeIdMutationVariables = Exact<{
  input: UpdateHotelRoomDetailByNodeIdInput
}>

export type UpdateHotelRoomDetailByNodeIdMutation = {
  __typename: 'Mutation'
  updateHotelRoomDetailByNodeId?: {
    __typename: 'UpdateHotelRoomDetailPayload'
    hotelRoomDetail?: {
      __typename: 'HotelRoomDetail'
      id: any
      nodeId: string
      name: string
      roomType: string
      comment: string
      reservedFor: string
      bathroomType: string
      gamingRoom: boolean
      enabled: boolean
      formattedRoomType: string
      internalRoomType: string
      reserved: boolean
    } | null
  } | null
}

export type CreateHotelRoomDetailMutationVariables = Exact<{
  input: CreateHotelRoomDetailInput
}>

export type CreateHotelRoomDetailMutation = {
  __typename: 'Mutation'
  createHotelRoomDetail?: {
    __typename: 'CreateHotelRoomDetailPayload'
    hotelRoomDetail?: {
      __typename: 'HotelRoomDetail'
      id: any
      nodeId: string
      name: string
      roomType: string
      comment: string
      reservedFor: string
      bathroomType: string
      gamingRoom: boolean
      enabled: boolean
      formattedRoomType: string
      internalRoomType: string
      reserved: boolean
    } | null
  } | null
}

export type DeleteHotelRoomDetailMutationVariables = Exact<{
  input: DeleteHotelRoomDetailInput
}>

export type DeleteHotelRoomDetailMutation = {
  __typename: 'Mutation'
  deleteHotelRoomDetail?: {
    __typename: 'DeleteHotelRoomDetailPayload'
    clientMutationId?: string | null
    deletedHotelRoomDetailNodeId?: string | null
  } | null
}

export type LookupFieldsFragment = { __typename: 'Lookup'; nodeId: string; id: number; realm: string }

export type LookupValuesFieldsFragment = {
  __typename: 'LookupValue'
  nodeId: string
  id: number
  code: string
  sequencer: number
  value: string
}

export type GetLookupsQueryVariables = Exact<{ [key: string]: never }>

export type GetLookupsQuery = {
  __typename: 'Query'
  lookups?: {
    __typename: 'LookupsConnection'
    edges: Array<{
      __typename: 'LookupsEdge'
      node?: {
        __typename: 'Lookup'
        nodeId: string
        id: number
        realm: string
        lookupValues: {
          __typename: 'LookupValuesConnection'
          nodes: Array<{
            __typename: 'LookupValue'
            nodeId: string
            id: number
            code: string
            sequencer: number
            value: string
          } | null>
        }
      } | null
    }>
  } | null
}

export type GetLookupValuesQueryVariables = Exact<{
  realm: Scalars['String']['input']
}>

export type GetLookupValuesQuery = {
  __typename: 'Query'
  lookups?: {
    __typename: 'LookupsConnection'
    edges: Array<{
      __typename: 'LookupsEdge'
      node?: {
        __typename: 'Lookup'
        nodeId: string
        id: number
        realm: string
        lookupValues: {
          __typename: 'LookupValuesConnection'
          nodes: Array<{
            __typename: 'LookupValue'
            nodeId: string
            id: number
            code: string
            sequencer: number
            value: string
          } | null>
        }
      } | null
    }>
  } | null
}

export type GetSingleLookupValueQueryVariables = Exact<{
  realm: Scalars['String']['input']
  code: Scalars['String']['input']
}>

export type GetSingleLookupValueQuery = {
  __typename: 'Query'
  lookups?: {
    __typename: 'LookupsConnection'
    edges: Array<{
      __typename: 'LookupsEdge'
      node?: {
        __typename: 'Lookup'
        nodeId: string
        id: number
        realm: string
        lookupValues: {
          __typename: 'LookupValuesConnection'
          nodes: Array<{
            __typename: 'LookupValue'
            nodeId: string
            id: number
            code: string
            sequencer: number
            value: string
          } | null>
        }
      } | null
    }>
  } | null
}

export type UpdateLookupByNodeIdMutationVariables = Exact<{
  input: UpdateLookupByNodeIdInput
}>

export type UpdateLookupByNodeIdMutation = {
  __typename: 'Mutation'
  updateLookupByNodeId?: {
    __typename: 'UpdateLookupPayload'
    lookup?: { __typename: 'Lookup'; nodeId: string; id: number; realm: string } | null
  } | null
}

export type CreateLookupMutationVariables = Exact<{
  input: CreateLookupInput
}>

export type CreateLookupMutation = {
  __typename: 'Mutation'
  createLookup?: {
    __typename: 'CreateLookupPayload'
    lookup?: { __typename: 'Lookup'; nodeId: string; id: number; realm: string } | null
  } | null
}

export type DeleteLookupMutationVariables = Exact<{
  input: DeleteLookupInput
}>

export type DeleteLookupMutation = {
  __typename: 'Mutation'
  deleteLookup?: {
    __typename: 'DeleteLookupPayload'
    clientMutationId?: string | null
    deletedLookupNodeId?: string | null
  } | null
}

export type UpdateLookupValueByNodeIdMutationVariables = Exact<{
  input: UpdateLookupValueByNodeIdInput
}>

export type UpdateLookupValueByNodeIdMutation = {
  __typename: 'Mutation'
  updateLookupValueByNodeId?: {
    __typename: 'UpdateLookupValuePayload'
    lookupValue?: {
      __typename: 'LookupValue'
      nodeId: string
      id: number
      code: string
      sequencer: number
      value: string
    } | null
  } | null
}

export type CreateLookupValueMutationVariables = Exact<{
  input: CreateLookupValueInput
}>

export type CreateLookupValueMutation = {
  __typename: 'Mutation'
  createLookupValue?: {
    __typename: 'CreateLookupValuePayload'
    lookupValue?: {
      __typename: 'LookupValue'
      nodeId: string
      id: number
      code: string
      sequencer: number
      value: string
    } | null
  } | null
}

export type DeleteLookupValueMutationVariables = Exact<{
  input: DeleteLookupValueInput
}>

export type DeleteLookupValueMutation = {
  __typename: 'Mutation'
  deleteLookupValue?: {
    __typename: 'DeleteLookupValuePayload'
    clientMutationId?: string | null
    deletedLookupValueNodeId?: string | null
  } | null
}

export type GetMembershipByYearAndIdQueryVariables = Exact<{
  year: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}>

export type GetMembershipByYearAndIdQuery = {
  __typename: 'Query'
  memberships?: {
    __typename: 'MembershipsConnection'
    nodes: Array<{
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null>
  } | null
}

export type GetMembershipsByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetMembershipsByYearQuery = {
  __typename: 'Query'
  memberships?: {
    __typename: 'MembershipsConnection'
    nodes: Array<{
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null>
  } | null
}

export type GetMembershipRoomsByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetMembershipRoomsByYearQuery = {
  __typename: 'Query'
  memberships?: {
    __typename: 'MembershipsConnection'
    nodes: Array<{
      __typename: 'Membership'
      hotelRoom?: {
        __typename: 'HotelRoom'
        id: number
        type: string
        gamingRoom: boolean
        bathroomType: string
      } | null
    } | null>
  } | null
}

export type GetMembershipsByIdQueryVariables = Exact<{
  id: Scalars['Int']['input']
}>

export type GetMembershipsByIdQuery = {
  __typename: 'Query'
  memberships?: {
    __typename: 'MembershipsConnection'
    nodes: Array<{
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null>
  } | null
}

export type GetMembershipByYearAndRoomQueryVariables = Exact<{
  year: Scalars['Int']['input']
  hotelRoomId: Scalars['Int']['input']
}>

export type GetMembershipByYearAndRoomQuery = {
  __typename: 'Query'
  memberships?: {
    __typename: 'MembershipsConnection'
    nodes: Array<{
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null>
  } | null
}

export type UpdateMembershipByNodeIdMutationVariables = Exact<{
  input: UpdateMembershipByNodeIdInput
}>

export type UpdateMembershipByNodeIdMutation = {
  __typename: 'Mutation'
  updateMembershipByNodeId?: {
    __typename: 'UpdateMembershipPayload'
    membership?: {
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null
  } | null
}

export type CreateMembershipMutationVariables = Exact<{
  input: CreateMembershipInput
}>

export type CreateMembershipMutation = {
  __typename: 'Mutation'
  createMembership?: {
    __typename: 'CreateMembershipPayload'
    membership?: {
      __typename: 'Membership'
      nodeId: string
      id: number
      arrivalDate: string
      attendance: string
      attending: boolean
      hotelRoomId: number
      departureDate: string
      interestLevel: string
      message: string
      offerSubsidy: boolean
      requestOldPrice: boolean
      roomPreferenceAndNotes: string
      roomingPreferences: string
      roomingWith: string
      userId: number
      volunteer: boolean
      year: number
      slotsAttending?: string | null
      user?: {
        __typename: 'User'
        nodeId: string
        id: number
        email: string
        fullName?: string | null
        firstName?: string | null
        lastName?: string | null
        displayName?: string | null
        amountOwed: number
        profiles: {
          __typename: 'ProfilesConnection'
          nodes: Array<{
            __typename: 'Profile'
            nodeId: string
            userId: number
            phoneNumber?: string | null
            snailMailAddress?: string | null
          } | null>
        }
      } | null
      hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
    } | null
  } | null
}

export type DeleteMembershipMutationVariables = Exact<{
  input: DeleteMembershipInput
}>

export type DeleteMembershipMutation = {
  __typename: 'Mutation'
  deleteMembership?: {
    __typename: 'DeleteMembershipPayload'
    clientMutationId?: string | null
    deletedMembershipNodeId?: string | null
  } | null
}

export type GetAllMembersByQueryVariables = Exact<{
  year: Scalars['Int']['input']
  query: Scalars['String']['input']
}>

export type GetAllMembersByQuery = {
  __typename: 'Query'
  users?: {
    __typename: 'UsersConnection'
    nodes: Array<{
      __typename: 'User'
      nodeId: string
      id: number
      email: string
      fullName?: string | null
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      amountOwed: number
      memberships: {
        __typename: 'MembershipsConnection'
        nodes: Array<{
          __typename: 'Membership'
          nodeId: string
          id: number
          arrivalDate: string
          attendance: string
          attending: boolean
          hotelRoomId: number
          departureDate: string
          interestLevel: string
          message: string
          offerSubsidy: boolean
          requestOldPrice: boolean
          roomPreferenceAndNotes: string
          roomingPreferences: string
          roomingWith: string
          userId: number
          volunteer: boolean
          year: number
          slotsAttending?: string | null
          user?: {
            __typename: 'User'
            nodeId: string
            id: number
            email: string
            fullName?: string | null
            firstName?: string | null
            lastName?: string | null
            displayName?: string | null
            amountOwed: number
            profiles: {
              __typename: 'ProfilesConnection'
              nodes: Array<{
                __typename: 'Profile'
                nodeId: string
                userId: number
                phoneNumber?: string | null
                snailMailAddress?: string | null
              } | null>
            }
          } | null
          hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
        } | null>
      }
    } | null>
  } | null
}

export type MembershipFieldsFragment = {
  __typename: 'Membership'
  nodeId: string
  id: number
  arrivalDate: string
  attendance: string
  attending: boolean
  hotelRoomId: number
  departureDate: string
  interestLevel: string
  message: string
  offerSubsidy: boolean
  requestOldPrice: boolean
  roomPreferenceAndNotes: string
  roomingPreferences: string
  roomingWith: string
  userId: number
  volunteer: boolean
  year: number
  slotsAttending?: string | null
  user?: {
    __typename: 'User'
    nodeId: string
    id: number
    email: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    amountOwed: number
    profiles: {
      __typename: 'ProfilesConnection'
      nodes: Array<{
        __typename: 'Profile'
        nodeId: string
        userId: number
        phoneNumber?: string | null
        snailMailAddress?: string | null
      } | null>
    }
  } | null
  hotelRoom?: { __typename: 'HotelRoom'; type: string } | null
}

export type SettingFieldsFragment = {
  __typename: 'Setting'
  nodeId: string
  id: number
  code: string
  type: string
  value: string
}

export type GetSettingsQueryVariables = Exact<{ [key: string]: never }>

export type GetSettingsQuery = {
  __typename: 'Query'
  settings?: {
    __typename: 'SettingsConnection'
    nodes: Array<{
      __typename: 'Setting'
      nodeId: string
      id: number
      code: string
      type: string
      value: string
    } | null>
  } | null
}

export type CreateSettingMutationVariables = Exact<{
  input: CreateSettingInput
}>

export type CreateSettingMutation = {
  __typename: 'Mutation'
  createSetting?: {
    __typename: 'CreateSettingPayload'
    setting?: { __typename: 'Setting'; nodeId: string; id: number; code: string; type: string; value: string } | null
  } | null
}

export type DeleteSettingMutationVariables = Exact<{
  input: DeleteSettingInput
}>

export type DeleteSettingMutation = {
  __typename: 'Mutation'
  deleteSetting?: {
    __typename: 'DeleteSettingPayload'
    clientMutationId?: string | null
    deletedSettingNodeId?: string | null
  } | null
}

export type UpdateSettingByNodeIdMutationVariables = Exact<{
  input: UpdateSettingByNodeIdInput
}>

export type UpdateSettingByNodeIdMutation = {
  __typename: 'Mutation'
  updateSettingByNodeId?: {
    __typename: 'UpdateSettingPayload'
    setting?: { __typename: 'Setting'; nodeId: string; id: number; code: string; type: string; value: string } | null
  } | null
}

export type GetSlotsQueryVariables = Exact<{ [key: string]: never }>

export type GetSlotsQuery = {
  __typename: 'Query'
  slots?: {
    __typename: 'SlotsConnection'
    nodes: Array<{
      __typename: 'Slot'
      nodeId: string
      id: number
      slot: number
      day: string
      length: string
      time: string
    } | null>
  } | null
}

export type SlotFieldsFragment = {
  __typename: 'Slot'
  nodeId: string
  id: number
  slot: number
  day: string
  length: string
  time: string
}

export type GetStripeQueryVariables = Exact<{ [key: string]: never }>

export type GetStripeQuery = {
  __typename: 'Query'
  stripes?: {
    __typename: 'StripesConnection'
    nodes: Array<{ __typename: 'Stripe'; id: number; data: { [key: string]: any } } | null>
  } | null
}

export type CreateStripeMutationVariables = Exact<{
  input: CreateStripeInput
}>

export type CreateStripeMutation = {
  __typename: 'Mutation'
  createStripe?: { __typename: 'CreateStripePayload'; clientMutationId?: string | null } | null
}

export type GetTransactionQueryVariables = Exact<{ [key: string]: never }>

export type GetTransactionQuery = {
  __typename: 'Query'
  transactions?: {
    __typename: 'TransactionsConnection'
    nodes: Array<{
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null>
  } | null
}

export type GetTransactionByYearQueryVariables = Exact<{
  year: Scalars['Int']['input']
}>

export type GetTransactionByYearQuery = {
  __typename: 'Query'
  transactions?: {
    __typename: 'TransactionsConnection'
    nodes: Array<{
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null>
  } | null
}

export type GetTransactionByUserQueryVariables = Exact<{
  userId: Scalars['Int']['input']
}>

export type GetTransactionByUserQuery = {
  __typename: 'Query'
  transactions?: {
    __typename: 'TransactionsConnection'
    nodes: Array<{
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null>
  } | null
}

export type GetTransactionByYearAndUserQueryVariables = Exact<{
  year: Scalars['Int']['input']
  userId: Scalars['Int']['input']
}>

export type GetTransactionByYearAndUserQuery = {
  __typename: 'Query'
  transactions?: {
    __typename: 'TransactionsConnection'
    nodes: Array<{
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null>
  } | null
}

export type GetTransactionByYearAndMemberQueryVariables = Exact<{
  year: Scalars['Int']['input']
  memberId: Scalars['Int']['input']
}>

export type GetTransactionByYearAndMemberQuery = {
  __typename: 'Query'
  transactions?: {
    __typename: 'TransactionsConnection'
    nodes: Array<{
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null>
  } | null
}

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput
}>

export type CreateTransactionMutation = {
  __typename: 'Mutation'
  createTransaction?: {
    __typename: 'CreateTransactionPayload'
    transaction?: {
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null
  } | null
}

export type DeleteTransactionMutationVariables = Exact<{
  input: DeleteTransactionInput
}>

export type DeleteTransactionMutation = {
  __typename: 'Mutation'
  deleteTransaction?: {
    __typename: 'DeleteTransactionPayload'
    clientMutationId?: string | null
    deletedTransactionNodeId?: string | null
  } | null
}

export type UpdateTransactionByNodeIdMutationVariables = Exact<{
  input: UpdateTransactionByNodeIdInput
}>

export type UpdateTransactionByNodeIdMutation = {
  __typename: 'Mutation'
  updateTransactionByNodeId?: {
    __typename: 'UpdateTransactionPayload'
    transaction?: {
      __typename: 'Transaction'
      id: any
      nodeId: string
      userId: number
      memberId?: number | null
      amount: number
      origin?: number | null
      stripe: boolean
      timestamp: string
      year: number
      notes: string
      data: { [key: string]: any }
      user?: { __typename: 'User'; fullName?: string | null } | null
      userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
      member?: { __typename: 'Membership'; year: number } | null
    } | null
  } | null
}

export type TransactionFieldsFragment = {
  __typename: 'Transaction'
  id: any
  nodeId: string
  userId: number
  memberId?: number | null
  amount: number
  origin?: number | null
  stripe: boolean
  timestamp: string
  year: number
  notes: string
  data: { [key: string]: any }
  user?: { __typename: 'User'; fullName?: string | null } | null
  userByOrigin?: { __typename: 'User'; fullName?: string | null } | null
  member?: { __typename: 'Membership'; year: number } | null
}

export type GetUserByEmailQueryVariables = Exact<{
  email: Scalars['String']['input']
}>

export type GetUserByEmailQuery = {
  __typename: 'Query'
  userByEmail?: {
    __typename: 'User'
    nodeId: string
    id: number
    email: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    amountOwed: number
    profiles: {
      __typename: 'ProfilesConnection'
      nodes: Array<{
        __typename: 'Profile'
        nodeId: string
        userId: number
        phoneNumber?: string | null
        snailMailAddress?: string | null
      } | null>
    }
  } | null
}

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int']['input']
}>

export type GetUserByIdQuery = {
  __typename: 'Query'
  user?: {
    __typename: 'User'
    nodeId: string
    id: number
    email: string
    fullName?: string | null
    firstName?: string | null
    lastName?: string | null
    displayName?: string | null
    amountOwed: number
  } | null
}

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput
}>

export type UpdateUserMutation = {
  __typename: 'Mutation'
  updateUser?: {
    __typename: 'UpdateUserPayload'
    user?: {
      __typename: 'User'
      nodeId: string
      id: number
      email: string
      fullName?: string | null
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      amountOwed: number
    } | null
  } | null
}

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never }>

export type GetAllUsersQuery = {
  __typename: 'Query'
  users?: {
    __typename: 'UsersConnection'
    nodes: Array<{
      __typename: 'User'
      nodeId: string
      id: number
      email: string
      fullName?: string | null
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      amountOwed: number
    } | null>
  } | null
}

export type GetAllUsersAndProfilesQueryVariables = Exact<{ [key: string]: never }>

export type GetAllUsersAndProfilesQuery = {
  __typename: 'Query'
  users?: {
    __typename: 'UsersConnection'
    nodes: Array<{
      __typename: 'User'
      nodeId: string
      id: number
      email: string
      fullName?: string | null
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      amountOwed: number
      profiles: {
        __typename: 'ProfilesConnection'
        nodes: Array<{
          __typename: 'Profile'
          nodeId: string
          userId: number
          phoneNumber?: string | null
          snailMailAddress?: string | null
        } | null>
      }
    } | null>
  } | null
}

export type GetAllUsersByQueryVariables = Exact<{
  query: Scalars['String']['input']
}>

export type GetAllUsersByQuery = {
  __typename: 'Query'
  users?: {
    __typename: 'UsersConnection'
    nodes: Array<{
      __typename: 'User'
      nodeId: string
      id: number
      email: string
      fullName?: string | null
      firstName?: string | null
      lastName?: string | null
      displayName?: string | null
      amountOwed: number
      memberships: {
        __typename: 'MembershipsConnection'
        nodes: Array<{ __typename: 'Membership'; id: number; year: number } | null>
      }
    } | null>
  } | null
}

export type CreateProfileMutationVariables = Exact<{
  input: CreateProfileInput
}>

export type CreateProfileMutation = {
  __typename: 'Mutation'
  createProfile?: { __typename: 'CreateProfilePayload'; clientMutationId?: string | null } | null
}

export type UpdateProfileByNodeIdMutationVariables = Exact<{
  input: UpdateProfileByNodeIdInput
}>

export type UpdateProfileByNodeIdMutation = {
  __typename: 'Mutation'
  updateProfileByNodeId?: { __typename: 'UpdateProfilePayload'; clientMutationId?: string | null } | null
}

export type UserFieldsFragment = {
  __typename: 'User'
  nodeId: string
  id: number
  email: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  amountOwed: number
}

export type ProfileFieldsFragment = {
  __typename: 'Profile'
  nodeId: string
  userId: number
  phoneNumber?: string | null
  snailMailAddress?: string | null
}

export type UserAndProfileFieldsFragment = {
  __typename: 'User'
  nodeId: string
  id: number
  email: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  displayName?: string | null
  amountOwed: number
  profiles: {
    __typename: 'ProfilesConnection'
    nodes: Array<{
      __typename: 'Profile'
      nodeId: string
      userId: number
      phoneNumber?: string | null
      snailMailAddress?: string | null
    } | null>
  }
}

export const GameSubmissionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameSubmissionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameSubmission' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameSubmissionFieldsFragment, unknown>
export const GameChoiceFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameChoiceFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameChoice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameChoiceFieldsFragment, unknown>
export const GameFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameFieldsFragment, unknown>
export const GameAssignmentFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameAssignmentFieldsFragment, unknown>
export const AssignmentFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AssignmentFieldsFragment, unknown>
export const GameGmsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameGmsFragment, unknown>
export const GameRoomFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Room' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GameRoomFieldsFragment, unknown>
export const HotelRoomFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoom' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'occupancy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HotelRoomFieldsFragment, unknown>
export const HotelRoomDetailsFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomDetailsFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoomDetail' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reservedFor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'formattedRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'internalRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reserved' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HotelRoomDetailsFieldsFragment, unknown>
export const LookupFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LookupFieldsFragment, unknown>
export const LookupValuesFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LookupValuesFieldsFragment, unknown>
export const UserFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserFieldsFragment, unknown>
export const ProfileFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileFieldsFragment, unknown>
export const UserAndProfileFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserAndProfileFieldsFragment, unknown>
export const MembershipFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MembershipFieldsFragment, unknown>
export const SettingFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'settingFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Setting' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SettingFieldsFragment, unknown>
export const SlotFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'slotFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Slot' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slot' } },
          { kind: 'Field', name: { kind: 'Name', value: 'day' } },
          { kind: 'Field', name: { kind: 'Name', value: 'length' } },
          { kind: 'Field', name: { kind: 'Name', value: 'time' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SlotFieldsFragment, unknown>
export const TransactionFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TransactionFieldsFragment, unknown>
export const GetGamesBySlotForSignupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGamesBySlotForSignup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slotId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'or' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'and' },
                                value: {
                                  kind: 'ListValue',
                                  values: [
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'or' },
                                          value: {
                                            kind: 'ListValue',
                                            values: [
                                              {
                                                kind: 'ObjectValue',
                                                fields: [
                                                  {
                                                    kind: 'ObjectField',
                                                    name: { kind: 'Name', value: 'year' },
                                                    value: {
                                                      kind: 'ObjectValue',
                                                      fields: [
                                                        {
                                                          kind: 'ObjectField',
                                                          name: { kind: 'Name', value: 'equalTo' },
                                                          value: {
                                                            kind: 'Variable',
                                                            name: { kind: 'Name', value: 'year' },
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'ObjectValue',
                                                fields: [
                                                  {
                                                    kind: 'ObjectField',
                                                    name: { kind: 'Name', value: 'year' },
                                                    value: {
                                                      kind: 'ObjectValue',
                                                      fields: [
                                                        {
                                                          kind: 'ObjectField',
                                                          name: { kind: 'Name', value: 'equalTo' },
                                                          value: { kind: 'IntValue', value: '0' },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'slotId' },
                                          value: {
                                            kind: 'ObjectValue',
                                            fields: [
                                              {
                                                kind: 'ObjectField',
                                                name: { kind: 'Name', value: 'equalTo' },
                                                value: { kind: 'Variable', name: { kind: 'Name', value: 'slotId' } },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'and' },
                                value: {
                                  kind: 'ListValue',
                                  values: [
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'year' },
                                          value: {
                                            kind: 'ObjectValue',
                                            fields: [
                                              {
                                                kind: 'ObjectField',
                                                name: { kind: 'Name', value: 'equalTo' },
                                                value: { kind: 'IntValue', value: '0' },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'slotId' },
                                          value: {
                                            kind: 'ObjectValue',
                                            fields: [
                                              {
                                                kind: 'ObjectField',
                                                name: { kind: 'Name', value: 'isNull' },
                                                value: { kind: 'BooleanValue', value: true },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'YEAR_DESC' },
                    { kind: 'EnumValue', value: 'SLOT_ID_ASC' },
                    { kind: 'EnumValue', value: 'NAME_ASC' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGamesBySlotForSignupQuery, GetGamesBySlotForSignupQueryVariables>
export const GetGamesBySlotDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGamesBySlot' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slotId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'slotId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'slotId' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'SLOT_ID_ASC' },
                    { kind: 'EnumValue', value: 'NAME_ASC' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGamesBySlotQuery, GetGamesBySlotQueryVariables>
export const GetGamesByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGamesByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'or' },
                      value: {
                        kind: 'ListValue',
                        values: [
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'and' },
                                value: {
                                  kind: 'ListValue',
                                  values: [
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'or' },
                                          value: {
                                            kind: 'ListValue',
                                            values: [
                                              {
                                                kind: 'ObjectValue',
                                                fields: [
                                                  {
                                                    kind: 'ObjectField',
                                                    name: { kind: 'Name', value: 'year' },
                                                    value: {
                                                      kind: 'ObjectValue',
                                                      fields: [
                                                        {
                                                          kind: 'ObjectField',
                                                          name: { kind: 'Name', value: 'equalTo' },
                                                          value: {
                                                            kind: 'Variable',
                                                            name: { kind: 'Name', value: 'year' },
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                              {
                                                kind: 'ObjectValue',
                                                fields: [
                                                  {
                                                    kind: 'ObjectField',
                                                    name: { kind: 'Name', value: 'year' },
                                                    value: {
                                                      kind: 'ObjectValue',
                                                      fields: [
                                                        {
                                                          kind: 'ObjectField',
                                                          name: { kind: 'Name', value: 'equalTo' },
                                                          value: { kind: 'IntValue', value: '0' },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                          {
                            kind: 'ObjectValue',
                            fields: [
                              {
                                kind: 'ObjectField',
                                name: { kind: 'Name', value: 'and' },
                                value: {
                                  kind: 'ListValue',
                                  values: [
                                    {
                                      kind: 'ObjectValue',
                                      fields: [
                                        {
                                          kind: 'ObjectField',
                                          name: { kind: 'Name', value: 'year' },
                                          value: {
                                            kind: 'ObjectValue',
                                            fields: [
                                              {
                                                kind: 'ObjectField',
                                                name: { kind: 'Name', value: 'equalTo' },
                                                value: { kind: 'IntValue', value: '0' },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'YEAR_DESC' },
                    { kind: 'EnumValue', value: 'SLOT_ID_ASC' },
                    { kind: 'EnumValue', value: 'NAME_ASC' },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'room' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameRoomFields' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Room' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGamesByYearQuery, GetGamesByYearQueryVariables>
export const GetSmallGamesByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSmallGamesByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: {
                  kind: 'ListValue',
                  values: [
                    { kind: 'EnumValue', value: 'SLOT_ID_ASC' },
                    { kind: 'EnumValue', value: 'NAME_ASC' },
                  ],
                },
              },
              { kind: 'Argument', name: { kind: 'Name', value: 'first' }, value: { kind: 'IntValue', value: '1' } },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSmallGamesByYearQuery, GetSmallGamesByYearQueryVariables>
export const UpdateGameByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGameByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateGameByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGameByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'game' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameByNodeIdMutation, UpdateGameByNodeIdMutationVariables>
export const UpdateGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateGameInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'game' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>
export const CreateGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateGameInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'game' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>
export const DeleteGameDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteGame' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteGameInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteGame' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedGameNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteGameMutation, DeleteGameMutationVariables>
export const GetFirstGameOfSlotDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getFirstGameOfSlot' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'NAME_ASC' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'slotId' },
                      value: { kind: 'IntValue', value: '1' },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
              { kind: 'Argument', name: { kind: 'Name', value: 'first' }, value: { kind: 'IntValue', value: '1' } },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gameAssignments' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'filter' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'gm' },
                                  value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                      {
                                        kind: 'ObjectField',
                                        name: { kind: 'Name', value: 'lessThan' },
                                        value: { kind: 'IntValue', value: '0' },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'member' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'user' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                              { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetFirstGameOfSlotQuery, GetFirstGameOfSlotQueryVariables>
export const GetGamesByAuthorDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGamesByAuthor' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'authoredGames' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nodes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGamesByAuthorQuery, GetGamesByAuthorQueryVariables>
export const GetGamesByYearAndAuthorDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGamesByYearAndAuthor' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'games' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'authorId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGamesByYearAndAuthorQuery, GetGamesByYearAndAuthorQueryVariables>
export const GetGameByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'game' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameGms' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameGms' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'lessThan' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameByIdQuery, GetGameByIdQueryVariables>
export const GetGameAssignmentsByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameAssignmentsByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameAssignmentsByYearQuery, GetGameAssignmentsByYearQueryVariables>
export const GetGameAssignmentsByGameIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameAssignmentsByGameId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gameId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gameId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'gameId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameAssignmentsByGameIdQuery, GetGameAssignmentsByGameIdQueryVariables>
export const GetGameAssignmentsByMemberIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameAssignmentsByMemberId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameAssignmentsByMemberIdQuery, GetGameAssignmentsByMemberIdQueryVariables>
export const UpdateGameAssignmentByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGameAssignmentByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateGameAssignmentByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGameAssignmentByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameAssignment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameAssignmentByNodeIdMutation, UpdateGameAssignmentByNodeIdMutationVariables>
export const CreateGameAssignmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGameAssignment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateGameAssignmentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGameAssignment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameAssignment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameAssignmentMutation, CreateGameAssignmentMutationVariables>
export const DeleteGameAssignmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteGameAssignment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteGameAssignmentByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteGameAssignmentByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedGameAssignmentNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteGameAssignmentMutation, DeleteGameAssignmentMutationVariables>
export const GetScheduleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSchedule' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameAssignments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'gm' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'greaterThanOrEqualTo' },
                            value: { kind: 'IntValue', value: '0' },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'game' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameFields' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'gameAssignments' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'filter' },
                                  value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                      {
                                        kind: 'ObjectField',
                                        name: { kind: 'Name', value: 'gm' },
                                        value: {
                                          kind: 'ObjectValue',
                                          fields: [
                                            {
                                              kind: 'ObjectField',
                                              name: { kind: 'Name', value: 'greaterThanOrEqualTo' },
                                              value: { kind: 'IntValue', value: '0' },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'nodes' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'FragmentSpread', name: { kind: 'Name', value: 'assignmentFields' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameAssignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Game' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'genre' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'setting' } },
          { kind: 'Field', name: { kind: 'Name', value: 'charInstructions' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerMin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playerPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayers' } },
          { kind: 'Field', name: { kind: 'Name', value: 'playersContactGm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameContactEmail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'estimatedLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotPreference' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateStart' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lateFinish' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotConflicts' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'teenFriendly' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'full' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomId' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'room' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'description' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'assignmentFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameAssignment' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameAssignmentFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetScheduleQuery, GetScheduleQueryVariables>
export const CreateGameChoicesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGameChoices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slots' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createBareSlotChoices' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'yearNo' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'noSlots' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'slots' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameChoicesMutation, CreateGameChoicesMutationVariables>
export const GetGameChoicesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameChoices' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameSubmissions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameSubmissionFields' } }],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameChoices' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameChoiceFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameSubmissionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameSubmission' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameChoiceFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameChoice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameChoicesQuery, GetGameChoicesQueryVariables>
export const ReadGameChoiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'readGameChoice' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'gameChoice' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameChoiceFields' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameChoiceFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameChoice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ReadGameChoiceQuery, ReadGameChoiceQueryVariables>
export const CreateGameSubmissionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGameSubmission' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateGameSubmissionInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGameSubmission' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameSubmission' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameSubmissionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameSubmissionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameSubmission' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameSubmissionMutation, CreateGameSubmissionMutationVariables>
export const UpdateGameSubmissionByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGameSubmissionByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateGameSubmissionByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGameSubmissionByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameSubmission' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameSubmissionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameSubmissionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameSubmission' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameSubmissionByNodeIdMutation, UpdateGameSubmissionByNodeIdMutationVariables>
export const CreateGameChoiceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGameChoice' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateGameChoiceInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createGameChoice' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameChoice' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameChoiceFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameChoiceFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameChoice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameChoiceMutation, CreateGameChoiceMutationVariables>
export const UpdateGameChoiceByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGameChoiceByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateGameChoiceByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateGameChoiceByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'gameChoice' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameChoiceFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameChoiceFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'GameChoice' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'gameId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'returningPlayer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameChoiceByNodeIdMutation, UpdateGameChoiceByNodeIdMutationVariables>
export const GetGameRoomsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameRooms' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rooms' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameRoomFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Room' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameRoomsQuery, GetGameRoomsQueryVariables>
export const UpdateGameRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateGameRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateRoomInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateRoom' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'room' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameRoomFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Room' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateGameRoomMutation, UpdateGameRoomMutationVariables>
export const CreateGameRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createGameRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateRoomInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createRoom' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'room' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'gameRoomFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'gameRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Room' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'size' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updated' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateGameRoomMutation, CreateGameRoomMutationVariables>
export const DeleteGameRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteGameRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteRoomInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteRoom' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedRoomNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteGameRoomMutation, DeleteGameRoomMutationVariables>
export const GetGameRoomAndGamesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getGameRoomAndGames' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rooms' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'games' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'condition' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'year' },
                                  value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                                },
                              ],
                            },
                          },
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'orderBy' },
                            value: { kind: 'EnumValue', value: 'SLOT_ID_ASC' },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slotId' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'gmNames' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetGameRoomAndGamesQuery, GetGameRoomAndGamesQueryVariables>
export const GetHotelRoomsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getHotelRooms' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRooms' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomFields' } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoom' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'occupancy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetHotelRoomsQuery, GetHotelRoomsQueryVariables>
export const UpdateHotelRoomByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateHotelRoomByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateHotelRoomByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateHotelRoomByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hotelRoom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoom' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'occupancy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateHotelRoomByNodeIdMutation, UpdateHotelRoomByNodeIdMutationVariables>
export const CreateHotelRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createHotelRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateHotelRoomInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createHotelRoom' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hotelRoom' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoom' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'occupancy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateHotelRoomMutation, CreateHotelRoomMutationVariables>
export const DeleteHotelRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteHotelRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteHotelRoomInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteHotelRoom' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedHotelRoomNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteHotelRoomMutation, DeleteHotelRoomMutationVariables>
export const GetHotelRoomDetailsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getHotelRoomDetails' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoomDetails' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomDetailsFields' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomDetailsFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoomDetail' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reservedFor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'formattedRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'internalRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reserved' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetHotelRoomDetailsQuery, GetHotelRoomDetailsQueryVariables>
export const UpdateHotelRoomDetailByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateHotelRoomDetailByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateHotelRoomDetailByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateHotelRoomDetailByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hotelRoomDetail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomDetailsFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomDetailsFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoomDetail' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reservedFor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'formattedRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'internalRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reserved' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateHotelRoomDetailByNodeIdMutation, UpdateHotelRoomDetailByNodeIdMutationVariables>
export const CreateHotelRoomDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createHotelRoomDetail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateHotelRoomDetailInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createHotelRoomDetail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hotelRoomDetail' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'hotelRoomDetailsFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'hotelRoomDetailsFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'HotelRoomDetail' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'comment' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reservedFor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
          { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
          { kind: 'Field', name: { kind: 'Name', value: 'formattedRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'internalRoomType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'reserved' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateHotelRoomDetailMutation, CreateHotelRoomDetailMutationVariables>
export const DeleteHotelRoomDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteHotelRoomDetail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteHotelRoomDetailInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteHotelRoomDetail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedHotelRoomDetailNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteHotelRoomDetailMutation, DeleteHotelRoomDetailMutationVariables>
export const GetLookupsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getLookups' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lookups' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'REALM_ASC' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupFields' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lookupValues' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'orderBy' },
                                  value: { kind: 'EnumValue', value: 'SEQUENCER_ASC' },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'nodes' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupValuesFields' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLookupsQuery, GetLookupsQueryVariables>
export const GetLookupValuesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getLookupValues' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'realm' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lookups' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'realm' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'realm' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupFields' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lookupValues' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'orderBy' },
                                  value: { kind: 'EnumValue', value: 'VALUE_ASC' },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'nodes' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupValuesFields' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLookupValuesQuery, GetLookupValuesQueryVariables>
export const GetSingleLookupValueDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSingleLookupValue' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'realm' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'lookups' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'realm' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'realm' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupFields' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lookupValues' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'condition' },
                                  value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                      {
                                        kind: 'ObjectField',
                                        name: { kind: 'Name', value: 'code' },
                                        value: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
                                      },
                                    ],
                                  },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'nodes' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupValuesFields' } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSingleLookupValueQuery, GetSingleLookupValueQueryVariables>
export const UpdateLookupByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateLookupByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateLookupByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateLookupByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lookup' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLookupByNodeIdMutation, UpdateLookupByNodeIdMutationVariables>
export const CreateLookupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createLookup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateLookupInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLookup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lookup' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Lookup' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'realm' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLookupMutation, CreateLookupMutationVariables>
export const DeleteLookupDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteLookup' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteLookupInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteLookup' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedLookupNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteLookupMutation, DeleteLookupMutationVariables>
export const UpdateLookupValueByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateLookupValueByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateLookupValueByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateLookupValueByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lookupValue' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupValuesFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLookupValueByNodeIdMutation, UpdateLookupValueByNodeIdMutationVariables>
export const CreateLookupValueDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createLookupValue' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateLookupValueInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLookupValue' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'lookupValue' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'lookupValuesFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'lookupValuesFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LookupValue' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'sequencer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLookupValueMutation, CreateLookupValueMutationVariables>
export const DeleteLookupValueDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteLookupValue' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteLookupValueInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteLookupValue' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedLookupValueNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteLookupValueMutation, DeleteLookupValueMutationVariables>
export const GetMembershipByYearAndIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getMembershipByYearAndId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'userId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembershipByYearAndIdQuery, GetMembershipByYearAndIdQueryVariables>
export const GetMembershipsByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getMembershipsByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembershipsByYearQuery, GetMembershipsByYearQueryVariables>
export const GetMembershipRoomsByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getMembershipRoomsByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hotelRoom' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'gamingRoom' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'bathroomType' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembershipRoomsByYearQuery, GetMembershipRoomsByYearQueryVariables>
export const GetMembershipsByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getMembershipsById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'id' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembershipsByIdQuery, GetMembershipsByIdQueryVariables>
export const GetMembershipByYearAndRoomDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getMembershipByYearAndRoom' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'hotelRoomId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'memberships' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'hotelRoomId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'hotelRoomId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMembershipByYearAndRoomQuery, GetMembershipByYearAndRoomQueryVariables>
export const UpdateMembershipByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateMembershipByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateMembershipByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateMembershipByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'membership' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMembershipByNodeIdMutation, UpdateMembershipByNodeIdMutationVariables>
export const CreateMembershipDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createMembership' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateMembershipInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createMembership' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'membership' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateMembershipMutation, CreateMembershipMutationVariables>
export const DeleteMembershipDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteMembership' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteMembershipInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteMembership' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedMembershipNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteMembershipMutation, DeleteMembershipMutationVariables>
export const GetAllMembersByDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getAllMembersBy' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'LAST_NAME_ASC' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'fullName' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'includesInsensitive' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'memberships' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'condition' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'attending' },
                                  value: { kind: 'BooleanValue', value: true },
                                },
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'year' },
                                  value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'FragmentSpread', name: { kind: 'Name', value: 'membershipFields' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'membershipFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Membership' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'arrivalDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attendance' } },
          { kind: 'Field', name: { kind: 'Name', value: 'attending' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hotelRoomId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'departureDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'interestLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'offerSubsidy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'requestOldPrice' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomPreferenceAndNotes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingPreferences' } },
          { kind: 'Field', name: { kind: 'Name', value: 'roomingWith' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'volunteer' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slotsAttending' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'hotelRoom' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllMembersByQuery, GetAllMembersByQueryVariables>
export const GetSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSettings' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'settings' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'settingFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'settingFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Setting' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSettingsQuery, GetSettingsQueryVariables>
export const CreateSettingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createSetting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateSettingInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSetting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'setting' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'settingFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'settingFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Setting' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateSettingMutation, CreateSettingMutationVariables>
export const DeleteSettingDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteSetting' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteSettingInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteSetting' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedSettingNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteSettingMutation, DeleteSettingMutationVariables>
export const UpdateSettingByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateSettingByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateSettingByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSettingByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'setting' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'settingFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'settingFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Setting' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'value' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateSettingByNodeIdMutation, UpdateSettingByNodeIdMutationVariables>
export const GetSlotsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getSlots' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'slots' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'slotFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'slotFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Slot' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slot' } },
          { kind: 'Field', name: { kind: 'Name', value: 'day' } },
          { kind: 'Field', name: { kind: 'Name', value: 'length' } },
          { kind: 'Field', name: { kind: 'Name', value: 'time' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSlotsQuery, GetSlotsQueryVariables>
export const GetStripeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getStripe' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stripes' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'data' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetStripeQuery, GetStripeQueryVariables>
export const CreateStripeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createStripe' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateStripeInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createStripe' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateStripeMutation, CreateStripeMutationVariables>
export const GetTransactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTransaction' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTransactionQuery, GetTransactionQueryVariables>
export const GetTransactionByYearDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTransactionByYear' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTransactionByYearQuery, GetTransactionByYearQueryVariables>
export const GetTransactionByUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTransactionByUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'userId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTransactionByUserQuery, GetTransactionByUserQueryVariables>
export const GetTransactionByYearAndUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTransactionByYearAndUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'userId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTransactionByYearAndUserQuery, GetTransactionByYearAndUserQueryVariables>
export const GetTransactionByYearAndMemberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getTransactionByYearAndMember' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'transactions' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'year' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'year' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'memberId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'memberId' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTransactionByYearAndMemberQuery, GetTransactionByYearAndMemberQueryVariables>
export const CreateTransactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createTransaction' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateTransactionInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createTransaction' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'transaction' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>
export const DeleteTransactionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteTransaction' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteTransactionInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteTransaction' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'deletedTransactionNodeId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>
export const UpdateTransactionByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateTransactionByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateTransactionByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateTransactionByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'transaction' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'transactionFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'transactionFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Transaction' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'memberId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'origin' } },
          { kind: 'Field', name: { kind: 'Name', value: 'stripe' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'year' } },
          { kind: 'Field', name: { kind: 'Name', value: 'notes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'data' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByOrigin' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'fullName' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'member' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'year' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateTransactionByNodeIdMutation, UpdateTransactionByNodeIdMutationVariables>
export const GetUserByEmailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUserByEmail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'userByEmail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserByEmailQuery, GetUserByEmailQueryVariables>
export const GetUserByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUserById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } }],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>
export const UpdateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateUserInput' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>
export const GetAllUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getAllUsers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'LAST_NAME_ASC' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>
export const GetAllUsersAndProfilesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getAllUsersAndProfiles' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'LAST_NAME_ASC' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'userAndProfileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'profileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Profile' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'userId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'snailMailAddress' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userAndProfileFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'profiles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'profileFields' } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllUsersAndProfilesQuery, GetAllUsersAndProfilesQueryVariables>
export const GetAllUsersByDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getAllUsersBy' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'LAST_NAME_ASC' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'fullName' },
                      value: {
                        kind: 'ObjectValue',
                        fields: [
                          {
                            kind: 'ObjectField',
                            name: { kind: 'Name', value: 'includesInsensitive' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'userFields' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'memberships' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'condition' },
                            value: {
                              kind: 'ObjectValue',
                              fields: [
                                {
                                  kind: 'ObjectField',
                                  name: { kind: 'Name', value: 'attending' },
                                  value: { kind: 'BooleanValue', value: true },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'nodes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'year' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'userFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'nodeId' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'amountOwed' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAllUsersByQuery, GetAllUsersByQueryVariables>
export const CreateProfileDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createProfile' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateProfileInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProfile' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateProfileMutation, CreateProfileMutationVariables>
export const UpdateProfileByNodeIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateProfileByNodeId' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateProfileByNodeIdInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProfileByNodeId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'clientMutationId' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateProfileByNodeIdMutation, UpdateProfileByNodeIdMutationVariables>
