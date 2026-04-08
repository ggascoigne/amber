import type { MouseEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData, UpsertGameChoiceBySlotInput } from '@amber/client'
import { useInvalidateGameAssignmentDashboardQueries, useTRPC } from '@amber/client'
import { Loader, useLocalStorage } from '@amber/ui'
import { Box, GlobalStyles } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery } from '@tanstack/react-query'

import { AssignmentSummaryDialog } from './AssignmentSummaryDialog'
import { applyAssignmentUpdatesToDashboardData, applyUpsertedChoiceToDashboardData } from './dashboardData'
import type { DashboardAssignmentUpdatePayload } from './dashboardData'
import { GameAssignmentsDashboard } from './GameAssignmentsDashboard'
import { GameAssignmentsTitleBar } from './GameAssignmentsTitleBar'
import type { GameAssignmentsLayoutMode, GameAssignmentsPaneId, GameAssignmentsPaneSlotFilters } from './pageState'
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

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useConfiguration, useYearFilter } from '../../utils'
import { useSendEmail } from '../../utils/useSendEmail'

const GAME_ASSIGNMENTS_LAYOUT_STORAGE_KEY = 'amber.gameAssignments.layoutMode'
const GAME_ASSIGNMENTS_SLOT_FILTERS_STORAGE_KEY = 'amber.gameAssignments.paneSlotFilters'
const GAME_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY = 'amber.gameAssignments.expandedPaneId'

