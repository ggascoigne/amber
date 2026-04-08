import { gameAssignmentsPaneIds } from './pageState'
import type { GameAssignmentsLayoutMode, GameAssignmentsPaneId } from './pageState'

export type GameAssignmentsLayoutPlan =
  | {
      type: 'pane'
      paneId: GameAssignmentsPaneId
    }
  | {
      type: 'stack'
      paneIds: Array<GameAssignmentsPaneId>
    }
  | {
      type: 'group'
      orientation: 'horizontal' | 'vertical'
      panels: Array<GameAssignmentsLayoutPanel>
    }

export type GameAssignmentsLayoutPanel = {
  defaultSize: number
  minSize: number
  plan: GameAssignmentsLayoutPlan
}

type BuildGameAssignmentsLayoutPlanArgs = {
  expandedPaneId: GameAssignmentsPaneId | null
  isSmallScreen: boolean
  layoutMode: GameAssignmentsLayoutMode
}

const buildPanePanel = ({
  defaultSize,
  minSize,
  paneId,
}: {
  defaultSize: number
  minSize: number
  paneId: GameAssignmentsPaneId
}): GameAssignmentsLayoutPanel => ({
  defaultSize,
  minSize,
  plan: {
    type: 'pane',
    paneId,
  },
})

export const buildGameAssignmentsLayoutPlan = ({
  expandedPaneId,
  isSmallScreen,
  layoutMode,
}: BuildGameAssignmentsLayoutPlanArgs): GameAssignmentsLayoutPlan => {
  if (isSmallScreen) {
    return expandedPaneId
      ? {
          type: 'pane',
          paneId: expandedPaneId,
        }
      : {
          type: 'stack',
          paneIds: Array.from(gameAssignmentsPaneIds),
        }
  }

  if (expandedPaneId) {
    return {
      type: 'pane',
      paneId: expandedPaneId,
    }
  }

  if (layoutMode === 'columns') {
    return {
      type: 'group',
      orientation: 'horizontal',
      panels: gameAssignmentsPaneIds.map((paneId) =>
        buildPanePanel({
          defaultSize: 25,
          minSize: 15,
          paneId,
        }),
      ),
    }
  }

  return {
    type: 'group',
    orientation: 'horizontal',
    panels: [
      {
        defaultSize: 50,
        minSize: 30,
        plan: {
          type: 'group',
          orientation: 'vertical',
          panels: [
            buildPanePanel({
              defaultSize: 50,
              minSize: 20,
              paneId: 'byGame',
            }),
            buildPanePanel({
              defaultSize: 50,
              minSize: 20,
              paneId: 'byMember',
            }),
          ],
        },
      },
      {
        defaultSize: 50,
        minSize: 30,
        plan: {
          type: 'group',
          orientation: 'vertical',
          panels: [
            buildPanePanel({
              defaultSize: 50,
              minSize: 20,
              paneId: 'choices',
            }),
            buildPanePanel({
              defaultSize: 50,
              minSize: 20,
              paneId: 'interest',
            }),
          ],
        },
      },
    ],
  }
}
