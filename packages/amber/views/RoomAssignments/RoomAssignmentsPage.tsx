import type { MouseEvent, SyntheticEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { RecalculateRoomAssignmentsResult } from '@amber/client'
import { useInvalidateRoomAssignmentQueries, useTRPC } from '@amber/client'
import { Loader, useLocalStorage } from '@amber/ui'
import {
  Box,
  Button,
  FormControl,
  GlobalStyles,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { downloadInitialPlannerResult } from './initialPlannerExport'
import AssignMembersToRoomsPane from './panes/AssignMembersToRoomsPane'
import CurrentSlotRoomAvailabilityPane from './panes/CurrentSlotRoomAvailabilityPane'
import ManualGameRoomAssignmentPane from './panes/ManualGameRoomAssignmentPane'
import MemberRoomAssignmentsPane from './panes/MemberRoomAssignmentsPane'
import RoomAssignmentConflictSummaryPane from './panes/RoomAssignmentConflictSummaryPane'
import RoomSlotAvailabilityPane from './panes/RoomSlotAvailabilityPane'
import RoomUsageSummaryPane from './panes/RoomUsageSummaryPane'
import type {
  CurrentSlotRoomAvailabilityRow,
  ManualGameRoomAssignmentRow,
  ManualRoomSelectOption,
  MemberRoomAssignmentRow,
  RoomAssignmentConflictRow,
  RoomMemberAssignmentRow,
  RoomSlotAvailabilityRow,
  RoomUsageSummaryRow,
  SizedRoomSelectOption,
} from './types'
import {
  buildAssignedMemberNamesByRoomId,
  buildAssignmentCountsByGameId,
  buildCurrentSlotAvailableRooms,
  buildDefaultRoomAssignmentByGameId,
  buildEnabledManualRoomOptions,
  buildGameMembersByGameId,
  buildGmNamesByGameId,
  buildManualGameRows,
  buildMemberRoomIdByMemberId,
  buildMemberRoomRows,
  buildOverrideAssignmentsByGameId,
  buildRequiredAccessibilityByGameId,
  buildRoomAssignmentConflictRows,
  buildRoomMemberRows,
  buildRoomSelectOptions,
  buildRoomSlotAvailabilityMap,
  buildRoomUsageSummaryRows,
  buildSlotIds,
  isRoomAvailableInSlot,
  sortGamesForRoomAssignment,
} from './utils'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useConfiguration, useYearFilter } from '../../utils'
import { CollapsibleInfoPanel } from '../GameAssignments/CollapsibleInfoPanel'

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

type RoomAssignmentsTabId = 'setup' | 'assignment'
type RoomAssignmentsSetupLayoutMode = 'rows' | 'columns'
type RoomAssignmentsAssignmentLayoutMode = 'grid' | 'columns'
type RoomAssignmentsPaneId =
  | 'slotAvailability'
  | 'memberRoomAssignments'
  | 'roomMemberAssignments'
  | 'manualGameRoomAssignment'
  | 'roomAvailability'
  | 'conflictSummary'
  | 'roomUsageSummary'

const ROOM_ASSIGNMENTS_SETUP_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.setupLayoutMode'
const ROOM_ASSIGNMENTS_ASSIGNMENT_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.assignmentLayoutMode'
const ROOM_ASSIGNMENTS_TAB_STORAGE_KEY = 'amber.roomAssignments.activeTab'
const ROOM_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY = 'amber.roomAssignments.expandedPaneId'
const ROOM_ASSIGNMENTS_ASSIGNMENT_SLOT_FILTER_STORAGE_KEY = 'amber.roomAssignments.assignmentSlotFilter'
const ROOM_ASSIGNMENTS_SHOW_MEMBER_ROOMS_STORAGE_KEY = 'amber.roomAssignments.showMemberRooms'
const ROOM_ASSIGNMENTS_CONFLICT_SHOW_ALL_SLOTS_STORAGE_KEY = 'amber.roomAssignments.conflictShowAllSlots'

const workflowLegendItems = [
  'Calculate replaces non-override room assignments across the schedule and keeps override rows fixed.',
  'Calculate for This Slot only recalculates the visible slot and leaves override rows fixed.',
  'Reset Room Assignments clears both default and override room assignments for the year.',
  'Override rooms now take priority when syncing the display/report room into game.room_id.',
  'Download Details exports the latest calculation result from this page session.',
]

const isSetupLayoutMode = (value: unknown): value is RoomAssignmentsSetupLayoutMode =>
  value === 'rows' || value === 'columns'

const isAssignmentLayoutMode = (value: unknown): value is RoomAssignmentsAssignmentLayoutMode =>
  value === 'grid' || value === 'columns'

const isTabId = (value: unknown): value is RoomAssignmentsTabId => value === 'setup' || value === 'assignment'

const isPaneId = (value: unknown): value is RoomAssignmentsPaneId =>
  value === 'slotAvailability' ||
  value === 'memberRoomAssignments' ||
  value === 'roomMemberAssignments' ||
  value === 'manualGameRoomAssignment' ||
  value === 'roomAvailability' ||
  value === 'conflictSummary' ||
  value === 'roomUsageSummary'

const sanitizeRequiredSlotFilterId = (value: unknown, slotFilterOptions: Array<number>): number => {
  const fallbackSlotId = slotFilterOptions[0] ?? 1

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return fallbackSlotId
  }

  return slotFilterOptions.includes(value) ? value : fallbackSlotId
}

