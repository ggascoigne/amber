import type { MouseEvent, SyntheticEvent } from 'react'
import { useCallback, useEffect, useMemo } from 'react'

import { useInvalidateRoomAssignmentQueries, useTRPC } from '@amber/client'
import { Loader, useLocalStorage } from '@amber/ui'
import {
  Alert,
  Box,
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

import AssignMembersToRoomsPane from './panes/AssignMembersToRoomsPane'
import CurrentSlotRoomAvailabilityPane from './panes/CurrentSlotRoomAvailabilityPane'
import ManualGameRoomAssignmentPane from './panes/ManualGameRoomAssignmentPane'
import MemberRoomAssignmentsPane from './panes/MemberRoomAssignmentsPane'
import RoomSlotAvailabilityPane from './panes/RoomSlotAvailabilityPane'
import RoomUsageSummaryPane from './panes/RoomUsageSummaryPane'
import type {
  CurrentSlotRoomAvailabilityRow,
  ManualGameRoomAssignmentRow,
  ManualRoomSelectOption,
  MemberRoomAssignmentRow,
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
  | 'roomUsageSummary'

const ROOM_ASSIGNMENTS_SETUP_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.setupLayoutMode'
const ROOM_ASSIGNMENTS_ASSIGNMENT_LAYOUT_STORAGE_KEY = 'amber.roomAssignments.assignmentLayoutMode'
const ROOM_ASSIGNMENTS_TAB_STORAGE_KEY = 'amber.roomAssignments.activeTab'
const ROOM_ASSIGNMENTS_EXPANDED_PANE_STORAGE_KEY = 'amber.roomAssignments.expandedPaneId'
const ROOM_ASSIGNMENTS_ASSIGNMENT_SLOT_FILTER_STORAGE_KEY = 'amber.roomAssignments.assignmentSlotFilter'

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

  const isMutationPending =
    assignGameRoomMutation.isPending ||
    removeGameRoomAssignmentMutation.isPending ||
    upsertRoomSlotAvailabilityMutation.isPending ||
    upsertMemberRoomAssignmentMutation.isPending ||
    updateGameRoomMutation.isPending

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
        slotId: assignmentSlotFilterId,
      }),
    [assignmentSlotFilterId, roomAssignments, roomOptions, rooms],
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

  const manualGameRows = useMemo<Array<ManualGameRoomAssignmentRow>>(
    () =>
      buildManualGameRows({
        games: sortedGames,
        defaultAssignmentByGameId,
        gmNamesByGameId,
        assignmentCountsByGameId,
        gameMembersByGameId,
      }),
    [assignmentCountsByGameId, defaultAssignmentByGameId, gameMembersByGameId, gmNamesByGameId, sortedGames],
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
      case 'roomUsageSummary':
        return (
          <RoomUsageSummaryPane
            isExpanded={isPaneExpanded}
            onToggleExpand={() => setStoredExpandedPaneId(isPaneExpanded ? null : paneId)}
            rows={roomUsageSummaryRows}
            isLoading={isLoading}
            isFetching={isFetching}
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
          <Panel defaultSize={34} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('manualGameRoomAssignment')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('roomAvailability')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={33} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('roomUsageSummary')}
          </Panel>
        </Group>
      )
    }

    return (
      <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
        <Panel defaultSize={50} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {renderPane('manualGameRoomAssignment')}
        </Panel>
        <ResizeHandle direction='vertical' />
        <Panel defaultSize={50} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('roomAvailability')}
            </Panel>
            <ResizeHandle direction='horizontal' />
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('roomUsageSummary')}
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
        <Alert severity='info'>
          {configuration.name} room assignment workspace for year {year}. Setup covers room/member configuration and
          Assignment covers active slot and room usage.
        </Alert>

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
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
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
