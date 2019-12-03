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
}
