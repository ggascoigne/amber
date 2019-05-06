/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteLookupInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: deleteLookup
// ====================================================

export interface deleteLookup_deleteLookup {
  __typename: 'DeleteLookupPayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId: string | null
  deletedLookupNodeId: string | null
}

export interface deleteLookup {
  /**
   * Deletes a single `Lookup` using a unique key.
   */
  deleteLookup: deleteLookup_deleteLookup | null
}

export interface deleteLookupVariables {
  input: DeleteLookupInput
}
