export type RoomAssignmentsTabId = 'setup' | 'assignment'
export type RoomAssignmentsSetupLayoutMode = 'rows' | 'columns'
export type RoomAssignmentsAssignmentLayoutMode = 'grid' | 'columns'
export type RoomAssignmentsPaneId =
  | 'slotAvailability'
  | 'memberRoomAssignments'
  | 'roomMemberAssignments'
  | 'manualGameRoomAssignment'
  | 'roomAvailability'
  | 'conflictSummary'
  | 'roomUsageSummary'

const setupPaneIds: Array<RoomAssignmentsPaneId> = [
  'slotAvailability',
  'memberRoomAssignments',
  'roomMemberAssignments',
]
const assignmentPaneIds: Array<RoomAssignmentsPaneId> = [
  'manualGameRoomAssignment',
  'roomAvailability',
  'conflictSummary',
  'roomUsageSummary',
]

export const buildSlotFilterOptions = (numberOfSlots: number) =>
  Array.from({ length: numberOfSlots }, (_unusedValue: undefined, slotIndex: number) => slotIndex + 1)

export const sanitizeRoomAssignmentsTabId = (value: unknown): RoomAssignmentsTabId =>
  value === 'setup' || value === 'assignment' ? value : 'assignment'

export const sanitizeRoomAssignmentsSetupLayoutMode = (value: unknown): RoomAssignmentsSetupLayoutMode =>
  value === 'rows' || value === 'columns' ? value : 'rows'

export const sanitizeRoomAssignmentsAssignmentLayoutMode = (value: unknown): RoomAssignmentsAssignmentLayoutMode =>
  value === 'grid' || value === 'columns' ? value : 'grid'

export const sanitizeRoomAssignmentsPaneId = (value: unknown): RoomAssignmentsPaneId | null =>
  value === 'slotAvailability' ||
  value === 'memberRoomAssignments' ||
  value === 'roomMemberAssignments' ||
  value === 'manualGameRoomAssignment' ||
  value === 'roomAvailability' ||
  value === 'conflictSummary' ||
  value === 'roomUsageSummary'
    ? value
    : null

export const sanitizeRequiredSlotFilterId = (value: unknown, slotFilterOptions: Array<number>): number => {
  const fallbackSlotId = slotFilterOptions[0] ?? 1

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return fallbackSlotId
  }

  return slotFilterOptions.includes(value) ? value : fallbackSlotId
}

export const getActivePaneIds = (activeTab: RoomAssignmentsTabId): Array<RoomAssignmentsPaneId> =>
  activeTab === 'setup' ? setupPaneIds : assignmentPaneIds

export const getActiveExpandedPaneId = ({
  activeTab,
  expandedPaneId,
}: {
  activeTab: RoomAssignmentsTabId
  expandedPaneId: RoomAssignmentsPaneId | null
}): RoomAssignmentsPaneId | null => {
  const activePaneIds = getActivePaneIds(activeTab)

  return expandedPaneId && activePaneIds.includes(expandedPaneId) ? expandedPaneId : null
}
