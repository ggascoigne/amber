import type {
  GameAssignmentDashboardData,
  UpdateGameAssignmentsInput,
  UpsertGameChoiceBySlotInput,
} from '@amber/client'

export type DashboardAssignment = GameAssignmentDashboardData['assignments'][number]
export type DashboardChoice = GameAssignmentDashboardData['choices'][number]
export type DashboardGame = GameAssignmentDashboardData['games'][number]
export type DashboardMembership = GameAssignmentDashboardData['memberships'][number]
export type DashboardSubmission = GameAssignmentDashboardData['submissions'][number]
export type AssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]
export type ChoiceUpsert = UpsertGameChoiceBySlotInput

export type AssignmentCounts = {
  assignedCount: number
  overrun: number
  shortfall: number
  spaces: number
}

export type GameAssignmentSummaryRow = {
  gameId: number
  slotId: number
  name: string
  playerMin: number
  playerMax: number
  assignedCount: number
  overrun: number
  shortfall: number
  spaces: number
}

export type GameInterestSummaryRow = GameAssignmentSummaryRow & {
  overallInterest: number
}

export type MemberAssignmentCounts = {
  gmOrFirst: number
  second: number
  third: number
  fourth: number
  other: number
}

export type MemberAssignmentSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
  counts: MemberAssignmentCounts
}

export type MemberAssignmentEditorRow = {
  rowId: string
  memberId: number
  slotId: number
  slotLabel: string
  gameId: number | null
  gameName: string
  gm: number
  priorityLabel: string
  prioritySortValue: number
}

export type GameAssignmentEditorRow = {
  rowId: string
  memberId: number | null
  gameId: number
  slotId: number
  gm: number
  moveToGameId: number
  priorityLabel: string
  prioritySortValue: number
  counts: MemberAssignmentCounts
}

export type MemberChoiceSummaryRow = {
  memberId: number
  memberName: string
  assignments: number
  requiresAttention: boolean
}

export type MoveOption = {
  gameId: number
  name: string
  priorityLabel: string
  overrunLabel: string
  shortfallLabel: string
  spacesLabel: string
  spaces: number
}

export type MemberChoiceRow = {
  rowId: string
  memberId: number
  slotId: number
  slotLabel: string
  rank: number
  rankLabel: string
  gameId: number | null
  returningPlayer: boolean
}

export type MemberChoiceEditorState = {
  choiceRows: Array<MemberChoiceRow>
  gmGameIdBySlotId: Map<number, number>
  previousRowIdByRowId: Map<string, string>
}

export type ChoicesByMemberSlot = Map<number, Map<number, Array<DashboardChoice>>>
export type InterestChoicesByGameId = Map<number, Array<DashboardChoice>>

export type GameInterestRow = {
  rowId: string
  memberName: string
  priorityLabel: string
  prioritySortValue: number
  rank: number | null
}

export type SlotAssignmentScope = {
  filteredSlotGames: Array<DashboardGame>
  slotGameIdSet: Set<number>
  scheduledAssignments: Array<DashboardAssignment>
}
