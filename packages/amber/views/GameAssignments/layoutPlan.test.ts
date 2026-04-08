import { describe, expect, test } from 'vitest'

import { buildGameAssignmentsLayoutPlan } from './layoutPlan'

describe('game assignments layout plan helpers', () => {
  test('small screens stack all panes when nothing is expanded', () => {
    expect(
      buildGameAssignmentsLayoutPlan({
        expandedPaneId: null,
        isSmallScreen: true,
        layoutMode: 'grid',
      }),
    ).toEqual({
      type: 'stack',
      paneIds: ['byGame', 'byMember', 'choices', 'interest'],
    })
  })

  test('expanded panes override the desktop layout tree', () => {
    expect(
      buildGameAssignmentsLayoutPlan({
        expandedPaneId: 'choices',
        isSmallScreen: false,
        layoutMode: 'columns',
      }),
    ).toEqual({
      type: 'pane',
      paneId: 'choices',
    })
  })

  test('columns mode keeps four equal-width desktop panels', () => {
    expect(
      buildGameAssignmentsLayoutPlan({
        expandedPaneId: null,
        isSmallScreen: false,
        layoutMode: 'columns',
      }),
    ).toEqual({
      type: 'group',
      orientation: 'horizontal',
      panels: [
        {
          defaultSize: 25,
          minSize: 15,
          plan: { type: 'pane', paneId: 'byGame' },
        },
        {
          defaultSize: 25,
          minSize: 15,
          plan: { type: 'pane', paneId: 'byMember' },
        },
        {
          defaultSize: 25,
          minSize: 15,
          plan: { type: 'pane', paneId: 'choices' },
        },
        {
          defaultSize: 25,
          minSize: 15,
          plan: { type: 'pane', paneId: 'interest' },
        },
      ],
    })
  })

  test('grid mode preserves the two-column nested desktop layout', () => {
    expect(
      buildGameAssignmentsLayoutPlan({
        expandedPaneId: null,
        isSmallScreen: false,
        layoutMode: 'grid',
      }),
    ).toEqual({
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
              {
                defaultSize: 50,
                minSize: 20,
                plan: { type: 'pane', paneId: 'byGame' },
              },
              {
                defaultSize: 50,
                minSize: 20,
                plan: { type: 'pane', paneId: 'byMember' },
              },
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
              {
                defaultSize: 50,
                minSize: 20,
                plan: { type: 'pane', paneId: 'choices' },
              },
              {
                defaultSize: 50,
                minSize: 20,
                plan: { type: 'pane', paneId: 'interest' },
              },
            ],
          },
        },
      ],
    })
  })
})