type ExplicitSlotFilterSelectProps = {
  slotFilterOptions: Array<number>
  slotFilterId: number
  onSlotFilterChange: (slotFilterId: number) => void
}

const ExplicitSlotFilterSelect = ({
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
}: ExplicitSlotFilterSelectProps) => (
  <FormControl sx={{ minWidth: 110 }}>
    <TextField
      select
      size='small'
      variant='standard'
      value={`${slotFilterId}`}
      onChange={(event) => {
        const nextValue = Number(event.target.value)
        if (!Number.isInteger(nextValue)) {
          return
        }

        onSlotFilterChange(nextValue)
      }}
      aria-label='Slot filter'
    >
      {slotFilterOptions.map((slotValue) => (
        <MenuItem key={slotValue} value={`${slotValue}`}>
          {`Slot ${slotValue}`}
        </MenuItem>
      ))}
    </TextField>
  </FormControl>
)

type RoomAssignmentsTitleBarProps = {
  activeTab: RoomAssignmentsTabId
  onTabChange: (nextTab: RoomAssignmentsTabId) => void
}

const RoomAssignmentsTitleBar = ({ activeTab, onTabChange }: RoomAssignmentsTitleBarProps) => (
  <Box
    sx={{
      px: 3,
      pt: 2.5,
      pb: 1.25,
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'flex-start' },
      justifyContent: 'space-between',
      gap: 2,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-start' },
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            fontSize: '2.25rem',
            lineHeight: '1.5em',
            fontWeight: 300,
            color: 'inherit',
            m: 0,
          }}
          component='h1'
        >
          Room Assignments
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_event: SyntheticEvent, nextTab: RoomAssignmentsTabId) => onTabChange(nextTab)}
        >
          <Tab label='Setup' value='setup' />
          <Tab label='Assignment' value='assignment' />
        </Tabs>
      </Box>
      <CollapsibleInfoPanel
        defaultCollapsed={false}
        expandAriaLabel='Expand legend'
        collapseAriaLabel='Collapse legend'
        rootSx={{
          border: (styleTheme) => `1px solid ${styleTheme.palette.divider}`,
          borderRadius: 1,
          px: 2,
          backgroundColor: 'background.default',
          '& .MuiIconButton-root': {
            p: 0.5,
          },
        }}
        collapsedSx={{
          py: 0.25,
          minHeight: 30,
          fontSize: '0.75rem',
          lineHeight: 1.4,
          maxWidth: { xs: '100%', md: 220 },
        }}
        expandedSx={{
          py: 1,
          maxWidth: { xs: '100%', md: 560 },
        }}
        collapsedContent={
          <Box component='span' sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', lineHeight: 1.4 }}>
            Legend
          </Box>
        }
        expandedContent={
          <Box
            component='ul'
            sx={{
              m: 0,
              pl: 2.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              fontSize: '0.75rem',
              lineHeight: 1.4,
            }}
          >
            {workflowLegendItems.map((item) => (
              <Box component='li' key={item}>
                {item}
              </Box>
            ))}
          </Box>
        }
      />
    </Box>
  </Box>
)

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

