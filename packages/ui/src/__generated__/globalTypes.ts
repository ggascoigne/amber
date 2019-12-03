/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * All input for the create `Game` mutation.
 */
export interface CreateGameInput {
  clientMutationId?: string | null
  game: GameInput
}

/**
 * All input for the create `Lookup` mutation.
 */
export interface CreateLookupInput {
  clientMutationId?: string | null
  lookup: LookupInput
}

/**
 * All input for the create `LookupValue` mutation.
 */
export interface CreateLookupValueInput {
  clientMutationId?: string | null
  lookupValue: LookupValueInput
}

/**
 * All input for the `deleteGame` mutation.
 */
export interface DeleteGameInput {
  clientMutationId?: string | null
  id: number
}

/**
 * All input for the `deleteLookup` mutation.
 */
export interface DeleteLookupInput {
  clientMutationId?: string | null
  id: number
}

/**
 * All input for the `deleteLookupValue` mutation.
 */
export interface DeleteLookupValueInput {
  clientMutationId?: string | null
  id: number
}

/**
 * An input for mutations affecting `Game`
 */
export interface GameInput {
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
 * Represents an update to a `Game`. Fields that are set will be updated.
 */
export interface GamePatch {
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
 * An input for mutations affecting `Lookup`
 */
export interface LookupInput {
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
 * Represents an update to a `Lookup`. Fields that are set will be updated.
 */
export interface LookupPatch {
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
 * An input for mutations affecting `LookupValue`
 */
export interface LookupValueInput {
  id?: number | null
  code: string
  lookupId: number
  numericSequencer: any
  sequencer: number
  stringSequencer: string
  value: string
}

/**
 * Represents an update to a `LookupValue`. Fields that are set will be updated.
 */
export interface LookupValuePatch {
  id?: number | null
  code?: string | null
  lookupId?: number | null
  numericSequencer?: any | null
  sequencer?: number | null
  stringSequencer?: string | null
  value?: string | null
}

/**
 * All input for the `updateGameByNodeId` mutation.
 */
export interface UpdateGameByNodeIdInput {
  clientMutationId?: string | null
  nodeId: string
  patch: GamePatch
}

/**
 * All input for the `updateLookupByNodeId` mutation.
 */
export interface UpdateLookupByNodeIdInput {
  clientMutationId?: string | null
  nodeId: string
  patch: LookupPatch
}

/**
 * All input for the `updateLookupValueByNodeId` mutation.
 */
export interface UpdateLookupValueByNodeIdInput {
  clientMutationId?: string | null
  nodeId: string
  patch: LookupValuePatch
}

//==============================================================
// END Enums and Input Objects
//==============================================================
