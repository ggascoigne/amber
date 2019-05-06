/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CreateLookupInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: createLookup
// ====================================================

export interface createLookup_createLookup_lookup {
  __typename: 'Lookup'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  realm: string
}

export interface createLookup_createLookup {
  __typename: 'CreateLookupPayload'
  /**
   * The `Lookup` that was created by this mutation.
   */
  lookup: createLookup_createLookup_lookup | null
}

export interface createLookup {
  /**
   * Creates a single `Lookup`.
   */
  createLookup: createLookup_createLookup | null
}

export interface createLookupVariables {
  input: CreateLookupInput
}
