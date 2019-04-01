// tslint:disable
// graphql typescript definitions

declare namespace Acnw {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation
    errors?: Array<IGraphQLResponseError>
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string
    locations?: Array<IGraphQLResponseErrorLocation>
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any
  }

  interface IGraphQLResponseErrorLocation {
    line: number
    column: number
  }

  /**
   * The root query type which gives access points into the data universe.
   */
  interface IQuery {
    __typename: 'Query'

    /**
     * Exposes the root query type nested one level down. This is helpful for Relay 1
     * which can only query top level fields if they are in a particular form.
     */
    query: IQuery

    /**
     * The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`.
     */
    nodeId: string

    /**
     * Fetches an object given its globally unique `ID`.
     */
    node: Node | null

    /**
     * Reads and enables pagination through a set of `Game`.
     */
    games: IGamesConnection | null

    /**
     * Reads and enables pagination through a set of `GameAssignment`.
     */
    gameAssignments: IGameAssignmentsConnection | null

    /**
     * Reads and enables pagination through a set of `GameChoice`.
     */
    gameChoices: IGameChoicesConnection | null

    /**
     * Reads and enables pagination through a set of `GameSubmission`.
     */
    gameSubmissions: IGameSubmissionsConnection | null

    /**
     * Reads and enables pagination through a set of `HotelRoom`.
     */
    hotelRooms: IHotelRoomsConnection | null

    /**
     * Reads and enables pagination through a set of `HotelRoomDetail`.
     */
    hotelRoomDetails: IHotelRoomDetailsConnection | null

    /**
     * Reads and enables pagination through a set of `Lookup`.
     */
    lookups: ILookupsConnection | null

    /**
     * Reads and enables pagination through a set of `LookupValue`.
     */
    lookupValues: ILookupValuesConnection | null

    /**
     * Reads and enables pagination through a set of `MemberHotelRoomAssignment`.
     */
    memberHotelRoomAssignments: IMemberHotelRoomAssignmentsConnection | null

    /**
     * Reads and enables pagination through a set of `Membership`.
     */
    memberships: IMembershipsConnection | null

    /**
     * Reads and enables pagination through a set of `Profile`.
     */
    profiles: IProfilesConnection | null

    /**
     * Reads and enables pagination through a set of `RegistrationCode`.
     */
    registrationCodes: IRegistrationCodesConnection | null

    /**
     * Reads and enables pagination through a set of `Role`.
     */
    roles: IRolesConnection | null

    /**
     * Reads and enables pagination through a set of `Room`.
     */
    rooms: IRoomsConnection | null

    /**
     * Reads and enables pagination through a set of `Setting`.
     */
    settings: ISettingsConnection | null

    /**
     * Reads and enables pagination through a set of `ShirtOrder`.
     */
    shirtOrders: IShirtOrdersConnection | null

    /**
     * Reads and enables pagination through a set of `ShirtOrderItem`.
     */
    shirtOrderItems: IShirtOrderItemsConnection | null

    /**
     * Reads and enables pagination through a set of `Slot`.
     */
    slots: ISlotsConnection | null

    /**
     * Reads and enables pagination through a set of `Token`.
     */
    tokens: ITokensConnection | null

    /**
     * Reads and enables pagination through a set of `User`.
     */
    users: IUsersConnection | null

    /**
     * Reads and enables pagination through a set of `UserRole`.
     */
    userRoles: IUserRolesConnection | null
    game: IGame | null
    gameAssignment: IGameAssignment | null
    gameChoice: IGameChoice | null
    gameSubmission: IGameSubmission | null
    hotelRoom: IHotelRoom | null
    hotelRoomDetail: IHotelRoomDetail | null
    lookup: ILookup | null
    lookupByRealm: ILookup | null
    lookupValue: ILookupValue | null
    lookupValueByLookupIdAndCode: ILookupValue | null
    memberHotelRoomAssignment: IMemberHotelRoomAssignment | null
    membership: IMembership | null
    profile: IProfile | null
    profileByEmail: IProfile | null
    registrationCode: IRegistrationCode | null
    role: IRole | null
    roleByAuthority: IRole | null
    room: IRoom | null
    setting: ISetting | null
    shirtOrder: IShirtOrder | null
    shirtOrderItem: IShirtOrderItem | null
    slot: ISlot | null
    token: IToken | null
    user: IUser | null
    userByUsername: IUser | null
    userRole: IUserRole | null

    /**
     * Reads a single `Game` using its globally unique `ID`.
     */
    gameByNodeId: IGame | null

    /**
     * Reads a single `GameAssignment` using its globally unique `ID`.
     */
    gameAssignmentByNodeId: IGameAssignment | null

    /**
     * Reads a single `GameChoice` using its globally unique `ID`.
     */
    gameChoiceByNodeId: IGameChoice | null

    /**
     * Reads a single `GameSubmission` using its globally unique `ID`.
     */
    gameSubmissionByNodeId: IGameSubmission | null

    /**
     * Reads a single `HotelRoom` using its globally unique `ID`.
     */
    hotelRoomByNodeId: IHotelRoom | null

    /**
     * Reads a single `HotelRoomDetail` using its globally unique `ID`.
     */
    hotelRoomDetailByNodeId: IHotelRoomDetail | null

    /**
     * Reads a single `Lookup` using its globally unique `ID`.
     */
    lookupByNodeId: ILookup | null

    /**
     * Reads a single `LookupValue` using its globally unique `ID`.
     */
    lookupValueByNodeId: ILookupValue | null

    /**
     * Reads a single `MemberHotelRoomAssignment` using its globally unique `ID`.
     */
    memberHotelRoomAssignmentByNodeId: IMemberHotelRoomAssignment | null

    /**
     * Reads a single `Membership` using its globally unique `ID`.
     */
    membershipByNodeId: IMembership | null

    /**
     * Reads a single `Profile` using its globally unique `ID`.
     */
    profileByNodeId: IProfile | null

    /**
     * Reads a single `RegistrationCode` using its globally unique `ID`.
     */
    registrationCodeByNodeId: IRegistrationCode | null

    /**
     * Reads a single `Role` using its globally unique `ID`.
     */
    roleByNodeId: IRole | null

    /**
     * Reads a single `Room` using its globally unique `ID`.
     */
    roomByNodeId: IRoom | null

    /**
     * Reads a single `Setting` using its globally unique `ID`.
     */
    settingByNodeId: ISetting | null

    /**
     * Reads a single `ShirtOrder` using its globally unique `ID`.
     */
    shirtOrderByNodeId: IShirtOrder | null

    /**
     * Reads a single `ShirtOrderItem` using its globally unique `ID`.
     */
    shirtOrderItemByNodeId: IShirtOrderItem | null

    /**
     * Reads a single `Slot` using its globally unique `ID`.
     */
    slotByNodeId: ISlot | null

    /**
     * Reads a single `Token` using its globally unique `ID`.
     */
    tokenByNodeId: IToken | null

    /**
     * Reads a single `User` using its globally unique `ID`.
     */
    userByNodeId: IUser | null

    /**
     * Reads a single `UserRole` using its globally unique `ID`.
     */
    userRoleByNodeId: IUserRole | null
  }

  interface INodeOnQueryArguments {
    /**
     * The globally unique `ID`.
     */
    nodeId: string
  }

  interface IGamesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameFilter | null
  }

  interface IGameAssignmentsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameAssignmentFilter | null
  }

  interface IGameChoicesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameChoiceCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameChoiceFilter | null
  }

  interface IGameSubmissionsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameSubmission`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameSubmissionsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameSubmissionCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameSubmissionFilter | null
  }

  interface IHotelRoomsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `HotelRoom`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IHotelRoomCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IHotelRoomFilter | null
  }

  interface IHotelRoomDetailsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `HotelRoomDetail`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomDetailsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IHotelRoomDetailCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IHotelRoomDetailFilter | null
  }

  interface ILookupsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Lookup`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ILookupCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ILookupFilter | null
  }

  interface ILookupValuesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `LookupValue`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupValuesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ILookupValueCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ILookupValueFilter | null
  }

  interface IMemberHotelRoomAssignmentsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMemberHotelRoomAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMemberHotelRoomAssignmentFilter | null
  }

  interface IMembershipsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMembershipCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMembershipFilter | null
  }

  interface IProfilesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Profile`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ProfilesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IProfileCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IProfileFilter | null
  }

  interface IRegistrationCodesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `RegistrationCode`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RegistrationCodesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IRegistrationCodeCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IRegistrationCodeFilter | null
  }

  interface IRolesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Role`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RolesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IRoleCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IRoleFilter | null
  }

  interface IRoomsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Room`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RoomsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IRoomCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IRoomFilter | null
  }

  interface ISettingsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Setting`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SettingsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ISettingCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ISettingFilter | null
  }

  interface IShirtOrdersOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `ShirtOrder`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrdersOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IShirtOrderCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IShirtOrderFilter | null
  }

  interface IShirtOrderItemsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `ShirtOrderItem`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrderItemsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IShirtOrderItemCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IShirtOrderItemFilter | null
  }

  interface ISlotsOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Slot`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SlotsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ISlotCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ISlotFilter | null
  }

  interface ITokensOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Token`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<TokensOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ITokenCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ITokenFilter | null
  }

  interface IUsersOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `User`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UsersOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IUserCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IUserFilter | null
  }

  interface IUserRolesOnQueryArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IUserRoleCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IUserRoleFilter | null
  }

  interface IGameOnQueryArguments {
    id: number
  }

  interface IGameAssignmentOnQueryArguments {
    memberId: number
    gameId: number
    gm: number
  }

  interface IGameChoiceOnQueryArguments {
    id: number
  }

  interface IGameSubmissionOnQueryArguments {
    id: number
  }

  interface IHotelRoomOnQueryArguments {
    id: number
  }

  interface IHotelRoomDetailOnQueryArguments {
    id: any
  }

  interface ILookupOnQueryArguments {
    id: number
  }

  interface ILookupByRealmOnQueryArguments {
    realm: string
  }

  interface ILookupValueOnQueryArguments {
    id: number
  }

  interface ILookupValueByLookupIdAndCodeOnQueryArguments {
    lookupId: number
    code: string
  }

  interface IMemberHotelRoomAssignmentOnQueryArguments {
    memberId: any
    hotelRoomId: any
  }

  interface IMembershipOnQueryArguments {
    id: number
  }

  interface IProfileOnQueryArguments {
    id: number
  }

  interface IProfileByEmailOnQueryArguments {
    email: string
  }

  interface IRegistrationCodeOnQueryArguments {
    id: number
  }

  interface IRoleOnQueryArguments {
    id: number
  }

  interface IRoleByAuthorityOnQueryArguments {
    authority: string
  }

  interface IRoomOnQueryArguments {
    id: number
  }

  interface ISettingOnQueryArguments {
    id: number
  }

  interface IShirtOrderOnQueryArguments {
    id: number
  }

  interface IShirtOrderItemOnQueryArguments {
    id: number
  }

  interface ISlotOnQueryArguments {
    id: number
  }

  interface ITokenOnQueryArguments {
    id: number
  }

  interface IUserOnQueryArguments {
    id: number
  }

  interface IUserByUsernameOnQueryArguments {
    username: string
  }

  interface IUserRoleOnQueryArguments {
    roleId: number
    userId: number
  }

  interface IGameByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Game`.
     */
    nodeId: string
  }

  interface IGameAssignmentByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `GameAssignment`.
     */
    nodeId: string
  }

  interface IGameChoiceByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `GameChoice`.
     */
    nodeId: string
  }

  interface IGameSubmissionByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `GameSubmission`.
     */
    nodeId: string
  }

  interface IHotelRoomByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `HotelRoom`.
     */
    nodeId: string
  }

  interface IHotelRoomDetailByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `HotelRoomDetail`.
     */
    nodeId: string
  }

  interface ILookupByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Lookup`.
     */
    nodeId: string
  }

  interface ILookupValueByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `LookupValue`.
     */
    nodeId: string
  }

  interface IMemberHotelRoomAssignmentByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `MemberHotelRoomAssignment`.
     */
    nodeId: string
  }

  interface IMembershipByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Membership`.
     */
    nodeId: string
  }

  interface IProfileByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Profile`.
     */
    nodeId: string
  }

  interface IRegistrationCodeByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `RegistrationCode`.
     */
    nodeId: string
  }

  interface IRoleByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Role`.
     */
    nodeId: string
  }

  interface IRoomByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Room`.
     */
    nodeId: string
  }

  interface ISettingByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Setting`.
     */
    nodeId: string
  }

  interface IShirtOrderByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `ShirtOrder`.
     */
    nodeId: string
  }

  interface IShirtOrderItemByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `ShirtOrderItem`.
     */
    nodeId: string
  }

  interface ISlotByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Slot`.
     */
    nodeId: string
  }

  interface ITokenByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `Token`.
     */
    nodeId: string
  }

  interface IUserByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `User`.
     */
    nodeId: string
  }

  interface IUserRoleByNodeIdOnQueryArguments {
    /**
     * The globally unique `ID` to be used in selecting a single `UserRole`.
     */
    nodeId: string
  }

  /**
   * An object with a globally unique `ID`.
   */
  type Node =
    | IQuery
    | IGame
    | IRoom
    | ISlot
    | IGameChoice
    | IMembership
    | IHotelRoom
    | IUser
    | IProfile
    | IShirtOrder
    | IShirtOrderItem
    | IUserRole
    | IRole
    | IToken
    | IGameAssignment
    | IGameSubmission
    | IMemberHotelRoomAssignment
    | IHotelRoomDetail
    | ILookup
    | ILookupValue
    | IRegistrationCode
    | ISetting

  /**
   * An object with a globally unique `ID`.
   */
  interface INode {
    __typename: 'Node'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
  }

  /**
   * Methods to use when ordering `Game`.
   */
  const enum GamesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    DESCRIPTION_ASC = 'DESCRIPTION_ASC',
    DESCRIPTION_DESC = 'DESCRIPTION_DESC',
    LATE_FINISH_ASC = 'LATE_FINISH_ASC',
    LATE_FINISH_DESC = 'LATE_FINISH_DESC',
    LATE_START_ASC = 'LATE_START_ASC',
    LATE_START_DESC = 'LATE_START_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
    PLAYER_MAX_ASC = 'PLAYER_MAX_ASC',
    PLAYER_MAX_DESC = 'PLAYER_MAX_DESC',
    PLAYER_MIN_ASC = 'PLAYER_MIN_ASC',
    PLAYER_MIN_DESC = 'PLAYER_MIN_DESC',
    ROOM_ID_ASC = 'ROOM_ID_ASC',
    ROOM_ID_DESC = 'ROOM_ID_DESC',
    SHORT_NAME_ASC = 'SHORT_NAME_ASC',
    SHORT_NAME_DESC = 'SHORT_NAME_DESC',
    SLOT_ID_ASC = 'SLOT_ID_ASC',
    SLOT_ID_DESC = 'SLOT_ID_DESC',
    CHAR_INSTRUCTIONS_ASC = 'CHAR_INSTRUCTIONS_ASC',
    CHAR_INSTRUCTIONS_DESC = 'CHAR_INSTRUCTIONS_DESC',
    ESTIMATED_LENGTH_ASC = 'ESTIMATED_LENGTH_ASC',
    ESTIMATED_LENGTH_DESC = 'ESTIMATED_LENGTH_DESC',
    GAME_CONTACT_EMAIL_ASC = 'GAME_CONTACT_EMAIL_ASC',
    GAME_CONTACT_EMAIL_DESC = 'GAME_CONTACT_EMAIL_DESC',
    GENRE_ASC = 'GENRE_ASC',
    GENRE_DESC = 'GENRE_DESC',
    GM_NAMES_ASC = 'GM_NAMES_ASC',
    GM_NAMES_DESC = 'GM_NAMES_DESC',
    MESSAGE_ASC = 'MESSAGE_ASC',
    MESSAGE_DESC = 'MESSAGE_DESC',
    PLAYER_PREFERENCE_ASC = 'PLAYER_PREFERENCE_ASC',
    PLAYER_PREFERENCE_DESC = 'PLAYER_PREFERENCE_DESC',
    PLAYERS_CONTACT_GM_ASC = 'PLAYERS_CONTACT_GM_ASC',
    PLAYERS_CONTACT_GM_DESC = 'PLAYERS_CONTACT_GM_DESC',
    RETURNING_PLAYERS_ASC = 'RETURNING_PLAYERS_ASC',
    RETURNING_PLAYERS_DESC = 'RETURNING_PLAYERS_DESC',
    SETTING_ASC = 'SETTING_ASC',
    SETTING_DESC = 'SETTING_DESC',
    SLOT_CONFLICTS_ASC = 'SLOT_CONFLICTS_ASC',
    SLOT_CONFLICTS_DESC = 'SLOT_CONFLICTS_DESC',
    SLOT_PREFERENCE_ASC = 'SLOT_PREFERENCE_ASC',
    SLOT_PREFERENCE_DESC = 'SLOT_PREFERENCE_DESC',
    TEEN_FRIENDLY_ASC = 'TEEN_FRIENDLY_ASC',
    TEEN_FRIENDLY_DESC = 'TEEN_FRIENDLY_DESC',
    TYPE_ASC = 'TYPE_ASC',
    TYPE_DESC = 'TYPE_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    AUTHOR_ID_ASC = 'AUTHOR_ID_ASC',
    AUTHOR_ID_DESC = 'AUTHOR_ID_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    ROOM_BY_ROOM_ID__ID_ASC = 'ROOM_BY_ROOM_ID__ID_ASC',
    ROOM_BY_ROOM_ID__ID_DESC = 'ROOM_BY_ROOM_ID__ID_DESC',
    ROOM_BY_ROOM_ID__DESCRIPTION_ASC = 'ROOM_BY_ROOM_ID__DESCRIPTION_ASC',
    ROOM_BY_ROOM_ID__DESCRIPTION_DESC = 'ROOM_BY_ROOM_ID__DESCRIPTION_DESC',
    ROOM_BY_ROOM_ID__SIZE_ASC = 'ROOM_BY_ROOM_ID__SIZE_ASC',
    ROOM_BY_ROOM_ID__SIZE_DESC = 'ROOM_BY_ROOM_ID__SIZE_DESC',
    ROOM_BY_ROOM_ID__TYPE_ASC = 'ROOM_BY_ROOM_ID__TYPE_ASC',
    ROOM_BY_ROOM_ID__TYPE_DESC = 'ROOM_BY_ROOM_ID__TYPE_DESC',
    ROOM_BY_ROOM_ID__UPDATED_ASC = 'ROOM_BY_ROOM_ID__UPDATED_ASC',
    ROOM_BY_ROOM_ID__UPDATED_DESC = 'ROOM_BY_ROOM_ID__UPDATED_DESC',
    SLOT_BY_SLOT_ID__ID_ASC = 'SLOT_BY_SLOT_ID__ID_ASC',
    SLOT_BY_SLOT_ID__ID_DESC = 'SLOT_BY_SLOT_ID__ID_DESC',
    SLOT_BY_SLOT_ID__SLOT_ASC = 'SLOT_BY_SLOT_ID__SLOT_ASC',
    SLOT_BY_SLOT_ID__SLOT_DESC = 'SLOT_BY_SLOT_ID__SLOT_DESC',
    SLOT_BY_SLOT_ID__DAY_ASC = 'SLOT_BY_SLOT_ID__DAY_ASC',
    SLOT_BY_SLOT_ID__DAY_DESC = 'SLOT_BY_SLOT_ID__DAY_DESC',
    SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC',
    SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC',
    SLOT_BY_SLOT_ID__LENGTH_ASC = 'SLOT_BY_SLOT_ID__LENGTH_ASC',
    SLOT_BY_SLOT_ID__LENGTH_DESC = 'SLOT_BY_SLOT_ID__LENGTH_DESC',
    SLOT_BY_SLOT_ID__TIME_ASC = 'SLOT_BY_SLOT_ID__TIME_ASC',
    SLOT_BY_SLOT_ID__TIME_DESC = 'SLOT_BY_SLOT_ID__TIME_DESC',
    USER_BY_AUTHOR_ID__ID_ASC = 'USER_BY_AUTHOR_ID__ID_ASC',
    USER_BY_AUTHOR_ID__ID_DESC = 'USER_BY_AUTHOR_ID__ID_DESC',
    USER_BY_AUTHOR_ID__ACCOUNT_LOCKED_ASC = 'USER_BY_AUTHOR_ID__ACCOUNT_LOCKED_ASC',
    USER_BY_AUTHOR_ID__ACCOUNT_LOCKED_DESC = 'USER_BY_AUTHOR_ID__ACCOUNT_LOCKED_DESC',
    USER_BY_AUTHOR_ID__ENABLED_ASC = 'USER_BY_AUTHOR_ID__ENABLED_ASC',
    USER_BY_AUTHOR_ID__ENABLED_DESC = 'USER_BY_AUTHOR_ID__ENABLED_DESC',
    USER_BY_AUTHOR_ID__PASSWORD_ASC = 'USER_BY_AUTHOR_ID__PASSWORD_ASC',
    USER_BY_AUTHOR_ID__PASSWORD_DESC = 'USER_BY_AUTHOR_ID__PASSWORD_DESC',
    USER_BY_AUTHOR_ID__PROFILE_ID_ASC = 'USER_BY_AUTHOR_ID__PROFILE_ID_ASC',
    USER_BY_AUTHOR_ID__PROFILE_ID_DESC = 'USER_BY_AUTHOR_ID__PROFILE_ID_DESC',
    USER_BY_AUTHOR_ID__USERNAME_ASC = 'USER_BY_AUTHOR_ID__USERNAME_ASC',
    USER_BY_AUTHOR_ID__USERNAME_DESC = 'USER_BY_AUTHOR_ID__USERNAME_DESC',
    GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_ASC = 'GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_ASC',
    GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_DESC = 'GAME_ASSIGNMENTS_BY_GAME_ID__COUNT_DESC',
    GAME_CHOICES_BY_GAME_ID__COUNT_ASC = 'GAME_CHOICES_BY_GAME_ID__COUNT_ASC',
    GAME_CHOICES_BY_GAME_ID__COUNT_DESC = 'GAME_CHOICES_BY_GAME_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Game` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface IGameCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `description` field.
     */
    description?: string | null

    /**
     * Checks for equality with the object’s `lateFinish` field.
     */
    lateFinish?: boolean | null

    /**
     * Checks for equality with the object’s `lateStart` field.
     */
    lateStart?: string | null

    /**
     * Checks for equality with the object’s `name` field.
     */
    name?: string | null

    /**
     * Checks for equality with the object’s `playerMax` field.
     */
    playerMax?: number | null

    /**
     * Checks for equality with the object’s `playerMin` field.
     */
    playerMin?: number | null

    /**
     * Checks for equality with the object’s `roomId` field.
     */
    roomId?: number | null

    /**
     * Checks for equality with the object’s `shortName` field.
     */
    shortName?: string | null

    /**
     * Checks for equality with the object’s `slotId` field.
     */
    slotId?: number | null

    /**
     * Checks for equality with the object’s `charInstructions` field.
     */
    charInstructions?: string | null

    /**
     * Checks for equality with the object’s `estimatedLength` field.
     */
    estimatedLength?: string | null

    /**
     * Checks for equality with the object’s `gameContactEmail` field.
     */
    gameContactEmail?: string | null

    /**
     * Checks for equality with the object’s `genre` field.
     */
    genre?: string | null

    /**
     * Checks for equality with the object’s `gmNames` field.
     */
    gmNames?: string | null

    /**
     * Checks for equality with the object’s `message` field.
     */
    message?: string | null

    /**
     * Checks for equality with the object’s `playerPreference` field.
     */
    playerPreference?: string | null

    /**
     * Checks for equality with the object’s `playersContactGm` field.
     */
    playersContactGm?: boolean | null

    /**
     * Checks for equality with the object’s `returningPlayers` field.
     */
    returningPlayers?: string | null

    /**
     * Checks for equality with the object’s `setting` field.
     */
    setting?: string | null

    /**
     * Checks for equality with the object’s `slotConflicts` field.
     */
    slotConflicts?: string | null

    /**
     * Checks for equality with the object’s `slotPreference` field.
     */
    slotPreference?: number | null

    /**
     * Checks for equality with the object’s `teenFriendly` field.
     */
    teenFriendly?: boolean | null

    /**
     * Checks for equality with the object’s `type` field.
     */
    type?: string | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null

    /**
     * Checks for equality with the object’s `authorId` field.
     */
    authorId?: number | null
  }

  /**
   * A filter to be used against `Game` object types. All fields are combined with a logical ‘and.’
   */
  interface IGameFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `description` field.
     */
    description?: IStringFilter | null

    /**
     * Filter by the object’s `lateFinish` field.
     */
    lateFinish?: IBooleanFilter | null

    /**
     * Filter by the object’s `lateStart` field.
     */
    lateStart?: IStringFilter | null

    /**
     * Filter by the object’s `name` field.
     */
    name?: IStringFilter | null

    /**
     * Filter by the object’s `playerMax` field.
     */
    playerMax?: IIntFilter | null

    /**
     * Filter by the object’s `playerMin` field.
     */
    playerMin?: IIntFilter | null

    /**
     * Filter by the object’s `roomId` field.
     */
    roomId?: IIntFilter | null

    /**
     * Filter by the object’s `shortName` field.
     */
    shortName?: IStringFilter | null

    /**
     * Filter by the object’s `slotId` field.
     */
    slotId?: IIntFilter | null

    /**
     * Filter by the object’s `charInstructions` field.
     */
    charInstructions?: IStringFilter | null

    /**
     * Filter by the object’s `estimatedLength` field.
     */
    estimatedLength?: IStringFilter | null

    /**
     * Filter by the object’s `gameContactEmail` field.
     */
    gameContactEmail?: IStringFilter | null

    /**
     * Filter by the object’s `genre` field.
     */
    genre?: IStringFilter | null

    /**
     * Filter by the object’s `gmNames` field.
     */
    gmNames?: IStringFilter | null

    /**
     * Filter by the object’s `message` field.
     */
    message?: IStringFilter | null

    /**
     * Filter by the object’s `playerPreference` field.
     */
    playerPreference?: IStringFilter | null

    /**
     * Filter by the object’s `playersContactGm` field.
     */
    playersContactGm?: IBooleanFilter | null

    /**
     * Filter by the object’s `returningPlayers` field.
     */
    returningPlayers?: IStringFilter | null

    /**
     * Filter by the object’s `setting` field.
     */
    setting?: IStringFilter | null

    /**
     * Filter by the object’s `slotConflicts` field.
     */
    slotConflicts?: IStringFilter | null

    /**
     * Filter by the object’s `slotPreference` field.
     */
    slotPreference?: IIntFilter | null

    /**
     * Filter by the object’s `teenFriendly` field.
     */
    teenFriendly?: IBooleanFilter | null

    /**
     * Filter by the object’s `type` field.
     */
    type?: IStringFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Filter by the object’s `authorId` field.
     */
    authorId?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IGameFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IGameFilter> | null

    /**
     * Negates the expression.
     */
    not?: IGameFilter | null
  }

  /**
   * A filter to be used against Int fields. All fields are combined with a logical ‘and.’
   */
  interface IIntFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: number | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: number | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: number | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: number | null

    /**
     * Included in the specified list.
     */
    in?: Array<number> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<number> | null

    /**
     * Less than the specified value.
     */
    lessThan?: number | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: number | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: number | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: number | null
  }

  /**
   * A filter to be used against String fields. All fields are combined with a logical ‘and.’
   */
  interface IStringFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: string | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: string | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: string | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: string | null

    /**
     * Included in the specified list.
     */
    in?: Array<string> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<string> | null

    /**
     * Less than the specified value.
     */
    lessThan?: string | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: string | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: string | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: string | null

    /**
     * Contains the specified string (case-sensitive).
     */
    includes?: string | null

    /**
     * Does not contain the specified string (case-sensitive).
     */
    notIncludes?: string | null

    /**
     * Contains the specified string (case-insensitive).
     */
    includesInsensitive?: string | null

    /**
     * Does not contain the specified string (case-insensitive).
     */
    notIncludesInsensitive?: string | null

    /**
     * Starts with the specified string (case-sensitive).
     */
    startsWith?: string | null

    /**
     * Does not start with the specified string (case-sensitive).
     */
    notStartsWith?: string | null

    /**
     * Starts with the specified string (case-insensitive).
     */
    startsWithInsensitive?: string | null

    /**
     * Does not start with the specified string (case-insensitive).
     */
    notStartsWithInsensitive?: string | null

    /**
     * Ends with the specified string (case-sensitive).
     */
    endsWith?: string | null

    /**
     * Does not end with the specified string (case-sensitive).
     */
    notEndsWith?: string | null

    /**
     * Ends with the specified string (case-insensitive).
     */
    endsWithInsensitive?: string | null

    /**
     * Does not end with the specified string (case-insensitive).
     */
    notEndsWithInsensitive?: string | null

    /**
     * Matches the specified pattern (case-sensitive). An underscore (_) matches any
     * single character; a percent sign (%) matches any sequence of zero or more characters.
     */
    like?: string | null

    /**
     * Does not match the specified pattern (case-sensitive). An underscore (_)
     * matches any single character; a percent sign (%) matches any sequence of zero
     * or more characters.
     */
    notLike?: string | null

    /**
     * Matches the specified pattern (case-insensitive). An underscore (_) matches
     * any single character; a percent sign (%) matches any sequence of zero or more characters.
     */
    likeInsensitive?: string | null

    /**
     * Does not match the specified pattern (case-insensitive). An underscore (_)
     * matches any single character; a percent sign (%) matches any sequence of zero
     * or more characters.
     */
    notLikeInsensitive?: string | null

    /**
     * Matches the specified pattern using the SQL standard's definition of a regular expression.
     */
    similarTo?: string | null

    /**
     * Does not match the specified pattern using the SQL standard's definition of a regular expression.
     */
    notSimilarTo?: string | null
  }

  /**
   * A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’
   */
  interface IBooleanFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: boolean | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: boolean | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: boolean | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: boolean | null

    /**
     * Included in the specified list.
     */
    in?: Array<boolean> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<boolean> | null

    /**
     * Less than the specified value.
     */
    lessThan?: boolean | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: boolean | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: boolean | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: boolean | null
  }

  /**
   * A connection to a list of `Game` values.
   */
  interface IGamesConnection {
    __typename: 'GamesConnection'

    /**
     * A list of `Game` objects.
     */
    nodes: Array<IGame | null>

    /**
     * A list of edges which contains the `Game` and cursor to aid in pagination.
     */
    edges: Array<IGamesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Game` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IGame {
    __typename: 'Game'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    description: string
    lateFinish: boolean | null
    lateStart: string | null
    name: string
    playerMax: number
    playerMin: number
    roomId: number | null
    shortName: string | null
    slotId: number | null
    charInstructions: string
    estimatedLength: string
    gameContactEmail: string
    genre: string
    gmNames: string | null
    message: string
    playerPreference: string
    playersContactGm: boolean
    returningPlayers: string
    setting: string
    slotConflicts: string
    slotPreference: number
    teenFriendly: boolean
    type: string
    year: number
    authorId: number | null

    /**
     * Reads a single `Room` that is related to this `Game`.
     */
    room: IRoom | null

    /**
     * Reads a single `Slot` that is related to this `Game`.
     */
    slot: ISlot | null

    /**
     * Reads a single `User` that is related to this `Game`.
     */
    author: IUser | null

    /**
     * Reads and enables pagination through a set of `GameAssignment`.
     */
    gameAssignments: IGameAssignmentsConnection

    /**
     * Reads and enables pagination through a set of `GameChoice`.
     */
    gameChoices: IGameChoicesConnection
  }

  interface IGameAssignmentsOnGameArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameAssignmentFilter | null
  }

  interface IGameChoicesOnGameArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameChoiceCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameChoiceFilter | null
  }

  interface IRoom {
    __typename: 'Room'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    description: string
    size: number
    type: string
    updated: boolean

    /**
     * Reads and enables pagination through a set of `Game`.
     */
    games: IGamesConnection
  }

  interface IGamesOnRoomArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameFilter | null
  }

  interface ISlot {
    __typename: 'Slot'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    slot: number
    day: string
    formattedDate: string
    length: string
    time: string

    /**
     * Reads and enables pagination through a set of `Game`.
     */
    games: IGamesConnection

    /**
     * Reads and enables pagination through a set of `GameChoice`.
     */
    gameChoices: IGameChoicesConnection
  }

  interface IGamesOnSlotArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameFilter | null
  }

  interface IGameChoicesOnSlotArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameChoiceCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameChoiceFilter | null
  }

  /**
   * Methods to use when ordering `GameChoice`.
   */
  const enum GameChoicesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    GAME_ID_ASC = 'GAME_ID_ASC',
    GAME_ID_DESC = 'GAME_ID_DESC',
    MEMBER_ID_ASC = 'MEMBER_ID_ASC',
    MEMBER_ID_DESC = 'MEMBER_ID_DESC',
    RANK_ASC = 'RANK_ASC',
    RANK_DESC = 'RANK_DESC',
    SLOT_ID_ASC = 'SLOT_ID_ASC',
    SLOT_ID_DESC = 'SLOT_ID_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    RETURNING_PLAYER_ASC = 'RETURNING_PLAYER_ASC',
    RETURNING_PLAYER_DESC = 'RETURNING_PLAYER_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    GAME_BY_GAME_ID__ID_ASC = 'GAME_BY_GAME_ID__ID_ASC',
    GAME_BY_GAME_ID__ID_DESC = 'GAME_BY_GAME_ID__ID_DESC',
    GAME_BY_GAME_ID__DESCRIPTION_ASC = 'GAME_BY_GAME_ID__DESCRIPTION_ASC',
    GAME_BY_GAME_ID__DESCRIPTION_DESC = 'GAME_BY_GAME_ID__DESCRIPTION_DESC',
    GAME_BY_GAME_ID__LATE_FINISH_ASC = 'GAME_BY_GAME_ID__LATE_FINISH_ASC',
    GAME_BY_GAME_ID__LATE_FINISH_DESC = 'GAME_BY_GAME_ID__LATE_FINISH_DESC',
    GAME_BY_GAME_ID__LATE_START_ASC = 'GAME_BY_GAME_ID__LATE_START_ASC',
    GAME_BY_GAME_ID__LATE_START_DESC = 'GAME_BY_GAME_ID__LATE_START_DESC',
    GAME_BY_GAME_ID__NAME_ASC = 'GAME_BY_GAME_ID__NAME_ASC',
    GAME_BY_GAME_ID__NAME_DESC = 'GAME_BY_GAME_ID__NAME_DESC',
    GAME_BY_GAME_ID__PLAYER_MAX_ASC = 'GAME_BY_GAME_ID__PLAYER_MAX_ASC',
    GAME_BY_GAME_ID__PLAYER_MAX_DESC = 'GAME_BY_GAME_ID__PLAYER_MAX_DESC',
    GAME_BY_GAME_ID__PLAYER_MIN_ASC = 'GAME_BY_GAME_ID__PLAYER_MIN_ASC',
    GAME_BY_GAME_ID__PLAYER_MIN_DESC = 'GAME_BY_GAME_ID__PLAYER_MIN_DESC',
    GAME_BY_GAME_ID__ROOM_ID_ASC = 'GAME_BY_GAME_ID__ROOM_ID_ASC',
    GAME_BY_GAME_ID__ROOM_ID_DESC = 'GAME_BY_GAME_ID__ROOM_ID_DESC',
    GAME_BY_GAME_ID__SHORT_NAME_ASC = 'GAME_BY_GAME_ID__SHORT_NAME_ASC',
    GAME_BY_GAME_ID__SHORT_NAME_DESC = 'GAME_BY_GAME_ID__SHORT_NAME_DESC',
    GAME_BY_GAME_ID__SLOT_ID_ASC = 'GAME_BY_GAME_ID__SLOT_ID_ASC',
    GAME_BY_GAME_ID__SLOT_ID_DESC = 'GAME_BY_GAME_ID__SLOT_ID_DESC',
    GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC',
    GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC',
    GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC',
    GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC',
    GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC',
    GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC',
    GAME_BY_GAME_ID__GENRE_ASC = 'GAME_BY_GAME_ID__GENRE_ASC',
    GAME_BY_GAME_ID__GENRE_DESC = 'GAME_BY_GAME_ID__GENRE_DESC',
    GAME_BY_GAME_ID__GM_NAMES_ASC = 'GAME_BY_GAME_ID__GM_NAMES_ASC',
    GAME_BY_GAME_ID__GM_NAMES_DESC = 'GAME_BY_GAME_ID__GM_NAMES_DESC',
    GAME_BY_GAME_ID__MESSAGE_ASC = 'GAME_BY_GAME_ID__MESSAGE_ASC',
    GAME_BY_GAME_ID__MESSAGE_DESC = 'GAME_BY_GAME_ID__MESSAGE_DESC',
    GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC',
    GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC',
    GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC',
    GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC',
    GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC',
    GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC',
    GAME_BY_GAME_ID__SETTING_ASC = 'GAME_BY_GAME_ID__SETTING_ASC',
    GAME_BY_GAME_ID__SETTING_DESC = 'GAME_BY_GAME_ID__SETTING_DESC',
    GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC',
    GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC',
    GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC',
    GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC',
    GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC',
    GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC',
    GAME_BY_GAME_ID__TYPE_ASC = 'GAME_BY_GAME_ID__TYPE_ASC',
    GAME_BY_GAME_ID__TYPE_DESC = 'GAME_BY_GAME_ID__TYPE_DESC',
    GAME_BY_GAME_ID__YEAR_ASC = 'GAME_BY_GAME_ID__YEAR_ASC',
    GAME_BY_GAME_ID__YEAR_DESC = 'GAME_BY_GAME_ID__YEAR_DESC',
    GAME_BY_GAME_ID__AUTHOR_ID_ASC = 'GAME_BY_GAME_ID__AUTHOR_ID_ASC',
    GAME_BY_GAME_ID__AUTHOR_ID_DESC = 'GAME_BY_GAME_ID__AUTHOR_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC',
    SLOT_BY_SLOT_ID__ID_ASC = 'SLOT_BY_SLOT_ID__ID_ASC',
    SLOT_BY_SLOT_ID__ID_DESC = 'SLOT_BY_SLOT_ID__ID_DESC',
    SLOT_BY_SLOT_ID__SLOT_ASC = 'SLOT_BY_SLOT_ID__SLOT_ASC',
    SLOT_BY_SLOT_ID__SLOT_DESC = 'SLOT_BY_SLOT_ID__SLOT_DESC',
    SLOT_BY_SLOT_ID__DAY_ASC = 'SLOT_BY_SLOT_ID__DAY_ASC',
    SLOT_BY_SLOT_ID__DAY_DESC = 'SLOT_BY_SLOT_ID__DAY_DESC',
    SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_ASC',
    SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC = 'SLOT_BY_SLOT_ID__FORMATTED_DATE_DESC',
    SLOT_BY_SLOT_ID__LENGTH_ASC = 'SLOT_BY_SLOT_ID__LENGTH_ASC',
    SLOT_BY_SLOT_ID__LENGTH_DESC = 'SLOT_BY_SLOT_ID__LENGTH_DESC',
    SLOT_BY_SLOT_ID__TIME_ASC = 'SLOT_BY_SLOT_ID__TIME_ASC',
    SLOT_BY_SLOT_ID__TIME_DESC = 'SLOT_BY_SLOT_ID__TIME_DESC'
  }

  /**
   * A condition to be used against `GameChoice` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface IGameChoiceCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `gameId` field.
     */
    gameId?: number | null

    /**
     * Checks for equality with the object’s `memberId` field.
     */
    memberId?: number | null

    /**
     * Checks for equality with the object’s `rank` field.
     */
    rank?: number | null

    /**
     * Checks for equality with the object’s `slotId` field.
     */
    slotId?: number | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null

    /**
     * Checks for equality with the object’s `returningPlayer` field.
     */
    returningPlayer?: boolean | null
  }

  /**
   * A filter to be used against `GameChoice` object types. All fields are combined with a logical ‘and.’
   */
  interface IGameChoiceFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `gameId` field.
     */
    gameId?: IIntFilter | null

    /**
     * Filter by the object’s `memberId` field.
     */
    memberId?: IIntFilter | null

    /**
     * Filter by the object’s `rank` field.
     */
    rank?: IIntFilter | null

    /**
     * Filter by the object’s `slotId` field.
     */
    slotId?: IIntFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Filter by the object’s `returningPlayer` field.
     */
    returningPlayer?: IBooleanFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IGameChoiceFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IGameChoiceFilter> | null

    /**
     * Negates the expression.
     */
    not?: IGameChoiceFilter | null
  }

  /**
   * A connection to a list of `GameChoice` values.
   */
  interface IGameChoicesConnection {
    __typename: 'GameChoicesConnection'

    /**
     * A list of `GameChoice` objects.
     */
    nodes: Array<IGameChoice | null>

    /**
     * A list of edges which contains the `GameChoice` and cursor to aid in pagination.
     */
    edges: Array<IGameChoicesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `GameChoice` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IGameChoice {
    __typename: 'GameChoice'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    gameId: number | null
    memberId: number
    rank: number
    slotId: number
    year: number
    returningPlayer: boolean

    /**
     * Reads a single `Game` that is related to this `GameChoice`.
     */
    game: IGame | null

    /**
     * Reads a single `Membership` that is related to this `GameChoice`.
     */
    member: IMembership | null

    /**
     * Reads a single `Slot` that is related to this `GameChoice`.
     */
    slot: ISlot | null
  }

  interface IMembership {
    __typename: 'Membership'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    arrivalDate: any
    attendance: string
    attending: boolean
    departureDate: any
    hotelRoomId: number
    interestLevel: string
    message: string
    roomPreferenceAndNotes: string
    roomingPreferences: string
    roomingWith: string
    userId: number
    volunteer: boolean
    year: number
    offerSubsidy: boolean
    requestOldPrice: boolean
    amountOwed: number
    amountPaid: number

    /**
     * Reads a single `HotelRoom` that is related to this `Membership`.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Reads a single `User` that is related to this `Membership`.
     */
    user: IUser | null

    /**
     * Reads and enables pagination through a set of `GameAssignment`.
     */
    gameAssignmentsByMemberId: IGameAssignmentsConnection

    /**
     * Reads and enables pagination through a set of `GameChoice`.
     */
    gameChoicesByMemberId: IGameChoicesConnection

    /**
     * Reads and enables pagination through a set of `GameSubmission`.
     */
    gameSubmissionsByMemberId: IGameSubmissionsConnection

    /**
     * Reads and enables pagination through a set of `MemberHotelRoomAssignment`.
     */
    memberHotelRoomAssignmentsByMemberId: IMemberHotelRoomAssignmentsConnection
  }

  interface IGameAssignmentsByMemberIdOnMembershipArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameAssignmentFilter | null
  }

  interface IGameChoicesByMemberIdOnMembershipArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameChoiceCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameChoiceFilter | null
  }

  interface IGameSubmissionsByMemberIdOnMembershipArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `GameSubmission`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameSubmissionsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameSubmissionCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameSubmissionFilter | null
  }

  interface IMemberHotelRoomAssignmentsByMemberIdOnMembershipArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMemberHotelRoomAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMemberHotelRoomAssignmentFilter | null
  }

  interface IHotelRoom {
    __typename: 'HotelRoom'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    description: string
    gamingRoom: boolean
    occupancy: string
    quantity: number
    rate: string
    bathroomType: string
    type: string

    /**
     * Reads and enables pagination through a set of `Membership`.
     */
    memberships: IMembershipsConnection
  }

  interface IMembershipsOnHotelRoomArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMembershipCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMembershipFilter | null
  }

  /**
   * Methods to use when ordering `Membership`.
   */
  const enum MembershipsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    ARRIVAL_DATE_ASC = 'ARRIVAL_DATE_ASC',
    ARRIVAL_DATE_DESC = 'ARRIVAL_DATE_DESC',
    ATTENDANCE_ASC = 'ATTENDANCE_ASC',
    ATTENDANCE_DESC = 'ATTENDANCE_DESC',
    ATTENDING_ASC = 'ATTENDING_ASC',
    ATTENDING_DESC = 'ATTENDING_DESC',
    DEPARTURE_DATE_ASC = 'DEPARTURE_DATE_ASC',
    DEPARTURE_DATE_DESC = 'DEPARTURE_DATE_DESC',
    HOTEL_ROOM_ID_ASC = 'HOTEL_ROOM_ID_ASC',
    HOTEL_ROOM_ID_DESC = 'HOTEL_ROOM_ID_DESC',
    INTEREST_LEVEL_ASC = 'INTEREST_LEVEL_ASC',
    INTEREST_LEVEL_DESC = 'INTEREST_LEVEL_DESC',
    MESSAGE_ASC = 'MESSAGE_ASC',
    MESSAGE_DESC = 'MESSAGE_DESC',
    ROOM_PREFERENCE_AND_NOTES_ASC = 'ROOM_PREFERENCE_AND_NOTES_ASC',
    ROOM_PREFERENCE_AND_NOTES_DESC = 'ROOM_PREFERENCE_AND_NOTES_DESC',
    ROOMING_PREFERENCES_ASC = 'ROOMING_PREFERENCES_ASC',
    ROOMING_PREFERENCES_DESC = 'ROOMING_PREFERENCES_DESC',
    ROOMING_WITH_ASC = 'ROOMING_WITH_ASC',
    ROOMING_WITH_DESC = 'ROOMING_WITH_DESC',
    USER_ID_ASC = 'USER_ID_ASC',
    USER_ID_DESC = 'USER_ID_DESC',
    VOLUNTEER_ASC = 'VOLUNTEER_ASC',
    VOLUNTEER_DESC = 'VOLUNTEER_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    OFFER_SUBSIDY_ASC = 'OFFER_SUBSIDY_ASC',
    OFFER_SUBSIDY_DESC = 'OFFER_SUBSIDY_DESC',
    REQUEST_OLD_PRICE_ASC = 'REQUEST_OLD_PRICE_ASC',
    REQUEST_OLD_PRICE_DESC = 'REQUEST_OLD_PRICE_DESC',
    AMOUNT_OWED_ASC = 'AMOUNT_OWED_ASC',
    AMOUNT_OWED_DESC = 'AMOUNT_OWED_DESC',
    AMOUNT_PAID_ASC = 'AMOUNT_PAID_ASC',
    AMOUNT_PAID_DESC = 'AMOUNT_PAID_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__ID_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__DESCRIPTION_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__GAMING_ROOM_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__OCCUPANCY_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__QUANTITY_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__RATE_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_DESC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_ASC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_ASC',
    HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_DESC = 'HOTEL_ROOM_BY_HOTEL_ROOM_ID__TYPE_DESC',
    USER_BY_USER_ID__ID_ASC = 'USER_BY_USER_ID__ID_ASC',
    USER_BY_USER_ID__ID_DESC = 'USER_BY_USER_ID__ID_DESC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_ASC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_ASC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_DESC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_DESC',
    USER_BY_USER_ID__ENABLED_ASC = 'USER_BY_USER_ID__ENABLED_ASC',
    USER_BY_USER_ID__ENABLED_DESC = 'USER_BY_USER_ID__ENABLED_DESC',
    USER_BY_USER_ID__PASSWORD_ASC = 'USER_BY_USER_ID__PASSWORD_ASC',
    USER_BY_USER_ID__PASSWORD_DESC = 'USER_BY_USER_ID__PASSWORD_DESC',
    USER_BY_USER_ID__PROFILE_ID_ASC = 'USER_BY_USER_ID__PROFILE_ID_ASC',
    USER_BY_USER_ID__PROFILE_ID_DESC = 'USER_BY_USER_ID__PROFILE_ID_DESC',
    USER_BY_USER_ID__USERNAME_ASC = 'USER_BY_USER_ID__USERNAME_ASC',
    USER_BY_USER_ID__USERNAME_DESC = 'USER_BY_USER_ID__USERNAME_DESC',
    GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_ASC = 'GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_ASC',
    GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_DESC = 'GAME_ASSIGNMENTS_BY_MEMBER_ID__COUNT_DESC',
    GAME_CHOICES_BY_MEMBER_ID__COUNT_ASC = 'GAME_CHOICES_BY_MEMBER_ID__COUNT_ASC',
    GAME_CHOICES_BY_MEMBER_ID__COUNT_DESC = 'GAME_CHOICES_BY_MEMBER_ID__COUNT_DESC',
    GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_ASC = 'GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_ASC',
    GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_DESC = 'GAME_SUBMISSIONS_BY_MEMBER_ID__COUNT_DESC',
    MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_MEMBER_ID__COUNT_ASC = 'MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_MEMBER_ID__COUNT_ASC',
    MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_MEMBER_ID__COUNT_DESC = 'MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_MEMBER_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Membership` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface IMembershipCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `arrivalDate` field.
     */
    arrivalDate?: any | null

    /**
     * Checks for equality with the object’s `attendance` field.
     */
    attendance?: string | null

    /**
     * Checks for equality with the object’s `attending` field.
     */
    attending?: boolean | null

    /**
     * Checks for equality with the object’s `departureDate` field.
     */
    departureDate?: any | null

    /**
     * Checks for equality with the object’s `hotelRoomId` field.
     */
    hotelRoomId?: number | null

    /**
     * Checks for equality with the object’s `interestLevel` field.
     */
    interestLevel?: string | null

    /**
     * Checks for equality with the object’s `message` field.
     */
    message?: string | null

    /**
     * Checks for equality with the object’s `roomPreferenceAndNotes` field.
     */
    roomPreferenceAndNotes?: string | null

    /**
     * Checks for equality with the object’s `roomingPreferences` field.
     */
    roomingPreferences?: string | null

    /**
     * Checks for equality with the object’s `roomingWith` field.
     */
    roomingWith?: string | null

    /**
     * Checks for equality with the object’s `userId` field.
     */
    userId?: number | null

    /**
     * Checks for equality with the object’s `volunteer` field.
     */
    volunteer?: boolean | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null

    /**
     * Checks for equality with the object’s `offerSubsidy` field.
     */
    offerSubsidy?: boolean | null

    /**
     * Checks for equality with the object’s `requestOldPrice` field.
     */
    requestOldPrice?: boolean | null

    /**
     * Checks for equality with the object’s `amountOwed` field.
     */
    amountOwed?: number | null

    /**
     * Checks for equality with the object’s `amountPaid` field.
     */
    amountPaid?: number | null
  }

  /**
   * A filter to be used against `Membership` object types. All fields are combined with a logical ‘and.’
   */
  interface IMembershipFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `arrivalDate` field.
     */
    arrivalDate?: IDatetimeFilter | null

    /**
     * Filter by the object’s `attendance` field.
     */
    attendance?: IStringFilter | null

    /**
     * Filter by the object’s `attending` field.
     */
    attending?: IBooleanFilter | null

    /**
     * Filter by the object’s `departureDate` field.
     */
    departureDate?: IDatetimeFilter | null

    /**
     * Filter by the object’s `hotelRoomId` field.
     */
    hotelRoomId?: IIntFilter | null

    /**
     * Filter by the object’s `interestLevel` field.
     */
    interestLevel?: IStringFilter | null

    /**
     * Filter by the object’s `message` field.
     */
    message?: IStringFilter | null

    /**
     * Filter by the object’s `roomPreferenceAndNotes` field.
     */
    roomPreferenceAndNotes?: IStringFilter | null

    /**
     * Filter by the object’s `roomingPreferences` field.
     */
    roomingPreferences?: IStringFilter | null

    /**
     * Filter by the object’s `roomingWith` field.
     */
    roomingWith?: IStringFilter | null

    /**
     * Filter by the object’s `userId` field.
     */
    userId?: IIntFilter | null

    /**
     * Filter by the object’s `volunteer` field.
     */
    volunteer?: IBooleanFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Filter by the object’s `offerSubsidy` field.
     */
    offerSubsidy?: IBooleanFilter | null

    /**
     * Filter by the object’s `requestOldPrice` field.
     */
    requestOldPrice?: IBooleanFilter | null

    /**
     * Filter by the object’s `amountOwed` field.
     */
    amountOwed?: IFloatFilter | null

    /**
     * Filter by the object’s `amountPaid` field.
     */
    amountPaid?: IFloatFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IMembershipFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IMembershipFilter> | null

    /**
     * Negates the expression.
     */
    not?: IMembershipFilter | null
  }

  /**
   * A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’
   */
  interface IDatetimeFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: any | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: any | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: any | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: any | null

    /**
     * Included in the specified list.
     */
    in?: Array<any> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<any> | null

    /**
     * Less than the specified value.
     */
    lessThan?: any | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: any | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: any | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: any | null
  }

  /**
   * A filter to be used against Float fields. All fields are combined with a logical ‘and.’
   */
  interface IFloatFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: number | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: number | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: number | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: number | null

    /**
     * Included in the specified list.
     */
    in?: Array<number> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<number> | null

    /**
     * Less than the specified value.
     */
    lessThan?: number | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: number | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: number | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: number | null
  }

  /**
   * A connection to a list of `Membership` values.
   */
  interface IMembershipsConnection {
    __typename: 'MembershipsConnection'

    /**
     * A list of `Membership` objects.
     */
    nodes: Array<IMembership | null>

    /**
     * A list of edges which contains the `Membership` and cursor to aid in pagination.
     */
    edges: Array<IMembershipsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Membership` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `Membership` edge in the connection.
   */
  interface IMembershipsEdge {
    __typename: 'MembershipsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Membership` at the end of the edge.
     */
    node: IMembership | null
  }

  /**
   * Information about pagination in a connection.
   */
  interface IPageInfo {
    __typename: 'PageInfo'

    /**
     * When paginating forwards, are there more items?
     */
    hasNextPage: boolean

    /**
     * When paginating backwards, are there more items?
     */
    hasPreviousPage: boolean

    /**
     * When paginating backwards, the cursor to continue.
     */
    startCursor: any | null

    /**
     * When paginating forwards, the cursor to continue.
     */
    endCursor: any | null
  }

  interface IUser {
    __typename: 'User'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    accountLocked: boolean
    enabled: boolean
    password: string
    profileId: number
    username: string

    /**
     * Reads a single `Profile` that is related to this `User`.
     */
    profile: IProfile | null

    /**
     * Reads and enables pagination through a set of `Game`.
     */
    authoredGames: IGamesConnection

    /**
     * Reads and enables pagination through a set of `Membership`.
     */
    memberships: IMembershipsConnection

    /**
     * Reads and enables pagination through a set of `ShirtOrder`.
     */
    shirtOrders: IShirtOrdersConnection

    /**
     * Reads and enables pagination through a set of `UserRole`.
     */
    userRoles: IUserRolesConnection

    /**
     * Reads and enables pagination through a set of `Token`.
     */
    tokens: ITokensConnection
  }

  interface IAuthoredGamesOnUserArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IGameCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IGameFilter | null
  }

  interface IMembershipsOnUserArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMembershipCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMembershipFilter | null
  }

  interface IShirtOrdersOnUserArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `ShirtOrder`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrdersOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IShirtOrderCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IShirtOrderFilter | null
  }

  interface IUserRolesOnUserArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IUserRoleCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IUserRoleFilter | null
  }

  interface ITokensOnUserArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `Token`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<TokensOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ITokenCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ITokenFilter | null
  }

  interface IProfile {
    __typename: 'Profile'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    email: string
    fullName: string
    phoneNumber: string | null
    snailMailAddress: string | null

    /**
     * Reads and enables pagination through a set of `User`.
     */
    users: IUsersConnection
  }

  interface IUsersOnProfileArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `User`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UsersOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IUserCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IUserFilter | null
  }

  /**
   * Methods to use when ordering `User`.
   */
  const enum UsersOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    ACCOUNT_LOCKED_ASC = 'ACCOUNT_LOCKED_ASC',
    ACCOUNT_LOCKED_DESC = 'ACCOUNT_LOCKED_DESC',
    ENABLED_ASC = 'ENABLED_ASC',
    ENABLED_DESC = 'ENABLED_DESC',
    PASSWORD_ASC = 'PASSWORD_ASC',
    PASSWORD_DESC = 'PASSWORD_DESC',
    PROFILE_ID_ASC = 'PROFILE_ID_ASC',
    PROFILE_ID_DESC = 'PROFILE_ID_DESC',
    USERNAME_ASC = 'USERNAME_ASC',
    USERNAME_DESC = 'USERNAME_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    PROFILE_BY_PROFILE_ID__ID_ASC = 'PROFILE_BY_PROFILE_ID__ID_ASC',
    PROFILE_BY_PROFILE_ID__ID_DESC = 'PROFILE_BY_PROFILE_ID__ID_DESC',
    PROFILE_BY_PROFILE_ID__EMAIL_ASC = 'PROFILE_BY_PROFILE_ID__EMAIL_ASC',
    PROFILE_BY_PROFILE_ID__EMAIL_DESC = 'PROFILE_BY_PROFILE_ID__EMAIL_DESC',
    PROFILE_BY_PROFILE_ID__FULL_NAME_ASC = 'PROFILE_BY_PROFILE_ID__FULL_NAME_ASC',
    PROFILE_BY_PROFILE_ID__FULL_NAME_DESC = 'PROFILE_BY_PROFILE_ID__FULL_NAME_DESC',
    PROFILE_BY_PROFILE_ID__PHONE_NUMBER_ASC = 'PROFILE_BY_PROFILE_ID__PHONE_NUMBER_ASC',
    PROFILE_BY_PROFILE_ID__PHONE_NUMBER_DESC = 'PROFILE_BY_PROFILE_ID__PHONE_NUMBER_DESC',
    PROFILE_BY_PROFILE_ID__SNAIL_MAIL_ADDRESS_ASC = 'PROFILE_BY_PROFILE_ID__SNAIL_MAIL_ADDRESS_ASC',
    PROFILE_BY_PROFILE_ID__SNAIL_MAIL_ADDRESS_DESC = 'PROFILE_BY_PROFILE_ID__SNAIL_MAIL_ADDRESS_DESC',
    GAMES_BY_AUTHOR_ID__COUNT_ASC = 'GAMES_BY_AUTHOR_ID__COUNT_ASC',
    GAMES_BY_AUTHOR_ID__COUNT_DESC = 'GAMES_BY_AUTHOR_ID__COUNT_DESC',
    MEMBERSHIPS_BY_USER_ID__COUNT_ASC = 'MEMBERSHIPS_BY_USER_ID__COUNT_ASC',
    MEMBERSHIPS_BY_USER_ID__COUNT_DESC = 'MEMBERSHIPS_BY_USER_ID__COUNT_DESC',
    SHIRT_ORDERS_BY_USER_ID__COUNT_ASC = 'SHIRT_ORDERS_BY_USER_ID__COUNT_ASC',
    SHIRT_ORDERS_BY_USER_ID__COUNT_DESC = 'SHIRT_ORDERS_BY_USER_ID__COUNT_DESC',
    USER_ROLES_BY_USER_ID__COUNT_ASC = 'USER_ROLES_BY_USER_ID__COUNT_ASC',
    USER_ROLES_BY_USER_ID__COUNT_DESC = 'USER_ROLES_BY_USER_ID__COUNT_DESC',
    TOKENS_BY_USER_ID__COUNT_ASC = 'TOKENS_BY_USER_ID__COUNT_ASC',
    TOKENS_BY_USER_ID__COUNT_DESC = 'TOKENS_BY_USER_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface IUserCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `accountLocked` field.
     */
    accountLocked?: boolean | null

    /**
     * Checks for equality with the object’s `enabled` field.
     */
    enabled?: boolean | null

    /**
     * Checks for equality with the object’s `password` field.
     */
    password?: string | null

    /**
     * Checks for equality with the object’s `profileId` field.
     */
    profileId?: number | null

    /**
     * Checks for equality with the object’s `username` field.
     */
    username?: string | null
  }

  /**
   * A filter to be used against `User` object types. All fields are combined with a logical ‘and.’
   */
  interface IUserFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `accountLocked` field.
     */
    accountLocked?: IBooleanFilter | null

    /**
     * Filter by the object’s `enabled` field.
     */
    enabled?: IBooleanFilter | null

    /**
     * Filter by the object’s `password` field.
     */
    password?: IStringFilter | null

    /**
     * Filter by the object’s `profileId` field.
     */
    profileId?: IIntFilter | null

    /**
     * Filter by the object’s `username` field.
     */
    username?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IUserFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IUserFilter> | null

    /**
     * Negates the expression.
     */
    not?: IUserFilter | null
  }

  /**
   * A connection to a list of `User` values.
   */
  interface IUsersConnection {
    __typename: 'UsersConnection'

    /**
     * A list of `User` objects.
     */
    nodes: Array<IUser | null>

    /**
     * A list of edges which contains the `User` and cursor to aid in pagination.
     */
    edges: Array<IUsersEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `User` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `User` edge in the connection.
   */
  interface IUsersEdge {
    __typename: 'UsersEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `User` at the end of the edge.
     */
    node: IUser | null
  }

  /**
   * Methods to use when ordering `ShirtOrder`.
   */
  const enum ShirtOrdersOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    DELIVERY_METHOD_ASC = 'DELIVERY_METHOD_ASC',
    DELIVERY_METHOD_DESC = 'DELIVERY_METHOD_DESC',
    MESSAGE_ASC = 'MESSAGE_ASC',
    MESSAGE_DESC = 'MESSAGE_DESC',
    USER_ID_ASC = 'USER_ID_ASC',
    USER_ID_DESC = 'USER_ID_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    USER_BY_USER_ID__ID_ASC = 'USER_BY_USER_ID__ID_ASC',
    USER_BY_USER_ID__ID_DESC = 'USER_BY_USER_ID__ID_DESC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_ASC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_ASC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_DESC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_DESC',
    USER_BY_USER_ID__ENABLED_ASC = 'USER_BY_USER_ID__ENABLED_ASC',
    USER_BY_USER_ID__ENABLED_DESC = 'USER_BY_USER_ID__ENABLED_DESC',
    USER_BY_USER_ID__PASSWORD_ASC = 'USER_BY_USER_ID__PASSWORD_ASC',
    USER_BY_USER_ID__PASSWORD_DESC = 'USER_BY_USER_ID__PASSWORD_DESC',
    USER_BY_USER_ID__PROFILE_ID_ASC = 'USER_BY_USER_ID__PROFILE_ID_ASC',
    USER_BY_USER_ID__PROFILE_ID_DESC = 'USER_BY_USER_ID__PROFILE_ID_DESC',
    USER_BY_USER_ID__USERNAME_ASC = 'USER_BY_USER_ID__USERNAME_ASC',
    USER_BY_USER_ID__USERNAME_DESC = 'USER_BY_USER_ID__USERNAME_DESC',
    SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_ASC = 'SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_ASC',
    SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_DESC = 'SHIRT_ORDER_ITEMS_BY_ORDER_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `ShirtOrder` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface IShirtOrderCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `deliveryMethod` field.
     */
    deliveryMethod?: string | null

    /**
     * Checks for equality with the object’s `message` field.
     */
    message?: string | null

    /**
     * Checks for equality with the object’s `userId` field.
     */
    userId?: number | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null
  }

  /**
   * A filter to be used against `ShirtOrder` object types. All fields are combined with a logical ‘and.’
   */
  interface IShirtOrderFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `deliveryMethod` field.
     */
    deliveryMethod?: IStringFilter | null

    /**
     * Filter by the object’s `message` field.
     */
    message?: IStringFilter | null

    /**
     * Filter by the object’s `userId` field.
     */
    userId?: IIntFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IShirtOrderFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IShirtOrderFilter> | null

    /**
     * Negates the expression.
     */
    not?: IShirtOrderFilter | null
  }

  /**
   * A connection to a list of `ShirtOrder` values.
   */
  interface IShirtOrdersConnection {
    __typename: 'ShirtOrdersConnection'

    /**
     * A list of `ShirtOrder` objects.
     */
    nodes: Array<IShirtOrder | null>

    /**
     * A list of edges which contains the `ShirtOrder` and cursor to aid in pagination.
     */
    edges: Array<IShirtOrdersEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `ShirtOrder` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IShirtOrder {
    __typename: 'ShirtOrder'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    deliveryMethod: string
    message: string
    userId: number
    year: number

    /**
     * Reads a single `User` that is related to this `ShirtOrder`.
     */
    user: IUser | null

    /**
     * Reads and enables pagination through a set of `ShirtOrderItem`.
     */
    shirtOrderItemsByOrderId: IShirtOrderItemsConnection
  }

  interface IShirtOrderItemsByOrderIdOnShirtOrderArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `ShirtOrderItem`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrderItemsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IShirtOrderItemCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IShirtOrderItemFilter | null
  }

  /**
   * Methods to use when ordering `ShirtOrderItem`.
   */
  const enum ShirtOrderItemsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    ORDER_ID_ASC = 'ORDER_ID_ASC',
    ORDER_ID_DESC = 'ORDER_ID_DESC',
    QUANTITY_ASC = 'QUANTITY_ASC',
    QUANTITY_DESC = 'QUANTITY_DESC',
    SIZE_ASC = 'SIZE_ASC',
    SIZE_DESC = 'SIZE_DESC',
    STYLE_ASC = 'STYLE_ASC',
    STYLE_DESC = 'STYLE_DESC',
    ITEMS_IDX_ASC = 'ITEMS_IDX_ASC',
    ITEMS_IDX_DESC = 'ITEMS_IDX_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    SHIRT_ORDER_BY_ORDER_ID__ID_ASC = 'SHIRT_ORDER_BY_ORDER_ID__ID_ASC',
    SHIRT_ORDER_BY_ORDER_ID__ID_DESC = 'SHIRT_ORDER_BY_ORDER_ID__ID_DESC',
    SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_ASC = 'SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_ASC',
    SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_DESC = 'SHIRT_ORDER_BY_ORDER_ID__DELIVERY_METHOD_DESC',
    SHIRT_ORDER_BY_ORDER_ID__MESSAGE_ASC = 'SHIRT_ORDER_BY_ORDER_ID__MESSAGE_ASC',
    SHIRT_ORDER_BY_ORDER_ID__MESSAGE_DESC = 'SHIRT_ORDER_BY_ORDER_ID__MESSAGE_DESC',
    SHIRT_ORDER_BY_ORDER_ID__USER_ID_ASC = 'SHIRT_ORDER_BY_ORDER_ID__USER_ID_ASC',
    SHIRT_ORDER_BY_ORDER_ID__USER_ID_DESC = 'SHIRT_ORDER_BY_ORDER_ID__USER_ID_DESC',
    SHIRT_ORDER_BY_ORDER_ID__YEAR_ASC = 'SHIRT_ORDER_BY_ORDER_ID__YEAR_ASC',
    SHIRT_ORDER_BY_ORDER_ID__YEAR_DESC = 'SHIRT_ORDER_BY_ORDER_ID__YEAR_DESC'
  }

  /**
   * A condition to be used against `ShirtOrderItem` object types. All fields are
   * tested for equality and combined with a logical ‘and.’
   */
  interface IShirtOrderItemCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `orderId` field.
     */
    orderId?: number | null

    /**
     * Checks for equality with the object’s `quantity` field.
     */
    quantity?: number | null

    /**
     * Checks for equality with the object’s `size` field.
     */
    size?: string | null

    /**
     * Checks for equality with the object’s `style` field.
     */
    style?: string | null

    /**
     * Checks for equality with the object’s `itemsIdx` field.
     */
    itemsIdx?: number | null
  }

  /**
   * A filter to be used against `ShirtOrderItem` object types. All fields are combined with a logical ‘and.’
   */
  interface IShirtOrderItemFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `orderId` field.
     */
    orderId?: IIntFilter | null

    /**
     * Filter by the object’s `quantity` field.
     */
    quantity?: IIntFilter | null

    /**
     * Filter by the object’s `size` field.
     */
    size?: IStringFilter | null

    /**
     * Filter by the object’s `style` field.
     */
    style?: IStringFilter | null

    /**
     * Filter by the object’s `itemsIdx` field.
     */
    itemsIdx?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IShirtOrderItemFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IShirtOrderItemFilter> | null

    /**
     * Negates the expression.
     */
    not?: IShirtOrderItemFilter | null
  }

  /**
   * A connection to a list of `ShirtOrderItem` values.
   */
  interface IShirtOrderItemsConnection {
    __typename: 'ShirtOrderItemsConnection'

    /**
     * A list of `ShirtOrderItem` objects.
     */
    nodes: Array<IShirtOrderItem | null>

    /**
     * A list of edges which contains the `ShirtOrderItem` and cursor to aid in pagination.
     */
    edges: Array<IShirtOrderItemsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `ShirtOrderItem` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IShirtOrderItem {
    __typename: 'ShirtOrderItem'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    orderId: number
    quantity: number
    size: string
    style: string
    itemsIdx: number | null

    /**
     * Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`.
     */
    order: IShirtOrder | null
  }

  /**
   * A `ShirtOrderItem` edge in the connection.
   */
  interface IShirtOrderItemsEdge {
    __typename: 'ShirtOrderItemsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `ShirtOrderItem` at the end of the edge.
     */
    node: IShirtOrderItem | null
  }

  /**
   * A `ShirtOrder` edge in the connection.
   */
  interface IShirtOrdersEdge {
    __typename: 'ShirtOrdersEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `ShirtOrder` at the end of the edge.
     */
    node: IShirtOrder | null
  }

  /**
   * Methods to use when ordering `UserRole`.
   */
  const enum UserRolesOrderBy {
    NATURAL = 'NATURAL',
    ROLE_ID_ASC = 'ROLE_ID_ASC',
    ROLE_ID_DESC = 'ROLE_ID_DESC',
    USER_ID_ASC = 'USER_ID_ASC',
    USER_ID_DESC = 'USER_ID_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    ROLE_BY_ROLE_ID__ID_ASC = 'ROLE_BY_ROLE_ID__ID_ASC',
    ROLE_BY_ROLE_ID__ID_DESC = 'ROLE_BY_ROLE_ID__ID_DESC',
    ROLE_BY_ROLE_ID__AUTHORITY_ASC = 'ROLE_BY_ROLE_ID__AUTHORITY_ASC',
    ROLE_BY_ROLE_ID__AUTHORITY_DESC = 'ROLE_BY_ROLE_ID__AUTHORITY_DESC',
    USER_BY_USER_ID__ID_ASC = 'USER_BY_USER_ID__ID_ASC',
    USER_BY_USER_ID__ID_DESC = 'USER_BY_USER_ID__ID_DESC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_ASC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_ASC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_DESC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_DESC',
    USER_BY_USER_ID__ENABLED_ASC = 'USER_BY_USER_ID__ENABLED_ASC',
    USER_BY_USER_ID__ENABLED_DESC = 'USER_BY_USER_ID__ENABLED_DESC',
    USER_BY_USER_ID__PASSWORD_ASC = 'USER_BY_USER_ID__PASSWORD_ASC',
    USER_BY_USER_ID__PASSWORD_DESC = 'USER_BY_USER_ID__PASSWORD_DESC',
    USER_BY_USER_ID__PROFILE_ID_ASC = 'USER_BY_USER_ID__PROFILE_ID_ASC',
    USER_BY_USER_ID__PROFILE_ID_DESC = 'USER_BY_USER_ID__PROFILE_ID_DESC',
    USER_BY_USER_ID__USERNAME_ASC = 'USER_BY_USER_ID__USERNAME_ASC',
    USER_BY_USER_ID__USERNAME_DESC = 'USER_BY_USER_ID__USERNAME_DESC'
  }

  /**
   * A condition to be used against `UserRole` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface IUserRoleCondition {
    /**
     * Checks for equality with the object’s `roleId` field.
     */
    roleId?: number | null

    /**
     * Checks for equality with the object’s `userId` field.
     */
    userId?: number | null
  }

  /**
   * A filter to be used against `UserRole` object types. All fields are combined with a logical ‘and.’
   */
  interface IUserRoleFilter {
    /**
     * Filter by the object’s `roleId` field.
     */
    roleId?: IIntFilter | null

    /**
     * Filter by the object’s `userId` field.
     */
    userId?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IUserRoleFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IUserRoleFilter> | null

    /**
     * Negates the expression.
     */
    not?: IUserRoleFilter | null
  }

  /**
   * A connection to a list of `UserRole` values.
   */
  interface IUserRolesConnection {
    __typename: 'UserRolesConnection'

    /**
     * A list of `UserRole` objects.
     */
    nodes: Array<IUserRole | null>

    /**
     * A list of edges which contains the `UserRole` and cursor to aid in pagination.
     */
    edges: Array<IUserRolesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `UserRole` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IUserRole {
    __typename: 'UserRole'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    roleId: number
    userId: number

    /**
     * Reads a single `Role` that is related to this `UserRole`.
     */
    role: IRole | null

    /**
     * Reads a single `User` that is related to this `UserRole`.
     */
    user: IUser | null
  }

  interface IRole {
    __typename: 'Role'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    authority: string

    /**
     * Reads and enables pagination through a set of `UserRole`.
     */
    userRoles: IUserRolesConnection
  }

  interface IUserRolesOnRoleArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IUserRoleCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IUserRoleFilter | null
  }

  /**
   * A `UserRole` edge in the connection.
   */
  interface IUserRolesEdge {
    __typename: 'UserRolesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `UserRole` at the end of the edge.
     */
    node: IUserRole | null
  }

  /**
   * Methods to use when ordering `Token`.
   */
  const enum TokensOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    USER_ID_ASC = 'USER_ID_ASC',
    USER_ID_DESC = 'USER_ID_DESC',
    CUID_ASC = 'CUID_ASC',
    CUID_DESC = 'CUID_DESC',
    ACTIVE_ASC = 'ACTIVE_ASC',
    ACTIVE_DESC = 'ACTIVE_DESC',
    LAST_USED_ASC = 'LAST_USED_ASC',
    LAST_USED_DESC = 'LAST_USED_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    USER_BY_USER_ID__ID_ASC = 'USER_BY_USER_ID__ID_ASC',
    USER_BY_USER_ID__ID_DESC = 'USER_BY_USER_ID__ID_DESC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_ASC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_ASC',
    USER_BY_USER_ID__ACCOUNT_LOCKED_DESC = 'USER_BY_USER_ID__ACCOUNT_LOCKED_DESC',
    USER_BY_USER_ID__ENABLED_ASC = 'USER_BY_USER_ID__ENABLED_ASC',
    USER_BY_USER_ID__ENABLED_DESC = 'USER_BY_USER_ID__ENABLED_DESC',
    USER_BY_USER_ID__PASSWORD_ASC = 'USER_BY_USER_ID__PASSWORD_ASC',
    USER_BY_USER_ID__PASSWORD_DESC = 'USER_BY_USER_ID__PASSWORD_DESC',
    USER_BY_USER_ID__PROFILE_ID_ASC = 'USER_BY_USER_ID__PROFILE_ID_ASC',
    USER_BY_USER_ID__PROFILE_ID_DESC = 'USER_BY_USER_ID__PROFILE_ID_DESC',
    USER_BY_USER_ID__USERNAME_ASC = 'USER_BY_USER_ID__USERNAME_ASC',
    USER_BY_USER_ID__USERNAME_DESC = 'USER_BY_USER_ID__USERNAME_DESC'
  }

  /**
   * A condition to be used against `Token` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface ITokenCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `userId` field.
     */
    userId?: number | null

    /**
     * Checks for equality with the object’s `cuid` field.
     */
    cuid?: string | null

    /**
     * Checks for equality with the object’s `active` field.
     */
    active?: boolean | null

    /**
     * Checks for equality with the object’s `lastUsed` field.
     */
    lastUsed?: any | null
  }

  /**
   * A filter to be used against `Token` object types. All fields are combined with a logical ‘and.’
   */
  interface ITokenFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `userId` field.
     */
    userId?: IIntFilter | null

    /**
     * Filter by the object’s `cuid` field.
     */
    cuid?: IStringFilter | null

    /**
     * Filter by the object’s `active` field.
     */
    active?: IBooleanFilter | null

    /**
     * Filter by the object’s `lastUsed` field.
     */
    lastUsed?: IDatetimeFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<ITokenFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<ITokenFilter> | null

    /**
     * Negates the expression.
     */
    not?: ITokenFilter | null
  }

  /**
   * A connection to a list of `Token` values.
   */
  interface ITokensConnection {
    __typename: 'TokensConnection'

    /**
     * A list of `Token` objects.
     */
    nodes: Array<IToken | null>

    /**
     * A list of edges which contains the `Token` and cursor to aid in pagination.
     */
    edges: Array<ITokensEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Token` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IToken {
    __typename: 'Token'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    userId: number
    cuid: string | null
    active: boolean | null
    lastUsed: any | null

    /**
     * Reads a single `User` that is related to this `Token`.
     */
    user: IUser | null
  }

  /**
   * A `Token` edge in the connection.
   */
  interface ITokensEdge {
    __typename: 'TokensEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Token` at the end of the edge.
     */
    node: IToken | null
  }

  /**
   * Methods to use when ordering `GameAssignment`.
   */
  const enum GameAssignmentsOrderBy {
    NATURAL = 'NATURAL',
    MEMBER_ID_ASC = 'MEMBER_ID_ASC',
    MEMBER_ID_DESC = 'MEMBER_ID_DESC',
    GAME_ID_ASC = 'GAME_ID_ASC',
    GAME_ID_DESC = 'GAME_ID_DESC',
    GM_ASC = 'GM_ASC',
    GM_DESC = 'GM_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC',
    GAME_BY_GAME_ID__ID_ASC = 'GAME_BY_GAME_ID__ID_ASC',
    GAME_BY_GAME_ID__ID_DESC = 'GAME_BY_GAME_ID__ID_DESC',
    GAME_BY_GAME_ID__DESCRIPTION_ASC = 'GAME_BY_GAME_ID__DESCRIPTION_ASC',
    GAME_BY_GAME_ID__DESCRIPTION_DESC = 'GAME_BY_GAME_ID__DESCRIPTION_DESC',
    GAME_BY_GAME_ID__LATE_FINISH_ASC = 'GAME_BY_GAME_ID__LATE_FINISH_ASC',
    GAME_BY_GAME_ID__LATE_FINISH_DESC = 'GAME_BY_GAME_ID__LATE_FINISH_DESC',
    GAME_BY_GAME_ID__LATE_START_ASC = 'GAME_BY_GAME_ID__LATE_START_ASC',
    GAME_BY_GAME_ID__LATE_START_DESC = 'GAME_BY_GAME_ID__LATE_START_DESC',
    GAME_BY_GAME_ID__NAME_ASC = 'GAME_BY_GAME_ID__NAME_ASC',
    GAME_BY_GAME_ID__NAME_DESC = 'GAME_BY_GAME_ID__NAME_DESC',
    GAME_BY_GAME_ID__PLAYER_MAX_ASC = 'GAME_BY_GAME_ID__PLAYER_MAX_ASC',
    GAME_BY_GAME_ID__PLAYER_MAX_DESC = 'GAME_BY_GAME_ID__PLAYER_MAX_DESC',
    GAME_BY_GAME_ID__PLAYER_MIN_ASC = 'GAME_BY_GAME_ID__PLAYER_MIN_ASC',
    GAME_BY_GAME_ID__PLAYER_MIN_DESC = 'GAME_BY_GAME_ID__PLAYER_MIN_DESC',
    GAME_BY_GAME_ID__ROOM_ID_ASC = 'GAME_BY_GAME_ID__ROOM_ID_ASC',
    GAME_BY_GAME_ID__ROOM_ID_DESC = 'GAME_BY_GAME_ID__ROOM_ID_DESC',
    GAME_BY_GAME_ID__SHORT_NAME_ASC = 'GAME_BY_GAME_ID__SHORT_NAME_ASC',
    GAME_BY_GAME_ID__SHORT_NAME_DESC = 'GAME_BY_GAME_ID__SHORT_NAME_DESC',
    GAME_BY_GAME_ID__SLOT_ID_ASC = 'GAME_BY_GAME_ID__SLOT_ID_ASC',
    GAME_BY_GAME_ID__SLOT_ID_DESC = 'GAME_BY_GAME_ID__SLOT_ID_DESC',
    GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_ASC',
    GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC = 'GAME_BY_GAME_ID__CHAR_INSTRUCTIONS_DESC',
    GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_ASC',
    GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC = 'GAME_BY_GAME_ID__ESTIMATED_LENGTH_DESC',
    GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_ASC',
    GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC = 'GAME_BY_GAME_ID__GAME_CONTACT_EMAIL_DESC',
    GAME_BY_GAME_ID__GENRE_ASC = 'GAME_BY_GAME_ID__GENRE_ASC',
    GAME_BY_GAME_ID__GENRE_DESC = 'GAME_BY_GAME_ID__GENRE_DESC',
    GAME_BY_GAME_ID__GM_NAMES_ASC = 'GAME_BY_GAME_ID__GM_NAMES_ASC',
    GAME_BY_GAME_ID__GM_NAMES_DESC = 'GAME_BY_GAME_ID__GM_NAMES_DESC',
    GAME_BY_GAME_ID__MESSAGE_ASC = 'GAME_BY_GAME_ID__MESSAGE_ASC',
    GAME_BY_GAME_ID__MESSAGE_DESC = 'GAME_BY_GAME_ID__MESSAGE_DESC',
    GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_ASC',
    GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC = 'GAME_BY_GAME_ID__PLAYER_PREFERENCE_DESC',
    GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_ASC',
    GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC = 'GAME_BY_GAME_ID__PLAYERS_CONTACT_GM_DESC',
    GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_ASC',
    GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC = 'GAME_BY_GAME_ID__RETURNING_PLAYERS_DESC',
    GAME_BY_GAME_ID__SETTING_ASC = 'GAME_BY_GAME_ID__SETTING_ASC',
    GAME_BY_GAME_ID__SETTING_DESC = 'GAME_BY_GAME_ID__SETTING_DESC',
    GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_ASC',
    GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC = 'GAME_BY_GAME_ID__SLOT_CONFLICTS_DESC',
    GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_ASC',
    GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC = 'GAME_BY_GAME_ID__SLOT_PREFERENCE_DESC',
    GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_ASC',
    GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC = 'GAME_BY_GAME_ID__TEEN_FRIENDLY_DESC',
    GAME_BY_GAME_ID__TYPE_ASC = 'GAME_BY_GAME_ID__TYPE_ASC',
    GAME_BY_GAME_ID__TYPE_DESC = 'GAME_BY_GAME_ID__TYPE_DESC',
    GAME_BY_GAME_ID__YEAR_ASC = 'GAME_BY_GAME_ID__YEAR_ASC',
    GAME_BY_GAME_ID__YEAR_DESC = 'GAME_BY_GAME_ID__YEAR_DESC',
    GAME_BY_GAME_ID__AUTHOR_ID_ASC = 'GAME_BY_GAME_ID__AUTHOR_ID_ASC',
    GAME_BY_GAME_ID__AUTHOR_ID_DESC = 'GAME_BY_GAME_ID__AUTHOR_ID_DESC'
  }

  /**
   * A condition to be used against `GameAssignment` object types. All fields are
   * tested for equality and combined with a logical ‘and.’
   */
  interface IGameAssignmentCondition {
    /**
     * Checks for equality with the object’s `memberId` field.
     */
    memberId?: number | null

    /**
     * Checks for equality with the object’s `gameId` field.
     */
    gameId?: number | null

    /**
     * Checks for equality with the object’s `gm` field.
     */
    gm?: number | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null
  }

  /**
   * A filter to be used against `GameAssignment` object types. All fields are combined with a logical ‘and.’
   */
  interface IGameAssignmentFilter {
    /**
     * Filter by the object’s `memberId` field.
     */
    memberId?: IIntFilter | null

    /**
     * Filter by the object’s `gameId` field.
     */
    gameId?: IIntFilter | null

    /**
     * Filter by the object’s `gm` field.
     */
    gm?: IIntFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IGameAssignmentFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IGameAssignmentFilter> | null

    /**
     * Negates the expression.
     */
    not?: IGameAssignmentFilter | null
  }

  /**
   * A connection to a list of `GameAssignment` values.
   */
  interface IGameAssignmentsConnection {
    __typename: 'GameAssignmentsConnection'

    /**
     * A list of `GameAssignment` objects.
     */
    nodes: Array<IGameAssignment | null>

    /**
     * A list of edges which contains the `GameAssignment` and cursor to aid in pagination.
     */
    edges: Array<IGameAssignmentsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `GameAssignment` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IGameAssignment {
    __typename: 'GameAssignment'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    memberId: number
    gameId: number
    gm: number
    year: number

    /**
     * Reads a single `Membership` that is related to this `GameAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `Game` that is related to this `GameAssignment`.
     */
    game: IGame | null
  }

  /**
   * A `GameAssignment` edge in the connection.
   */
  interface IGameAssignmentsEdge {
    __typename: 'GameAssignmentsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `GameAssignment` at the end of the edge.
     */
    node: IGameAssignment | null
  }

  /**
   * Methods to use when ordering `GameSubmission`.
   */
  const enum GameSubmissionsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    MEMBER_ID_ASC = 'MEMBER_ID_ASC',
    MEMBER_ID_DESC = 'MEMBER_ID_DESC',
    MESSAGE_ASC = 'MESSAGE_ASC',
    MESSAGE_DESC = 'MESSAGE_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC'
  }

  /**
   * A condition to be used against `GameSubmission` object types. All fields are
   * tested for equality and combined with a logical ‘and.’
   */
  interface IGameSubmissionCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `memberId` field.
     */
    memberId?: number | null

    /**
     * Checks for equality with the object’s `message` field.
     */
    message?: string | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null
  }

  /**
   * A filter to be used against `GameSubmission` object types. All fields are combined with a logical ‘and.’
   */
  interface IGameSubmissionFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `memberId` field.
     */
    memberId?: IIntFilter | null

    /**
     * Filter by the object’s `message` field.
     */
    message?: IStringFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IGameSubmissionFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IGameSubmissionFilter> | null

    /**
     * Negates the expression.
     */
    not?: IGameSubmissionFilter | null
  }

  /**
   * A connection to a list of `GameSubmission` values.
   */
  interface IGameSubmissionsConnection {
    __typename: 'GameSubmissionsConnection'

    /**
     * A list of `GameSubmission` objects.
     */
    nodes: Array<IGameSubmission | null>

    /**
     * A list of edges which contains the `GameSubmission` and cursor to aid in pagination.
     */
    edges: Array<IGameSubmissionsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `GameSubmission` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IGameSubmission {
    __typename: 'GameSubmission'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    memberId: number
    message: string
    year: number

    /**
     * Reads a single `Membership` that is related to this `GameSubmission`.
     */
    member: IMembership | null
  }

  /**
   * A `GameSubmission` edge in the connection.
   */
  interface IGameSubmissionsEdge {
    __typename: 'GameSubmissionsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `GameSubmission` at the end of the edge.
     */
    node: IGameSubmission | null
  }

  /**
   * Methods to use when ordering `MemberHotelRoomAssignment`.
   */
  const enum MemberHotelRoomAssignmentsOrderBy {
    NATURAL = 'NATURAL',
    MEMBER_ID_ASC = 'MEMBER_ID_ASC',
    MEMBER_ID_DESC = 'MEMBER_ID_DESC',
    HOTEL_ROOM_ID_ASC = 'HOTEL_ROOM_ID_ASC',
    HOTEL_ROOM_ID_DESC = 'HOTEL_ROOM_ID_DESC',
    ROOM_OWNER_ASC = 'ROOM_OWNER_ASC',
    ROOM_OWNER_DESC = 'ROOM_OWNER_DESC',
    YEAR_ASC = 'YEAR_ASC',
    YEAR_DESC = 'YEAR_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ARRIVAL_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDANCE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ATTENDING_DESC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__DEPARTURE_DATE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__HOTEL_ROOM_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_ASC',
    MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC = 'MEMBERSHIP_BY_MEMBER_ID__INTEREST_LEVEL_DESC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__MESSAGE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOM_PREFERENCE_AND_NOTES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_PREFERENCES_DESC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_ASC',
    MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC = 'MEMBERSHIP_BY_MEMBER_ID__ROOMING_WITH_DESC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__USER_ID_DESC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_ASC',
    MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC = 'MEMBERSHIP_BY_MEMBER_ID__VOLUNTEER_DESC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_ASC',
    MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC = 'MEMBERSHIP_BY_MEMBER_ID__YEAR_DESC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_ASC',
    MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC = 'MEMBERSHIP_BY_MEMBER_ID__OFFER_SUBSIDY_DESC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_ASC',
    MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC = 'MEMBERSHIP_BY_MEMBER_ID__REQUEST_OLD_PRICE_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_OWED_DESC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_ASC',
    MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC = 'MEMBERSHIP_BY_MEMBER_ID__AMOUNT_PAID_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ID_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ID_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ID_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ID_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__VERSION_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__VERSION_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__VERSION_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__VERSION_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__BATHROOM_TYPE_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__COMMENT_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__COMMENT_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__COMMENT_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__COMMENT_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ENABLED_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ENABLED_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ENABLED_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ENABLED_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__GAMING_ROOM_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__GAMING_ROOM_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__GAMING_ROOM_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__GAMING_ROOM_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__INTERNAL_ROOM_TYPE_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__INTERNAL_ROOM_TYPE_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__INTERNAL_ROOM_TYPE_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__INTERNAL_ROOM_TYPE_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__NAME_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__NAME_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__NAME_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__NAME_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_FOR_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_FOR_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_FOR_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__RESERVED_FOR_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ROOM_TYPE_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ROOM_TYPE_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ROOM_TYPE_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__ROOM_TYPE_DESC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__FORMATTED_ROOM_TYPE_ASC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__FORMATTED_ROOM_TYPE_ASC',
    HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__FORMATTED_ROOM_TYPE_DESC = 'HOTEL_ROOM_DETAIL_BY_HOTEL_ROOM_ID__FORMATTED_ROOM_TYPE_DESC'
  }

  /**
   * A condition to be used against `MemberHotelRoomAssignment` object types. All
   * fields are tested for equality and combined with a logical ‘and.’
   */
  interface IMemberHotelRoomAssignmentCondition {
    /**
     * Checks for equality with the object’s `memberId` field.
     */
    memberId?: any | null

    /**
     * Checks for equality with the object’s `hotelRoomId` field.
     */
    hotelRoomId?: any | null

    /**
     * Checks for equality with the object’s `roomOwner` field.
     */
    roomOwner?: boolean | null

    /**
     * Checks for equality with the object’s `year` field.
     */
    year?: number | null
  }

  /**
   * A filter to be used against `MemberHotelRoomAssignment` object types. All fields are combined with a logical ‘and.’
   */
  interface IMemberHotelRoomAssignmentFilter {
    /**
     * Filter by the object’s `memberId` field.
     */
    memberId?: IBigIntFilter | null

    /**
     * Filter by the object’s `hotelRoomId` field.
     */
    hotelRoomId?: IBigIntFilter | null

    /**
     * Filter by the object’s `roomOwner` field.
     */
    roomOwner?: IBooleanFilter | null

    /**
     * Filter by the object’s `year` field.
     */
    year?: IIntFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IMemberHotelRoomAssignmentFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IMemberHotelRoomAssignmentFilter> | null

    /**
     * Negates the expression.
     */
    not?: IMemberHotelRoomAssignmentFilter | null
  }

  /**
   * A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’
   */
  interface IBigIntFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: any | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: any | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: any | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: any | null

    /**
     * Included in the specified list.
     */
    in?: Array<any> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<any> | null

    /**
     * Less than the specified value.
     */
    lessThan?: any | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: any | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: any | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: any | null
  }

  /**
   * A connection to a list of `MemberHotelRoomAssignment` values.
   */
  interface IMemberHotelRoomAssignmentsConnection {
    __typename: 'MemberHotelRoomAssignmentsConnection'

    /**
     * A list of `MemberHotelRoomAssignment` objects.
     */
    nodes: Array<IMemberHotelRoomAssignment | null>

    /**
     * A list of edges which contains the `MemberHotelRoomAssignment` and cursor to aid in pagination.
     */
    edges: Array<IMemberHotelRoomAssignmentsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `MemberHotelRoomAssignment` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IMemberHotelRoomAssignment {
    __typename: 'MemberHotelRoomAssignment'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    memberId: any
    hotelRoomId: any
    roomOwner: boolean
    year: number

    /**
     * Reads a single `Membership` that is related to this `MemberHotelRoomAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `HotelRoomDetail` that is related to this `MemberHotelRoomAssignment`.
     */
    hotelRoom: IHotelRoomDetail | null
  }

  interface IHotelRoomDetail {
    __typename: 'HotelRoomDetail'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: any
    version: any
    bathroomType: string
    comment: string
    enabled: boolean
    gamingRoom: boolean
    internalRoomType: string
    name: string
    reserved: boolean
    reservedFor: string
    roomType: string
    formattedRoomType: string

    /**
     * Reads and enables pagination through a set of `MemberHotelRoomAssignment`.
     */
    memberHotelRoomAssignmentsByHotelRoomId: IMemberHotelRoomAssignmentsConnection
  }

  interface IMemberHotelRoomAssignmentsByHotelRoomIdOnHotelRoomDetailArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: IMemberHotelRoomAssignmentCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: IMemberHotelRoomAssignmentFilter | null
  }

  /**
   * A `MemberHotelRoomAssignment` edge in the connection.
   */
  interface IMemberHotelRoomAssignmentsEdge {
    __typename: 'MemberHotelRoomAssignmentsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `MemberHotelRoomAssignment` at the end of the edge.
     */
    node: IMemberHotelRoomAssignment | null
  }

  /**
   * A `GameChoice` edge in the connection.
   */
  interface IGameChoicesEdge {
    __typename: 'GameChoicesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `GameChoice` at the end of the edge.
     */
    node: IGameChoice | null
  }

  /**
   * A `Game` edge in the connection.
   */
  interface IGamesEdge {
    __typename: 'GamesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Game` at the end of the edge.
     */
    node: IGame | null
  }

  /**
   * Methods to use when ordering `HotelRoom`.
   */
  const enum HotelRoomsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    DESCRIPTION_ASC = 'DESCRIPTION_ASC',
    DESCRIPTION_DESC = 'DESCRIPTION_DESC',
    GAMING_ROOM_ASC = 'GAMING_ROOM_ASC',
    GAMING_ROOM_DESC = 'GAMING_ROOM_DESC',
    OCCUPANCY_ASC = 'OCCUPANCY_ASC',
    OCCUPANCY_DESC = 'OCCUPANCY_DESC',
    QUANTITY_ASC = 'QUANTITY_ASC',
    QUANTITY_DESC = 'QUANTITY_DESC',
    RATE_ASC = 'RATE_ASC',
    RATE_DESC = 'RATE_DESC',
    BATHROOM_TYPE_ASC = 'BATHROOM_TYPE_ASC',
    BATHROOM_TYPE_DESC = 'BATHROOM_TYPE_DESC',
    TYPE_ASC = 'TYPE_ASC',
    TYPE_DESC = 'TYPE_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_ASC = 'MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_ASC',
    MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_DESC = 'MEMBERSHIPS_BY_HOTEL_ROOM_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `HotelRoom` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface IHotelRoomCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `description` field.
     */
    description?: string | null

    /**
     * Checks for equality with the object’s `gamingRoom` field.
     */
    gamingRoom?: boolean | null

    /**
     * Checks for equality with the object’s `occupancy` field.
     */
    occupancy?: string | null

    /**
     * Checks for equality with the object’s `quantity` field.
     */
    quantity?: number | null

    /**
     * Checks for equality with the object’s `rate` field.
     */
    rate?: string | null

    /**
     * Checks for equality with the object’s `bathroomType` field.
     */
    bathroomType?: string | null

    /**
     * Checks for equality with the object’s `type` field.
     */
    type?: string | null
  }

  /**
   * A filter to be used against `HotelRoom` object types. All fields are combined with a logical ‘and.’
   */
  interface IHotelRoomFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `description` field.
     */
    description?: IStringFilter | null

    /**
     * Filter by the object’s `gamingRoom` field.
     */
    gamingRoom?: IBooleanFilter | null

    /**
     * Filter by the object’s `occupancy` field.
     */
    occupancy?: IStringFilter | null

    /**
     * Filter by the object’s `quantity` field.
     */
    quantity?: IIntFilter | null

    /**
     * Filter by the object’s `rate` field.
     */
    rate?: IStringFilter | null

    /**
     * Filter by the object’s `bathroomType` field.
     */
    bathroomType?: IStringFilter | null

    /**
     * Filter by the object’s `type` field.
     */
    type?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IHotelRoomFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IHotelRoomFilter> | null

    /**
     * Negates the expression.
     */
    not?: IHotelRoomFilter | null
  }

  /**
   * A connection to a list of `HotelRoom` values.
   */
  interface IHotelRoomsConnection {
    __typename: 'HotelRoomsConnection'

    /**
     * A list of `HotelRoom` objects.
     */
    nodes: Array<IHotelRoom | null>

    /**
     * A list of edges which contains the `HotelRoom` and cursor to aid in pagination.
     */
    edges: Array<IHotelRoomsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `HotelRoom` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `HotelRoom` edge in the connection.
   */
  interface IHotelRoomsEdge {
    __typename: 'HotelRoomsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `HotelRoom` at the end of the edge.
     */
    node: IHotelRoom | null
  }

  /**
   * Methods to use when ordering `HotelRoomDetail`.
   */
  const enum HotelRoomDetailsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    VERSION_ASC = 'VERSION_ASC',
    VERSION_DESC = 'VERSION_DESC',
    BATHROOM_TYPE_ASC = 'BATHROOM_TYPE_ASC',
    BATHROOM_TYPE_DESC = 'BATHROOM_TYPE_DESC',
    COMMENT_ASC = 'COMMENT_ASC',
    COMMENT_DESC = 'COMMENT_DESC',
    ENABLED_ASC = 'ENABLED_ASC',
    ENABLED_DESC = 'ENABLED_DESC',
    GAMING_ROOM_ASC = 'GAMING_ROOM_ASC',
    GAMING_ROOM_DESC = 'GAMING_ROOM_DESC',
    INTERNAL_ROOM_TYPE_ASC = 'INTERNAL_ROOM_TYPE_ASC',
    INTERNAL_ROOM_TYPE_DESC = 'INTERNAL_ROOM_TYPE_DESC',
    NAME_ASC = 'NAME_ASC',
    NAME_DESC = 'NAME_DESC',
    RESERVED_ASC = 'RESERVED_ASC',
    RESERVED_DESC = 'RESERVED_DESC',
    RESERVED_FOR_ASC = 'RESERVED_FOR_ASC',
    RESERVED_FOR_DESC = 'RESERVED_FOR_DESC',
    ROOM_TYPE_ASC = 'ROOM_TYPE_ASC',
    ROOM_TYPE_DESC = 'ROOM_TYPE_DESC',
    FORMATTED_ROOM_TYPE_ASC = 'FORMATTED_ROOM_TYPE_ASC',
    FORMATTED_ROOM_TYPE_DESC = 'FORMATTED_ROOM_TYPE_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_HOTEL_ROOM_ID__COUNT_ASC = 'MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_HOTEL_ROOM_ID__COUNT_ASC',
    MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_HOTEL_ROOM_ID__COUNT_DESC = 'MEMBER_HOTEL_ROOM_ASSIGNMENTS_BY_HOTEL_ROOM_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `HotelRoomDetail` object types. All fields are
   * tested for equality and combined with a logical ‘and.’
   */
  interface IHotelRoomDetailCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: any | null

    /**
     * Checks for equality with the object’s `version` field.
     */
    version?: any | null

    /**
     * Checks for equality with the object’s `bathroomType` field.
     */
    bathroomType?: string | null

    /**
     * Checks for equality with the object’s `comment` field.
     */
    comment?: string | null

    /**
     * Checks for equality with the object’s `enabled` field.
     */
    enabled?: boolean | null

    /**
     * Checks for equality with the object’s `gamingRoom` field.
     */
    gamingRoom?: boolean | null

    /**
     * Checks for equality with the object’s `internalRoomType` field.
     */
    internalRoomType?: string | null

    /**
     * Checks for equality with the object’s `name` field.
     */
    name?: string | null

    /**
     * Checks for equality with the object’s `reserved` field.
     */
    reserved?: boolean | null

    /**
     * Checks for equality with the object’s `reservedFor` field.
     */
    reservedFor?: string | null

    /**
     * Checks for equality with the object’s `roomType` field.
     */
    roomType?: string | null

    /**
     * Checks for equality with the object’s `formattedRoomType` field.
     */
    formattedRoomType?: string | null
  }

  /**
   * A filter to be used against `HotelRoomDetail` object types. All fields are combined with a logical ‘and.’
   */
  interface IHotelRoomDetailFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IBigIntFilter | null

    /**
     * Filter by the object’s `version` field.
     */
    version?: IBigIntFilter | null

    /**
     * Filter by the object’s `bathroomType` field.
     */
    bathroomType?: IStringFilter | null

    /**
     * Filter by the object’s `comment` field.
     */
    comment?: IStringFilter | null

    /**
     * Filter by the object’s `enabled` field.
     */
    enabled?: IBooleanFilter | null

    /**
     * Filter by the object’s `gamingRoom` field.
     */
    gamingRoom?: IBooleanFilter | null

    /**
     * Filter by the object’s `internalRoomType` field.
     */
    internalRoomType?: IStringFilter | null

    /**
     * Filter by the object’s `name` field.
     */
    name?: IStringFilter | null

    /**
     * Filter by the object’s `reserved` field.
     */
    reserved?: IBooleanFilter | null

    /**
     * Filter by the object’s `reservedFor` field.
     */
    reservedFor?: IStringFilter | null

    /**
     * Filter by the object’s `roomType` field.
     */
    roomType?: IStringFilter | null

    /**
     * Filter by the object’s `formattedRoomType` field.
     */
    formattedRoomType?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IHotelRoomDetailFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IHotelRoomDetailFilter> | null

    /**
     * Negates the expression.
     */
    not?: IHotelRoomDetailFilter | null
  }

  /**
   * A connection to a list of `HotelRoomDetail` values.
   */
  interface IHotelRoomDetailsConnection {
    __typename: 'HotelRoomDetailsConnection'

    /**
     * A list of `HotelRoomDetail` objects.
     */
    nodes: Array<IHotelRoomDetail | null>

    /**
     * A list of edges which contains the `HotelRoomDetail` and cursor to aid in pagination.
     */
    edges: Array<IHotelRoomDetailsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `HotelRoomDetail` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `HotelRoomDetail` edge in the connection.
   */
  interface IHotelRoomDetailsEdge {
    __typename: 'HotelRoomDetailsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `HotelRoomDetail` at the end of the edge.
     */
    node: IHotelRoomDetail | null
  }

  /**
   * Methods to use when ordering `Lookup`.
   */
  const enum LookupsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    CODE_MAXIMUM_ASC = 'CODE_MAXIMUM_ASC',
    CODE_MAXIMUM_DESC = 'CODE_MAXIMUM_DESC',
    CODE_MINIMUM_ASC = 'CODE_MINIMUM_ASC',
    CODE_MINIMUM_DESC = 'CODE_MINIMUM_DESC',
    CODE_SCALE_ASC = 'CODE_SCALE_ASC',
    CODE_SCALE_DESC = 'CODE_SCALE_DESC',
    CODE_TYPE_ASC = 'CODE_TYPE_ASC',
    CODE_TYPE_DESC = 'CODE_TYPE_DESC',
    INTERNATIONALIZE_ASC = 'INTERNATIONALIZE_ASC',
    INTERNATIONALIZE_DESC = 'INTERNATIONALIZE_DESC',
    ORDERING_ASC = 'ORDERING_ASC',
    ORDERING_DESC = 'ORDERING_DESC',
    REALM_ASC = 'REALM_ASC',
    REALM_DESC = 'REALM_DESC',
    VALUE_MAXIMUM_ASC = 'VALUE_MAXIMUM_ASC',
    VALUE_MAXIMUM_DESC = 'VALUE_MAXIMUM_DESC',
    VALUE_MINIMUM_ASC = 'VALUE_MINIMUM_ASC',
    VALUE_MINIMUM_DESC = 'VALUE_MINIMUM_DESC',
    VALUE_SCALE_ASC = 'VALUE_SCALE_ASC',
    VALUE_SCALE_DESC = 'VALUE_SCALE_DESC',
    VALUE_TYPE_ASC = 'VALUE_TYPE_ASC',
    VALUE_TYPE_DESC = 'VALUE_TYPE_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_ASC = 'LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_ASC',
    LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_DESC = 'LOOKUP_VALUES_BY_LOOKUP_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Lookup` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface ILookupCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `codeMaximum` field.
     */
    codeMaximum?: string | null

    /**
     * Checks for equality with the object’s `codeMinimum` field.
     */
    codeMinimum?: string | null

    /**
     * Checks for equality with the object’s `codeScale` field.
     */
    codeScale?: number | null

    /**
     * Checks for equality with the object’s `codeType` field.
     */
    codeType?: string | null

    /**
     * Checks for equality with the object’s `internationalize` field.
     */
    internationalize?: boolean | null

    /**
     * Checks for equality with the object’s `ordering` field.
     */
    ordering?: string | null

    /**
     * Checks for equality with the object’s `realm` field.
     */
    realm?: string | null

    /**
     * Checks for equality with the object’s `valueMaximum` field.
     */
    valueMaximum?: string | null

    /**
     * Checks for equality with the object’s `valueMinimum` field.
     */
    valueMinimum?: string | null

    /**
     * Checks for equality with the object’s `valueScale` field.
     */
    valueScale?: number | null

    /**
     * Checks for equality with the object’s `valueType` field.
     */
    valueType?: string | null
  }

  /**
   * A filter to be used against `Lookup` object types. All fields are combined with a logical ‘and.’
   */
  interface ILookupFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `codeMaximum` field.
     */
    codeMaximum?: IStringFilter | null

    /**
     * Filter by the object’s `codeMinimum` field.
     */
    codeMinimum?: IStringFilter | null

    /**
     * Filter by the object’s `codeScale` field.
     */
    codeScale?: IIntFilter | null

    /**
     * Filter by the object’s `codeType` field.
     */
    codeType?: IStringFilter | null

    /**
     * Filter by the object’s `internationalize` field.
     */
    internationalize?: IBooleanFilter | null

    /**
     * Filter by the object’s `ordering` field.
     */
    ordering?: IStringFilter | null

    /**
     * Filter by the object’s `realm` field.
     */
    realm?: IStringFilter | null

    /**
     * Filter by the object’s `valueMaximum` field.
     */
    valueMaximum?: IStringFilter | null

    /**
     * Filter by the object’s `valueMinimum` field.
     */
    valueMinimum?: IStringFilter | null

    /**
     * Filter by the object’s `valueScale` field.
     */
    valueScale?: IIntFilter | null

    /**
     * Filter by the object’s `valueType` field.
     */
    valueType?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<ILookupFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<ILookupFilter> | null

    /**
     * Negates the expression.
     */
    not?: ILookupFilter | null
  }

  /**
   * A connection to a list of `Lookup` values.
   */
  interface ILookupsConnection {
    __typename: 'LookupsConnection'

    /**
     * A list of `Lookup` objects.
     */
    nodes: Array<ILookup | null>

    /**
     * A list of edges which contains the `Lookup` and cursor to aid in pagination.
     */
    edges: Array<ILookupsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Lookup` you could get from the connection.
     */
    totalCount: number | null
  }

  interface ILookup {
    __typename: 'Lookup'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    codeMaximum: string | null
    codeMinimum: string | null
    codeScale: number | null
    codeType: string
    internationalize: boolean
    ordering: string
    realm: string
    valueMaximum: string | null
    valueMinimum: string | null
    valueScale: number | null
    valueType: string

    /**
     * Reads and enables pagination through a set of `LookupValue`.
     */
    lookupValues: ILookupValuesConnection
  }

  interface ILookupValuesOnLookupArguments {
    /**
     * Only read the first `n` values of the set.
     */
    first?: number | null

    /**
     * Only read the last `n` values of the set.
     */
    last?: number | null

    /**
     * Skip the first `n` values from our `after` cursor, an alternative to cursor
     * based pagination. May not be used with `last`.
     */
    offset?: number | null

    /**
     * Read all values in the set before (above) this cursor.
     */
    before?: any | null

    /**
     * Read all values in the set after (below) this cursor.
     */
    after?: any | null

    /**
     * The method to use when ordering `LookupValue`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupValuesOrderBy> | null

    /**
     * A condition to be used in determining which values should be returned by the collection.
     */
    condition?: ILookupValueCondition | null

    /**
     * A filter to be used in determining which values should be returned by the collection.
     */
    filter?: ILookupValueFilter | null
  }

  /**
   * Methods to use when ordering `LookupValue`.
   */
  const enum LookupValuesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    CODE_ASC = 'CODE_ASC',
    CODE_DESC = 'CODE_DESC',
    LOOKUP_ID_ASC = 'LOOKUP_ID_ASC',
    LOOKUP_ID_DESC = 'LOOKUP_ID_DESC',
    NUMERIC_SEQUENCER_ASC = 'NUMERIC_SEQUENCER_ASC',
    NUMERIC_SEQUENCER_DESC = 'NUMERIC_SEQUENCER_DESC',
    SEQUENCER_ASC = 'SEQUENCER_ASC',
    SEQUENCER_DESC = 'SEQUENCER_DESC',
    STRING_SEQUENCER_ASC = 'STRING_SEQUENCER_ASC',
    STRING_SEQUENCER_DESC = 'STRING_SEQUENCER_DESC',
    VALUE_ASC = 'VALUE_ASC',
    VALUE_DESC = 'VALUE_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    LOOKUP_BY_LOOKUP_ID__ID_ASC = 'LOOKUP_BY_LOOKUP_ID__ID_ASC',
    LOOKUP_BY_LOOKUP_ID__ID_DESC = 'LOOKUP_BY_LOOKUP_ID__ID_DESC',
    LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_ASC = 'LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_ASC',
    LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_DESC = 'LOOKUP_BY_LOOKUP_ID__CODE_MAXIMUM_DESC',
    LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_ASC = 'LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_ASC',
    LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_DESC = 'LOOKUP_BY_LOOKUP_ID__CODE_MINIMUM_DESC',
    LOOKUP_BY_LOOKUP_ID__CODE_SCALE_ASC = 'LOOKUP_BY_LOOKUP_ID__CODE_SCALE_ASC',
    LOOKUP_BY_LOOKUP_ID__CODE_SCALE_DESC = 'LOOKUP_BY_LOOKUP_ID__CODE_SCALE_DESC',
    LOOKUP_BY_LOOKUP_ID__CODE_TYPE_ASC = 'LOOKUP_BY_LOOKUP_ID__CODE_TYPE_ASC',
    LOOKUP_BY_LOOKUP_ID__CODE_TYPE_DESC = 'LOOKUP_BY_LOOKUP_ID__CODE_TYPE_DESC',
    LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_ASC = 'LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_ASC',
    LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_DESC = 'LOOKUP_BY_LOOKUP_ID__INTERNATIONALIZE_DESC',
    LOOKUP_BY_LOOKUP_ID__ORDERING_ASC = 'LOOKUP_BY_LOOKUP_ID__ORDERING_ASC',
    LOOKUP_BY_LOOKUP_ID__ORDERING_DESC = 'LOOKUP_BY_LOOKUP_ID__ORDERING_DESC',
    LOOKUP_BY_LOOKUP_ID__REALM_ASC = 'LOOKUP_BY_LOOKUP_ID__REALM_ASC',
    LOOKUP_BY_LOOKUP_ID__REALM_DESC = 'LOOKUP_BY_LOOKUP_ID__REALM_DESC',
    LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_ASC = 'LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_ASC',
    LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_DESC = 'LOOKUP_BY_LOOKUP_ID__VALUE_MAXIMUM_DESC',
    LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_ASC = 'LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_ASC',
    LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_DESC = 'LOOKUP_BY_LOOKUP_ID__VALUE_MINIMUM_DESC',
    LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_ASC = 'LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_ASC',
    LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_DESC = 'LOOKUP_BY_LOOKUP_ID__VALUE_SCALE_DESC',
    LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_ASC = 'LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_ASC',
    LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_DESC = 'LOOKUP_BY_LOOKUP_ID__VALUE_TYPE_DESC'
  }

  /**
   * A condition to be used against `LookupValue` object types. All fields are tested
   * for equality and combined with a logical ‘and.’
   */
  interface ILookupValueCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `code` field.
     */
    code?: string | null

    /**
     * Checks for equality with the object’s `lookupId` field.
     */
    lookupId?: number | null

    /**
     * Checks for equality with the object’s `numericSequencer` field.
     */
    numericSequencer?: any | null

    /**
     * Checks for equality with the object’s `sequencer` field.
     */
    sequencer?: number | null

    /**
     * Checks for equality with the object’s `stringSequencer` field.
     */
    stringSequencer?: string | null

    /**
     * Checks for equality with the object’s `value` field.
     */
    value?: string | null
  }

  /**
   * A filter to be used against `LookupValue` object types. All fields are combined with a logical ‘and.’
   */
  interface ILookupValueFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `code` field.
     */
    code?: IStringFilter | null

    /**
     * Filter by the object’s `lookupId` field.
     */
    lookupId?: IIntFilter | null

    /**
     * Filter by the object’s `numericSequencer` field.
     */
    numericSequencer?: IBigFloatFilter | null

    /**
     * Filter by the object’s `sequencer` field.
     */
    sequencer?: IIntFilter | null

    /**
     * Filter by the object’s `stringSequencer` field.
     */
    stringSequencer?: IStringFilter | null

    /**
     * Filter by the object’s `value` field.
     */
    value?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<ILookupValueFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<ILookupValueFilter> | null

    /**
     * Negates the expression.
     */
    not?: ILookupValueFilter | null
  }

  /**
   * A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’
   */
  interface IBigFloatFilter {
    /**
     * Is null (if `true` is specified) or is not null (if `false` is specified).
     */
    isNull?: boolean | null

    /**
     * Equal to the specified value.
     */
    equalTo?: any | null

    /**
     * Not equal to the specified value.
     */
    notEqualTo?: any | null

    /**
     * Not equal to the specified value, treating null like an ordinary value.
     */
    distinctFrom?: any | null

    /**
     * Equal to the specified value, treating null like an ordinary value.
     */
    notDistinctFrom?: any | null

    /**
     * Included in the specified list.
     */
    in?: Array<any> | null

    /**
     * Not included in the specified list.
     */
    notIn?: Array<any> | null

    /**
     * Less than the specified value.
     */
    lessThan?: any | null

    /**
     * Less than or equal to the specified value.
     */
    lessThanOrEqualTo?: any | null

    /**
     * Greater than the specified value.
     */
    greaterThan?: any | null

    /**
     * Greater than or equal to the specified value.
     */
    greaterThanOrEqualTo?: any | null
  }

  /**
   * A connection to a list of `LookupValue` values.
   */
  interface ILookupValuesConnection {
    __typename: 'LookupValuesConnection'

    /**
     * A list of `LookupValue` objects.
     */
    nodes: Array<ILookupValue | null>

    /**
     * A list of edges which contains the `LookupValue` and cursor to aid in pagination.
     */
    edges: Array<ILookupValuesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `LookupValue` you could get from the connection.
     */
    totalCount: number | null
  }

  interface ILookupValue {
    __typename: 'LookupValue'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    code: string
    lookupId: number
    numericSequencer: any
    sequencer: number
    stringSequencer: string
    value: string

    /**
     * Reads a single `Lookup` that is related to this `LookupValue`.
     */
    lookup: ILookup | null
  }

  /**
   * A `LookupValue` edge in the connection.
   */
  interface ILookupValuesEdge {
    __typename: 'LookupValuesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `LookupValue` at the end of the edge.
     */
    node: ILookupValue | null
  }

  /**
   * A `Lookup` edge in the connection.
   */
  interface ILookupsEdge {
    __typename: 'LookupsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Lookup` at the end of the edge.
     */
    node: ILookup | null
  }

  /**
   * Methods to use when ordering `Profile`.
   */
  const enum ProfilesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    EMAIL_ASC = 'EMAIL_ASC',
    EMAIL_DESC = 'EMAIL_DESC',
    FULL_NAME_ASC = 'FULL_NAME_ASC',
    FULL_NAME_DESC = 'FULL_NAME_DESC',
    PHONE_NUMBER_ASC = 'PHONE_NUMBER_ASC',
    PHONE_NUMBER_DESC = 'PHONE_NUMBER_DESC',
    SNAIL_MAIL_ADDRESS_ASC = 'SNAIL_MAIL_ADDRESS_ASC',
    SNAIL_MAIL_ADDRESS_DESC = 'SNAIL_MAIL_ADDRESS_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    USERS_BY_PROFILE_ID__COUNT_ASC = 'USERS_BY_PROFILE_ID__COUNT_ASC',
    USERS_BY_PROFILE_ID__COUNT_DESC = 'USERS_BY_PROFILE_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Profile` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface IProfileCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `email` field.
     */
    email?: string | null

    /**
     * Checks for equality with the object’s `fullName` field.
     */
    fullName?: string | null

    /**
     * Checks for equality with the object’s `phoneNumber` field.
     */
    phoneNumber?: string | null

    /**
     * Checks for equality with the object’s `snailMailAddress` field.
     */
    snailMailAddress?: string | null
  }

  /**
   * A filter to be used against `Profile` object types. All fields are combined with a logical ‘and.’
   */
  interface IProfileFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `email` field.
     */
    email?: IStringFilter | null

    /**
     * Filter by the object’s `fullName` field.
     */
    fullName?: IStringFilter | null

    /**
     * Filter by the object’s `phoneNumber` field.
     */
    phoneNumber?: IStringFilter | null

    /**
     * Filter by the object’s `snailMailAddress` field.
     */
    snailMailAddress?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IProfileFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IProfileFilter> | null

    /**
     * Negates the expression.
     */
    not?: IProfileFilter | null
  }

  /**
   * A connection to a list of `Profile` values.
   */
  interface IProfilesConnection {
    __typename: 'ProfilesConnection'

    /**
     * A list of `Profile` objects.
     */
    nodes: Array<IProfile | null>

    /**
     * A list of edges which contains the `Profile` and cursor to aid in pagination.
     */
    edges: Array<IProfilesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Profile` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `Profile` edge in the connection.
   */
  interface IProfilesEdge {
    __typename: 'ProfilesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Profile` at the end of the edge.
     */
    node: IProfile | null
  }

  /**
   * Methods to use when ordering `RegistrationCode`.
   */
  const enum RegistrationCodesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    TOKEN_ASC = 'TOKEN_ASC',
    TOKEN_DESC = 'TOKEN_DESC',
    USERNAME_ASC = 'USERNAME_ASC',
    USERNAME_DESC = 'USERNAME_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
  }

  /**
   * A condition to be used against `RegistrationCode` object types. All fields are
   * tested for equality and combined with a logical ‘and.’
   */
  interface IRegistrationCodeCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `token` field.
     */
    token?: string | null

    /**
     * Checks for equality with the object’s `username` field.
     */
    username?: string | null
  }

  /**
   * A filter to be used against `RegistrationCode` object types. All fields are combined with a logical ‘and.’
   */
  interface IRegistrationCodeFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `token` field.
     */
    token?: IStringFilter | null

    /**
     * Filter by the object’s `username` field.
     */
    username?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IRegistrationCodeFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IRegistrationCodeFilter> | null

    /**
     * Negates the expression.
     */
    not?: IRegistrationCodeFilter | null
  }

  /**
   * A connection to a list of `RegistrationCode` values.
   */
  interface IRegistrationCodesConnection {
    __typename: 'RegistrationCodesConnection'

    /**
     * A list of `RegistrationCode` objects.
     */
    nodes: Array<IRegistrationCode | null>

    /**
     * A list of edges which contains the `RegistrationCode` and cursor to aid in pagination.
     */
    edges: Array<IRegistrationCodesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `RegistrationCode` you could get from the connection.
     */
    totalCount: number | null
  }

  interface IRegistrationCode {
    __typename: 'RegistrationCode'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    token: string
    username: string
  }

  /**
   * A `RegistrationCode` edge in the connection.
   */
  interface IRegistrationCodesEdge {
    __typename: 'RegistrationCodesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `RegistrationCode` at the end of the edge.
     */
    node: IRegistrationCode | null
  }

  /**
   * Methods to use when ordering `Role`.
   */
  const enum RolesOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    AUTHORITY_ASC = 'AUTHORITY_ASC',
    AUTHORITY_DESC = 'AUTHORITY_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    USER_ROLES_BY_ROLE_ID__COUNT_ASC = 'USER_ROLES_BY_ROLE_ID__COUNT_ASC',
    USER_ROLES_BY_ROLE_ID__COUNT_DESC = 'USER_ROLES_BY_ROLE_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Role` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface IRoleCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `authority` field.
     */
    authority?: string | null
  }

  /**
   * A filter to be used against `Role` object types. All fields are combined with a logical ‘and.’
   */
  interface IRoleFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `authority` field.
     */
    authority?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IRoleFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IRoleFilter> | null

    /**
     * Negates the expression.
     */
    not?: IRoleFilter | null
  }

  /**
   * A connection to a list of `Role` values.
   */
  interface IRolesConnection {
    __typename: 'RolesConnection'

    /**
     * A list of `Role` objects.
     */
    nodes: Array<IRole | null>

    /**
     * A list of edges which contains the `Role` and cursor to aid in pagination.
     */
    edges: Array<IRolesEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Role` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `Role` edge in the connection.
   */
  interface IRolesEdge {
    __typename: 'RolesEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Role` at the end of the edge.
     */
    node: IRole | null
  }

  /**
   * Methods to use when ordering `Room`.
   */
  const enum RoomsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    DESCRIPTION_ASC = 'DESCRIPTION_ASC',
    DESCRIPTION_DESC = 'DESCRIPTION_DESC',
    SIZE_ASC = 'SIZE_ASC',
    SIZE_DESC = 'SIZE_DESC',
    TYPE_ASC = 'TYPE_ASC',
    TYPE_DESC = 'TYPE_DESC',
    UPDATED_ASC = 'UPDATED_ASC',
    UPDATED_DESC = 'UPDATED_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    GAMES_BY_ROOM_ID__COUNT_ASC = 'GAMES_BY_ROOM_ID__COUNT_ASC',
    GAMES_BY_ROOM_ID__COUNT_DESC = 'GAMES_BY_ROOM_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Room` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface IRoomCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `description` field.
     */
    description?: string | null

    /**
     * Checks for equality with the object’s `size` field.
     */
    size?: number | null

    /**
     * Checks for equality with the object’s `type` field.
     */
    type?: string | null

    /**
     * Checks for equality with the object’s `updated` field.
     */
    updated?: boolean | null
  }

  /**
   * A filter to be used against `Room` object types. All fields are combined with a logical ‘and.’
   */
  interface IRoomFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `description` field.
     */
    description?: IStringFilter | null

    /**
     * Filter by the object’s `size` field.
     */
    size?: IIntFilter | null

    /**
     * Filter by the object’s `type` field.
     */
    type?: IStringFilter | null

    /**
     * Filter by the object’s `updated` field.
     */
    updated?: IBooleanFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<IRoomFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<IRoomFilter> | null

    /**
     * Negates the expression.
     */
    not?: IRoomFilter | null
  }

  /**
   * A connection to a list of `Room` values.
   */
  interface IRoomsConnection {
    __typename: 'RoomsConnection'

    /**
     * A list of `Room` objects.
     */
    nodes: Array<IRoom | null>

    /**
     * A list of edges which contains the `Room` and cursor to aid in pagination.
     */
    edges: Array<IRoomsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Room` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `Room` edge in the connection.
   */
  interface IRoomsEdge {
    __typename: 'RoomsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Room` at the end of the edge.
     */
    node: IRoom | null
  }

  /**
   * Methods to use when ordering `Setting`.
   */
  const enum SettingsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    CODE_ASC = 'CODE_ASC',
    CODE_DESC = 'CODE_DESC',
    TYPE_ASC = 'TYPE_ASC',
    TYPE_DESC = 'TYPE_DESC',
    VALUE_ASC = 'VALUE_ASC',
    VALUE_DESC = 'VALUE_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
  }

  /**
   * A condition to be used against `Setting` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface ISettingCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `code` field.
     */
    code?: string | null

    /**
     * Checks for equality with the object’s `type` field.
     */
    type?: string | null

    /**
     * Checks for equality with the object’s `value` field.
     */
    value?: string | null
  }

  /**
   * A filter to be used against `Setting` object types. All fields are combined with a logical ‘and.’
   */
  interface ISettingFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `code` field.
     */
    code?: IStringFilter | null

    /**
     * Filter by the object’s `type` field.
     */
    type?: IStringFilter | null

    /**
     * Filter by the object’s `value` field.
     */
    value?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<ISettingFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<ISettingFilter> | null

    /**
     * Negates the expression.
     */
    not?: ISettingFilter | null
  }

  /**
   * A connection to a list of `Setting` values.
   */
  interface ISettingsConnection {
    __typename: 'SettingsConnection'

    /**
     * A list of `Setting` objects.
     */
    nodes: Array<ISetting | null>

    /**
     * A list of edges which contains the `Setting` and cursor to aid in pagination.
     */
    edges: Array<ISettingsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Setting` you could get from the connection.
     */
    totalCount: number | null
  }

  interface ISetting {
    __typename: 'Setting'

    /**
     * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
     */
    nodeId: string
    id: number
    code: string
    type: string
    value: string
  }

  /**
   * A `Setting` edge in the connection.
   */
  interface ISettingsEdge {
    __typename: 'SettingsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Setting` at the end of the edge.
     */
    node: ISetting | null
  }

  /**
   * Methods to use when ordering `Slot`.
   */
  const enum SlotsOrderBy {
    NATURAL = 'NATURAL',
    ID_ASC = 'ID_ASC',
    ID_DESC = 'ID_DESC',
    SLOT_ASC = 'SLOT_ASC',
    SLOT_DESC = 'SLOT_DESC',
    DAY_ASC = 'DAY_ASC',
    DAY_DESC = 'DAY_DESC',
    FORMATTED_DATE_ASC = 'FORMATTED_DATE_ASC',
    FORMATTED_DATE_DESC = 'FORMATTED_DATE_DESC',
    LENGTH_ASC = 'LENGTH_ASC',
    LENGTH_DESC = 'LENGTH_DESC',
    TIME_ASC = 'TIME_ASC',
    TIME_DESC = 'TIME_DESC',
    PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
    PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC',
    GAMES_BY_SLOT_ID__COUNT_ASC = 'GAMES_BY_SLOT_ID__COUNT_ASC',
    GAMES_BY_SLOT_ID__COUNT_DESC = 'GAMES_BY_SLOT_ID__COUNT_DESC',
    GAME_CHOICES_BY_SLOT_ID__COUNT_ASC = 'GAME_CHOICES_BY_SLOT_ID__COUNT_ASC',
    GAME_CHOICES_BY_SLOT_ID__COUNT_DESC = 'GAME_CHOICES_BY_SLOT_ID__COUNT_DESC'
  }

  /**
   * A condition to be used against `Slot` object types. All fields are tested for equality and combined with a logical ‘and.’
   */
  interface ISlotCondition {
    /**
     * Checks for equality with the object’s `id` field.
     */
    id?: number | null

    /**
     * Checks for equality with the object’s `slot` field.
     */
    slot?: number | null

    /**
     * Checks for equality with the object’s `day` field.
     */
    day?: string | null

    /**
     * Checks for equality with the object’s `formattedDate` field.
     */
    formattedDate?: string | null

    /**
     * Checks for equality with the object’s `length` field.
     */
    length?: string | null

    /**
     * Checks for equality with the object’s `time` field.
     */
    time?: string | null
  }

  /**
   * A filter to be used against `Slot` object types. All fields are combined with a logical ‘and.’
   */
  interface ISlotFilter {
    /**
     * Filter by the object’s `id` field.
     */
    id?: IIntFilter | null

    /**
     * Filter by the object’s `slot` field.
     */
    slot?: IIntFilter | null

    /**
     * Filter by the object’s `day` field.
     */
    day?: IStringFilter | null

    /**
     * Filter by the object’s `formattedDate` field.
     */
    formattedDate?: IStringFilter | null

    /**
     * Filter by the object’s `length` field.
     */
    length?: IStringFilter | null

    /**
     * Filter by the object’s `time` field.
     */
    time?: IStringFilter | null

    /**
     * Checks for all expressions in this list.
     */
    and?: Array<ISlotFilter> | null

    /**
     * Checks for any expressions in this list.
     */
    or?: Array<ISlotFilter> | null

    /**
     * Negates the expression.
     */
    not?: ISlotFilter | null
  }

  /**
   * A connection to a list of `Slot` values.
   */
  interface ISlotsConnection {
    __typename: 'SlotsConnection'

    /**
     * A list of `Slot` objects.
     */
    nodes: Array<ISlot | null>

    /**
     * A list of edges which contains the `Slot` and cursor to aid in pagination.
     */
    edges: Array<ISlotsEdge>

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo

    /**
     * The count of *all* `Slot` you could get from the connection.
     */
    totalCount: number | null
  }

  /**
   * A `Slot` edge in the connection.
   */
  interface ISlotsEdge {
    __typename: 'SlotsEdge'

    /**
     * A cursor for use in pagination.
     */
    cursor: any | null

    /**
     * The `Slot` at the end of the edge.
     */
    node: ISlot | null
  }

  /**
   * The root mutation type which contains root level fields which mutate data.
   */
  interface IMutation {
    __typename: 'Mutation'

    /**
     * Creates a single `Game`.
     */
    createGame: ICreateGamePayload | null

    /**
     * Creates a single `GameAssignment`.
     */
    createGameAssignment: ICreateGameAssignmentPayload | null

    /**
     * Creates a single `GameChoice`.
     */
    createGameChoice: ICreateGameChoicePayload | null

    /**
     * Creates a single `GameSubmission`.
     */
    createGameSubmission: ICreateGameSubmissionPayload | null

    /**
     * Creates a single `HotelRoom`.
     */
    createHotelRoom: ICreateHotelRoomPayload | null

    /**
     * Creates a single `HotelRoomDetail`.
     */
    createHotelRoomDetail: ICreateHotelRoomDetailPayload | null

    /**
     * Creates a single `Lookup`.
     */
    createLookup: ICreateLookupPayload | null

    /**
     * Creates a single `LookupValue`.
     */
    createLookupValue: ICreateLookupValuePayload | null

    /**
     * Creates a single `MemberHotelRoomAssignment`.
     */
    createMemberHotelRoomAssignment: ICreateMemberHotelRoomAssignmentPayload | null

    /**
     * Creates a single `Membership`.
     */
    createMembership: ICreateMembershipPayload | null

    /**
     * Creates a single `Profile`.
     */
    createProfile: ICreateProfilePayload | null

    /**
     * Creates a single `RegistrationCode`.
     */
    createRegistrationCode: ICreateRegistrationCodePayload | null

    /**
     * Creates a single `Role`.
     */
    createRole: ICreateRolePayload | null

    /**
     * Creates a single `Room`.
     */
    createRoom: ICreateRoomPayload | null

    /**
     * Creates a single `Setting`.
     */
    createSetting: ICreateSettingPayload | null

    /**
     * Creates a single `ShirtOrder`.
     */
    createShirtOrder: ICreateShirtOrderPayload | null

    /**
     * Creates a single `ShirtOrderItem`.
     */
    createShirtOrderItem: ICreateShirtOrderItemPayload | null

    /**
     * Creates a single `Slot`.
     */
    createSlot: ICreateSlotPayload | null

    /**
     * Creates a single `Token`.
     */
    createToken: ICreateTokenPayload | null

    /**
     * Creates a single `User`.
     */
    createUser: ICreateUserPayload | null

    /**
     * Creates a single `UserRole`.
     */
    createUserRole: ICreateUserRolePayload | null

    /**
     * Updates a single `Game` using its globally unique id and a patch.
     */
    updateGameByNodeId: IUpdateGamePayload | null

    /**
     * Updates a single `Game` using a unique key and a patch.
     */
    updateGame: IUpdateGamePayload | null

    /**
     * Updates a single `GameAssignment` using its globally unique id and a patch.
     */
    updateGameAssignmentByNodeId: IUpdateGameAssignmentPayload | null

    /**
     * Updates a single `GameAssignment` using a unique key and a patch.
     */
    updateGameAssignment: IUpdateGameAssignmentPayload | null

    /**
     * Updates a single `GameChoice` using its globally unique id and a patch.
     */
    updateGameChoiceByNodeId: IUpdateGameChoicePayload | null

    /**
     * Updates a single `GameChoice` using a unique key and a patch.
     */
    updateGameChoice: IUpdateGameChoicePayload | null

    /**
     * Updates a single `GameSubmission` using its globally unique id and a patch.
     */
    updateGameSubmissionByNodeId: IUpdateGameSubmissionPayload | null

    /**
     * Updates a single `GameSubmission` using a unique key and a patch.
     */
    updateGameSubmission: IUpdateGameSubmissionPayload | null

    /**
     * Updates a single `HotelRoom` using its globally unique id and a patch.
     */
    updateHotelRoomByNodeId: IUpdateHotelRoomPayload | null

    /**
     * Updates a single `HotelRoom` using a unique key and a patch.
     */
    updateHotelRoom: IUpdateHotelRoomPayload | null

    /**
     * Updates a single `HotelRoomDetail` using its globally unique id and a patch.
     */
    updateHotelRoomDetailByNodeId: IUpdateHotelRoomDetailPayload | null

    /**
     * Updates a single `HotelRoomDetail` using a unique key and a patch.
     */
    updateHotelRoomDetail: IUpdateHotelRoomDetailPayload | null

    /**
     * Updates a single `Lookup` using its globally unique id and a patch.
     */
    updateLookupByNodeId: IUpdateLookupPayload | null

    /**
     * Updates a single `Lookup` using a unique key and a patch.
     */
    updateLookup: IUpdateLookupPayload | null

    /**
     * Updates a single `Lookup` using a unique key and a patch.
     */
    updateLookupByRealm: IUpdateLookupPayload | null

    /**
     * Updates a single `LookupValue` using its globally unique id and a patch.
     */
    updateLookupValueByNodeId: IUpdateLookupValuePayload | null

    /**
     * Updates a single `LookupValue` using a unique key and a patch.
     */
    updateLookupValue: IUpdateLookupValuePayload | null

    /**
     * Updates a single `LookupValue` using a unique key and a patch.
     */
    updateLookupValueByLookupIdAndCode: IUpdateLookupValuePayload | null

    /**
     * Updates a single `MemberHotelRoomAssignment` using its globally unique id and a patch.
     */
    updateMemberHotelRoomAssignmentByNodeId: IUpdateMemberHotelRoomAssignmentPayload | null

    /**
     * Updates a single `MemberHotelRoomAssignment` using a unique key and a patch.
     */
    updateMemberHotelRoomAssignment: IUpdateMemberHotelRoomAssignmentPayload | null

    /**
     * Updates a single `Membership` using its globally unique id and a patch.
     */
    updateMembershipByNodeId: IUpdateMembershipPayload | null

    /**
     * Updates a single `Membership` using a unique key and a patch.
     */
    updateMembership: IUpdateMembershipPayload | null

    /**
     * Updates a single `Profile` using its globally unique id and a patch.
     */
    updateProfileByNodeId: IUpdateProfilePayload | null

    /**
     * Updates a single `Profile` using a unique key and a patch.
     */
    updateProfile: IUpdateProfilePayload | null

    /**
     * Updates a single `Profile` using a unique key and a patch.
     */
    updateProfileByEmail: IUpdateProfilePayload | null

    /**
     * Updates a single `RegistrationCode` using its globally unique id and a patch.
     */
    updateRegistrationCodeByNodeId: IUpdateRegistrationCodePayload | null

    /**
     * Updates a single `RegistrationCode` using a unique key and a patch.
     */
    updateRegistrationCode: IUpdateRegistrationCodePayload | null

    /**
     * Updates a single `Role` using its globally unique id and a patch.
     */
    updateRoleByNodeId: IUpdateRolePayload | null

    /**
     * Updates a single `Role` using a unique key and a patch.
     */
    updateRole: IUpdateRolePayload | null

    /**
     * Updates a single `Role` using a unique key and a patch.
     */
    updateRoleByAuthority: IUpdateRolePayload | null

    /**
     * Updates a single `Room` using its globally unique id and a patch.
     */
    updateRoomByNodeId: IUpdateRoomPayload | null

    /**
     * Updates a single `Room` using a unique key and a patch.
     */
    updateRoom: IUpdateRoomPayload | null

    /**
     * Updates a single `Setting` using its globally unique id and a patch.
     */
    updateSettingByNodeId: IUpdateSettingPayload | null

    /**
     * Updates a single `Setting` using a unique key and a patch.
     */
    updateSetting: IUpdateSettingPayload | null

    /**
     * Updates a single `ShirtOrder` using its globally unique id and a patch.
     */
    updateShirtOrderByNodeId: IUpdateShirtOrderPayload | null

    /**
     * Updates a single `ShirtOrder` using a unique key and a patch.
     */
    updateShirtOrder: IUpdateShirtOrderPayload | null

    /**
     * Updates a single `ShirtOrderItem` using its globally unique id and a patch.
     */
    updateShirtOrderItemByNodeId: IUpdateShirtOrderItemPayload | null

    /**
     * Updates a single `ShirtOrderItem` using a unique key and a patch.
     */
    updateShirtOrderItem: IUpdateShirtOrderItemPayload | null

    /**
     * Updates a single `Slot` using its globally unique id and a patch.
     */
    updateSlotByNodeId: IUpdateSlotPayload | null

    /**
     * Updates a single `Slot` using a unique key and a patch.
     */
    updateSlot: IUpdateSlotPayload | null

    /**
     * Updates a single `Token` using its globally unique id and a patch.
     */
    updateTokenByNodeId: IUpdateTokenPayload | null

    /**
     * Updates a single `Token` using a unique key and a patch.
     */
    updateToken: IUpdateTokenPayload | null

    /**
     * Updates a single `User` using its globally unique id and a patch.
     */
    updateUserByNodeId: IUpdateUserPayload | null

    /**
     * Updates a single `User` using a unique key and a patch.
     */
    updateUser: IUpdateUserPayload | null

    /**
     * Updates a single `User` using a unique key and a patch.
     */
    updateUserByUsername: IUpdateUserPayload | null

    /**
     * Updates a single `UserRole` using its globally unique id and a patch.
     */
    updateUserRoleByNodeId: IUpdateUserRolePayload | null

    /**
     * Updates a single `UserRole` using a unique key and a patch.
     */
    updateUserRole: IUpdateUserRolePayload | null

    /**
     * Deletes a single `Game` using its globally unique id.
     */
    deleteGameByNodeId: IDeleteGamePayload | null

    /**
     * Deletes a single `Game` using a unique key.
     */
    deleteGame: IDeleteGamePayload | null

    /**
     * Deletes a single `GameAssignment` using its globally unique id.
     */
    deleteGameAssignmentByNodeId: IDeleteGameAssignmentPayload | null

    /**
     * Deletes a single `GameAssignment` using a unique key.
     */
    deleteGameAssignment: IDeleteGameAssignmentPayload | null

    /**
     * Deletes a single `GameChoice` using its globally unique id.
     */
    deleteGameChoiceByNodeId: IDeleteGameChoicePayload | null

    /**
     * Deletes a single `GameChoice` using a unique key.
     */
    deleteGameChoice: IDeleteGameChoicePayload | null

    /**
     * Deletes a single `GameSubmission` using its globally unique id.
     */
    deleteGameSubmissionByNodeId: IDeleteGameSubmissionPayload | null

    /**
     * Deletes a single `GameSubmission` using a unique key.
     */
    deleteGameSubmission: IDeleteGameSubmissionPayload | null

    /**
     * Deletes a single `HotelRoom` using its globally unique id.
     */
    deleteHotelRoomByNodeId: IDeleteHotelRoomPayload | null

    /**
     * Deletes a single `HotelRoom` using a unique key.
     */
    deleteHotelRoom: IDeleteHotelRoomPayload | null

    /**
     * Deletes a single `HotelRoomDetail` using its globally unique id.
     */
    deleteHotelRoomDetailByNodeId: IDeleteHotelRoomDetailPayload | null

    /**
     * Deletes a single `HotelRoomDetail` using a unique key.
     */
    deleteHotelRoomDetail: IDeleteHotelRoomDetailPayload | null

    /**
     * Deletes a single `Lookup` using its globally unique id.
     */
    deleteLookupByNodeId: IDeleteLookupPayload | null

    /**
     * Deletes a single `Lookup` using a unique key.
     */
    deleteLookup: IDeleteLookupPayload | null

    /**
     * Deletes a single `Lookup` using a unique key.
     */
    deleteLookupByRealm: IDeleteLookupPayload | null

    /**
     * Deletes a single `LookupValue` using its globally unique id.
     */
    deleteLookupValueByNodeId: IDeleteLookupValuePayload | null

    /**
     * Deletes a single `LookupValue` using a unique key.
     */
    deleteLookupValue: IDeleteLookupValuePayload | null

    /**
     * Deletes a single `LookupValue` using a unique key.
     */
    deleteLookupValueByLookupIdAndCode: IDeleteLookupValuePayload | null

    /**
     * Deletes a single `MemberHotelRoomAssignment` using its globally unique id.
     */
    deleteMemberHotelRoomAssignmentByNodeId: IDeleteMemberHotelRoomAssignmentPayload | null

    /**
     * Deletes a single `MemberHotelRoomAssignment` using a unique key.
     */
    deleteMemberHotelRoomAssignment: IDeleteMemberHotelRoomAssignmentPayload | null

    /**
     * Deletes a single `Membership` using its globally unique id.
     */
    deleteMembershipByNodeId: IDeleteMembershipPayload | null

    /**
     * Deletes a single `Membership` using a unique key.
     */
    deleteMembership: IDeleteMembershipPayload | null

    /**
     * Deletes a single `Profile` using its globally unique id.
     */
    deleteProfileByNodeId: IDeleteProfilePayload | null

    /**
     * Deletes a single `Profile` using a unique key.
     */
    deleteProfile: IDeleteProfilePayload | null

    /**
     * Deletes a single `Profile` using a unique key.
     */
    deleteProfileByEmail: IDeleteProfilePayload | null

    /**
     * Deletes a single `RegistrationCode` using its globally unique id.
     */
    deleteRegistrationCodeByNodeId: IDeleteRegistrationCodePayload | null

    /**
     * Deletes a single `RegistrationCode` using a unique key.
     */
    deleteRegistrationCode: IDeleteRegistrationCodePayload | null

    /**
     * Deletes a single `Role` using its globally unique id.
     */
    deleteRoleByNodeId: IDeleteRolePayload | null

    /**
     * Deletes a single `Role` using a unique key.
     */
    deleteRole: IDeleteRolePayload | null

    /**
     * Deletes a single `Role` using a unique key.
     */
    deleteRoleByAuthority: IDeleteRolePayload | null

    /**
     * Deletes a single `Room` using its globally unique id.
     */
    deleteRoomByNodeId: IDeleteRoomPayload | null

    /**
     * Deletes a single `Room` using a unique key.
     */
    deleteRoom: IDeleteRoomPayload | null

    /**
     * Deletes a single `Setting` using its globally unique id.
     */
    deleteSettingByNodeId: IDeleteSettingPayload | null

    /**
     * Deletes a single `Setting` using a unique key.
     */
    deleteSetting: IDeleteSettingPayload | null

    /**
     * Deletes a single `ShirtOrder` using its globally unique id.
     */
    deleteShirtOrderByNodeId: IDeleteShirtOrderPayload | null

    /**
     * Deletes a single `ShirtOrder` using a unique key.
     */
    deleteShirtOrder: IDeleteShirtOrderPayload | null

    /**
     * Deletes a single `ShirtOrderItem` using its globally unique id.
     */
    deleteShirtOrderItemByNodeId: IDeleteShirtOrderItemPayload | null

    /**
     * Deletes a single `ShirtOrderItem` using a unique key.
     */
    deleteShirtOrderItem: IDeleteShirtOrderItemPayload | null

    /**
     * Deletes a single `Slot` using its globally unique id.
     */
    deleteSlotByNodeId: IDeleteSlotPayload | null

    /**
     * Deletes a single `Slot` using a unique key.
     */
    deleteSlot: IDeleteSlotPayload | null

    /**
     * Deletes a single `Token` using its globally unique id.
     */
    deleteTokenByNodeId: IDeleteTokenPayload | null

    /**
     * Deletes a single `Token` using a unique key.
     */
    deleteToken: IDeleteTokenPayload | null

    /**
     * Deletes a single `User` using its globally unique id.
     */
    deleteUserByNodeId: IDeleteUserPayload | null

    /**
     * Deletes a single `User` using a unique key.
     */
    deleteUser: IDeleteUserPayload | null

    /**
     * Deletes a single `User` using a unique key.
     */
    deleteUserByUsername: IDeleteUserPayload | null

    /**
     * Deletes a single `UserRole` using its globally unique id.
     */
    deleteUserRoleByNodeId: IDeleteUserRolePayload | null

    /**
     * Deletes a single `UserRole` using a unique key.
     */
    deleteUserRole: IDeleteUserRolePayload | null
    fTruncateTables: IFTruncateTablesPayload | null
  }

  interface ICreateGameOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateGameInput
  }

  interface ICreateGameAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateGameAssignmentInput
  }

  interface ICreateGameChoiceOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateGameChoiceInput
  }

  interface ICreateGameSubmissionOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateGameSubmissionInput
  }

  interface ICreateHotelRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateHotelRoomInput
  }

  interface ICreateHotelRoomDetailOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateHotelRoomDetailInput
  }

  interface ICreateLookupOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateLookupInput
  }

  interface ICreateLookupValueOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateLookupValueInput
  }

  interface ICreateMemberHotelRoomAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateMemberHotelRoomAssignmentInput
  }

  interface ICreateMembershipOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateMembershipInput
  }

  interface ICreateProfileOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateProfileInput
  }

  interface ICreateRegistrationCodeOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateRegistrationCodeInput
  }

  interface ICreateRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateRoleInput
  }

  interface ICreateRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateRoomInput
  }

  interface ICreateSettingOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateSettingInput
  }

  interface ICreateShirtOrderOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateShirtOrderInput
  }

  interface ICreateShirtOrderItemOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateShirtOrderItemInput
  }

  interface ICreateSlotOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateSlotInput
  }

  interface ICreateTokenOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateTokenInput
  }

  interface ICreateUserOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateUserInput
  }

  interface ICreateUserRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: ICreateUserRoleInput
  }

  interface IUpdateGameByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameByNodeIdInput
  }

  interface IUpdateGameOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameInput
  }

  interface IUpdateGameAssignmentByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameAssignmentByNodeIdInput
  }

  interface IUpdateGameAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameAssignmentInput
  }

  interface IUpdateGameChoiceByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameChoiceByNodeIdInput
  }

  interface IUpdateGameChoiceOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameChoiceInput
  }

  interface IUpdateGameSubmissionByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameSubmissionByNodeIdInput
  }

  interface IUpdateGameSubmissionOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateGameSubmissionInput
  }

  interface IUpdateHotelRoomByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateHotelRoomByNodeIdInput
  }

  interface IUpdateHotelRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateHotelRoomInput
  }

  interface IUpdateHotelRoomDetailByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateHotelRoomDetailByNodeIdInput
  }

  interface IUpdateHotelRoomDetailOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateHotelRoomDetailInput
  }

  interface IUpdateLookupByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupByNodeIdInput
  }

  interface IUpdateLookupOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupInput
  }

  interface IUpdateLookupByRealmOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupByRealmInput
  }

  interface IUpdateLookupValueByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupValueByNodeIdInput
  }

  interface IUpdateLookupValueOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupValueInput
  }

  interface IUpdateLookupValueByLookupIdAndCodeOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateLookupValueByLookupIdAndCodeInput
  }

  interface IUpdateMemberHotelRoomAssignmentByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateMemberHotelRoomAssignmentByNodeIdInput
  }

  interface IUpdateMemberHotelRoomAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateMemberHotelRoomAssignmentInput
  }

  interface IUpdateMembershipByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateMembershipByNodeIdInput
  }

  interface IUpdateMembershipOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateMembershipInput
  }

  interface IUpdateProfileByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateProfileByNodeIdInput
  }

  interface IUpdateProfileOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateProfileInput
  }

  interface IUpdateProfileByEmailOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateProfileByEmailInput
  }

  interface IUpdateRegistrationCodeByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRegistrationCodeByNodeIdInput
  }

  interface IUpdateRegistrationCodeOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRegistrationCodeInput
  }

  interface IUpdateRoleByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRoleByNodeIdInput
  }

  interface IUpdateRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRoleInput
  }

  interface IUpdateRoleByAuthorityOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRoleByAuthorityInput
  }

  interface IUpdateRoomByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRoomByNodeIdInput
  }

  interface IUpdateRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateRoomInput
  }

  interface IUpdateSettingByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateSettingByNodeIdInput
  }

  interface IUpdateSettingOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateSettingInput
  }

  interface IUpdateShirtOrderByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateShirtOrderByNodeIdInput
  }

  interface IUpdateShirtOrderOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateShirtOrderInput
  }

  interface IUpdateShirtOrderItemByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateShirtOrderItemByNodeIdInput
  }

  interface IUpdateShirtOrderItemOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateShirtOrderItemInput
  }

  interface IUpdateSlotByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateSlotByNodeIdInput
  }

  interface IUpdateSlotOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateSlotInput
  }

  interface IUpdateTokenByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateTokenByNodeIdInput
  }

  interface IUpdateTokenOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateTokenInput
  }

  interface IUpdateUserByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateUserByNodeIdInput
  }

  interface IUpdateUserOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateUserInput
  }

  interface IUpdateUserByUsernameOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateUserByUsernameInput
  }

  interface IUpdateUserRoleByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateUserRoleByNodeIdInput
  }

  interface IUpdateUserRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IUpdateUserRoleInput
  }

  interface IDeleteGameByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameByNodeIdInput
  }

  interface IDeleteGameOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameInput
  }

  interface IDeleteGameAssignmentByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameAssignmentByNodeIdInput
  }

  interface IDeleteGameAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameAssignmentInput
  }

  interface IDeleteGameChoiceByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameChoiceByNodeIdInput
  }

  interface IDeleteGameChoiceOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameChoiceInput
  }

  interface IDeleteGameSubmissionByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameSubmissionByNodeIdInput
  }

  interface IDeleteGameSubmissionOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteGameSubmissionInput
  }

  interface IDeleteHotelRoomByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteHotelRoomByNodeIdInput
  }

  interface IDeleteHotelRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteHotelRoomInput
  }

  interface IDeleteHotelRoomDetailByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteHotelRoomDetailByNodeIdInput
  }

  interface IDeleteHotelRoomDetailOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteHotelRoomDetailInput
  }

  interface IDeleteLookupByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupByNodeIdInput
  }

  interface IDeleteLookupOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupInput
  }

  interface IDeleteLookupByRealmOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupByRealmInput
  }

  interface IDeleteLookupValueByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupValueByNodeIdInput
  }

  interface IDeleteLookupValueOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupValueInput
  }

  interface IDeleteLookupValueByLookupIdAndCodeOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteLookupValueByLookupIdAndCodeInput
  }

  interface IDeleteMemberHotelRoomAssignmentByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteMemberHotelRoomAssignmentByNodeIdInput
  }

  interface IDeleteMemberHotelRoomAssignmentOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteMemberHotelRoomAssignmentInput
  }

  interface IDeleteMembershipByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteMembershipByNodeIdInput
  }

  interface IDeleteMembershipOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteMembershipInput
  }

  interface IDeleteProfileByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteProfileByNodeIdInput
  }

  interface IDeleteProfileOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteProfileInput
  }

  interface IDeleteProfileByEmailOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteProfileByEmailInput
  }

  interface IDeleteRegistrationCodeByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRegistrationCodeByNodeIdInput
  }

  interface IDeleteRegistrationCodeOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRegistrationCodeInput
  }

  interface IDeleteRoleByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRoleByNodeIdInput
  }

  interface IDeleteRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRoleInput
  }

  interface IDeleteRoleByAuthorityOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRoleByAuthorityInput
  }

  interface IDeleteRoomByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRoomByNodeIdInput
  }

  interface IDeleteRoomOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteRoomInput
  }

  interface IDeleteSettingByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteSettingByNodeIdInput
  }

  interface IDeleteSettingOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteSettingInput
  }

  interface IDeleteShirtOrderByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteShirtOrderByNodeIdInput
  }

  interface IDeleteShirtOrderOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteShirtOrderInput
  }

  interface IDeleteShirtOrderItemByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteShirtOrderItemByNodeIdInput
  }

  interface IDeleteShirtOrderItemOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteShirtOrderItemInput
  }

  interface IDeleteSlotByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteSlotByNodeIdInput
  }

  interface IDeleteSlotOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteSlotInput
  }

  interface IDeleteTokenByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteTokenByNodeIdInput
  }

  interface IDeleteTokenOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteTokenInput
  }

  interface IDeleteUserByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteUserByNodeIdInput
  }

  interface IDeleteUserOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteUserInput
  }

  interface IDeleteUserByUsernameOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteUserByUsernameInput
  }

  interface IDeleteUserRoleByNodeIdOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteUserRoleByNodeIdInput
  }

  interface IDeleteUserRoleOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IDeleteUserRoleInput
  }

  interface IFTruncateTablesOnMutationArguments {
    /**
     * The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
     */
    input: IFTruncateTablesInput
  }

  /**
   * All input for the create `Game` mutation.
   */
  interface ICreateGameInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Game` to be created by this mutation.
     */
    game: IGameInput
  }

  /**
   * An input for mutations affecting `Game`
   */
  interface IGameInput {
    id?: number | null
    description: string
    lateFinish?: boolean | null
    lateStart?: string | null
    name: string
    playerMax: number
    playerMin: number
    roomId?: number | null
    shortName?: string | null
    slotId?: number | null
    charInstructions: string
    estimatedLength: string
    gameContactEmail: string
    genre: string
    gmNames?: string | null
    message: string
    playerPreference: string
    playersContactGm: boolean
    returningPlayers: string
    setting: string
    slotConflicts: string
    slotPreference: number
    teenFriendly: boolean
    type: string
    year: number
    authorId?: number | null
  }

  /**
   * The output of our create `Game` mutation.
   */
  interface ICreateGamePayload {
    __typename: 'CreateGamePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Game` that was created by this mutation.
     */
    game: IGame | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Room` that is related to this `Game`.
     */
    room: IRoom | null

    /**
     * Reads a single `Slot` that is related to this `Game`.
     */
    slot: ISlot | null

    /**
     * Reads a single `User` that is related to this `Game`.
     */
    author: IUser | null

    /**
     * An edge for our `Game`. May be used by Relay 1.
     */
    gameEdge: IGamesEdge | null
  }

  interface IGameEdgeOnCreateGamePayloadArguments {
    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null
  }

  /**
   * All input for the create `GameAssignment` mutation.
   */
  interface ICreateGameAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `GameAssignment` to be created by this mutation.
     */
    gameAssignment: IGameAssignmentInput
  }

  /**
   * An input for mutations affecting `GameAssignment`
   */
  interface IGameAssignmentInput {
    memberId: number
    gameId: number
    gm: number
    year: number
  }

  /**
   * The output of our create `GameAssignment` mutation.
   */
  interface ICreateGameAssignmentPayload {
    __typename: 'CreateGameAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameAssignment` that was created by this mutation.
     */
    gameAssignment: IGameAssignment | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `Game` that is related to this `GameAssignment`.
     */
    game: IGame | null

    /**
     * An edge for our `GameAssignment`. May be used by Relay 1.
     */
    gameAssignmentEdge: IGameAssignmentsEdge | null
  }

  interface IGameAssignmentEdgeOnCreateGameAssignmentPayloadArguments {
    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null
  }

  /**
   * All input for the create `GameChoice` mutation.
   */
  interface ICreateGameChoiceInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `GameChoice` to be created by this mutation.
     */
    gameChoice: IGameChoiceInput
  }

  /**
   * An input for mutations affecting `GameChoice`
   */
  interface IGameChoiceInput {
    id?: number | null
    gameId?: number | null
    memberId: number
    rank: number
    slotId: number
    year: number
    returningPlayer: boolean
  }

  /**
   * The output of our create `GameChoice` mutation.
   */
  interface ICreateGameChoicePayload {
    __typename: 'CreateGameChoicePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameChoice` that was created by this mutation.
     */
    gameChoice: IGameChoice | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Game` that is related to this `GameChoice`.
     */
    game: IGame | null

    /**
     * Reads a single `Membership` that is related to this `GameChoice`.
     */
    member: IMembership | null

    /**
     * Reads a single `Slot` that is related to this `GameChoice`.
     */
    slot: ISlot | null

    /**
     * An edge for our `GameChoice`. May be used by Relay 1.
     */
    gameChoiceEdge: IGameChoicesEdge | null
  }

  interface IGameChoiceEdgeOnCreateGameChoicePayloadArguments {
    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null
  }

  /**
   * All input for the create `GameSubmission` mutation.
   */
  interface ICreateGameSubmissionInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `GameSubmission` to be created by this mutation.
     */
    gameSubmission: IGameSubmissionInput
  }

  /**
   * An input for mutations affecting `GameSubmission`
   */
  interface IGameSubmissionInput {
    id?: number | null
    memberId: number
    message: string
    year: number
  }

  /**
   * The output of our create `GameSubmission` mutation.
   */
  interface ICreateGameSubmissionPayload {
    __typename: 'CreateGameSubmissionPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameSubmission` that was created by this mutation.
     */
    gameSubmission: IGameSubmission | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameSubmission`.
     */
    member: IMembership | null

    /**
     * An edge for our `GameSubmission`. May be used by Relay 1.
     */
    gameSubmissionEdge: IGameSubmissionsEdge | null
  }

  interface IGameSubmissionEdgeOnCreateGameSubmissionPayloadArguments {
    /**
     * The method to use when ordering `GameSubmission`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameSubmissionsOrderBy> | null
  }

  /**
   * All input for the create `HotelRoom` mutation.
   */
  interface ICreateHotelRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `HotelRoom` to be created by this mutation.
     */
    hotelRoom: IHotelRoomInput
  }

  /**
   * An input for mutations affecting `HotelRoom`
   */
  interface IHotelRoomInput {
    id?: number | null
    description: string
    gamingRoom: boolean
    occupancy: string
    quantity: number
    rate: string
    bathroomType: string
    type: string
  }

  /**
   * The output of our create `HotelRoom` mutation.
   */
  interface ICreateHotelRoomPayload {
    __typename: 'CreateHotelRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoom` that was created by this mutation.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoom`. May be used by Relay 1.
     */
    hotelRoomEdge: IHotelRoomsEdge | null
  }

  interface IHotelRoomEdgeOnCreateHotelRoomPayloadArguments {
    /**
     * The method to use when ordering `HotelRoom`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomsOrderBy> | null
  }

  /**
   * All input for the create `HotelRoomDetail` mutation.
   */
  interface ICreateHotelRoomDetailInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `HotelRoomDetail` to be created by this mutation.
     */
    hotelRoomDetail: IHotelRoomDetailInput
  }

  /**
   * An input for mutations affecting `HotelRoomDetail`
   */
  interface IHotelRoomDetailInput {
    id?: any | null
    version: any
    bathroomType: string
    comment: string
    enabled: boolean
    gamingRoom: boolean
    internalRoomType: string
    name: string
    reserved: boolean
    reservedFor: string
    roomType: string
    formattedRoomType: string
  }

  /**
   * The output of our create `HotelRoomDetail` mutation.
   */
  interface ICreateHotelRoomDetailPayload {
    __typename: 'CreateHotelRoomDetailPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoomDetail` that was created by this mutation.
     */
    hotelRoomDetail: IHotelRoomDetail | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoomDetail`. May be used by Relay 1.
     */
    hotelRoomDetailEdge: IHotelRoomDetailsEdge | null
  }

  interface IHotelRoomDetailEdgeOnCreateHotelRoomDetailPayloadArguments {
    /**
     * The method to use when ordering `HotelRoomDetail`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomDetailsOrderBy> | null
  }

  /**
   * All input for the create `Lookup` mutation.
   */
  interface ICreateLookupInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Lookup` to be created by this mutation.
     */
    lookup: ILookupInput
  }

  /**
   * An input for mutations affecting `Lookup`
   */
  interface ILookupInput {
    id?: number | null
    codeMaximum?: string | null
    codeMinimum?: string | null
    codeScale?: number | null
    codeType: string
    internationalize: boolean
    ordering: string
    realm: string
    valueMaximum?: string | null
    valueMinimum?: string | null
    valueScale?: number | null
    valueType: string
  }

  /**
   * The output of our create `Lookup` mutation.
   */
  interface ICreateLookupPayload {
    __typename: 'CreateLookupPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Lookup` that was created by this mutation.
     */
    lookup: ILookup | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Lookup`. May be used by Relay 1.
     */
    lookupEdge: ILookupsEdge | null
  }

  interface ILookupEdgeOnCreateLookupPayloadArguments {
    /**
     * The method to use when ordering `Lookup`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupsOrderBy> | null
  }

  /**
   * All input for the create `LookupValue` mutation.
   */
  interface ICreateLookupValueInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `LookupValue` to be created by this mutation.
     */
    lookupValue: ILookupValueInput
  }

  /**
   * An input for mutations affecting `LookupValue`
   */
  interface ILookupValueInput {
    id?: number | null
    code: string
    lookupId: number
    numericSequencer: any
    sequencer: number
    stringSequencer: string
    value: string
  }

  /**
   * The output of our create `LookupValue` mutation.
   */
  interface ICreateLookupValuePayload {
    __typename: 'CreateLookupValuePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `LookupValue` that was created by this mutation.
     */
    lookupValue: ILookupValue | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Lookup` that is related to this `LookupValue`.
     */
    lookup: ILookup | null

    /**
     * An edge for our `LookupValue`. May be used by Relay 1.
     */
    lookupValueEdge: ILookupValuesEdge | null
  }

  interface ILookupValueEdgeOnCreateLookupValuePayloadArguments {
    /**
     * The method to use when ordering `LookupValue`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupValuesOrderBy> | null
  }

  /**
   * All input for the create `MemberHotelRoomAssignment` mutation.
   */
  interface ICreateMemberHotelRoomAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `MemberHotelRoomAssignment` to be created by this mutation.
     */
    memberHotelRoomAssignment: IMemberHotelRoomAssignmentInput
  }

  /**
   * An input for mutations affecting `MemberHotelRoomAssignment`
   */
  interface IMemberHotelRoomAssignmentInput {
    memberId: any
    hotelRoomId: any
    roomOwner: boolean
    year: number
  }

  /**
   * The output of our create `MemberHotelRoomAssignment` mutation.
   */
  interface ICreateMemberHotelRoomAssignmentPayload {
    __typename: 'CreateMemberHotelRoomAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `MemberHotelRoomAssignment` that was created by this mutation.
     */
    memberHotelRoomAssignment: IMemberHotelRoomAssignment | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `MemberHotelRoomAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `HotelRoomDetail` that is related to this `MemberHotelRoomAssignment`.
     */
    hotelRoom: IHotelRoomDetail | null

    /**
     * An edge for our `MemberHotelRoomAssignment`. May be used by Relay 1.
     */
    memberHotelRoomAssignmentEdge: IMemberHotelRoomAssignmentsEdge | null
  }

  interface IMemberHotelRoomAssignmentEdgeOnCreateMemberHotelRoomAssignmentPayloadArguments {
    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null
  }

  /**
   * All input for the create `Membership` mutation.
   */
  interface ICreateMembershipInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Membership` to be created by this mutation.
     */
    membership: IMembershipInput
  }

  /**
   * An input for mutations affecting `Membership`
   */
  interface IMembershipInput {
    id?: number | null
    arrivalDate: any
    attendance: string
    attending: boolean
    departureDate: any
    hotelRoomId: number
    interestLevel: string
    message: string
    roomPreferenceAndNotes: string
    roomingPreferences: string
    roomingWith: string
    userId: number
    volunteer: boolean
    year: number
    offerSubsidy: boolean
    requestOldPrice: boolean
    amountOwed: number
    amountPaid: number
  }

  /**
   * The output of our create `Membership` mutation.
   */
  interface ICreateMembershipPayload {
    __typename: 'CreateMembershipPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Membership` that was created by this mutation.
     */
    membership: IMembership | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `HotelRoom` that is related to this `Membership`.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Reads a single `User` that is related to this `Membership`.
     */
    user: IUser | null

    /**
     * An edge for our `Membership`. May be used by Relay 1.
     */
    membershipEdge: IMembershipsEdge | null
  }

  interface IMembershipEdgeOnCreateMembershipPayloadArguments {
    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null
  }

  /**
   * All input for the create `Profile` mutation.
   */
  interface ICreateProfileInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Profile` to be created by this mutation.
     */
    profile: IProfileInput
  }

  /**
   * An input for mutations affecting `Profile`
   */
  interface IProfileInput {
    id?: number | null
    email: string
    fullName: string
    phoneNumber?: string | null
    snailMailAddress?: string | null
  }

  /**
   * The output of our create `Profile` mutation.
   */
  interface ICreateProfilePayload {
    __typename: 'CreateProfilePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Profile` that was created by this mutation.
     */
    profile: IProfile | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Profile`. May be used by Relay 1.
     */
    profileEdge: IProfilesEdge | null
  }

  interface IProfileEdgeOnCreateProfilePayloadArguments {
    /**
     * The method to use when ordering `Profile`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ProfilesOrderBy> | null
  }

  /**
   * All input for the create `RegistrationCode` mutation.
   */
  interface ICreateRegistrationCodeInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `RegistrationCode` to be created by this mutation.
     */
    registrationCode: IRegistrationCodeInput
  }

  /**
   * An input for mutations affecting `RegistrationCode`
   */
  interface IRegistrationCodeInput {
    id?: number | null
    token: string
    username: string
  }

  /**
   * The output of our create `RegistrationCode` mutation.
   */
  interface ICreateRegistrationCodePayload {
    __typename: 'CreateRegistrationCodePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `RegistrationCode` that was created by this mutation.
     */
    registrationCode: IRegistrationCode | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `RegistrationCode`. May be used by Relay 1.
     */
    registrationCodeEdge: IRegistrationCodesEdge | null
  }

  interface IRegistrationCodeEdgeOnCreateRegistrationCodePayloadArguments {
    /**
     * The method to use when ordering `RegistrationCode`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RegistrationCodesOrderBy> | null
  }

  /**
   * All input for the create `Role` mutation.
   */
  interface ICreateRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Role` to be created by this mutation.
     */
    role: IRoleInput
  }

  /**
   * An input for mutations affecting `Role`
   */
  interface IRoleInput {
    id?: number | null
    authority: string
  }

  /**
   * The output of our create `Role` mutation.
   */
  interface ICreateRolePayload {
    __typename: 'CreateRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Role` that was created by this mutation.
     */
    role: IRole | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Role`. May be used by Relay 1.
     */
    roleEdge: IRolesEdge | null
  }

  interface IRoleEdgeOnCreateRolePayloadArguments {
    /**
     * The method to use when ordering `Role`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RolesOrderBy> | null
  }

  /**
   * All input for the create `Room` mutation.
   */
  interface ICreateRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Room` to be created by this mutation.
     */
    room: IRoomInput
  }

  /**
   * An input for mutations affecting `Room`
   */
  interface IRoomInput {
    id?: number | null
    description: string
    size: number
    type: string
    updated: boolean
  }

  /**
   * The output of our create `Room` mutation.
   */
  interface ICreateRoomPayload {
    __typename: 'CreateRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Room` that was created by this mutation.
     */
    room: IRoom | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Room`. May be used by Relay 1.
     */
    roomEdge: IRoomsEdge | null
  }

  interface IRoomEdgeOnCreateRoomPayloadArguments {
    /**
     * The method to use when ordering `Room`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RoomsOrderBy> | null
  }

  /**
   * All input for the create `Setting` mutation.
   */
  interface ICreateSettingInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Setting` to be created by this mutation.
     */
    setting: ISettingInput
  }

  /**
   * An input for mutations affecting `Setting`
   */
  interface ISettingInput {
    id?: number | null
    code: string
    type: string
    value: string
  }

  /**
   * The output of our create `Setting` mutation.
   */
  interface ICreateSettingPayload {
    __typename: 'CreateSettingPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Setting` that was created by this mutation.
     */
    setting: ISetting | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Setting`. May be used by Relay 1.
     */
    settingEdge: ISettingsEdge | null
  }

  interface ISettingEdgeOnCreateSettingPayloadArguments {
    /**
     * The method to use when ordering `Setting`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SettingsOrderBy> | null
  }

  /**
   * All input for the create `ShirtOrder` mutation.
   */
  interface ICreateShirtOrderInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `ShirtOrder` to be created by this mutation.
     */
    shirtOrder: IShirtOrderInput
  }

  /**
   * An input for mutations affecting `ShirtOrder`
   */
  interface IShirtOrderInput {
    id?: number | null
    deliveryMethod: string
    message: string
    userId: number
    year: number
  }

  /**
   * The output of our create `ShirtOrder` mutation.
   */
  interface ICreateShirtOrderPayload {
    __typename: 'CreateShirtOrderPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrder` that was created by this mutation.
     */
    shirtOrder: IShirtOrder | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `ShirtOrder`.
     */
    user: IUser | null

    /**
     * An edge for our `ShirtOrder`. May be used by Relay 1.
     */
    shirtOrderEdge: IShirtOrdersEdge | null
  }

  interface IShirtOrderEdgeOnCreateShirtOrderPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrder`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrdersOrderBy> | null
  }

  /**
   * All input for the create `ShirtOrderItem` mutation.
   */
  interface ICreateShirtOrderItemInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `ShirtOrderItem` to be created by this mutation.
     */
    shirtOrderItem: IShirtOrderItemInput
  }

  /**
   * An input for mutations affecting `ShirtOrderItem`
   */
  interface IShirtOrderItemInput {
    id?: number | null
    orderId: number
    quantity: number
    size: string
    style: string
    itemsIdx?: number | null
  }

  /**
   * The output of our create `ShirtOrderItem` mutation.
   */
  interface ICreateShirtOrderItemPayload {
    __typename: 'CreateShirtOrderItemPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrderItem` that was created by this mutation.
     */
    shirtOrderItem: IShirtOrderItem | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`.
     */
    order: IShirtOrder | null

    /**
     * An edge for our `ShirtOrderItem`. May be used by Relay 1.
     */
    shirtOrderItemEdge: IShirtOrderItemsEdge | null
  }

  interface IShirtOrderItemEdgeOnCreateShirtOrderItemPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrderItem`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrderItemsOrderBy> | null
  }

  /**
   * All input for the create `Slot` mutation.
   */
  interface ICreateSlotInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Slot` to be created by this mutation.
     */
    slot: ISlotInput
  }

  /**
   * An input for mutations affecting `Slot`
   */
  interface ISlotInput {
    id?: number | null
    slot: number
    day: string
    formattedDate: string
    length: string
    time: string
  }

  /**
   * The output of our create `Slot` mutation.
   */
  interface ICreateSlotPayload {
    __typename: 'CreateSlotPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Slot` that was created by this mutation.
     */
    slot: ISlot | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Slot`. May be used by Relay 1.
     */
    slotEdge: ISlotsEdge | null
  }

  interface ISlotEdgeOnCreateSlotPayloadArguments {
    /**
     * The method to use when ordering `Slot`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SlotsOrderBy> | null
  }

  /**
   * All input for the create `Token` mutation.
   */
  interface ICreateTokenInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `Token` to be created by this mutation.
     */
    token: ITokenInput
  }

  /**
   * An input for mutations affecting `Token`
   */
  interface ITokenInput {
    id?: number | null
    userId: number
    cuid?: string | null
    active?: boolean | null
    lastUsed?: any | null
  }

  /**
   * The output of our create `Token` mutation.
   */
  interface ICreateTokenPayload {
    __typename: 'CreateTokenPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Token` that was created by this mutation.
     */
    token: IToken | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `Token`.
     */
    user: IUser | null

    /**
     * An edge for our `Token`. May be used by Relay 1.
     */
    tokenEdge: ITokensEdge | null
  }

  interface ITokenEdgeOnCreateTokenPayloadArguments {
    /**
     * The method to use when ordering `Token`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<TokensOrderBy> | null
  }

  /**
   * All input for the create `User` mutation.
   */
  interface ICreateUserInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `User` to be created by this mutation.
     */
    user: IUserInput
  }

  /**
   * An input for mutations affecting `User`
   */
  interface IUserInput {
    id?: number | null
    accountLocked: boolean
    enabled: boolean
    password: string
    profileId: number
    username: string
  }

  /**
   * The output of our create `User` mutation.
   */
  interface ICreateUserPayload {
    __typename: 'CreateUserPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `User` that was created by this mutation.
     */
    user: IUser | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Profile` that is related to this `User`.
     */
    profile: IProfile | null

    /**
     * An edge for our `User`. May be used by Relay 1.
     */
    userEdge: IUsersEdge | null
  }

  interface IUserEdgeOnCreateUserPayloadArguments {
    /**
     * The method to use when ordering `User`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UsersOrderBy> | null
  }

  /**
   * All input for the create `UserRole` mutation.
   */
  interface ICreateUserRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The `UserRole` to be created by this mutation.
     */
    userRole: IUserRoleInput
  }

  /**
   * An input for mutations affecting `UserRole`
   */
  interface IUserRoleInput {
    roleId: number
    userId: number
  }

  /**
   * The output of our create `UserRole` mutation.
   */
  interface ICreateUserRolePayload {
    __typename: 'CreateUserRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `UserRole` that was created by this mutation.
     */
    userRole: IUserRole | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Role` that is related to this `UserRole`.
     */
    role: IRole | null

    /**
     * Reads a single `User` that is related to this `UserRole`.
     */
    user: IUser | null

    /**
     * An edge for our `UserRole`. May be used by Relay 1.
     */
    userRoleEdge: IUserRolesEdge | null
  }

  interface IUserRoleEdgeOnCreateUserRolePayloadArguments {
    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null
  }

  /**
   * All input for the `updateGameByNodeId` mutation.
   */
  interface IUpdateGameByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Game` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Game` being updated.
     */
    patch: IGamePatch
  }

  /**
   * Represents an update to a `Game`. Fields that are set will be updated.
   */
  interface IGamePatch {
    id?: number | null
    description?: string | null
    lateFinish?: boolean | null
    lateStart?: string | null
    name?: string | null
    playerMax?: number | null
    playerMin?: number | null
    roomId?: number | null
    shortName?: string | null
    slotId?: number | null
    charInstructions?: string | null
    estimatedLength?: string | null
    gameContactEmail?: string | null
    genre?: string | null
    gmNames?: string | null
    message?: string | null
    playerPreference?: string | null
    playersContactGm?: boolean | null
    returningPlayers?: string | null
    setting?: string | null
    slotConflicts?: string | null
    slotPreference?: number | null
    teenFriendly?: boolean | null
    type?: string | null
    year?: number | null
    authorId?: number | null
  }

  /**
   * The output of our update `Game` mutation.
   */
  interface IUpdateGamePayload {
    __typename: 'UpdateGamePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Game` that was updated by this mutation.
     */
    game: IGame | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Room` that is related to this `Game`.
     */
    room: IRoom | null

    /**
     * Reads a single `Slot` that is related to this `Game`.
     */
    slot: ISlot | null

    /**
     * Reads a single `User` that is related to this `Game`.
     */
    author: IUser | null

    /**
     * An edge for our `Game`. May be used by Relay 1.
     */
    gameEdge: IGamesEdge | null
  }

  interface IGameEdgeOnUpdateGamePayloadArguments {
    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null
  }

  /**
   * All input for the `updateGame` mutation.
   */
  interface IUpdateGameInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Game` being updated.
     */
    patch: IGamePatch
    id: number
  }

  /**
   * All input for the `updateGameAssignmentByNodeId` mutation.
   */
  interface IUpdateGameAssignmentByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameAssignment` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `GameAssignment` being updated.
     */
    patch: IGameAssignmentPatch
  }

  /**
   * Represents an update to a `GameAssignment`. Fields that are set will be updated.
   */
  interface IGameAssignmentPatch {
    memberId?: number | null
    gameId?: number | null
    gm?: number | null
    year?: number | null
  }

  /**
   * The output of our update `GameAssignment` mutation.
   */
  interface IUpdateGameAssignmentPayload {
    __typename: 'UpdateGameAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameAssignment` that was updated by this mutation.
     */
    gameAssignment: IGameAssignment | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `Game` that is related to this `GameAssignment`.
     */
    game: IGame | null

    /**
     * An edge for our `GameAssignment`. May be used by Relay 1.
     */
    gameAssignmentEdge: IGameAssignmentsEdge | null
  }

  interface IGameAssignmentEdgeOnUpdateGameAssignmentPayloadArguments {
    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null
  }

  /**
   * All input for the `updateGameAssignment` mutation.
   */
  interface IUpdateGameAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `GameAssignment` being updated.
     */
    patch: IGameAssignmentPatch
    memberId: number
    gameId: number
    gm: number
  }

  /**
   * All input for the `updateGameChoiceByNodeId` mutation.
   */
  interface IUpdateGameChoiceByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameChoice` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `GameChoice` being updated.
     */
    patch: IGameChoicePatch
  }

  /**
   * Represents an update to a `GameChoice`. Fields that are set will be updated.
   */
  interface IGameChoicePatch {
    id?: number | null
    gameId?: number | null
    memberId?: number | null
    rank?: number | null
    slotId?: number | null
    year?: number | null
    returningPlayer?: boolean | null
  }

  /**
   * The output of our update `GameChoice` mutation.
   */
  interface IUpdateGameChoicePayload {
    __typename: 'UpdateGameChoicePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameChoice` that was updated by this mutation.
     */
    gameChoice: IGameChoice | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Game` that is related to this `GameChoice`.
     */
    game: IGame | null

    /**
     * Reads a single `Membership` that is related to this `GameChoice`.
     */
    member: IMembership | null

    /**
     * Reads a single `Slot` that is related to this `GameChoice`.
     */
    slot: ISlot | null

    /**
     * An edge for our `GameChoice`. May be used by Relay 1.
     */
    gameChoiceEdge: IGameChoicesEdge | null
  }

  interface IGameChoiceEdgeOnUpdateGameChoicePayloadArguments {
    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null
  }

  /**
   * All input for the `updateGameChoice` mutation.
   */
  interface IUpdateGameChoiceInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `GameChoice` being updated.
     */
    patch: IGameChoicePatch
    id: number
  }

  /**
   * All input for the `updateGameSubmissionByNodeId` mutation.
   */
  interface IUpdateGameSubmissionByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameSubmission` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `GameSubmission` being updated.
     */
    patch: IGameSubmissionPatch
  }

  /**
   * Represents an update to a `GameSubmission`. Fields that are set will be updated.
   */
  interface IGameSubmissionPatch {
    id?: number | null
    memberId?: number | null
    message?: string | null
    year?: number | null
  }

  /**
   * The output of our update `GameSubmission` mutation.
   */
  interface IUpdateGameSubmissionPayload {
    __typename: 'UpdateGameSubmissionPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameSubmission` that was updated by this mutation.
     */
    gameSubmission: IGameSubmission | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameSubmission`.
     */
    member: IMembership | null

    /**
     * An edge for our `GameSubmission`. May be used by Relay 1.
     */
    gameSubmissionEdge: IGameSubmissionsEdge | null
  }

  interface IGameSubmissionEdgeOnUpdateGameSubmissionPayloadArguments {
    /**
     * The method to use when ordering `GameSubmission`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameSubmissionsOrderBy> | null
  }

  /**
   * All input for the `updateGameSubmission` mutation.
   */
  interface IUpdateGameSubmissionInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `GameSubmission` being updated.
     */
    patch: IGameSubmissionPatch
    id: number
  }

  /**
   * All input for the `updateHotelRoomByNodeId` mutation.
   */
  interface IUpdateHotelRoomByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `HotelRoom` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `HotelRoom` being updated.
     */
    patch: IHotelRoomPatch
  }

  /**
   * Represents an update to a `HotelRoom`. Fields that are set will be updated.
   */
  interface IHotelRoomPatch {
    id?: number | null
    description?: string | null
    gamingRoom?: boolean | null
    occupancy?: string | null
    quantity?: number | null
    rate?: string | null
    bathroomType?: string | null
    type?: string | null
  }

  /**
   * The output of our update `HotelRoom` mutation.
   */
  interface IUpdateHotelRoomPayload {
    __typename: 'UpdateHotelRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoom` that was updated by this mutation.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoom`. May be used by Relay 1.
     */
    hotelRoomEdge: IHotelRoomsEdge | null
  }

  interface IHotelRoomEdgeOnUpdateHotelRoomPayloadArguments {
    /**
     * The method to use when ordering `HotelRoom`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomsOrderBy> | null
  }

  /**
   * All input for the `updateHotelRoom` mutation.
   */
  interface IUpdateHotelRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `HotelRoom` being updated.
     */
    patch: IHotelRoomPatch
    id: number
  }

  /**
   * All input for the `updateHotelRoomDetailByNodeId` mutation.
   */
  interface IUpdateHotelRoomDetailByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `HotelRoomDetail` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `HotelRoomDetail` being updated.
     */
    patch: IHotelRoomDetailPatch
  }

  /**
   * Represents an update to a `HotelRoomDetail`. Fields that are set will be updated.
   */
  interface IHotelRoomDetailPatch {
    id?: any | null
    version?: any | null
    bathroomType?: string | null
    comment?: string | null
    enabled?: boolean | null
    gamingRoom?: boolean | null
    internalRoomType?: string | null
    name?: string | null
    reserved?: boolean | null
    reservedFor?: string | null
    roomType?: string | null
    formattedRoomType?: string | null
  }

  /**
   * The output of our update `HotelRoomDetail` mutation.
   */
  interface IUpdateHotelRoomDetailPayload {
    __typename: 'UpdateHotelRoomDetailPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoomDetail` that was updated by this mutation.
     */
    hotelRoomDetail: IHotelRoomDetail | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoomDetail`. May be used by Relay 1.
     */
    hotelRoomDetailEdge: IHotelRoomDetailsEdge | null
  }

  interface IHotelRoomDetailEdgeOnUpdateHotelRoomDetailPayloadArguments {
    /**
     * The method to use when ordering `HotelRoomDetail`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomDetailsOrderBy> | null
  }

  /**
   * All input for the `updateHotelRoomDetail` mutation.
   */
  interface IUpdateHotelRoomDetailInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `HotelRoomDetail` being updated.
     */
    patch: IHotelRoomDetailPatch
    id: any
  }

  /**
   * All input for the `updateLookupByNodeId` mutation.
   */
  interface IUpdateLookupByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Lookup` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Lookup` being updated.
     */
    patch: ILookupPatch
  }

  /**
   * Represents an update to a `Lookup`. Fields that are set will be updated.
   */
  interface ILookupPatch {
    id?: number | null
    codeMaximum?: string | null
    codeMinimum?: string | null
    codeScale?: number | null
    codeType?: string | null
    internationalize?: boolean | null
    ordering?: string | null
    realm?: string | null
    valueMaximum?: string | null
    valueMinimum?: string | null
    valueScale?: number | null
    valueType?: string | null
  }

  /**
   * The output of our update `Lookup` mutation.
   */
  interface IUpdateLookupPayload {
    __typename: 'UpdateLookupPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Lookup` that was updated by this mutation.
     */
    lookup: ILookup | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Lookup`. May be used by Relay 1.
     */
    lookupEdge: ILookupsEdge | null
  }

  interface ILookupEdgeOnUpdateLookupPayloadArguments {
    /**
     * The method to use when ordering `Lookup`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupsOrderBy> | null
  }

  /**
   * All input for the `updateLookup` mutation.
   */
  interface IUpdateLookupInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Lookup` being updated.
     */
    patch: ILookupPatch
    id: number
  }

  /**
   * All input for the `updateLookupByRealm` mutation.
   */
  interface IUpdateLookupByRealmInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Lookup` being updated.
     */
    patch: ILookupPatch
    realm: string
  }

  /**
   * All input for the `updateLookupValueByNodeId` mutation.
   */
  interface IUpdateLookupValueByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `LookupValue` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `LookupValue` being updated.
     */
    patch: ILookupValuePatch
  }

  /**
   * Represents an update to a `LookupValue`. Fields that are set will be updated.
   */
  interface ILookupValuePatch {
    id?: number | null
    code?: string | null
    lookupId?: number | null
    numericSequencer?: any | null
    sequencer?: number | null
    stringSequencer?: string | null
    value?: string | null
  }

  /**
   * The output of our update `LookupValue` mutation.
   */
  interface IUpdateLookupValuePayload {
    __typename: 'UpdateLookupValuePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `LookupValue` that was updated by this mutation.
     */
    lookupValue: ILookupValue | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Lookup` that is related to this `LookupValue`.
     */
    lookup: ILookup | null

    /**
     * An edge for our `LookupValue`. May be used by Relay 1.
     */
    lookupValueEdge: ILookupValuesEdge | null
  }

  interface ILookupValueEdgeOnUpdateLookupValuePayloadArguments {
    /**
     * The method to use when ordering `LookupValue`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupValuesOrderBy> | null
  }

  /**
   * All input for the `updateLookupValue` mutation.
   */
  interface IUpdateLookupValueInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `LookupValue` being updated.
     */
    patch: ILookupValuePatch
    id: number
  }

  /**
   * All input for the `updateLookupValueByLookupIdAndCode` mutation.
   */
  interface IUpdateLookupValueByLookupIdAndCodeInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `LookupValue` being updated.
     */
    patch: ILookupValuePatch
    lookupId: number
    code: string
  }

  /**
   * All input for the `updateMemberHotelRoomAssignmentByNodeId` mutation.
   */
  interface IUpdateMemberHotelRoomAssignmentByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `MemberHotelRoomAssignment` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `MemberHotelRoomAssignment` being updated.
     */
    patch: IMemberHotelRoomAssignmentPatch
  }

  /**
   * Represents an update to a `MemberHotelRoomAssignment`. Fields that are set will be updated.
   */
  interface IMemberHotelRoomAssignmentPatch {
    memberId?: any | null
    hotelRoomId?: any | null
    roomOwner?: boolean | null
    year?: number | null
  }

  /**
   * The output of our update `MemberHotelRoomAssignment` mutation.
   */
  interface IUpdateMemberHotelRoomAssignmentPayload {
    __typename: 'UpdateMemberHotelRoomAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `MemberHotelRoomAssignment` that was updated by this mutation.
     */
    memberHotelRoomAssignment: IMemberHotelRoomAssignment | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `MemberHotelRoomAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `HotelRoomDetail` that is related to this `MemberHotelRoomAssignment`.
     */
    hotelRoom: IHotelRoomDetail | null

    /**
     * An edge for our `MemberHotelRoomAssignment`. May be used by Relay 1.
     */
    memberHotelRoomAssignmentEdge: IMemberHotelRoomAssignmentsEdge | null
  }

  interface IMemberHotelRoomAssignmentEdgeOnUpdateMemberHotelRoomAssignmentPayloadArguments {
    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null
  }

  /**
   * All input for the `updateMemberHotelRoomAssignment` mutation.
   */
  interface IUpdateMemberHotelRoomAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `MemberHotelRoomAssignment` being updated.
     */
    patch: IMemberHotelRoomAssignmentPatch
    memberId: any
    hotelRoomId: any
  }

  /**
   * All input for the `updateMembershipByNodeId` mutation.
   */
  interface IUpdateMembershipByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Membership` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Membership` being updated.
     */
    patch: IMembershipPatch
  }

  /**
   * Represents an update to a `Membership`. Fields that are set will be updated.
   */
  interface IMembershipPatch {
    id?: number | null
    arrivalDate?: any | null
    attendance?: string | null
    attending?: boolean | null
    departureDate?: any | null
    hotelRoomId?: number | null
    interestLevel?: string | null
    message?: string | null
    roomPreferenceAndNotes?: string | null
    roomingPreferences?: string | null
    roomingWith?: string | null
    userId?: number | null
    volunteer?: boolean | null
    year?: number | null
    offerSubsidy?: boolean | null
    requestOldPrice?: boolean | null
    amountOwed?: number | null
    amountPaid?: number | null
  }

  /**
   * The output of our update `Membership` mutation.
   */
  interface IUpdateMembershipPayload {
    __typename: 'UpdateMembershipPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Membership` that was updated by this mutation.
     */
    membership: IMembership | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `HotelRoom` that is related to this `Membership`.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Reads a single `User` that is related to this `Membership`.
     */
    user: IUser | null

    /**
     * An edge for our `Membership`. May be used by Relay 1.
     */
    membershipEdge: IMembershipsEdge | null
  }

  interface IMembershipEdgeOnUpdateMembershipPayloadArguments {
    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null
  }

  /**
   * All input for the `updateMembership` mutation.
   */
  interface IUpdateMembershipInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Membership` being updated.
     */
    patch: IMembershipPatch
    id: number
  }

  /**
   * All input for the `updateProfileByNodeId` mutation.
   */
  interface IUpdateProfileByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Profile` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Profile` being updated.
     */
    patch: IProfilePatch
  }

  /**
   * Represents an update to a `Profile`. Fields that are set will be updated.
   */
  interface IProfilePatch {
    id?: number | null
    email?: string | null
    fullName?: string | null
    phoneNumber?: string | null
    snailMailAddress?: string | null
  }

  /**
   * The output of our update `Profile` mutation.
   */
  interface IUpdateProfilePayload {
    __typename: 'UpdateProfilePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Profile` that was updated by this mutation.
     */
    profile: IProfile | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Profile`. May be used by Relay 1.
     */
    profileEdge: IProfilesEdge | null
  }

  interface IProfileEdgeOnUpdateProfilePayloadArguments {
    /**
     * The method to use when ordering `Profile`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ProfilesOrderBy> | null
  }

  /**
   * All input for the `updateProfile` mutation.
   */
  interface IUpdateProfileInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Profile` being updated.
     */
    patch: IProfilePatch
    id: number
  }

  /**
   * All input for the `updateProfileByEmail` mutation.
   */
  interface IUpdateProfileByEmailInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Profile` being updated.
     */
    patch: IProfilePatch
    email: string
  }

  /**
   * All input for the `updateRegistrationCodeByNodeId` mutation.
   */
  interface IUpdateRegistrationCodeByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `RegistrationCode` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `RegistrationCode` being updated.
     */
    patch: IRegistrationCodePatch
  }

  /**
   * Represents an update to a `RegistrationCode`. Fields that are set will be updated.
   */
  interface IRegistrationCodePatch {
    id?: number | null
    token?: string | null
    username?: string | null
  }

  /**
   * The output of our update `RegistrationCode` mutation.
   */
  interface IUpdateRegistrationCodePayload {
    __typename: 'UpdateRegistrationCodePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `RegistrationCode` that was updated by this mutation.
     */
    registrationCode: IRegistrationCode | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `RegistrationCode`. May be used by Relay 1.
     */
    registrationCodeEdge: IRegistrationCodesEdge | null
  }

  interface IRegistrationCodeEdgeOnUpdateRegistrationCodePayloadArguments {
    /**
     * The method to use when ordering `RegistrationCode`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RegistrationCodesOrderBy> | null
  }

  /**
   * All input for the `updateRegistrationCode` mutation.
   */
  interface IUpdateRegistrationCodeInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `RegistrationCode` being updated.
     */
    patch: IRegistrationCodePatch
    id: number
  }

  /**
   * All input for the `updateRoleByNodeId` mutation.
   */
  interface IUpdateRoleByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Role` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Role` being updated.
     */
    patch: IRolePatch
  }

  /**
   * Represents an update to a `Role`. Fields that are set will be updated.
   */
  interface IRolePatch {
    id?: number | null
    authority?: string | null
  }

  /**
   * The output of our update `Role` mutation.
   */
  interface IUpdateRolePayload {
    __typename: 'UpdateRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Role` that was updated by this mutation.
     */
    role: IRole | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Role`. May be used by Relay 1.
     */
    roleEdge: IRolesEdge | null
  }

  interface IRoleEdgeOnUpdateRolePayloadArguments {
    /**
     * The method to use when ordering `Role`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RolesOrderBy> | null
  }

  /**
   * All input for the `updateRole` mutation.
   */
  interface IUpdateRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Role` being updated.
     */
    patch: IRolePatch
    id: number
  }

  /**
   * All input for the `updateRoleByAuthority` mutation.
   */
  interface IUpdateRoleByAuthorityInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Role` being updated.
     */
    patch: IRolePatch
    authority: string
  }

  /**
   * All input for the `updateRoomByNodeId` mutation.
   */
  interface IUpdateRoomByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Room` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Room` being updated.
     */
    patch: IRoomPatch
  }

  /**
   * Represents an update to a `Room`. Fields that are set will be updated.
   */
  interface IRoomPatch {
    id?: number | null
    description?: string | null
    size?: number | null
    type?: string | null
    updated?: boolean | null
  }

  /**
   * The output of our update `Room` mutation.
   */
  interface IUpdateRoomPayload {
    __typename: 'UpdateRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Room` that was updated by this mutation.
     */
    room: IRoom | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Room`. May be used by Relay 1.
     */
    roomEdge: IRoomsEdge | null
  }

  interface IRoomEdgeOnUpdateRoomPayloadArguments {
    /**
     * The method to use when ordering `Room`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RoomsOrderBy> | null
  }

  /**
   * All input for the `updateRoom` mutation.
   */
  interface IUpdateRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Room` being updated.
     */
    patch: IRoomPatch
    id: number
  }

  /**
   * All input for the `updateSettingByNodeId` mutation.
   */
  interface IUpdateSettingByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Setting` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Setting` being updated.
     */
    patch: ISettingPatch
  }

  /**
   * Represents an update to a `Setting`. Fields that are set will be updated.
   */
  interface ISettingPatch {
    id?: number | null
    code?: string | null
    type?: string | null
    value?: string | null
  }

  /**
   * The output of our update `Setting` mutation.
   */
  interface IUpdateSettingPayload {
    __typename: 'UpdateSettingPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Setting` that was updated by this mutation.
     */
    setting: ISetting | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Setting`. May be used by Relay 1.
     */
    settingEdge: ISettingsEdge | null
  }

  interface ISettingEdgeOnUpdateSettingPayloadArguments {
    /**
     * The method to use when ordering `Setting`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SettingsOrderBy> | null
  }

  /**
   * All input for the `updateSetting` mutation.
   */
  interface IUpdateSettingInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Setting` being updated.
     */
    patch: ISettingPatch
    id: number
  }

  /**
   * All input for the `updateShirtOrderByNodeId` mutation.
   */
  interface IUpdateShirtOrderByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `ShirtOrder` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `ShirtOrder` being updated.
     */
    patch: IShirtOrderPatch
  }

  /**
   * Represents an update to a `ShirtOrder`. Fields that are set will be updated.
   */
  interface IShirtOrderPatch {
    id?: number | null
    deliveryMethod?: string | null
    message?: string | null
    userId?: number | null
    year?: number | null
  }

  /**
   * The output of our update `ShirtOrder` mutation.
   */
  interface IUpdateShirtOrderPayload {
    __typename: 'UpdateShirtOrderPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrder` that was updated by this mutation.
     */
    shirtOrder: IShirtOrder | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `ShirtOrder`.
     */
    user: IUser | null

    /**
     * An edge for our `ShirtOrder`. May be used by Relay 1.
     */
    shirtOrderEdge: IShirtOrdersEdge | null
  }

  interface IShirtOrderEdgeOnUpdateShirtOrderPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrder`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrdersOrderBy> | null
  }

  /**
   * All input for the `updateShirtOrder` mutation.
   */
  interface IUpdateShirtOrderInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `ShirtOrder` being updated.
     */
    patch: IShirtOrderPatch
    id: number
  }

  /**
   * All input for the `updateShirtOrderItemByNodeId` mutation.
   */
  interface IUpdateShirtOrderItemByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `ShirtOrderItem` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `ShirtOrderItem` being updated.
     */
    patch: IShirtOrderItemPatch
  }

  /**
   * Represents an update to a `ShirtOrderItem`. Fields that are set will be updated.
   */
  interface IShirtOrderItemPatch {
    id?: number | null
    orderId?: number | null
    quantity?: number | null
    size?: string | null
    style?: string | null
    itemsIdx?: number | null
  }

  /**
   * The output of our update `ShirtOrderItem` mutation.
   */
  interface IUpdateShirtOrderItemPayload {
    __typename: 'UpdateShirtOrderItemPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrderItem` that was updated by this mutation.
     */
    shirtOrderItem: IShirtOrderItem | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`.
     */
    order: IShirtOrder | null

    /**
     * An edge for our `ShirtOrderItem`. May be used by Relay 1.
     */
    shirtOrderItemEdge: IShirtOrderItemsEdge | null
  }

  interface IShirtOrderItemEdgeOnUpdateShirtOrderItemPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrderItem`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrderItemsOrderBy> | null
  }

  /**
   * All input for the `updateShirtOrderItem` mutation.
   */
  interface IUpdateShirtOrderItemInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `ShirtOrderItem` being updated.
     */
    patch: IShirtOrderItemPatch
    id: number
  }

  /**
   * All input for the `updateSlotByNodeId` mutation.
   */
  interface IUpdateSlotByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Slot` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Slot` being updated.
     */
    patch: ISlotPatch
  }

  /**
   * Represents an update to a `Slot`. Fields that are set will be updated.
   */
  interface ISlotPatch {
    id?: number | null
    slot?: number | null
    day?: string | null
    formattedDate?: string | null
    length?: string | null
    time?: string | null
  }

  /**
   * The output of our update `Slot` mutation.
   */
  interface IUpdateSlotPayload {
    __typename: 'UpdateSlotPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Slot` that was updated by this mutation.
     */
    slot: ISlot | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Slot`. May be used by Relay 1.
     */
    slotEdge: ISlotsEdge | null
  }

  interface ISlotEdgeOnUpdateSlotPayloadArguments {
    /**
     * The method to use when ordering `Slot`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SlotsOrderBy> | null
  }

  /**
   * All input for the `updateSlot` mutation.
   */
  interface IUpdateSlotInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Slot` being updated.
     */
    patch: ISlotPatch
    id: number
  }

  /**
   * All input for the `updateTokenByNodeId` mutation.
   */
  interface IUpdateTokenByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Token` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `Token` being updated.
     */
    patch: ITokenPatch
  }

  /**
   * Represents an update to a `Token`. Fields that are set will be updated.
   */
  interface ITokenPatch {
    id?: number | null
    userId?: number | null
    cuid?: string | null
    active?: boolean | null
    lastUsed?: any | null
  }

  /**
   * The output of our update `Token` mutation.
   */
  interface IUpdateTokenPayload {
    __typename: 'UpdateTokenPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Token` that was updated by this mutation.
     */
    token: IToken | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `Token`.
     */
    user: IUser | null

    /**
     * An edge for our `Token`. May be used by Relay 1.
     */
    tokenEdge: ITokensEdge | null
  }

  interface ITokenEdgeOnUpdateTokenPayloadArguments {
    /**
     * The method to use when ordering `Token`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<TokensOrderBy> | null
  }

  /**
   * All input for the `updateToken` mutation.
   */
  interface IUpdateTokenInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `Token` being updated.
     */
    patch: ITokenPatch
    id: number
  }

  /**
   * All input for the `updateUserByNodeId` mutation.
   */
  interface IUpdateUserByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `User` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `User` being updated.
     */
    patch: IUserPatch
  }

  /**
   * Represents an update to a `User`. Fields that are set will be updated.
   */
  interface IUserPatch {
    id?: number | null
    accountLocked?: boolean | null
    enabled?: boolean | null
    password?: string | null
    profileId?: number | null
    username?: string | null
  }

  /**
   * The output of our update `User` mutation.
   */
  interface IUpdateUserPayload {
    __typename: 'UpdateUserPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `User` that was updated by this mutation.
     */
    user: IUser | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Profile` that is related to this `User`.
     */
    profile: IProfile | null

    /**
     * An edge for our `User`. May be used by Relay 1.
     */
    userEdge: IUsersEdge | null
  }

  interface IUserEdgeOnUpdateUserPayloadArguments {
    /**
     * The method to use when ordering `User`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UsersOrderBy> | null
  }

  /**
   * All input for the `updateUser` mutation.
   */
  interface IUpdateUserInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `User` being updated.
     */
    patch: IUserPatch
    id: number
  }

  /**
   * All input for the `updateUserByUsername` mutation.
   */
  interface IUpdateUserByUsernameInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `User` being updated.
     */
    patch: IUserPatch
    username: string
  }

  /**
   * All input for the `updateUserRoleByNodeId` mutation.
   */
  interface IUpdateUserRoleByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `UserRole` to be updated.
     */
    nodeId: string

    /**
     * An object where the defined keys will be set on the `UserRole` being updated.
     */
    patch: IUserRolePatch
  }

  /**
   * Represents an update to a `UserRole`. Fields that are set will be updated.
   */
  interface IUserRolePatch {
    roleId?: number | null
    userId?: number | null
  }

  /**
   * The output of our update `UserRole` mutation.
   */
  interface IUpdateUserRolePayload {
    __typename: 'UpdateUserRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `UserRole` that was updated by this mutation.
     */
    userRole: IUserRole | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Role` that is related to this `UserRole`.
     */
    role: IRole | null

    /**
     * Reads a single `User` that is related to this `UserRole`.
     */
    user: IUser | null

    /**
     * An edge for our `UserRole`. May be used by Relay 1.
     */
    userRoleEdge: IUserRolesEdge | null
  }

  interface IUserRoleEdgeOnUpdateUserRolePayloadArguments {
    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null
  }

  /**
   * All input for the `updateUserRole` mutation.
   */
  interface IUpdateUserRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * An object where the defined keys will be set on the `UserRole` being updated.
     */
    patch: IUserRolePatch
    roleId: number
    userId: number
  }

  /**
   * All input for the `deleteGameByNodeId` mutation.
   */
  interface IDeleteGameByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Game` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Game` mutation.
   */
  interface IDeleteGamePayload {
    __typename: 'DeleteGamePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Game` that was deleted by this mutation.
     */
    game: IGame | null
    deletedGameNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Room` that is related to this `Game`.
     */
    room: IRoom | null

    /**
     * Reads a single `Slot` that is related to this `Game`.
     */
    slot: ISlot | null

    /**
     * Reads a single `User` that is related to this `Game`.
     */
    author: IUser | null

    /**
     * An edge for our `Game`. May be used by Relay 1.
     */
    gameEdge: IGamesEdge | null
  }

  interface IGameEdgeOnDeleteGamePayloadArguments {
    /**
     * The method to use when ordering `Game`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GamesOrderBy> | null
  }

  /**
   * All input for the `deleteGame` mutation.
   */
  interface IDeleteGameInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteGameAssignmentByNodeId` mutation.
   */
  interface IDeleteGameAssignmentByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameAssignment` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `GameAssignment` mutation.
   */
  interface IDeleteGameAssignmentPayload {
    __typename: 'DeleteGameAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameAssignment` that was deleted by this mutation.
     */
    gameAssignment: IGameAssignment | null
    deletedGameAssignmentNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `Game` that is related to this `GameAssignment`.
     */
    game: IGame | null

    /**
     * An edge for our `GameAssignment`. May be used by Relay 1.
     */
    gameAssignmentEdge: IGameAssignmentsEdge | null
  }

  interface IGameAssignmentEdgeOnDeleteGameAssignmentPayloadArguments {
    /**
     * The method to use when ordering `GameAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameAssignmentsOrderBy> | null
  }

  /**
   * All input for the `deleteGameAssignment` mutation.
   */
  interface IDeleteGameAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    memberId: number
    gameId: number
    gm: number
  }

  /**
   * All input for the `deleteGameChoiceByNodeId` mutation.
   */
  interface IDeleteGameChoiceByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameChoice` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `GameChoice` mutation.
   */
  interface IDeleteGameChoicePayload {
    __typename: 'DeleteGameChoicePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameChoice` that was deleted by this mutation.
     */
    gameChoice: IGameChoice | null
    deletedGameChoiceNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Game` that is related to this `GameChoice`.
     */
    game: IGame | null

    /**
     * Reads a single `Membership` that is related to this `GameChoice`.
     */
    member: IMembership | null

    /**
     * Reads a single `Slot` that is related to this `GameChoice`.
     */
    slot: ISlot | null

    /**
     * An edge for our `GameChoice`. May be used by Relay 1.
     */
    gameChoiceEdge: IGameChoicesEdge | null
  }

  interface IGameChoiceEdgeOnDeleteGameChoicePayloadArguments {
    /**
     * The method to use when ordering `GameChoice`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameChoicesOrderBy> | null
  }

  /**
   * All input for the `deleteGameChoice` mutation.
   */
  interface IDeleteGameChoiceInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteGameSubmissionByNodeId` mutation.
   */
  interface IDeleteGameSubmissionByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `GameSubmission` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `GameSubmission` mutation.
   */
  interface IDeleteGameSubmissionPayload {
    __typename: 'DeleteGameSubmissionPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `GameSubmission` that was deleted by this mutation.
     */
    gameSubmission: IGameSubmission | null
    deletedGameSubmissionNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `GameSubmission`.
     */
    member: IMembership | null

    /**
     * An edge for our `GameSubmission`. May be used by Relay 1.
     */
    gameSubmissionEdge: IGameSubmissionsEdge | null
  }

  interface IGameSubmissionEdgeOnDeleteGameSubmissionPayloadArguments {
    /**
     * The method to use when ordering `GameSubmission`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<GameSubmissionsOrderBy> | null
  }

  /**
   * All input for the `deleteGameSubmission` mutation.
   */
  interface IDeleteGameSubmissionInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteHotelRoomByNodeId` mutation.
   */
  interface IDeleteHotelRoomByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `HotelRoom` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `HotelRoom` mutation.
   */
  interface IDeleteHotelRoomPayload {
    __typename: 'DeleteHotelRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoom` that was deleted by this mutation.
     */
    hotelRoom: IHotelRoom | null
    deletedHotelRoomNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoom`. May be used by Relay 1.
     */
    hotelRoomEdge: IHotelRoomsEdge | null
  }

  interface IHotelRoomEdgeOnDeleteHotelRoomPayloadArguments {
    /**
     * The method to use when ordering `HotelRoom`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomsOrderBy> | null
  }

  /**
   * All input for the `deleteHotelRoom` mutation.
   */
  interface IDeleteHotelRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteHotelRoomDetailByNodeId` mutation.
   */
  interface IDeleteHotelRoomDetailByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `HotelRoomDetail` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `HotelRoomDetail` mutation.
   */
  interface IDeleteHotelRoomDetailPayload {
    __typename: 'DeleteHotelRoomDetailPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `HotelRoomDetail` that was deleted by this mutation.
     */
    hotelRoomDetail: IHotelRoomDetail | null
    deletedHotelRoomDetailNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `HotelRoomDetail`. May be used by Relay 1.
     */
    hotelRoomDetailEdge: IHotelRoomDetailsEdge | null
  }

  interface IHotelRoomDetailEdgeOnDeleteHotelRoomDetailPayloadArguments {
    /**
     * The method to use when ordering `HotelRoomDetail`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<HotelRoomDetailsOrderBy> | null
  }

  /**
   * All input for the `deleteHotelRoomDetail` mutation.
   */
  interface IDeleteHotelRoomDetailInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: any
  }

  /**
   * All input for the `deleteLookupByNodeId` mutation.
   */
  interface IDeleteLookupByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Lookup` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Lookup` mutation.
   */
  interface IDeleteLookupPayload {
    __typename: 'DeleteLookupPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Lookup` that was deleted by this mutation.
     */
    lookup: ILookup | null
    deletedLookupNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Lookup`. May be used by Relay 1.
     */
    lookupEdge: ILookupsEdge | null
  }

  interface ILookupEdgeOnDeleteLookupPayloadArguments {
    /**
     * The method to use when ordering `Lookup`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupsOrderBy> | null
  }

  /**
   * All input for the `deleteLookup` mutation.
   */
  interface IDeleteLookupInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteLookupByRealm` mutation.
   */
  interface IDeleteLookupByRealmInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    realm: string
  }

  /**
   * All input for the `deleteLookupValueByNodeId` mutation.
   */
  interface IDeleteLookupValueByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `LookupValue` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `LookupValue` mutation.
   */
  interface IDeleteLookupValuePayload {
    __typename: 'DeleteLookupValuePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `LookupValue` that was deleted by this mutation.
     */
    lookupValue: ILookupValue | null
    deletedLookupValueNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Lookup` that is related to this `LookupValue`.
     */
    lookup: ILookup | null

    /**
     * An edge for our `LookupValue`. May be used by Relay 1.
     */
    lookupValueEdge: ILookupValuesEdge | null
  }

  interface ILookupValueEdgeOnDeleteLookupValuePayloadArguments {
    /**
     * The method to use when ordering `LookupValue`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<LookupValuesOrderBy> | null
  }

  /**
   * All input for the `deleteLookupValue` mutation.
   */
  interface IDeleteLookupValueInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteLookupValueByLookupIdAndCode` mutation.
   */
  interface IDeleteLookupValueByLookupIdAndCodeInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    lookupId: number
    code: string
  }

  /**
   * All input for the `deleteMemberHotelRoomAssignmentByNodeId` mutation.
   */
  interface IDeleteMemberHotelRoomAssignmentByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `MemberHotelRoomAssignment` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `MemberHotelRoomAssignment` mutation.
   */
  interface IDeleteMemberHotelRoomAssignmentPayload {
    __typename: 'DeleteMemberHotelRoomAssignmentPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `MemberHotelRoomAssignment` that was deleted by this mutation.
     */
    memberHotelRoomAssignment: IMemberHotelRoomAssignment | null
    deletedMemberHotelRoomAssignmentNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Membership` that is related to this `MemberHotelRoomAssignment`.
     */
    member: IMembership | null

    /**
     * Reads a single `HotelRoomDetail` that is related to this `MemberHotelRoomAssignment`.
     */
    hotelRoom: IHotelRoomDetail | null

    /**
     * An edge for our `MemberHotelRoomAssignment`. May be used by Relay 1.
     */
    memberHotelRoomAssignmentEdge: IMemberHotelRoomAssignmentsEdge | null
  }

  interface IMemberHotelRoomAssignmentEdgeOnDeleteMemberHotelRoomAssignmentPayloadArguments {
    /**
     * The method to use when ordering `MemberHotelRoomAssignment`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MemberHotelRoomAssignmentsOrderBy> | null
  }

  /**
   * All input for the `deleteMemberHotelRoomAssignment` mutation.
   */
  interface IDeleteMemberHotelRoomAssignmentInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    memberId: any
    hotelRoomId: any
  }

  /**
   * All input for the `deleteMembershipByNodeId` mutation.
   */
  interface IDeleteMembershipByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Membership` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Membership` mutation.
   */
  interface IDeleteMembershipPayload {
    __typename: 'DeleteMembershipPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Membership` that was deleted by this mutation.
     */
    membership: IMembership | null
    deletedMembershipNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `HotelRoom` that is related to this `Membership`.
     */
    hotelRoom: IHotelRoom | null

    /**
     * Reads a single `User` that is related to this `Membership`.
     */
    user: IUser | null

    /**
     * An edge for our `Membership`. May be used by Relay 1.
     */
    membershipEdge: IMembershipsEdge | null
  }

  interface IMembershipEdgeOnDeleteMembershipPayloadArguments {
    /**
     * The method to use when ordering `Membership`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<MembershipsOrderBy> | null
  }

  /**
   * All input for the `deleteMembership` mutation.
   */
  interface IDeleteMembershipInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteProfileByNodeId` mutation.
   */
  interface IDeleteProfileByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Profile` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Profile` mutation.
   */
  interface IDeleteProfilePayload {
    __typename: 'DeleteProfilePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Profile` that was deleted by this mutation.
     */
    profile: IProfile | null
    deletedProfileNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Profile`. May be used by Relay 1.
     */
    profileEdge: IProfilesEdge | null
  }

  interface IProfileEdgeOnDeleteProfilePayloadArguments {
    /**
     * The method to use when ordering `Profile`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ProfilesOrderBy> | null
  }

  /**
   * All input for the `deleteProfile` mutation.
   */
  interface IDeleteProfileInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteProfileByEmail` mutation.
   */
  interface IDeleteProfileByEmailInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    email: string
  }

  /**
   * All input for the `deleteRegistrationCodeByNodeId` mutation.
   */
  interface IDeleteRegistrationCodeByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `RegistrationCode` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `RegistrationCode` mutation.
   */
  interface IDeleteRegistrationCodePayload {
    __typename: 'DeleteRegistrationCodePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `RegistrationCode` that was deleted by this mutation.
     */
    registrationCode: IRegistrationCode | null
    deletedRegistrationCodeNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `RegistrationCode`. May be used by Relay 1.
     */
    registrationCodeEdge: IRegistrationCodesEdge | null
  }

  interface IRegistrationCodeEdgeOnDeleteRegistrationCodePayloadArguments {
    /**
     * The method to use when ordering `RegistrationCode`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RegistrationCodesOrderBy> | null
  }

  /**
   * All input for the `deleteRegistrationCode` mutation.
   */
  interface IDeleteRegistrationCodeInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteRoleByNodeId` mutation.
   */
  interface IDeleteRoleByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Role` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Role` mutation.
   */
  interface IDeleteRolePayload {
    __typename: 'DeleteRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Role` that was deleted by this mutation.
     */
    role: IRole | null
    deletedRoleNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Role`. May be used by Relay 1.
     */
    roleEdge: IRolesEdge | null
  }

  interface IRoleEdgeOnDeleteRolePayloadArguments {
    /**
     * The method to use when ordering `Role`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RolesOrderBy> | null
  }

  /**
   * All input for the `deleteRole` mutation.
   */
  interface IDeleteRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteRoleByAuthority` mutation.
   */
  interface IDeleteRoleByAuthorityInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    authority: string
  }

  /**
   * All input for the `deleteRoomByNodeId` mutation.
   */
  interface IDeleteRoomByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Room` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Room` mutation.
   */
  interface IDeleteRoomPayload {
    __typename: 'DeleteRoomPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Room` that was deleted by this mutation.
     */
    room: IRoom | null
    deletedRoomNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Room`. May be used by Relay 1.
     */
    roomEdge: IRoomsEdge | null
  }

  interface IRoomEdgeOnDeleteRoomPayloadArguments {
    /**
     * The method to use when ordering `Room`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<RoomsOrderBy> | null
  }

  /**
   * All input for the `deleteRoom` mutation.
   */
  interface IDeleteRoomInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteSettingByNodeId` mutation.
   */
  interface IDeleteSettingByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Setting` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Setting` mutation.
   */
  interface IDeleteSettingPayload {
    __typename: 'DeleteSettingPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Setting` that was deleted by this mutation.
     */
    setting: ISetting | null
    deletedSettingNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Setting`. May be used by Relay 1.
     */
    settingEdge: ISettingsEdge | null
  }

  interface ISettingEdgeOnDeleteSettingPayloadArguments {
    /**
     * The method to use when ordering `Setting`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SettingsOrderBy> | null
  }

  /**
   * All input for the `deleteSetting` mutation.
   */
  interface IDeleteSettingInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteShirtOrderByNodeId` mutation.
   */
  interface IDeleteShirtOrderByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `ShirtOrder` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `ShirtOrder` mutation.
   */
  interface IDeleteShirtOrderPayload {
    __typename: 'DeleteShirtOrderPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrder` that was deleted by this mutation.
     */
    shirtOrder: IShirtOrder | null
    deletedShirtOrderNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `ShirtOrder`.
     */
    user: IUser | null

    /**
     * An edge for our `ShirtOrder`. May be used by Relay 1.
     */
    shirtOrderEdge: IShirtOrdersEdge | null
  }

  interface IShirtOrderEdgeOnDeleteShirtOrderPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrder`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrdersOrderBy> | null
  }

  /**
   * All input for the `deleteShirtOrder` mutation.
   */
  interface IDeleteShirtOrderInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteShirtOrderItemByNodeId` mutation.
   */
  interface IDeleteShirtOrderItemByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `ShirtOrderItem` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `ShirtOrderItem` mutation.
   */
  interface IDeleteShirtOrderItemPayload {
    __typename: 'DeleteShirtOrderItemPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `ShirtOrderItem` that was deleted by this mutation.
     */
    shirtOrderItem: IShirtOrderItem | null
    deletedShirtOrderItemNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `ShirtOrder` that is related to this `ShirtOrderItem`.
     */
    order: IShirtOrder | null

    /**
     * An edge for our `ShirtOrderItem`. May be used by Relay 1.
     */
    shirtOrderItemEdge: IShirtOrderItemsEdge | null
  }

  interface IShirtOrderItemEdgeOnDeleteShirtOrderItemPayloadArguments {
    /**
     * The method to use when ordering `ShirtOrderItem`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<ShirtOrderItemsOrderBy> | null
  }

  /**
   * All input for the `deleteShirtOrderItem` mutation.
   */
  interface IDeleteShirtOrderItemInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteSlotByNodeId` mutation.
   */
  interface IDeleteSlotByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Slot` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Slot` mutation.
   */
  interface IDeleteSlotPayload {
    __typename: 'DeleteSlotPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Slot` that was deleted by this mutation.
     */
    slot: ISlot | null
    deletedSlotNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * An edge for our `Slot`. May be used by Relay 1.
     */
    slotEdge: ISlotsEdge | null
  }

  interface ISlotEdgeOnDeleteSlotPayloadArguments {
    /**
     * The method to use when ordering `Slot`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<SlotsOrderBy> | null
  }

  /**
   * All input for the `deleteSlot` mutation.
   */
  interface IDeleteSlotInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteTokenByNodeId` mutation.
   */
  interface IDeleteTokenByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `Token` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `Token` mutation.
   */
  interface IDeleteTokenPayload {
    __typename: 'DeleteTokenPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `Token` that was deleted by this mutation.
     */
    token: IToken | null
    deletedTokenNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `User` that is related to this `Token`.
     */
    user: IUser | null

    /**
     * An edge for our `Token`. May be used by Relay 1.
     */
    tokenEdge: ITokensEdge | null
  }

  interface ITokenEdgeOnDeleteTokenPayloadArguments {
    /**
     * The method to use when ordering `Token`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<TokensOrderBy> | null
  }

  /**
   * All input for the `deleteToken` mutation.
   */
  interface IDeleteTokenInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteUserByNodeId` mutation.
   */
  interface IDeleteUserByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `User` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `User` mutation.
   */
  interface IDeleteUserPayload {
    __typename: 'DeleteUserPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `User` that was deleted by this mutation.
     */
    user: IUser | null
    deletedUserNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Profile` that is related to this `User`.
     */
    profile: IProfile | null

    /**
     * An edge for our `User`. May be used by Relay 1.
     */
    userEdge: IUsersEdge | null
  }

  interface IUserEdgeOnDeleteUserPayloadArguments {
    /**
     * The method to use when ordering `User`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UsersOrderBy> | null
  }

  /**
   * All input for the `deleteUser` mutation.
   */
  interface IDeleteUserInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    id: number
  }

  /**
   * All input for the `deleteUserByUsername` mutation.
   */
  interface IDeleteUserByUsernameInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    username: string
  }

  /**
   * All input for the `deleteUserRoleByNodeId` mutation.
   */
  interface IDeleteUserRoleByNodeIdInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null

    /**
     * The globally unique `ID` which will identify a single `UserRole` to be deleted.
     */
    nodeId: string
  }

  /**
   * The output of our delete `UserRole` mutation.
   */
  interface IDeleteUserRolePayload {
    __typename: 'DeleteUserRolePayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * The `UserRole` that was deleted by this mutation.
     */
    userRole: IUserRole | null
    deletedUserRoleNodeId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null

    /**
     * Reads a single `Role` that is related to this `UserRole`.
     */
    role: IRole | null

    /**
     * Reads a single `User` that is related to this `UserRole`.
     */
    user: IUser | null

    /**
     * An edge for our `UserRole`. May be used by Relay 1.
     */
    userRoleEdge: IUserRolesEdge | null
  }

  interface IUserRoleEdgeOnDeleteUserRolePayloadArguments {
    /**
     * The method to use when ordering `UserRole`.
     * @default ["PRIMARY_KEY_ASC"]
     */
    orderBy?: Array<UserRolesOrderBy> | null
  }

  /**
   * All input for the `deleteUserRole` mutation.
   */
  interface IDeleteUserRoleInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    roleId: number
    userId: number
  }

  /**
   * All input for the `fTruncateTables` mutation.
   */
  interface IFTruncateTablesInput {
    /**
     * An arbitrary string value with no semantic meaning. Will be included in the
     * payload verbatim. May be used to track mutations by the client.
     */
    clientMutationId?: string | null
    _username?: string | null
  }

  /**
   * The output of our `fTruncateTables` mutation.
   */
  interface IFTruncateTablesPayload {
    __typename: 'FTruncateTablesPayload'

    /**
     * The exact same `clientMutationId` that was provided in the mutation input,
     * unchanged and unused. May be used by a client to track mutations.
     */
    clientMutationId: string | null

    /**
     * Our root query field type. Allows us to run any query from our mutation payload.
     */
    query: IQuery | null
  }
}

// tslint:enable
