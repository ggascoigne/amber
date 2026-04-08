import { describe, expect, test } from 'vitest'

import { buildRoomAssignmentsLayoutPlan } from './layoutPlan'

describe('room assignments layout plan helpers', () => {
  test('small screens stack the active setup panes when nothing is expanded', () => {
    expect(
      buildRoomAssignmentsLayoutPlan({
        activeExpandedPaneId: null,
        activeTab: 'setup',
        assignmentLayoutMode: 'grid',
        isSmallScreen: true,
        setupLayoutMode: 'rows',
      }),
    ).toEqual({
      type: 'stack',
      paneIds: ['slotAvailability', 'memberRoomAssignments', 'roomMemberAssignments'],
    })
  })

  test('expanded panes override the desktop layout tree', () => {
    expect(
      buildRoomAssignmentsLayoutPlan({
        activeExpandedPaneId: 'roomAvailability',
        activeTab: 'assignment',
        assignmentLayoutMode: 'columns',
        isSmallScreen: false,
        setupLayoutMode: 'rows',
      }),
    ).toEqual({
      type: 'pane',
      paneId: 'roomAvailability',
    })
  })

  test('setup layout mode controls the top-level group orientation', () => {
    expect(
      buildRoomAssignmentsLayoutPlan({
        activeExpandedPaneId: null,
        activeTab: 'setup',
        assignmentLayoutMode: 'grid',
        isSmallScreen: false,
        setupLayoutMode: 'columns',
      }),
    ).toEqual({
      type: 'group',
      orientation: 'horizontal',
      panels: [
        {
          defaultSize: 34,
          minSize: 20,
          plan: { type: 'pane', paneId: 'slotAvailability' },
        },
        {
          defaultSize: 33,
          minSize: 20,
          plan: { type: 'pane', paneId: 'memberRoomAssignments' },
        },
        {
          defaultSize: 33,
          minSize: 20,
          plan: { type: 'pane', paneId: 'roomMemberAssignments' },
        },
      ],
    })
  })

  test('assignment grid mode preserves the nested summary-column layout', () => {
    expect(
      buildRoomAssignmentsLayoutPlan({
        activeExpandedPaneId: null,
        activeTab: 'assignment',
        assignmentLayoutMode: 'grid',
        isSmallScreen: false,
        setupLayoutMode: 'rows',
      }),
    ).toEqual({
      type: 'group',
      orientation: 'horizontal',
      panels: [
        {
          defaultSize: 60,
          minSize: 30,
          plan: { type: 'pane', paneId: 'manualGameRoomAssignment' },
        },
        {
          defaultSize: 40,
          minSize: 30,
          plan: {
            type: 'group',
            orientation: 'vertical',
            panels: [
              {
                defaultSize: 50,
                minSize: 20,
                plan: { type: 'pane', paneId: 'roomAvailability' },
              },
              {
                defaultSize: 50,
                minSize: 20,
                plan: {
                  type: 'group',
                  orientation: 'vertical',
                  panels: [
                    {
                      defaultSize: 50,
                      minSize: 20,
                      plan: { type: 'pane', paneId: 'conflictSummary' },
                    },
                    {
                      defaultSize: 50,
                      minSize: 20,
                      plan: { type: 'pane', paneId: 'roomUsageSummary' },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    })
  })
})
