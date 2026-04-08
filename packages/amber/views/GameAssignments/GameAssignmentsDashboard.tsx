import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { GameAssignmentDashboardData, UpsertGameChoiceBySlotInput } from '@amber/client'
import { Box, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createPortal } from 'react-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'

import type { DashboardAssignmentUpdatePayload } from './dashboardData'
import { GameAssignmentsByGamePanel } from './GameAssignmentsByGamePanel'
import { GameAssignmentsByMemberPanel } from './GameAssignmentsByMemberPanel'
import { GameChoicesPanel } from './GameChoicesPanel'
import { GameInterestPanel } from './GameInterestPanel'
import type { GameAssignmentsLayoutPlan } from './layoutPlan'
import { buildGameAssignmentsLayoutPlan } from './layoutPlan'
import { gameAssignmentsPaneIds } from './pageState'
import type { GameAssignmentsLayoutMode, GameAssignmentsPaneId, GameAssignmentsPaneSlotFilters } from './pageState'

type ResizeHandleProps = {
  direction: 'horizontal' | 'vertical'
}

const ResizeHandle = ({ direction }: ResizeHandleProps) => (
  <Separator
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
      width: direction === 'vertical' ? '10px' : '100%',
      height: direction === 'horizontal' ? '10px' : '100%',
    }}
    aria-label={direction === 'vertical' ? 'Resize panels horizontally' : 'Resize panels vertically'}
  >
    <Box
      sx={{
        width: direction === 'vertical' ? 2 : '100%',
        height: direction === 'horizontal' ? 2 : '100%',
        borderRadius: 999,
        backgroundColor: 'divider',
      }}
    />
  </Separator>
)

export type GameAssignmentsDashboardProps = {
  data: GameAssignmentDashboardData
  year: number
  slotFilterOptions: Array<number>
  paneSlotFilters: GameAssignmentsPaneSlotFilters
  onPaneSlotFilterChange: (paneId: GameAssignmentsPaneId, slotFilterId: number | null) => void
  onUpdateAssignments: (payload: DashboardAssignmentUpdatePayload) => Promise<void>
  onUpsertChoice: (input: UpsertGameChoiceBySlotInput) => Promise<void>
  scrollBehavior: 'none' | 'bounded'
  layoutMode: GameAssignmentsLayoutMode
  expandedPaneId: GameAssignmentsPaneId | null
  onToggleExpand: (paneId: GameAssignmentsPaneId) => void
}

