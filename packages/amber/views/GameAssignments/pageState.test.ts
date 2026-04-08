import { describe, expect, test } from 'vitest'

import {
  buildDefaultPaneSlotFilters,
  buildGameAssignmentsSlotFilterOptions,
  buildUniformPaneSlotFilters,
  buildUpdatedPaneSlotFilters,
  doPaneSlotFiltersMatchStoredValue,
  getTopSlotFilterId,
  sanitizeGameAssignmentsLayoutMode,
  sanitizeGameAssignmentsPaneId,
  sanitizeGameAssignmentsPaneSlotFilters,
} from './pageState'

describe('game assignments page state helpers', () => {
  test('builds 1-indexed slot filter options and default pane filters', () => {
    expect(buildGameAssignmentsSlotFilterOptions(4)).toEqual([1, 2, 3, 4])
    expect(buildDefaultPaneSlotFilters()).toEqual({
      byGame: null,
      byMember: null,
      choices: null,
      interest: null,
    })
  })

  test('builds uniform and single-pane-updated filter maps', () => {
    expect(buildUniformPaneSlotFilters(3)).toEqual({
      byGame: 3,
      byMember: 3,
      choices: 3,
      interest: 3,
    })

    expect(
      buildUpdatedPaneSlotFilters({
        paneSlotFilters: buildUniformPaneSlotFilters(2),
        paneId: 'choices',
        slotFilterId: null,
      }),
    ).toEqual({
      byGame: 2,
      byMember: 2,
      choices: null,
      interest: 2,
    })
  })

  test('sanitizes layout mode and expanded pane id values', () => {
    expect(sanitizeGameAssignmentsLayoutMode('columns')).toBe('columns')
    expect(sanitizeGameAssignmentsLayoutMode('other')).toBe('grid')
    expect(sanitizeGameAssignmentsPaneId('choices')).toBe('choices')
    expect(sanitizeGameAssignmentsPaneId('other')).toBeNull()
  })

  test('sanitizes pane slot filters with per-pane fallbacks', () => {
    expect(
      sanitizeGameAssignmentsPaneSlotFilters(
        {
          byGame: 2,
          byMember: 8,
          choices: '3',
          interest: null,
        },
        [1, 2, 3],
      ),
    ).toEqual({
      byGame: 2,
      byMember: null,
      choices: null,
      interest: null,
    })

    expect(sanitizeGameAssignmentsPaneSlotFilters(null, [1, 2, 3])).toEqual(buildDefaultPaneSlotFilters())
  })

  test('detects whether stored pane slot filters already match sanitized values', () => {
    const expectedFilters = {
      byGame: 1,
      byMember: null,
      choices: 2,
      interest: 3,
    }

    expect(doPaneSlotFiltersMatchStoredValue(expectedFilters, expectedFilters)).toBe(true)
    expect(
      doPaneSlotFiltersMatchStoredValue(
        {
          ...expectedFilters,
          interest: '3',
        },
        expectedFilters,
      ),
    ).toBe(false)
  })

  test('reports a mixed top slot filter only when pane filters diverge', () => {
    expect(
      getTopSlotFilterId({
        byGame: 2,
        byMember: 2,
        choices: 2,
        interest: 2,
      }),
    ).toBe(2)

    expect(
      getTopSlotFilterId({
        byGame: null,
        byMember: null,
        choices: null,
        interest: null,
      }),
    ).toBeNull()

    expect(
      getTopSlotFilterId({
        byGame: 1,
        byMember: 2,
        choices: 1,
        interest: 1,
      }),
    ).toBe('mixed')
  })
})
