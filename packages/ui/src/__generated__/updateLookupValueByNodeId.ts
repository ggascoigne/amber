/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateLookupValueByNodeIdInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: updateLookupValueByNodeId
// ====================================================

export interface updateLookupValueByNodeId_updateLookupValueByNodeId_lookupValue {
  __typename: 'LookupValue'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  code: string
  sequencer: number
  value: string
}

export interface updateLookupValueByNodeId_updateLookupValueByNodeId {
  __typename: 'UpdateLookupValuePayload'
  /**
   * The `LookupValue` that was updated by this mutation.
   */
  lookupValue: updateLookupValueByNodeId_updateLookupValueByNodeId_lookupValue | null
}

export interface updateLookupValueByNodeId {
  /**
   * Updates a single `LookupValue` using its globally unique id and a patch.
   */
  updateLookupValueByNodeId: updateLookupValueByNodeId_updateLookupValueByNodeId | null
}

export interface updateLookupValueByNodeIdVariables {
  input: UpdateLookupValueByNodeIdInput
}
