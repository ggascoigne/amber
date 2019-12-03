/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteGameInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: deleteGame
// ====================================================

export interface deleteGame_deleteGame {
  __typename: 'DeleteGamePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId: string | null
  deletedGameNodeId: string | null
}

export interface deleteGame {
  /**
   * Deletes a single `Game` using a unique key.
   */
  deleteGame: deleteGame_deleteGame | null
}

export interface deleteGameVariables {
  input: DeleteGameInput
}