const GameAssignmentsPage = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)
  const invalidateDashboardQueries = useInvalidateGameAssignmentDashboardQueries()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const slotFilterOptions = useMemo<Array<number>>(
    () => buildGameAssignmentsSlotFilterOptions(configuration.numberOfSlots),
    [configuration.numberOfSlots],
  )
  const [storedPaneSlotFilters, setStoredPaneSlotFilters] = useLocalStorage<unknown>(
    GAME_ASSIGNMENTS_SLOT_FILTERS_STORAGE_KEY,
    buildDefaultPaneSlotFilters(),
  )
  const paneSlotFilters = useMemo<GameAssignmentsPaneSlotFilters>(
    () => sanitizeGameAssignmentsPaneSlotFilters(storedPaneSlotFilters, slotFilterOptions),
    [slotFilterOptions, storedPaneSlotFilters],
  )
  const topSlotFilterId = useMemo(() => getTopSlotFilterId(paneSlotFilters), [paneSlotFilters])
  const [storedLayoutMode, setStoredLayoutMode] = useLocalStorage<unknown>(GAME_ASSIGNMENTS_LAYOUT_STORAGE_KEY, 'grid')
  const layoutMode = useMemo<GameAssignmentsLayoutMode>(
    () => sanitizeGameAssignmentsLayoutMode(storedLayoutMode),
    [storedLayoutMode],
  )
  const [storedExpandedPaneId, setStoredExpandedPaneId] = useLocalStorage<unknown>(
    GAME_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY,
    null,
  )
  const expandedPaneId = useMemo<GameAssignmentsPaneId | null>(
    () => sanitizeGameAssignmentsPaneId(storedExpandedPaneId),
    [storedExpandedPaneId],
  )
  const tableFontSize = '0.78125rem'
  const tableFontVar = 'var(--amber-table-font-size, 0.875rem)'

  const { data, isLoading, error } = useQuery(
    trpc.gameAssignments.getAssignmentDashboardData.queryOptions(
      { year },
      {
        refetchOnMount: 'always',
      },
    ),
  )
  const {
    data: assignmentSummaryData,
    isFetching: isSummaryLoading,
    error: assignmentSummaryError,
    refetch: refetchAssignmentSummary,
  } = useQuery(
    trpc.gameAssignments.getAssignmentSummary.queryOptions(
      { year },
      {
        enabled: false,
        staleTime: 0,
      },
    ),
  )
  const sendEmail = useSendEmail()
  const updateAssignmentsMutation = useMutation(trpc.gameAssignments.updateGameAssignments.mutationOptions())
  const resetAssignmentsMutation = useMutation(trpc.gameAssignments.resetAssignments.mutationOptions())
  const setInitialAssignmentsMutation = useMutation(trpc.gameAssignments.setInitialAssignments.mutationOptions())
  const upsertChoiceMutation = useMutation(trpc.gameChoices.upsertGameChoiceBySlot.mutationOptions())

  const [dashboardData, setDashboardData] = useState<GameAssignmentDashboardData | null>(null)

  useEffect(() => {
    if (data) {
      setDashboardData(data)
    }
  }, [data])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    document.body.setAttribute('data-game-assignments-font', 'true')
    return () => {
      document.body.removeAttribute('data-game-assignments-font')
    }
  }, [])

  useEffect(() => {
    if (storedLayoutMode !== layoutMode) {
      setStoredLayoutMode(layoutMode)
    }
  }, [layoutMode, setStoredLayoutMode, storedLayoutMode])

  useEffect(() => {
    if (doPaneSlotFiltersMatchStoredValue(storedPaneSlotFilters, paneSlotFilters)) return
    setStoredPaneSlotFilters(paneSlotFilters)
  }, [paneSlotFilters, setStoredPaneSlotFilters, storedPaneSlotFilters])

  useEffect(() => {
    if (storedExpandedPaneId !== expandedPaneId) {
      setStoredExpandedPaneId(expandedPaneId)
    }
  }, [expandedPaneId, setStoredExpandedPaneId, storedExpandedPaneId])

  useEffect(() => {
    if (!isSummaryDialogOpen) return
    refetchAssignmentSummary()
  }, [isSummaryDialogOpen, refetchAssignmentSummary, year])

  const handleUpdateAssignments = useCallback(
    async (payload: DashboardAssignmentUpdatePayload) => {
      if (payload.adds.length === 0 && payload.removes.length === 0) return

      try {
        await updateAssignmentsMutation.mutateAsync({
          year,
          adds: payload.adds,
          removes: payload.removes,
        })
      } catch (err) {
        await invalidateDashboardQueries()
        throw err
      }

      // Fire-and-forget: notify affected players and GMs via email
      sendEmail({
        type: 'gameAssignmentChange',
        body: {
          year,
          adds: payload.adds.map(({ memberId, gameId }) => ({ memberId, gameId })),
          removes: payload.removes.map(({ memberId, gameId }) => ({ memberId, gameId })),
        },
      })

      setDashboardData((previous) => applyAssignmentUpdatesToDashboardData({ previous, payload }))
    },
    [invalidateDashboardQueries, sendEmail, updateAssignmentsMutation, year],
  )

  const handleUpsertChoice = useCallback(
    async (input: UpsertGameChoiceBySlotInput) => {
      let result
      try {
        result = await upsertChoiceMutation.mutateAsync(input)
      } catch (err) {
        await invalidateDashboardQueries()
        throw err
      }

      setDashboardData((previous) => applyUpsertedChoiceToDashboardData({ previous, gameChoice: result.gameChoice }))
    },
    [invalidateDashboardQueries, upsertChoiceMutation],
  )

  const handleResetAssignments = useCallback(async () => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line no-alert
    const shouldReset = window.confirm('Reset all scheduled assignments for this year?')
    if (!shouldReset) return

    try {
      await resetAssignmentsMutation.mutateAsync({ year })
    } catch (err) {
      await invalidateDashboardQueries()
      throw err
    }

    await invalidateDashboardQueries()
  }, [invalidateDashboardQueries, resetAssignmentsMutation, year])

  const handleSetInitialAssignments = useCallback(async () => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line no-alert
    const shouldSetInitial = window.confirm('Set initial assignments for this year?')
    if (!shouldSetInitial) return

    try {
      await setInitialAssignmentsMutation.mutateAsync({ year })
    } catch (err) {
      await invalidateDashboardQueries()
      throw err
    }

    await invalidateDashboardQueries()
  }, [invalidateDashboardQueries, setInitialAssignmentsMutation, year])

  const scrollBehavior = isSmallScreen ? 'none' : 'bounded'
  const handleLayoutChange = useCallback(
    (_event: MouseEvent<HTMLElement>, nextLayout: GameAssignmentsLayoutMode | null) => {
      if (nextLayout) {
        setStoredLayoutMode(nextLayout)
      }
    },
    [setStoredLayoutMode],
  )

  const handleToggleExpand = useCallback(
    (paneId: GameAssignmentsPaneId) => {
      setStoredExpandedPaneId(expandedPaneId === paneId ? null : paneId)
    },
    [expandedPaneId, setStoredExpandedPaneId],
  )
  const handlePaneSlotFilterChange = useCallback(
    (paneId: GameAssignmentsPaneId, slotFilterId: number | null) => {
      setStoredPaneSlotFilters(buildUpdatedPaneSlotFilters({ paneSlotFilters, paneId, slotFilterId }))
    },
    [paneSlotFilters, setStoredPaneSlotFilters],
  )
  const handleTopSlotFilterChange = useCallback(
    (slotFilterId: number | null) => {
      setStoredPaneSlotFilters(buildUniformPaneSlotFilters(slotFilterId))
    },
    [setStoredPaneSlotFilters],
  )
  const handleShowSummary = useCallback(() => {
    setIsSummaryDialogOpen(true)
  }, [])
  const handleCloseSummary = useCallback(() => {
    setIsSummaryDialogOpen(false)
  }, [])
  const summaryErrorMessage = assignmentSummaryError ? assignmentSummaryError.message : null

  if (error) {
    return <TransportError error={error} />
  }

  if (!dashboardData || isLoading) {
    return (
      <Page title='Game Assignments' variant='fill'>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Loader />
        </Box>
      </Page>
    )
  }

  return (
    <Page
      title='Game Assignments'
      variant='fill'
      titleElement={
        <GameAssignmentsTitleBar
          slotFilterOptions={slotFilterOptions}
          slotFilterId={topSlotFilterId}
          onSlotFilterChange={handleTopSlotFilterChange}
          layoutMode={layoutMode}
          onLayoutChange={handleLayoutChange}
          onShowSummary={handleShowSummary}
          onResetAssignments={handleResetAssignments}
          onSetInitialAssignments={handleSetInitialAssignments}
          isBusy={
            updateAssignmentsMutation.isPending ||
            resetAssignmentsMutation.isPending ||
            setInitialAssignmentsMutation.isPending
          }
          isSummaryBusy={isSummaryLoading}
        />
      }
    >
      <GlobalStyles
        styles={{
          'body[data-game-assignments-font="true"]': { '--amber-table-font-size': tableFontSize },
          'body[data-game-assignments-font="true"] [role="listbox"]': { fontSize: tableFontSize },
          'body[data-game-assignments-font="true"] .MuiMenuItem-root': { fontSize: tableFontVar },
          'body[data-game-assignments-font="true"] .MuiMenu-list': { fontSize: tableFontVar },
        }}
      />
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          '& [role="table"]': {
            fontSize: tableFontVar,
          },
        }}
      >
        <GameAssignmentsDashboard
          data={dashboardData}
          year={year}
          slotFilterOptions={slotFilterOptions}
          paneSlotFilters={paneSlotFilters}
          onPaneSlotFilterChange={handlePaneSlotFilterChange}
          onUpdateAssignments={handleUpdateAssignments}
          onUpsertChoice={handleUpsertChoice}
          scrollBehavior={scrollBehavior}
          layoutMode={layoutMode}
          expandedPaneId={expandedPaneId}
          onToggleExpand={handleToggleExpand}
        />
      </Box>
      <AssignmentSummaryDialog
        open={isSummaryDialogOpen}
        onClose={handleCloseSummary}
        isLoading={isSummaryLoading}
        data={assignmentSummaryData}
        errorMessage={summaryErrorMessage}
      />
    </Page>
  )
}

export default GameAssignmentsPage
