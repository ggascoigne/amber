import type { RoomAccessibility } from './domain'
import { buildInitialPlannerResult } from './initialPlanner.slotPlanning'

export type InitialPlannerRoom = {
  id: number
  description: string
  size: number
  type: string
  enabled: boolean
  accessibility: RoomAccessibility
}

export type InitialPlannerGame = {
  id: number
  name: string
  slotId: number
  year: number
  category: string
}

export type InitialPlannerParticipant = {
  memberId: number
  gameId: number
  isGm: boolean
  fullName: string
  roomAccessibilityPreference: RoomAccessibility | null
}

export type InitialPlannerRoomAvailability = {
  roomId: number
  slotId: number
  year: number
  isAvailable: boolean
}

export type InitialPlannerMemberRoomAssignment = {
  memberId: number
  roomId: number
  memberName: string
}

export type InitialPlannerExistingAssignment = {
  gameId: number
  roomId: number
  slotId: number
  year: number
  isOverride: boolean
  source: 'manual' | 'auto'
}

export type InitialPlannerInput = {
  year: number
  games: Array<InitialPlannerGame>
  rooms: Array<InitialPlannerRoom>
  participants: Array<InitialPlannerParticipant>
  roomSlotAvailability: Array<InitialPlannerRoomAvailability>
  memberRoomAssignments: Array<InitialPlannerMemberRoomAssignment>
  existingAssignments: Array<InitialPlannerExistingAssignment>
}

export type PlannedRoomAssignment = {
  gameId: number
  gameName: string
  roomId: number
  roomDescription: string
  slotId: number
  year: number
  source: 'auto'
  reason: string
}

export type SkippedPlannedGame = {
  gameId: number
  gameName: string
  slotId: number
  participantCount: number
  reason: string
}

export type PlannerUnmetConstraint = {
  id: string
  slotId: number
  type: 'unused_non_member_room'
  detail: string
}

export type InitialPlannerResult = {
  assignments: Array<PlannedRoomAssignment>
  skippedGames: Array<SkippedPlannedGame>
  unmetConstraints: Array<PlannerUnmetConstraint>
}

export const planInitialRoomAssignments = (input: InitialPlannerInput): InitialPlannerResult =>
  buildInitialPlannerResult(input)