const RoomAssignmentsPage = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const invalidateRoomAssignmentQueries = useInvalidateRoomAssignmentQueries()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))

  const slotFilterOptions = useMemo<Array<number>>(
    () =>
      Array.from(
        { length: configuration.numberOfSlots },
        (_unusedValue: undefined, slotIndex: number) => slotIndex + 1,
      ),
    [configuration.numberOfSlots],
  )

  const [storedTab, setStoredTab] = useLocalStorage<unknown>(ROOM_ASSIGNMENTS_TAB_STORAGE_KEY, 'assignment')
  const activeTab = useMemo<RoomAssignmentsTabId>(() => (isTabId(storedTab) ? storedTab : 'assignment'), [storedTab])
  const tableFontSize = '0.78125rem'
  const tableFontVar = 'var(--amber-table-font-size, 0.875rem)'

  const [storedSetupLayoutMode, setStoredSetupLayoutMode] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_SETUP_LAYOUT_STORAGE_KEY,
    'rows',
  )
  const setupLayoutMode = useMemo<RoomAssignmentsSetupLayoutMode>(
    () => (isSetupLayoutMode(storedSetupLayoutMode) ? storedSetupLayoutMode : 'rows'),
    [storedSetupLayoutMode],
  )

  const [storedAssignmentLayoutMode, setStoredAssignmentLayoutMode] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_ASSIGNMENT_LAYOUT_STORAGE_KEY,
    'grid',
  )
  const assignmentLayoutMode = useMemo<RoomAssignmentsAssignmentLayoutMode>(
    () => (isAssignmentLayoutMode(storedAssignmentLayoutMode) ? storedAssignmentLayoutMode : 'grid'),
    [storedAssignmentLayoutMode],
  )

  const [storedExpandedPaneId, setStoredExpandedPaneId] = useLocalStorage<unknown>(
    ROOM_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY,
    null,
  )
  const expandedPaneId = useMemo<RoomAssignmentsPaneId | null>(
    () => (isPaneId(storedExpandedPaneId) ? storedExpandedPaneId : null),
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

  const activePaneIds = activeTab === 'setup' ? setupPaneIds : assignmentPaneIds
  const activeExpandedPaneId = expandedPaneId && activePaneIds.includes(expandedPaneId) ? expandedPaneId : null

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

  const slotIds = useMemo(() => buildSlotIds(configuration.numberOfSlots), [configuration.numberOfSlots])
  const sortedGames = useMemo(() => sortGamesForRoomAssignment(data?.games ?? []), [data?.games])
  const defaultAssignmentByGameId = useMemo(
    () => buildDefaultRoomAssignmentByGameId(data?.roomAssignments ?? []),
    [data?.roomAssignments],
  )
  const availabilityByKey = useMemo(
    () => buildRoomSlotAvailabilityMap(data?.roomSlotAvailability ?? []),
    [data?.roomSlotAvailability],
  )
  const memberRoomIdByMemberId = useMemo(
    () => buildMemberRoomIdByMemberId(data?.memberRoomAssignments ?? []),
    [data?.memberRoomAssignments],
  )
  const rooms = useMemo(() => data?.rooms ?? [], [data?.rooms])
  const memberships = useMemo(() => data?.memberships ?? [], [data?.memberships])
  const roomAssignments = useMemo(() => data?.roomAssignments ?? [], [data?.roomAssignments])
  const gameAssignments = useMemo(() => data?.gameAssignments ?? [], [data?.gameAssignments])

  const assignedMemberNamesByRoomId = useMemo(
    () => buildAssignedMemberNamesByRoomId(memberships, memberRoomIdByMemberId),
    [memberRoomIdByMemberId, memberships],
  )

  const gmNamesByGameId = useMemo(() => buildGmNamesByGameId(gameAssignments), [gameAssignments])
  const assignmentCountsByGameId = useMemo(() => buildAssignmentCountsByGameId(gameAssignments), [gameAssignments])
  const gameMembersByGameId = useMemo(() => buildGameMembersByGameId(gameAssignments), [gameAssignments])
  const requiredAccessibilityByGameId = useMemo(
    () => buildRequiredAccessibilityByGameId(gameAssignments),
    [gameAssignments],
  )
  const overrideAssignmentsByGameId = useMemo(
    () =>
      buildOverrideAssignmentsByGameId({
        roomAssignments,
        rooms,
        assignedMemberNamesByRoomId,
      }),
    [assignedMemberNamesByRoomId, roomAssignments, rooms],
  )

  const isMutationPending =
    assignGameRoomMutation.isPending ||
    removeGameRoomAssignmentMutation.isPending ||
    upsertRoomSlotAvailabilityMutation.isPending ||
    upsertMemberRoomAssignmentMutation.isPending ||
    updateGameRoomMutation.isPending ||
    resetRoomAssignmentsMutation.isPending ||
    recalculateRoomAssignmentsMutation.isPending

  const roomOptions = useMemo<Array<SizedRoomSelectOption>>(
    () => buildRoomSelectOptions(rooms, assignedMemberNamesByRoomId),
    [assignedMemberNamesByRoomId, rooms],
  )
  const enabledManualRoomOptions = useMemo<Array<ManualRoomSelectOption>>(
    () =>
      buildEnabledManualRoomOptions({
        roomOptions,
        rooms,
        roomAssignments,
        availabilityByKey,
        slotId: assignmentSlotFilterId,
        year,
      }),
    [assignmentSlotFilterId, availabilityByKey, roomAssignments, roomOptions, rooms, year],
  )

  const memberOptions = useMemo(
    () =>
      memberships
        .filter((membership) => membership.attending)
        .map((membership) => ({
          id: membership.id,
          fullName: membership.user.fullName ?? '',
        }))
        .filter((memberOption) => memberOption.fullName)
        .sort((left, right) => left.fullName.localeCompare(right.fullName)),
    [memberships],
  )

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
      const nextMemberIds = [...new Set(memberIds)]
      const currentMemberIdsForRoom = memberships
        .filter((membership) => membership.attending)
        .filter((membership) => memberRoomIdByMemberId.get(membership.id) === roomId)
        .map((membership) => membership.id)

      const currentMemberIdsForRoomSet = new Set(currentMemberIdsForRoom)
      const nextMemberIdsSet = new Set(nextMemberIds)

      const memberIdsToAssign = nextMemberIds.filter((memberId) => !currentMemberIdsForRoomSet.has(memberId))
      const memberIdsToUnassign = currentMemberIdsForRoom.filter((memberId) => !nextMemberIdsSet.has(memberId))

      if (memberIdsToAssign.length === 0 && memberIdsToUnassign.length === 0) {
        return
      }

      await Promise.all([
        ...memberIdsToAssign.map((memberId) =>
          upsertMemberRoomAssignmentMutation.mutateAsync({
            memberId,
            roomId,
            year,
          }),
        ),
        ...memberIdsToUnassign.map((memberId) =>
          upsertMemberRoomAssignmentMutation.mutateAsync({
            memberId,
            roomId: null,
            year,
          }),
        ),
      ])
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

  const manualGameRows = useMemo<Array<ManualGameRoomAssignmentRow>>(
    () =>
      buildManualGameRows({
        games: sortedGames,
        defaultAssignmentByGameId,
        gmNamesByGameId,
        assignmentCountsByGameId,
        gameMembersByGameId,
        overrideAssignmentsByGameId,
      }),
    [
      assignmentCountsByGameId,
      defaultAssignmentByGameId,
      gameMembersByGameId,
      gmNamesByGameId,
      overrideAssignmentsByGameId,
      sortedGames,
    ],
  )

  const filteredManualGameRows = useMemo<Array<ManualGameRoomAssignmentRow>>(
    () => manualGameRows.filter((row) => row.slotId === assignmentSlotFilterId),
    [assignmentSlotFilterId, manualGameRows],
  )

  const roomSlotAvailabilityRows = useMemo<Array<RoomSlotAvailabilityRow>>(
    () =>
      rooms.map((room) => {
        const slotAvailabilityBySlotId = Object.fromEntries(
          slotIds.map((slotId) => [
            slotId,
            isRoomAvailableInSlot({
              availabilityByKey,
              roomId: room.id,
              slotId,
              year,
            }),
          ]),
        )

        return {
          id: room.id,
          roomId: room.id,
          roomDescription: room.description,
          roomType: room.type,
          slotAvailabilityBySlotId,
        }
      }),
    [availabilityByKey, rooms, slotIds, year],
  )

  const handleSetAllRoomsFullAvailability = useCallback(
    async (roomIds: Array<number>) => {
      if (roomIds.length === 0) {
        return
      }

      const selectedRoomIds = new Set(roomIds)
      const availabilityUpdates = roomSlotAvailabilityRows.flatMap((roomRow) =>
        selectedRoomIds.has(roomRow.roomId)
          ? slotIds
              .filter((slotId) => !(roomRow.slotAvailabilityBySlotId[slotId] ?? true))
              .map((slotId) => ({
                roomId: roomRow.roomId,
                slotId,
              }))
          : [],
      )

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

  const memberRoomRows = useMemo<Array<MemberRoomAssignmentRow>>(
    () =>
      buildMemberRoomRows({
        memberships,
        memberRoomIdByMemberId,
      }),
    [memberRoomIdByMemberId, memberships],
  )

  const roomMemberRows = useMemo<Array<RoomMemberAssignmentRow>>(
    () =>
      buildRoomMemberRows({
        rooms,
        memberships,
        memberRoomIdByMemberId,
      }),
    [memberRoomIdByMemberId, memberships, rooms],
  )

  const currentSlotAvailableRooms = useMemo<Array<CurrentSlotRoomAvailabilityRow>>(
    () =>
      buildCurrentSlotAvailableRooms({
        rooms,
        roomAssignments,
        assignedMemberNamesByRoomId,
        availabilityByKey,
        slotId: assignmentSlotFilterId,
        year,
      }),
    [assignedMemberNamesByRoomId, assignmentSlotFilterId, availabilityByKey, roomAssignments, rooms, year],
  )

  const roomUsageSummaryRows = useMemo<Array<RoomUsageSummaryRow>>(
    () =>
      buildRoomUsageSummaryRows({
        rooms,
        roomAssignments,
        assignedMemberNamesByRoomId,
      }),
    [assignedMemberNamesByRoomId, roomAssignments, rooms],
  )
  const filteredRoomUsageSummaryRows = useMemo<Array<RoomUsageSummaryRow>>(
    () =>
      showMemberRooms ? roomUsageSummaryRows.filter((row) => row.assignedMemberNames.length > 0) : roomUsageSummaryRows,
    [roomUsageSummaryRows, showMemberRooms],
  )

  const roomAssignmentConflictRows = useMemo<Array<RoomAssignmentConflictRow>>(
    () =>
      buildRoomAssignmentConflictRows({
        games: sortedGames,
        rooms,
        roomAssignments,
        assignmentCountsByGameId,
        gmNamesByGameId,
        requiredAccessibilityByGameId,
        assignedMemberNamesByRoomId,
        availabilityByKey,
        year,
      }),
    [
      assignmentCountsByGameId,
      assignedMemberNamesByRoomId,
      availabilityByKey,
      gmNamesByGameId,
      requiredAccessibilityByGameId,
      roomAssignments,
      rooms,
      sortedGames,
      year,
    ],
  )

  const filteredRoomAssignmentConflictRows = useMemo<Array<RoomAssignmentConflictRow>>(
    () =>
      conflictShowAllSlots
        ? roomAssignmentConflictRows
        : roomAssignmentConflictRows.filter((row) => row.slotId === assignmentSlotFilterId),
    [assignmentSlotFilterId, conflictShowAllSlots, roomAssignmentConflictRows],
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

  const renderPane = (paneId: RoomAssignmentsPaneId) => {
    const isPaneExpanded = activeExpandedPaneId === paneId

    switch (paneId) {
      case 'slotAvailability':
        return (
          <RoomSlotAvailabilityPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            rows={roomSlotAvailabilityRows}
            slotIds={slotIds}
            isLoading={isLoading}
            isFetching={isFetching}
            onRoomSlotAvailabilityChange={handleRoomSlotAvailabilityChange}
            onSetAllRoomsFullAvailability={handleSetAllRoomsFullAvailability}
          />
        )
      case 'memberRoomAssignments':
        return (
          <MemberRoomAssignmentsPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            rows={memberRoomRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            roomOptions={roomOptions}
            onMemberRoomChange={handleMemberRoomChange}
          />
        )
      case 'roomMemberAssignments':
        return (
          <AssignMembersToRoomsPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            rows={roomMemberRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            memberOptions={memberOptions}
            onRoomEnabledChange={handleRoomEnabledChange}
            onRoomMembersChange={handleRoomMembersChange}
          />
        )
      case 'manualGameRoomAssignment':
        return (
          <ManualGameRoomAssignmentPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            slotId={assignmentSlotFilterId}
            rows={filteredManualGameRows}
            isLoading={isLoading}
            isFetching={isFetching}
            isMutationPending={isMutationPending}
            roomOptions={enabledManualRoomOptions}
            onGameRoomChange={handleGameRoomChange}
            onAddOverrideRoom={handleOverrideGameRoomAdd}
            onRemoveRoomAssignment={handleRemoveRoomAssignment}
          />
        )
      case 'roomAvailability':
        return (
          <CurrentSlotRoomAvailabilityPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            slotId={assignmentSlotFilterId}
            rows={currentSlotAvailableRooms}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        )
      case 'conflictSummary':
        return (
          <RoomAssignmentConflictSummaryPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            slotId={assignmentSlotFilterId}
            rows={filteredRoomAssignmentConflictRows}
            isLoading={isLoading}
            isFetching={isFetching}
            showAllSlots={conflictShowAllSlots}
            onShowAllSlotsChange={setStoredConflictShowAllSlots}
          />
        )
      case 'roomUsageSummary':
        return (
          <RoomUsageSummaryPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            rows={filteredRoomUsageSummaryRows}
            isLoading={isLoading}
            isFetching={isFetching}
            showMemberRooms={showMemberRooms}
            onShowMemberRoomsChange={setStoredShowMemberRooms}
          />
        )
      default:
        return null
    }
  }

  const renderLayout = () => {
    if (isSmallScreen) {
      if (activeExpandedPaneId) {
        return <Box sx={{ flex: 1, minHeight: 0 }}>{renderPane(activeExpandedPaneId)}</Box>
      }

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minHeight: 0 }}>
          {activePaneIds.map((paneId) => (
            <Box key={paneId} sx={{ minHeight: 0, flex: 1 }}>
              {renderPane(paneId)}
            </Box>
          ))}
        </Box>
      )
    }

    if (activeExpandedPaneId) {
      return (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderPane(activeExpandedPaneId)}
        </Box>
      )
    }

    if (activeTab === 'setup') {
      if (setupLayoutMode === 'columns') {
        return (
          <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={34} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('slotAvailability')}
            </Panel>
            <ResizeHandle direction='vertical' />
            <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('memberRoomAssignments')}
            </Panel>
            <ResizeHandle direction='vertical' />
            <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('roomMemberAssignments')}
            </Panel>
          </Group>
        )
      }

      return (
        <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={34} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('slotAvailability')}
          </Panel>
          <ResizeHandle direction='horizontal' />
          <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('memberRoomAssignments')}
          </Panel>
          <ResizeHandle direction='horizontal' />
          <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('roomMemberAssignments')}
          </Panel>
        </Group>
      )
    }

    if (assignmentLayoutMode === 'columns') {
      return (
        <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={40} minSize={24} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('manualGameRoomAssignment')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={20} minSize={14} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('roomAvailability')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={20} minSize={14} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('conflictSummary')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={20} minSize={14} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('roomUsageSummary')}
          </Panel>
        </Group>
      )
    }

    return (
      <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
        <Panel defaultSize={60} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {renderPane('manualGameRoomAssignment')}
        </Panel>
        <ResizeHandle direction='vertical' />
        <Panel defaultSize={40} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('roomAvailability')}
            </Panel>
            <ResizeHandle direction='horizontal' />
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
                <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {renderPane('conflictSummary')}
                </Panel>
                <ResizeHandle direction='horizontal' />
                <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {renderPane('roomUsageSummary')}
                </Panel>
              </Group>
            </Panel>
          </Group>
        </Panel>
      </Group>
    )
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
          <RoomAssignmentsTitleBar
            activeTab={activeTab}
            onTabChange={(nextTab) => {
              setStoredTab(nextTab)
              setStoredExpandedPaneId(null)
            }}
          />

          <Box
            sx={{
              px: 2,
              pb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {activeTab === 'assignment' ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={handleResetRoomAssignments}
                    disabled={resetRoomAssignmentsMutation.isPending}
                  >
                    Reset Room Assignments
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleRecalculateRoomAssignments}
                    disabled={recalculateRoomAssignmentsMutation.isPending}
                  >
                    Calculate
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={handleRecalculateSlotRoomAssignments}
                    disabled={recalculateRoomAssignmentsMutation.isPending}
                  >
                    Calculate for This Slot
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      if (!plannerResult) {
                        return
                      }

                      downloadInitialPlannerResult({
                        result: plannerResult,
                        year,
                      })
                    }}
                    disabled={!plannerResult}
                  >
                    Download Details
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box />
            )}
            {activeTab === 'assignment' ? (
              <>
                <ExplicitSlotFilterSelect
                  slotFilterOptions={slotFilterOptions}
                  slotFilterId={assignmentSlotFilterId}
                  onSlotFilterChange={(nextSlotFilterId) => {
                    setStoredAssignmentSlotFilterId(nextSlotFilterId)
                  }}
                />
                <ToggleButtonGroup
                  value={assignmentLayoutMode}
                  exclusive
                  onChange={(
                    _event: MouseEvent<HTMLElement>,
                    nextLayoutMode: RoomAssignmentsAssignmentLayoutMode | null,
                  ) => {
                    if (!nextLayoutMode) {
                      return
                    }

                    setStoredAssignmentLayoutMode(nextLayoutMode)
                  }}
                  size='small'
                  aria-label='Assignment layout'
                >
                  <ToggleButton value='grid' aria-label='Grid layout'>
                    Grid
                  </ToggleButton>
                  <ToggleButton value='columns' aria-label='Column layout'>
                    Columns
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            ) : (
              <ToggleButtonGroup
                value={setupLayoutMode}
                exclusive
                onChange={(_event: MouseEvent<HTMLElement>, nextLayoutMode: RoomAssignmentsSetupLayoutMode | null) => {
                  if (!nextLayoutMode) {
                    return
                  }

                  setStoredSetupLayoutMode(nextLayoutMode)
                }}
                size='small'
                aria-label='Setup layout'
              >
                <ToggleButton value='rows' aria-label='Rows layout'>
                  Rows
                </ToggleButton>
                <ToggleButton value='columns' aria-label='Columns layout'>
                  Columns
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>

          <Box sx={{ px: 2, pb: 2, minHeight: 0, flex: 1, display: 'flex', overflow: 'hidden' }}>{renderLayout()}</Box>
        </Box>
      </Box>
    </Page>
  )
}

export default RoomAssignmentsPage
