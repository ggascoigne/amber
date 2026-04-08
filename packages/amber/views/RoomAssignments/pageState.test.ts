import { describe, expect, test } from 'vitest'

import {
  buildSlotFilterOptions,
  getActiveExpandedPaneId,
  getActivePaneIds,
  sanitizeRequiredSlotFilterId,
  sanitizeRoomAssignmentsAssignmentLayoutMode,
  sanitizeRoomAssignmentsPaneId,
  sanitizeRoomAssignmentsSetupLayoutMode,
  sanitizeRoomAssignmentsTabId,
} from './pageState'

describe('room assignments page state helpers', () => {
  test('buildSlotFilterOptions creates 1-indexed slot ids', () => {
    expect(buildSlotFilterOptions(4)).toEqual([1, 2, 3, 4])
  })

  test('sanitizers fall back to default tab and layout modes', () => {
    expect(sanitizeRoomAssignmentsTabId('setup')).toBe('setup')
    expect(sanitizeRoomAssignmentsTabId('other')).toBe('assignment')
    expect(sanitizeRoomAssignmentsSetupLayoutMode('columns')).toBe('columns')
    expect(sanitizeRoomAssignmentsSetupLayoutMode(null)).toBe('rows')
    expect(sanitizeRoomAssignmentsAssignmentLayoutMode('columns')).toBe('columns')
    expect(sanitizeRoomAssignmentsAssignmentLayoutMode(42)).toBe('grid')
  })

  test('pane sanitizing and active pane filtering ignore invalid or inactive panes', () => {
    expect(sanitizeRoomAssignmentsPaneId('roomAvailability')).toBe('roomAvailability')
    expect(sanitizeRoomAssignmentsPaneId('other')).toBeNull()
    expect(getActivePaneIds('setup')).toEqual(['slotAvailability', 'memberRoomAssignments', 'roomMemberAssignments'])
    expect(getActiveExpandedPaneId({ activeTab: 'setup', expandedPaneId: 'roomAvailability' })).toBeNull()
    expect(getActiveExpandedPaneId({ activeTab: 'assignment', expandedPaneId: 'roomAvailability' })).toBe(
      'roomAvailability',
    )
  })

  test('required slot filter falls back to the first available slot for invalid values', () => {
    expect(sanitizeRequiredSlotFilterId(3, [1, 2, 3])).toBe(3)
    expect(sanitizeRequiredSlotFilterId(7, [1, 2, 3])).toBe(1)
    expect(sanitizeRequiredSlotFilterId('2', [1, 2, 3])).toBe(1)
    expect(sanitizeRequiredSlotFilterId(null, [])).toBe(1)
  })
})
