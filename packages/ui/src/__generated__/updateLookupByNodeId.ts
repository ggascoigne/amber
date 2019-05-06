/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateLookupByNodeIdInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: updateLookupByNodeId
// ====================================================

export interface updateLookupByNodeId_updateLookupByNodeId_lookup {
  __typename: 'Lookup'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  realm: string
}

export interface updateLookupByNodeId_updateLookupByNodeId {
  __typename: 'UpdateLookupPayload'
  /**
   * The `Lookup` that was updated by this mutation.
   */
  lookup: updateLookupByNodeId_updateLookupByNodeId_lookup | null
}

export interface updateLookupByNodeId {
  /**
   * Updates a single `Lookup` using its globally unique id and a patch.
   */
  updateLookupByNodeId: updateLookupByNodeId_updateLookupByNodeId | null
}

export interface updateLookupByNodeIdVariables {
  input: UpdateLookupByNodeIdInput
}
