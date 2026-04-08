import type {
  RoomAssignmentsAssignmentLayoutMode,
  RoomAssignmentsPaneId,
  RoomAssignmentsSetupLayoutMode,
  RoomAssignmentsTabId,
} from './pageState'
import { getActivePaneIds } from './pageState'

export type RoomAssignmentsLayoutPlan =
  | {
      type: 'pane'
      paneId: RoomAssignmentsPaneId
    }
  | {
      type: 'stack'
      paneIds: Array<RoomAssignmentsPaneId>
    }
  | {
      type: 'group'
      orientation: 'horizontal' | 'vertical'
      panels: Array<RoomAssignmentsLayoutPanel>
    }

export type RoomAssignmentsLayoutPanel = {
  defaultSize: number
  minSize: number
  plan: RoomAssignmentsLayoutPlan
}

type BuildRoomAssignmentsLayoutPlanArgs = {
  activeExpandedPaneId: RoomAssignmentsPaneId | null
  activeTab: RoomAssignmentsTabId
  assignmentLayoutMode: RoomAssignmentsAssignmentLayoutMode
  isSmallScreen: boolean
  setupLayoutMode: RoomAssignmentsSetupLayoutMode
}

const buildPanePanel = ({
  defaultSize,
  minSize,
  paneId,
}: {
  defaultSize: number
  minSize: number
  paneId: RoomAssignmentsPaneId
}): RoomAssignmentsLayoutPanel => ({
  defaultSize,
  minSize,
  plan: {
    type: 'pane',
    paneId,
  },
})

export const buildRoomAssignmentsLayoutPlan = ({
  activeExpandedPaneId,
  activeTab,
  assignmentLayoutMode,
  isSmallScreen,
  setupLayoutMode,
}: BuildRoomAssignmentsLayoutPlanArgs): RoomAssignmentsLayoutPlan => {
  const activePaneIds = getActivePaneIds(activeTab)

  if (isSmallScreen) {
    return activeExpandedPaneId
      ? {
          type: 'pane',
          paneId: activeExpandedPaneId,
        }
      : {
          type: 'stack',
          paneIds: activePaneIds,
        }
  }

  if (activeExpandedPaneId) {
    return {
      type: 'pane',
      paneId: activeExpandedPaneId,
    }
  }

  if (activeTab === 'setup') {
    return {
      type: 'group',
      orientation: setupLayoutMode === 'columns' ? 'horizontal' : 'vertical',
      panels: [
        buildPanePanel({
          defaultSize: 34,
          minSize: 20,
          paneId: 'slotAvailability',
        }),
        buildPanePanel({
          defaultSize: 33,
          minSize: 20,
          paneId: 'memberRoomAssignments',
        }),
        buildPanePanel({
          defaultSize: 33,
          minSize: 20,
          paneId: 'roomMemberAssignments',
        }),
      ],
    }
  }

  if (assignmentLayoutMode === 'columns') {
    return {
      type: 'group',
      orientation: 'horizontal',
      panels: [
        buildPanePanel({
          defaultSize: 40,
          minSize: 24,
          paneId: 'manualGameRoomAssignment',
        }),
        buildPanePanel({
          defaultSize: 20,
          minSize: 14,
          paneId: 'roomAvailability',
        }),
        buildPanePanel({
          defaultSize: 20,
          minSize: 14,
          paneId: 'conflictSummary',
        }),
        buildPanePanel({
          defaultSize: 20,
          minSize: 14,
          paneId: 'roomUsageSummary',
        }),
      ],
    }
  }

  return {
    type: 'group',
    orientation: 'horizontal',
    panels: [
      buildPanePanel({
        defaultSize: 60,
        minSize: 30,
        paneId: 'manualGameRoomAssignment',
      }),
      {
        defaultSize: 40,
        minSize: 30,
        plan: {
          type: 'group',
          orientation: 'vertical',
          panels: [
            buildPanePanel({
              defaultSize: 50,
              minSize: 20,
              paneId: 'roomAvailability',
            }),
            {
              defaultSize: 50,
              minSize: 20,
              plan: {
                type: 'group',
                orientation: 'vertical',
                panels: [
                  buildPanePanel({
                    defaultSize: 50,
                    minSize: 20,
                    paneId: 'conflictSummary',
                  }),
                  buildPanePanel({
                    defaultSize: 50,
                    minSize: 20,
                    paneId: 'roomUsageSummary',
                  }),
                ],
              },
            },
          ],
        },
      },
    ],
  }
}
