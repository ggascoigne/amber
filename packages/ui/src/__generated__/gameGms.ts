/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: gameGms
// ====================================================

export interface gameGms_gameAssignments_nodes_member_user_profile {
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

export interface gameGms_gameAssignments_nodes_member_user {
  __typename: 'User'
  /**
   * Reads a single `Profile` that is related to this `User`.
   */
  profile: gameGms_gameAssignments_nodes_member_user_profile | null
}

export interface gameGms_gameAssignments_nodes_member {
  __typename: 'Membership'
  /**
   * Reads a single `User` that is related to this `Membership`.
   */
  user: gameGms_gameAssignments_nodes_member_user | null
}

export interface gameGms_gameAssignments_nodes {
  __typename: 'GameAssignment'
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string
  gm: number
  /**
   * Reads a single `Membership` that is related to this `GameAssignment`.
   */
  member: gameGms_gameAssignments_nodes_member | null
}

export interface gameGms_gameAssignments {
  __typename: 'GameAssignmentsConnection'
  /**
   * A list of `GameAssignment` objects.
   */
  nodes: (gameGms_gameAssignments_nodes | null)[]
}

export interface gameGms {
  __typename: 'Game'
  /**
   * Reads and enables pagination through a set of `GameAssignment`.
   */
  gameAssignments: gameGms_gameAssignments
}
