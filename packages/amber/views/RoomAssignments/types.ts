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
  currentRoomId: number | null
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
