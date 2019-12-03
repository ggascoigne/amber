/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLookupValues
// ====================================================

export interface GetLookupValues_lookups_edges_node_lookupValues_nodes {
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

export interface GetLookupValues_lookups_edges_node_lookupValues {
  __typename: 'LookupValuesConnection'
  /**
   * A list of `LookupValue` objects.
   */
  nodes: (GetLookupValues_lookups_edges_node_lookupValues_nodes | null)[]
}

export interface GetLookupValues_lookups_edges_node {
  __typename: 'Lookup'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  realm: string
  /**
   * Reads and enables pagination through a set of `LookupValue`.
   */
  lookupValues: GetLookupValues_lookups_edges_node_lookupValues
}

export interface GetLookupValues_lookups_edges {
  __typename: 'LookupsEdge'
  /**
   * The `Lookup` at the end of the edge.
   */
  node: GetLookupValues_lookups_edges_node | null
}

export interface GetLookupValues_lookups {
  __typename: 'LookupsConnection'
  /**
   * A list of edges which contains the `Lookup` and cursor to aid in pagination.
   */
  edges: GetLookupValues_lookups_edges[]
}

export interface GetLookupValues {
  /**
   * Reads and enables pagination through a set of `Lookup`.
   */
  lookups: GetLookupValues_lookups | null
}

export interface GetLookupValuesVariables {
  realm: string
}
