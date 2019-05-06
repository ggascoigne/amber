/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateLookupValueInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: createLookupValue
// ====================================================

export interface createLookupValue_createLookupValue_lookupValue {
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

export interface createLookupValue_createLookupValue {
  __typename: 'CreateLookupValuePayload'
  /**
   * The `LookupValue` that was created by this mutation.
   */
  lookupValue: createLookupValue_createLookupValue_lookupValue | null
}

export interface createLookupValue {
  /**
   * Creates a single `LookupValue`.
   */
  createLookupValue: createLookupValue_createLookupValue | null
}

export interface createLookupValueVariables {
  input: CreateLookupValueInput
}
