export type RoomSelectOption = {
  id: number
  description: string
  assignedMemberNames: Array<string>
}

export type SizedRoomSelectOption = RoomSelectOption & {
  size: number
}

export type ManualRoomSelectOption = SizedRoomSelectOption & {
  slotAssignmentCount: number
  slotIsAvailable: boolean
}

export type ManualGameRoomOverrideAssignment = {
  id: bigint
  roomId: number
  roomDescription: string
  roomSize: number
  assignedMemberNames: Array<string>
}

export type ManualGameMember = {
  id: string
  memberId: number
  memberName: string
  roleLabel: string
  gm: boolean
}

export type ManualGameRoomAssignmentRow = {
  id: number
  gameId: number
  slotId: number
  gameName: string
  gmNames: Array<string>
  assignedCount: number
  currentRoomSize: number | null
  roomSpace: number | null
  currentRoomId: number | null
  currentRoomAssignmentReason: string | null
  overrideAssignments: Array<ManualGameRoomOverrideAssignment>
  members: Array<ManualGameMember>
}

export type RoomSlotAvailabilityRow = {
  id: number
  roomId: number
  roomDescription: string
  roomType: string
  slotAvailabilityBySlotId: Record<number, boolean>
}

export type MemberRoomAssignmentRow = {
  id: number
  memberId: number
  memberName: string
  assignedRoomId: number | null
  sharingLabel: string
}

export type RoomMemberAssignmentRow = {
  id: number
  roomId: number
  roomDescription: string
  roomType: string
  enabled: boolean
  assignedMemberIds: Array<number>
  assignedMemberNames: Array<string>
}

export type CurrentSlotRoomAvailabilityRow = {
  id: number
  roomId: number
  roomDescription: string
  assignedMemberNames: Array<string>
  size: number
}

export type RoomUsageSummaryRow = {
  id: number
  roomId: number
  roomDescription: string
  assignedMemberNames: Array<string>
  size: number
  usageCount: number
}

export type RoomAssignmentConflictRow = {
  id: string
  slotId: number
  gameId: number | null
  gameName: string
  gmNames: Array<string>
  roomDescription: string
  assignedMemberNames: Array<string>
  severity: 'error' | 'warning'
  issueType: string
  detail: string
}
