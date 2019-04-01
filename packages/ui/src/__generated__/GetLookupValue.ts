/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLookupValue
// ====================================================

export interface GetLookupValue_lookups_edges_node_lookupValues_nodes {
  __typename: 'LookupValue'
  id: number
  code: string
  sequencer: number
  value: string
}

export interface GetLookupValue_lookups_edges_node_lookupValues {
  __typename: 'LookupValuesConnection'
  /**
   * A list of `LookupValue` objects.
   */
  nodes: (GetLookupValue_lookups_edges_node_lookupValues_nodes | null)[]
}

export interface GetLookupValue_lookups_edges_node {
  __typename: 'Lookup'
  realm: string
  /**
   * Reads and enables pagination through a set of `LookupValue`.
   */
  lookupValues: GetLookupValue_lookups_edges_node_lookupValues
}

export interface GetLookupValue_lookups_edges {
  __typename: 'LookupsEdge'
  /**
   * The `Lookup` at the end of the edge.
   */
  node: GetLookupValue_lookups_edges_node | null
}

export interface GetLookupValue_lookups {
  __typename: 'LookupsConnection'
  /**
   * A list of edges which contains the `Lookup` and cursor to aid in pagination.
   */
  edges: GetLookupValue_lookups_edges[]
}

export interface GetLookupValue {
  /**
   * Reads and enables pagination through a set of `Lookup`.
   */
  lookups: GetLookupValue_lookups | null
}

export interface GetLookupValueVariables {
  realm: string
  code: string
}
