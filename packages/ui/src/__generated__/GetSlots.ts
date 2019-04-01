/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSlots
// ====================================================

export interface GetSlots_slots_nodes {
  __typename: 'Slot'
  id: number
  slot: number
  day: string
  length: string
  time: string
}

export interface GetSlots_slots {
  __typename: 'SlotsConnection'
  /**
   * A list of `Slot` objects.
   */
  nodes: (GetSlots_slots_nodes | null)[]
}

export interface GetSlots {
  /**
   * Reads and enables pagination through a set of `Slot`.
   */
  slots: GetSlots_slots | null
}
