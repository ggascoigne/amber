/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateGameByNodeIdInput } from './globalTypes'

// ====================================================
// GraphQL mutation operation: updateGameByNodeId
// ====================================================

export interface updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member_user_profile {
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

export interface updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member_user {
  __typename: 'User'
  /**
   * Reads a single `Profile` that is related to this `User`.
   */
  profile: updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member_user_profile | null
}

export interface updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member {
  __typename: 'Membership'
  /**
   * Reads a single `User` that is related to this `Membership`.
   */
  user: updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member_user | null
}

export interface updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes {
  __typename: 'GameAssignment'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  gm: number
  /**
   * Reads a single `Membership` that is related to this `GameAssignment`.
   */
  member: updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes_member | null
}

export interface updateGameByNodeId_updateGameByNodeId_game_gameAssignments {
  __typename: 'GameAssignmentsConnection'
  /**
   * A list of `GameAssignment` objects.
   */
  nodes: (updateGameByNodeId_updateGameByNodeId_game_gameAssignments_nodes | null)[]
}

export interface updateGameByNodeId_updateGameByNodeId_game {
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
  gameAssignments: updateGameByNodeId_updateGameByNodeId_game_gameAssignments
}

export interface updateGameByNodeId_updateGameByNodeId {
  __typename: 'UpdateGamePayload'
  /**
   * The `Game` that was updated by this mutation.
   */
  game: updateGameByNodeId_updateGameByNodeId_game | null
}

export interface updateGameByNodeId {
  /**
   * Updates a single `Game` using its globally unique id and a patch.
   */
  updateGameByNodeId: updateGameByNodeId_updateGameByNodeId | null
}

export interface updateGameByNodeIdVariables {
  input: UpdateGameByNodeIdInput
}
