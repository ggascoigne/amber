/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: gameFields
// ====================================================

export interface gameFields {
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
}
