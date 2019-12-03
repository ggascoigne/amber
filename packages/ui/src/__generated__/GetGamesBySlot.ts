/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGamesBySlot
// ====================================================

export interface GetGamesBySlot_games_edges_node_gameAssignments_nodes_member_user_profile {
  __typename: 'Profile'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  email: string
  fullName: string
  phoneNumber: string | null
  snailMailAddress: string | null
}

export interface GetGamesBySlot_games_edges_node_gameAssignments_nodes_member_user {
  __typename: 'User'
  /**
   * Reads a single `Profile` that is related to this `User`.
   */
  profile: GetGamesBySlot_games_edges_node_gameAssignments_nodes_member_user_profile | null
}

export interface GetGamesBySlot_games_edges_node_gameAssignments_nodes_member {
  __typename: 'Membership'
  /**
   * Reads a single `User` that is related to this `Membership`.
   */
  user: GetGamesBySlot_games_edges_node_gameAssignments_nodes_member_user | null
}

export interface GetGamesBySlot_games_edges_node_gameAssignments_nodes {
  __typename: 'GameAssignment'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  gm: number
  /**
   * Reads a single `Membership` that is related to this `GameAssignment`.
   */
  member: GetGamesBySlot_games_edges_node_gameAssignments_nodes_member | null
}

export interface GetGamesBySlot_games_edges_node_gameAssignments {
  __typename: 'GameAssignmentsConnection'
  /**
   * A list of `GameAssignment` objects.
   */
  nodes: (GetGamesBySlot_games_edges_node_gameAssignments_nodes | null)[]
}

export interface GetGamesBySlot_games_edges_node {
  __typename: 'Game'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  name: string
  gmNames: string | null
  description: string
  genre: string
  type: string
  setting: string
  charInstructions: string
  playerMax: number
  playerMin: number
  playerPreference: string
  returningPlayers: string
  playersContactGm: boolean
  gameContactEmail: string
  estimatedLength: string
  slotPreference: number
  lateStart: string | null
  lateFinish: boolean | null
  slotConflicts: string
  message: string
  slotId: number | null
  teenFriendly: boolean
  year: number
  /**
   * Reads and enables pagination through a set of `GameAssignment`.
   */
  gameAssignments: GetGamesBySlot_games_edges_node_gameAssignments
}

export interface GetGamesBySlot_games_edges {
  __typename: 'GamesEdge'
  /**
   * The `Game` at the end of the edge.
   */
  node: GetGamesBySlot_games_edges_node | null
}

export interface GetGamesBySlot_games {
  __typename: 'GamesConnection'
  /**
   * A list of edges which contains the `Game` and cursor to aid in pagination.
   */
  edges: GetGamesBySlot_games_edges[]
}

export interface GetGamesBySlot {
  /**
   * Reads and enables pagination through a set of `Game`.
   */
  games: GetGamesBySlot_games | null
}

export interface GetGamesBySlotVariables {
  year: number
  slotId: number
}
