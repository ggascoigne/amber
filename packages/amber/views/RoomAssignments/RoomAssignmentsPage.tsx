import { useCallback, useEffect, useMemo, useState } from 'react'

import type { RecalculateRoomAssignmentsResult, RoomAssignmentDashboardData } from '@amber/client'
import { useInvalidateRoomAssignmentQueries, useTRPC } from '@amber/client'
import { Loader, useLocalStorage } from '@amber/ui'
import { Box, GlobalStyles } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery } from '@tanstack/react-query'

import { buildRoomAssignmentsDashboardViewModel } from './dashboardViewModel'
import { downloadInitialPlannerResult } from './initialPlannerExport'
import type { RoomAssignmentsLayoutPlan } from './layoutPlan'
import { buildRoomAssignmentsLayoutPlan } from './layoutPlan'
import type {
  RoomAssignmentsAssignmentLayoutMode,
  RoomAssignmentsPaneId,
  RoomAssignmentsSetupLayoutMode,
  RoomAssignmentsTabId,
} from './pageState'
import {
  buildSlotFilterOptions,
  getActiveExpandedPaneId,
  sanitizeRequiredSlotFilterId,
  sanitizeRoomAssignmentsAssignmentLayoutMode,
  sanitizeRoomAssignmentsPaneId,
  sanitizeRoomAssignmentsSetupLayoutMode,
  sanitizeRoomAssignmentsTabId,
} from './pageState'
import RoomAssignmentsDashboard from './RoomAssignmentsDashboard'
import RoomAssignmentsPageChrome from './RoomAssignmentsPageChrome'
import { buildRoomMemberAssignmentUpdates, buildFullAvailabilityUpdates } from './utils'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useConfiguration, useYearFilter } from '../../utils'

const ROOM_ASSIGNMENTS_SETUP_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.setupLayoutMode'
const ROOM_ASSIGNMENTS_ASSIGNMENT_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.assignmentLayoutMode'
const ROOM_ASSIGNMENTS_TAB_STORAGE_KEY = 'amber.roomAssignments.activeTab'
const ROOM_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY = 'amber.roomAssignments.expandedPaneId'
const ROOM_ASSIGNMENTS_ASSIGNMENT_SLOT_FILTER_STORAGE_KEY = 'amber.roomAssignments.assignmentSlotFilter'
const ROOM_ASSIGNMENTS_SHOW_MEMBER_ROOMS_STORAGE_KEY = 'amber.roomAssignments.showMemberRooms'
const ROOM_ASSIGNMENTS_CONFLICT_SHOW_ALL_SLOTS_STORAGE_KEY = 'amber.roomAssignments.conflictShowAllSlots'

const emptyRoomAssignmentsDashboardData = {
  rooms: [],
  games: [],
  roomAssignments: [],
  roomSlotAvailability: [],
  memberRoomAssignments: [],
  memberships: [],
  gameAssignments: [],
} as RoomAssignmentDashboardData