export const GameAssignmentsDashboard = ({
  data,
  year,
  slotFilterOptions,
  paneSlotFilters,
  onPaneSlotFilterChange,
  onUpdateAssignments,
  onUpsertChoice,
  scrollBehavior,
  layoutMode,
  expandedPaneId,
  onToggleExpand,
}: GameAssignmentsDashboardProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [portalReady, setPortalReady] = useState(false)
  const hiddenHostRef = useRef<HTMLDivElement | null>(null)
  const paneHostsRef = useRef<Record<GameAssignmentsPaneId, HTMLDivElement> | null>(null)
  const layoutPlan = useMemo<GameAssignmentsLayoutPlan>(
    () =>
      buildGameAssignmentsLayoutPlan({
        expandedPaneId,
        isSmallScreen,
        layoutMode,
      }),
    [expandedPaneId, isSmallScreen, layoutMode],
  )

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (paneHostsRef.current || !hiddenHostRef.current) return

    const hosts = Object.fromEntries(
      gameAssignmentsPaneIds.map((paneId) => {
        const host = document.createElement('div')
        host.style.display = 'flex'
        host.style.flexDirection = 'column'
        host.style.flex = '1 1 auto'
        host.style.minHeight = '0'

        return [paneId, host]
      }),
    ) as Record<GameAssignmentsPaneId, HTMLDivElement>

    paneHostsRef.current = hosts
    Object.values(hosts).forEach((host) => hiddenHostRef.current?.appendChild(host))
    setPortalReady(true)
  }, [])

  const buildExpandProps = (paneId: GameAssignmentsPaneId) => ({
    isExpanded: expandedPaneId === paneId,
    onToggleExpand: () => onToggleExpand(paneId),
  })

  const renderPaneContent = (paneId: GameAssignmentsPaneId) => {
    switch (paneId) {
      case 'byGame':
        return (
          <GameAssignmentsByGamePanel
            data={data}
            year={year}
            slotFilterOptions={slotFilterOptions}
            slotFilterId={paneSlotFilters.byGame}
            onSlotFilterChange={(nextSlotFilterId) => onPaneSlotFilterChange('byGame', nextSlotFilterId)}
            onUpdateAssignments={onUpdateAssignments}
            scrollBehavior={scrollBehavior}
            {...buildExpandProps(paneId)}
          />
        )
      case 'byMember':
        return (
          <GameAssignmentsByMemberPanel
            data={data}
            year={year}
            slotFilterOptions={slotFilterOptions}
            slotFilterId={paneSlotFilters.byMember}
            onSlotFilterChange={(nextSlotFilterId) => onPaneSlotFilterChange('byMember', nextSlotFilterId)}
            onUpdateAssignments={onUpdateAssignments}
            scrollBehavior={scrollBehavior}
            {...buildExpandProps(paneId)}
          />
        )
      case 'choices':
        return (
          <GameChoicesPanel
            data={data}
            year={year}
            slotFilterOptions={slotFilterOptions}
            slotFilterId={paneSlotFilters.choices}
            onSlotFilterChange={(nextSlotFilterId) => onPaneSlotFilterChange('choices', nextSlotFilterId)}
            onUpsertChoice={onUpsertChoice}
            scrollBehavior={scrollBehavior}
            {...buildExpandProps(paneId)}
          />
        )
      case 'interest':
        return (
          <GameInterestPanel
            data={data}
            slotFilterOptions={slotFilterOptions}
            slotFilterId={paneSlotFilters.interest}
            onSlotFilterChange={(nextSlotFilterId) => onPaneSlotFilterChange('interest', nextSlotFilterId)}
            scrollBehavior={scrollBehavior}
            {...buildExpandProps(paneId)}
          />
        )
      default:
        return null
    }
  }

  const attachHost = useCallback(
    (paneId: GameAssignmentsPaneId) => (node: HTMLDivElement | null) => {
      const host = paneHostsRef.current?.[paneId]
      const fallbackHost = hiddenHostRef.current
      if (!host || !fallbackHost) return
      const nextParent = node ?? fallbackHost
      if (host.parentElement !== nextParent) {
        nextParent.appendChild(host)
      }
    },
    [],
  )

  const renderPaneSlot = (paneId: GameAssignmentsPaneId) => (
    <Box
      ref={attachHost(paneId)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    />
  )

  const renderPane = (paneId: GameAssignmentsPaneId) =>
    portalReady ? renderPaneSlot(paneId) : renderPaneContent(paneId)

  const renderLayoutPlan = (plan: GameAssignmentsLayoutPlan): React.ReactNode => {
    switch (plan.type) {
      case 'pane':
        return (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: isSmallScreen ? undefined : 'hidden',
            }}
          >
            {renderPane(plan.paneId)}
          </Box>
        )
      case 'stack':
        return (
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            {plan.paneIds.map((paneId) => (
              <Box key={paneId} sx={{ minHeight: 0 }}>
                {renderPane(paneId)}
              </Box>
            ))}
          </Stack>
        )
      case 'group':
        return (
          <Group orientation={plan.orientation} style={{ flex: 1, minHeight: 0 }}>
            {plan.panels.map((panel, panelIndex) => (
              <Fragment key={panelIndex}>
                {panelIndex > 0 ? (
                  <ResizeHandle direction={plan.orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
                ) : null}
                <Panel
                  defaultSize={panel.defaultSize}
                  minSize={panel.minSize}
                  style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {renderLayoutPlan(panel.plan)}
                </Panel>
              </Fragment>
            ))}
          </Group>
        )
      default:
        return null
    }
  }

  const portalContent = portalReady ? (
    <>
      {gameAssignmentsPaneIds.map((paneId) => {
        const host = paneHostsRef.current?.[paneId]
        return host ? <Fragment key={paneId}>{createPortal(renderPaneContent(paneId), host)}</Fragment> : null
      })}
    </>
  ) : null

  return (
    <>
      <Box ref={hiddenHostRef} sx={{ display: 'none' }} />
      {portalContent}
      {renderLayoutPlan(layoutPlan)}
    </>
  )
}
