/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetLookups
// ====================================================

export interface GetLookups_lookups_edges_node_lookupValues_nodes {
  __typename: 'LookupValue'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  sequencer: number
  value: string
}

export interface GetLookups_lookups_edges_node_lookupValues {
  __typename: 'LookupValuesConnection'
  /**
   * A list of `LookupValue` objects.
   */
  nodes: (GetLookups_lookups_edges_node_lookupValues_nodes | null)[]
}

export interface GetLookups_lookups_edges_node {
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
  lookupValues: GetLookups_lookups_edges_node_lookupValues
}

export interface GetLookups_lookups_edges {
  __typename: 'LookupsEdge'
  /**
   * The `Lookup` at the end of the edge.
   */
  node: GetLookups_lookups_edges_node | null
}

export interface GetLookups_lookups {
  __typename: 'LookupsConnection'
  /**
   * A list of edges which contains the `Lookup` and cursor to aid in pagination.
   */
  edges: GetLookups_lookups_edges[]
}

export interface GetLookups {
  /**
   * Reads and enables pagination through a set of `Lookup`.
   */
  lookups: GetLookups_lookups | null
}