const RoomAssignmentsPage = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const invalidateRoomAssignmentQueries = useInvalidateRoomAssignmentQueries()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const slotFilterOptions = useMemo<Array<number>>(
    () => buildSlotFilterOptions(configuration.numberOfSlots),
    [configuration.numberOfSlots],
  )

  const [storedTab, setStoredTab] = useLocalStorage<unknown>(ROOM_ASSIGNMENTS_TAB_STORAGE_KEY, 'assignment')
  const activeTab = useMemo<RoomAssignmentsTabId>(() => sanitizeRoomAssignmentsTabId(storedTab), [storedTab])
  const tableFontSize = '0.78125rem'
  const tableFontVar = 'var(--amber-table-font-size, 0.875rem)'

  const [storedSetupLayoutMode, setStoredSetupLayoutMode] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_SETUP_LAYOUT_STORAGE_KEY,
    'rows',
  )
  const setupLayoutMode = useMemo<RoomAssignmentsSetupLayoutMode>(
    () => sanitizeRoomAssignmentsSetupLayoutMode(storedSetupLayoutMode),
    [storedSetupLayoutMode],
  )

  const [storedAssignmentLayoutMode, setStoredAssignmentLayoutMode] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_ASSIGNMENT_LAYOUT_STORAGE_KEY,
    'grid',
  )
  const assignmentLayoutMode = useMemo<RoomAssignmentsAssignmentLayoutMode>(
    () => sanitizeRoomAssignmentsAssignmentLayoutMode(storedAssignmentLayoutMode),
    [storedAssignmentLayoutMode],
  )

  const [storedExpandedPaneId, setStoredExpandedPaneId] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY,
    null,
  )
  const expandedPaneId = useMemo<RoomAssignmentsPaneId | null>(
    () => sanitizeRoomAssignmentsPaneId(storedExpandedPaneId),
    [storedExpandedPaneId],
  )

  const [storedAssignmentSlotFilterId, setStoredAssignmentSlotFilterId] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_ASSIGNMENT_SLOT_FILTER_STORAGE_KEY,
    slotFilterOptions[0] ?? 1,
  )
  const assignmentSlotFilterId = useMemo<number>(
    () => sanitizeRequiredSlotFilterId(storedAssignmentSlotFilterId, slotFilterOptions),
    [slotFilterOptions, storedAssignmentSlotFilterId],
  )
  const [storedShowMemberRooms, setStoredShowMemberRooms] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_SHOW_MEMBER_ROOMS_STORAGE_KEY,
    true,
  )
  const showMemberRooms = storedShowMemberRooms !== false
  const [storedConflictShowAllSlots, setStoredConflictShowAllSlots] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_CONFLICT_SHOW_ALL_SLOTS_STORAGE_KEY,
    false,
  )
  const conflictShowAllSlots = storedConflictShowAllSlots === true
  const [plannerResult, setPlannerResult] = useState<RecalculateRoomAssignmentsResult | null>(null)

  const activeExpandedPaneId = useMemo<RoomAssignmentsPaneId | null>(
    () =>
      getActiveExpandedPaneId({
        activeTab,
        expandedPaneId,
      }),
    [activeTab, expandedPaneId],
  )
  const layoutPlan = useMemo<RoomAssignmentsLayoutPlan>(
    () =>
      buildRoomAssignmentsLayoutPlan({
        activeExpandedPaneId,
        activeTab,
        assignmentLayoutMode,
        isSmallScreen,
        setupLayoutMode,
      }),
    [activeExpandedPaneId, activeTab, assignmentLayoutMode, isSmallScreen, setupLayoutMode],
  )

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    document.body.setAttribute('data-room-assignments-font', 'true')
    return () => {
      document.body.removeAttribute('data-room-assignments-font')
    }
  }, [])

  const { data, isLoading, error, isFetching } = useQuery(
    trpc.roomAssignments.getRoomAssignmentDashboardData.queryOptions(
      {
        year,
      },
      {
        refetchOnMount: 'always',
      },
    ),
  )

  const assignGameRoomMutation = useMutation(trpc.roomAssignments.assignGameRoom.mutationOptions())
  const removeGameRoomAssignmentMutation = useMutation(trpc.roomAssignments.removeGameRoomAssignment.mutationOptions())
  const upsertRoomSlotAvailabilityMutation = useMutation(
    trpc.roomAssignments.upsertRoomSlotAvailability.mutationOptions(),
  )
  const upsertMemberRoomAssignmentMutation = useMutation(
    trpc.roomAssignments.upsertMemberRoomAssignment.mutationOptions(),
  )
  const updateGameRoomMutation = useMutation(trpc.gameRooms.updateGameRoom.mutationOptions())
  const resetRoomAssignmentsMutation = useMutation(trpc.roomAssignments.resetRoomAssignments.mutationOptions())
  const recalculateRoomAssignmentsMutation = useMutation(
    trpc.roomAssignments.recalculateRoomAssignments.mutationOptions(),
  )

  const dashboardData = data ?? emptyRoomAssignmentsDashboardData
  const { memberships } = dashboardData
  const dashboardViewModel = useMemo(
    () =>
      buildRoomAssignmentsDashboardViewModel({
        data: dashboardData,
        numberOfSlots: configuration.numberOfSlots,
        assignmentSlotFilterId,
        showMemberRooms,
        conflictShowAllSlots,
        year,
      }),
    [assignmentSlotFilterId, configuration.numberOfSlots, conflictShowAllSlots, dashboardData, showMemberRooms, year],
  )
  const { slotIds, defaultAssignmentByGameId, memberRoomIdByMemberId, roomSlotAvailabilityRows } = dashboardViewModel

  const isMutationPending =
    assignGameRoomMutation.isPending ||
    removeGameRoomAssignmentMutation.isPending ||
    upsertRoomSlotAvailabilityMutation.isPending ||
    upsertMemberRoomAssignmentMutation.isPending ||
    updateGameRoomMutation.isPending ||
    resetRoomAssignmentsMutation.isPending ||
    recalculateRoomAssignmentsMutation.isPending

  const handleGameRoomChange = useCallback(
    async ({ gameId, slotId, roomId }: { gameId: number; slotId: number; roomId: number | null }) => {
      const currentAssignment = defaultAssignmentByGameId.get(gameId)

      if (roomId === null) {
        if (!currentAssignment) {
          return
        }
        await removeGameRoomAssignmentMutation.mutateAsync({ id: currentAssignment.id })
        await invalidateRoomAssignmentQueries()
        return
      }

      await assignGameRoomMutation.mutateAsync({
        gameId,
        roomId,
        slotId,
        year,
        isOverride: false,
        source: 'manual',
      })
      await invalidateRoomAssignmentQueries()
    },
    [
      assignGameRoomMutation,
      defaultAssignmentByGameId,
      invalidateRoomAssignmentQueries,
      removeGameRoomAssignmentMutation,
      year,
    ],
  )

  const handleOverrideGameRoomAdd = useCallback(
    async ({ gameId, slotId, roomId }: { gameId: number; slotId: number; roomId: number | null }) => {
      if (roomId === null) {
        return
      }

      await assignGameRoomMutation.mutateAsync({
        gameId,
        roomId,
        slotId,
        year,
        isOverride: true,
        source: 'manual',
      })
      await invalidateRoomAssignmentQueries()
    },
    [assignGameRoomMutation, invalidateRoomAssignmentQueries, year],
  )

  const handleRemoveRoomAssignment = useCallback(
    async (id: bigint) => {
      await removeGameRoomAssignmentMutation.mutateAsync({ id })
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, removeGameRoomAssignmentMutation],
  )

  const handleRoomSlotAvailabilityChange = useCallback(
    async ({ roomId, slotId, isAvailable }: { roomId: number; slotId: number; isAvailable: boolean }) => {
      await upsertRoomSlotAvailabilityMutation.mutateAsync({
        roomId,
        slotId,
        year,
        isAvailable,
      })
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, upsertRoomSlotAvailabilityMutation, year],
  )

  const handleMemberRoomChange = useCallback(
    async ({ memberId, roomId }: { memberId: number; roomId: number | null }) => {
      await upsertMemberRoomAssignmentMutation.mutateAsync({
        memberId,
        roomId,
        year,
      })
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, upsertMemberRoomAssignmentMutation, year],
  )

  const handleRoomMembersChange = useCallback(
    async ({ roomId, memberIds }: { roomId: number; memberIds: Array<number> }) => {
      const assignmentUpdates = buildRoomMemberAssignmentUpdates({
        roomId,
        memberships,
        memberRoomIdByMemberId,
        nextMemberIds: memberIds,
      })

      if (assignmentUpdates.length === 0) {
        return
      }

      await Promise.all(
        assignmentUpdates.map((assignmentUpdate) =>
          upsertMemberRoomAssignmentMutation.mutateAsync({
            memberId: assignmentUpdate.memberId,
            roomId: assignmentUpdate.roomId,
            year,
          }),
        ),
      )
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, memberRoomIdByMemberId, memberships, upsertMemberRoomAssignmentMutation, year],
  )

  const handleRoomEnabledChange = useCallback(
    async ({ roomId, enabled }: { roomId: number; enabled: boolean }) => {
      await updateGameRoomMutation.mutateAsync({
        id: roomId,
        data: {
          enabled,
        },
      })
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, updateGameRoomMutation],
  )

  const handleRecalculateRoomAssignments = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    // eslint-disable-next-line no-alert
    const shouldRunPlanner = window.confirm(
      'Recalculate room assignments for the full schedule? All non-override assignments will be replaced.',
    )
    if (!shouldRunPlanner) {
      return
    }

    try {
      const result = await recalculateRoomAssignmentsMutation.mutateAsync({ year })
      setPlannerResult(result)
    } catch (err) {
      await invalidateRoomAssignmentQueries()
      throw err
    }

    await invalidateRoomAssignmentQueries()
  }, [invalidateRoomAssignmentQueries, recalculateRoomAssignmentsMutation, year])

  const handleRecalculateSlotRoomAssignments = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    // eslint-disable-next-line no-alert
    const shouldRunPlanner = window.confirm(
      `Recalculate room assignments for Slot ${assignmentSlotFilterId}? All non-override assignments in this slot will be replaced.`,
    )
    if (!shouldRunPlanner) {
      return
    }

    try {
      const result = await recalculateRoomAssignmentsMutation.mutateAsync({
        year,
        slotId: assignmentSlotFilterId,
      })
      setPlannerResult(result)
    } catch (err) {
      await invalidateRoomAssignmentQueries()
      throw err
    }

    await invalidateRoomAssignmentQueries()
  }, [assignmentSlotFilterId, invalidateRoomAssignmentQueries, recalculateRoomAssignmentsMutation, year])

  const handleResetRoomAssignments = useCallback(async () => {
    if (typeof window === 'undefined') {
      return
    }

    // eslint-disable-next-line no-alert
    const shouldReset = window.confirm('Reset all room assignments for this year?')
    if (!shouldReset) {
      return
    }

    try {
      await resetRoomAssignmentsMutation.mutateAsync({
        year,
        mode: 'all',
      })
      setPlannerResult(null)
    } catch (err) {
      await invalidateRoomAssignmentQueries()
      throw err
    }

    await invalidateRoomAssignmentQueries()
  }, [invalidateRoomAssignmentQueries, resetRoomAssignmentsMutation, year])

  const handleSetAllRoomsFullAvailability = useCallback(
    async (roomIds: Array<number>) => {
      if (roomIds.length === 0) {
        return
      }

      const availabilityUpdates = buildFullAvailabilityUpdates({
        roomIds,
        rows: roomSlotAvailabilityRows,
        slotIds,
      })

      if (availabilityUpdates.length === 0) {
        return
      }

      await Promise.all(
        availabilityUpdates.map((availabilityUpdate) =>
          upsertRoomSlotAvailabilityMutation.mutateAsync({
            roomId: availabilityUpdate.roomId,
            slotId: availabilityUpdate.slotId,
            year,
            isAvailable: true,
          }),
        ),
      )
      await invalidateRoomAssignmentQueries()
    },
    [invalidateRoomAssignmentQueries, roomSlotAvailabilityRows, slotIds, upsertRoomSlotAvailabilityMutation, year],
  )

  const handleToggleExpand = useCallback(
    (paneId: RoomAssignmentsPaneId) => {
      setStoredExpandedPaneId(activeExpandedPaneId === paneId ? null : paneId)
    },
    [activeExpandedPaneId, setStoredExpandedPaneId],
  )

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <TransportError error={error} />
  }

  if (!data) {
    return <Loader />
  }

  return (
    <Page title='Room Assignments' variant='fill' hideTitle>
      <GlobalStyles
        styles={{
          'body[data-room-assignments-font="true"]': { '--amber-table-font-size': tableFontSize },
          'body[data-room-assignments-font="true"] [role="listbox"]': { fontSize: tableFontSize },
          'body[data-room-assignments-font="true"] .MuiMenuItem-root': { fontSize: tableFontVar },
          'body[data-room-assignments-font="true"] .MuiMenu-list': { fontSize: tableFontVar },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          height: '100%',
          '& [role="table"]': {
            fontSize: tableFontVar,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            flex: 1,
            border: (styleTheme) => `1px solid ${styleTheme.palette.divider}`,
            borderRadius: 1,
            overflow: 'hidden',
            backgroundColor: 'background.paper',
          }}
        >
          <RoomAssignmentsPageChrome
            activeTab={activeTab}
            onTabChange={(nextTab) => {
              setStoredTab(nextTab)
              setStoredExpandedPaneId(null)
            }}
            assignmentSlotFilterId={assignmentSlotFilterId}
            slotFilterOptions={slotFilterOptions}
            onAssignmentSlotFilterChange={setStoredAssignmentSlotFilterId}
            assignmentLayoutMode={assignmentLayoutMode}
            onAssignmentLayoutModeChange={setStoredAssignmentLayoutMode}
            setupLayoutMode={setupLayoutMode}
            onSetupLayoutModeChange={setStoredSetupLayoutMode}
            onResetRoomAssignments={handleResetRoomAssignments}
            onRecalculateRoomAssignments={handleRecalculateRoomAssignments}
            onRecalculateSlotRoomAssignments={handleRecalculateSlotRoomAssignments}
            onDownloadPlannerResult={() => {
              if (!plannerResult) {
                return
              }

              downloadInitialPlannerResult({
                result: plannerResult,
                year,
              })
            }}
            canDownloadPlannerResult={plannerResult !== null}
            isResetPending={resetRoomAssignmentsMutation.isPending}
            isRecalculatePending={recalculateRoomAssignmentsMutation.isPending}
          />

          <Box sx={{ px: 2, pb: 2, minHeight: 0, flex: 1, display: 'flex', overflow: 'hidden' }}>
            <RoomAssignmentsDashboard
              layoutPlan={layoutPlan}
              activeExpandedPaneId={activeExpandedPaneId}
              assignmentSlotFilterId={assignmentSlotFilterId}
              isLoading={isLoading}
              isFetching={isFetching}
              isMutationPending={isMutationPending}
              showMemberRooms={showMemberRooms}
              conflictShowAllSlots={conflictShowAllSlots}
              viewModel={dashboardViewModel}
              onToggleExpand={handleToggleExpand}
              onGameRoomChange={handleGameRoomChange}
              onOverrideGameRoomAdd={handleOverrideGameRoomAdd}
              onRemoveRoomAssignment={handleRemoveRoomAssignment}
              onRoomSlotAvailabilityChange={handleRoomSlotAvailabilityChange}
              onSetAllRoomsFullAvailability={handleSetAllRoomsFullAvailability}
              onMemberRoomChange={handleMemberRoomChange}
              onRoomMembersChange={handleRoomMembersChange}
              onRoomEnabledChange={handleRoomEnabledChange}
              onShowMemberRoomsChange={setStoredShowMemberRooms}
              onConflictShowAllSlotsChange={setStoredConflictShowAllSlots}
            />
          </Box>
        </Box>
      </Box>
    </Page>
  )
}

export default RoomAssignmentsPage
