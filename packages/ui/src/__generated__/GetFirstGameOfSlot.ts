/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFirstGameOfSlot
// ====================================================

export interface GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member_user_profile {
  __typename: 'Profile'
  id: number
  email: string
  fullName: string
  phoneNumber: string | null
  snailMailAddress: string | null
}

export interface GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member_user {
  __typename: 'User'
  /**
   * Reads a single `Profile` that is related to this `User`.
   */
  profile: GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member_user_profile | null
}

export interface GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member {
  __typename: 'Membership'
  /**
   * Reads a single `User` that is related to this `Membership`.
   */
  user: GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member_user | null
}

export interface GetFirstGameOfSlot_games_nodes_gameAssignments_nodes {
  __typename: 'GameAssignment'
  gm: number
  /**
   * Reads a single `Membership` that is related to this `GameAssignment`.
   */
  member: GetFirstGameOfSlot_games_nodes_gameAssignments_nodes_member | null
}

export interface GetFirstGameOfSlot_games_nodes_gameAssignments {
  __typename: 'GameAssignmentsConnection'
  /**
   * A list of `GameAssignment` objects.
   */
  nodes: (GetFirstGameOfSlot_games_nodes_gameAssignments_nodes | null)[]
}

export interface GetFirstGameOfSlot_games_nodes {
  __typename: 'Game'
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
  gameAssignments: GetFirstGameOfSlot_games_nodes_gameAssignments
}

export interface GetFirstGameOfSlot_games {
  __typename: 'GamesConnection'
  /**
   * A list of `Game` objects.
   */
  nodes: (GetFirstGameOfSlot_games_nodes | null)[]
}

export interface GetFirstGameOfSlot {
  /**
   * Reads and enables pagination through a set of `Game`.
   */
  games: GetFirstGameOfSlot_games | null
}

export interface GetFirstGameOfSlotVariables {
  year: number
}
