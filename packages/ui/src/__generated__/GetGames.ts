/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGames
// ====================================================

export interface GetGames_games_edges_node_gameAssignments_nodes_member_user_profile {
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

export interface GetGames_games_edges_node_gameAssignments_nodes_member_user {
  __typename: 'User'
  /**
   * Reads a single `Profile` that is related to this `User`.
   */
  profile: GetGames_games_edges_node_gameAssignments_nodes_member_user_profile | null
}

export interface GetGames_games_edges_node_gameAssignments_nodes_member {
  __typename: 'Membership'
  /**
   * Reads a single `User` that is related to this `Membership`.
   */
  user: GetGames_games_edges_node_gameAssignments_nodes_member_user | null
}

export interface GetGames_games_edges_node_gameAssignments_nodes {
  __typename: 'GameAssignment'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  gm: number
  /**
   * Reads a single `Membership` that is related to this `GameAssignment`.
   */
  member: GetGames_games_edges_node_gameAssignments_nodes_member | null
}

export interface GetGames_games_edges_node_gameAssignments {
  __typename: 'GameAssignmentsConnection'
  /**
   * A list of `GameAssignment` objects.
   */
  nodes: (GetGames_games_edges_node_gameAssignments_nodes | null)[]
}

export interface GetGames_games_edges_node {
  __typename: 'Game'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  id: number
  charInstructions: string
  description: string
  estimatedLength: string
  gameContactEmail: string
  genre: string
  lateFinish: boolean | null
  lateStart: string | null
  message: string
  name: string
  playerMax: number
  playerMin: number
  playerPreference: string
  playersContactGm: boolean
  returningPlayers: string
  setting: string
  slotConflicts: string
  slotId: number | null
  slotPreference: number
  teenFriendly: boolean
  type: string
  year: number
  /**
   * Reads and enables pagination through a set of `GameAssignment`.
   */
  gameAssignments: GetGames_games_edges_node_gameAssignments
}

export interface GetGames_games_edges {
  __typename: 'GamesEdge'
  /**
   * The `Game` at the end of the edge.
   */
  node: GetGames_games_edges_node | null
}

export interface GetGames_games {
  __typename: 'GamesConnection'
  /**
   * A list of edges which contains the `Game` and cursor to aid in pagination.
   */
  edges: GetGames_games_edges[]
}

export interface GetGames {
  /**
   * Reads and enables pagination through a set of `Game`.
   */
  games: GetGames_games | null
}

export interface GetGamesVariables {
  year: number
  slotId: number
}
