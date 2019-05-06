/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { DeleteLookupValueInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: deleteLookupValue
// ====================================================

export interface deleteLookupValue_deleteLookupValue {
  __typename: 'DeleteLookupValuePayload'
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId: string | null
  deletedLookupValueNodeId: string | null
}

export interface deleteLookupValue {
  /**
   * Deletes a single `LookupValue` using a unique key.
   */
  deleteLookupValue: deleteLookupValue_deleteLookupValue | null
}

export interface deleteLookupValueVariables {
  input: DeleteLookupValueInput
}
