import type { MouseEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type {
  GameAssignmentDashboardData,
  UpdateGameAssignmentsInput,
  UpsertGameChoiceBySlotInput,
} from '@amber/client'
import { useInvalidateGameAssignmentDashboardQueries, useTRPC } from '@amber/client'
import { Loader, useLocalStorage } from '@amber/ui'
import {
  Box,
  Button,
  FormControl,
  GlobalStyles,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'

import { CollapsibleInfoPanel } from './CollapsibleInfoPanel'
import { GameAssignmentsByGamePanel } from './GameAssignmentsByGamePanel'
import { GameAssignmentsByMemberPanel } from './GameAssignmentsByMemberPanel'
import { GameChoicesPanel } from './GameChoicesPanel'
import { GameInterestPanel } from './GameInterestPanel'
import { buildAssignmentKeyFromInput, buildAssignmentKeyFromRecord, buildChoiceKey } from './utils'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useConfiguration, useYearFilter } from '../../utils'

type AssignmentUpdate = UpdateGameAssignmentsInput['adds'][number]

type AssignmentUpdatePayload = {
  adds: Array<AssignmentUpdate>
  removes: Array<AssignmentUpdate>
}

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

type GameAssignmentsPaneId = 'byGame' | 'byMember' | 'choices' | 'interest'

type LayoutMode = 'grid' | 'columns'

const GAME_ASSIGNMENTS_LAYOUT_STORAGE_KEY = 'amber.gameAssignments.layoutMode'
const GAME_ASSIGNMENTS_SLOT_FILTERS_STORAGE_KEY = 'amber.gameAssignments.paneSlotFilters'

const buildDefaultPaneSlotFilters = (): Record<GameAssignmentsPaneId, number | null> => ({
  byGame: null,
  byMember: null,
  choices: null,
  interest: null,
})

const isLayoutMode = (value: unknown): value is LayoutMode => value === 'grid' || value === 'columns'

const sanitizeSlotFilterId = (value: unknown, slotFilterOptions: Array<number>): number | null => {
  if (value === null) return null
  if (typeof value !== 'number' || !Number.isInteger(value)) return null
  return slotFilterOptions.includes(value) ? value : null
}

const sanitizePaneSlotFilters = (
  value: unknown,
  slotFilterOptions: Array<number>,
): Record<GameAssignmentsPaneId, number | null> => {
  const defaultFilters = buildDefaultPaneSlotFilters()
  if (!value || typeof value !== 'object') return defaultFilters
  const typedValue = value as Partial<Record<GameAssignmentsPaneId, unknown>>
  return {
    byGame: sanitizeSlotFilterId(typedValue.byGame, slotFilterOptions),
    byMember: sanitizeSlotFilterId(typedValue.byMember, slotFilterOptions),
    choices: sanitizeSlotFilterId(typedValue.choices, slotFilterOptions),
    interest: sanitizeSlotFilterId(typedValue.interest, slotFilterOptions),
  }
}

const doesStoredPaneSlotFiltersMatch = (
  value: unknown,
  expected: Record<GameAssignmentsPaneId, number | null>,
): boolean => {
  if (!value || typeof value !== 'object') return false
  const typedValue = value as Partial<Record<GameAssignmentsPaneId, unknown>>
  return (
    typedValue.byGame === expected.byGame &&
    typedValue.byMember === expected.byMember &&
    typedValue.choices === expected.choices &&
    typedValue.interest === expected.interest
  )
}

const legendItems = [
  'Members with a * by their name have Signup notes',
  'Priorities with a * by them are returning players.',
  'Game names with a * by them are returning players only.',
]

type GameAssignmentsTitleBarProps = {
  slotFilterOptions: Array<number>
  slotFilterId: number | null | 'mixed'
  onSlotFilterChange: (slotFilterId: number | null) => void
  layoutMode: LayoutMode
  onLayoutChange: (event: MouseEvent<HTMLElement>, nextLayout: LayoutMode | null) => void
  onResetAssignments: () => void
  onSetInitialAssignments: () => void
  isBusy: boolean
}

const GameAssignmentsTitleBar = ({
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  layoutMode,
  onLayoutChange,
  onResetAssignments,
  onSetInitialAssignments,
  isBusy,
}: GameAssignmentsTitleBarProps) => (
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
        fontSize: '2.25rem',
        lineHeight: '1.5em',
        fontWeight: 300,
        color: 'inherit',
        m: 0,
      }}
      component='h1'
    >
      Game Assignments
    </Box>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
      }}
    >
      <FormControl sx={{ minWidth: 110 }}>
        <TextField
          select
          size='small'
          variant='standard'
          value={slotFilterId === 'mixed' ? '' : slotFilterId === null ? 'all' : `${slotFilterId}`}
          onChange={(event) => {
            const nextValue = event.target.value
            if (nextValue === '') return
            onSlotFilterChange(nextValue === 'all' ? null : Number(nextValue))
          }}
          aria-label='Slot filter'
        >
          <MenuItem value='' disabled>
            &nbsp;
          </MenuItem>
          <MenuItem value='all'>All Slots</MenuItem>
          {slotFilterOptions.map((slotValue) => (
            <MenuItem key={slotValue} value={`${slotValue}`}>
              {`Slot ${slotValue}`}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <ToggleButtonGroup
        value={layoutMode}
        exclusive
        onChange={onLayoutChange}
        size='small'
        aria-label='Layout'
        sx={{
          display: { xs: 'none', md: 'inline-flex' },
          '& .MuiToggleButton-root': {
            py: 0.25,
            px: 1.25,
            minHeight: 30,
            lineHeight: 1.2,
          },
        }}
      >
        <ToggleButton value='grid' aria-label='Grid layout'>
          Grid
        </ToggleButton>
        <ToggleButton value='columns' aria-label='Column layout'>
          Columns
        </ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
        <Button variant='outlined' size='small' onClick={onResetAssignments} disabled={isBusy}>
          Reset Assignments
        </Button>
        <Button variant='outlined' size='small' onClick={onSetInitialAssignments} disabled={isBusy}>
          Set Initial Assignments
        </Button>
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
          maxWidth: { xs: '100%', md: 380 },
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
            {legendItems.map((item) => (
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

type GameAssignmentsPageProps = {
  data: GameAssignmentDashboardData
  year: number
  slotFilterOptions: Array<number>
  paneSlotFilters: Record<GameAssignmentsPaneId, number | null>
  onPaneSlotFilterChange: (paneId: GameAssignmentsPaneId, slotFilterId: number | null) => void
  onUpdateAssignments: (payload: AssignmentUpdatePayload) => Promise<void>
  onUpsertChoice: (input: UpsertGameChoiceBySlotInput) => Promise<void>
  scrollBehavior: 'none' | 'bounded'
  layoutMode: LayoutMode
  expandedPaneId: GameAssignmentsPaneId | null
  onToggleExpand: (paneId: GameAssignmentsPaneId) => void
}

const GameAssignmentsDashboard = ({
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
}: GameAssignmentsPageProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [portalReady, setPortalReady] = useState(false)
  const hiddenHostRef = useRef<HTMLDivElement | null>(null)
  const paneHostsRef = useRef<Record<GameAssignmentsPaneId, HTMLDivElement> | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (paneHostsRef.current || !hiddenHostRef.current) return
    const createHost = () => {
      const host = document.createElement('div')
      host.style.display = 'flex'
      host.style.flexDirection = 'column'
      host.style.flex = '1 1 auto'
      host.style.minHeight = '0'
      return host
    }
    const hosts = {
      byGame: createHost(),
      byMember: createHost(),
      choices: createHost(),
      interest: createHost(),
    }
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

  const portalContent = portalReady ? (
    <>
      {paneHostsRef.current?.byGame ? createPortal(renderPaneContent('byGame'), paneHostsRef.current.byGame) : null}
      {paneHostsRef.current?.byMember
        ? createPortal(renderPaneContent('byMember'), paneHostsRef.current.byMember)
        : null}
      {paneHostsRef.current?.choices ? createPortal(renderPaneContent('choices'), paneHostsRef.current.choices) : null}
      {paneHostsRef.current?.interest
        ? createPortal(renderPaneContent('interest'), paneHostsRef.current.interest)
        : null}
    </>
  ) : null

  const layout = (() => {
    if (isSmallScreen) {
      if (expandedPaneId) {
        return <Box sx={{ flex: 1, minHeight: 0 }}>{renderPane(expandedPaneId)}</Box>
      }
      return (
        <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
          {renderPane('byGame')}
          {renderPane('byMember')}
          {renderPane('choices')}
          {renderPane('interest')}
        </Stack>
      )
    }

    if (expandedPaneId) {
      return (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderPane(expandedPaneId)}
        </Box>
      )
    }

    if (layoutMode === 'columns') {
      return (
        <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
          <Panel defaultSize={25} minSize={15} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('byGame')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={25} minSize={15} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('byMember')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={25} minSize={15} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('choices')}
          </Panel>
          <ResizeHandle direction='vertical' />
          <Panel defaultSize={25} minSize={15} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {renderPane('interest')}
          </Panel>
        </Group>
      )
    }

    return (
      <Group orientation='horizontal' style={{ flex: 1, minHeight: 0 }}>
        <Panel defaultSize={50} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('byGame')}
            </Panel>
            <ResizeHandle direction='horizontal' />
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('byMember')}
            </Panel>
          </Group>
        </Panel>
        <ResizeHandle direction='vertical' />
        <Panel defaultSize={50} minSize={30} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Group orientation='vertical' style={{ flex: 1, minHeight: 0 }}>
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('choices')}
            </Panel>
            <ResizeHandle direction='horizontal' />
            <Panel defaultSize={50} minSize={20} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {renderPane('interest')}
            </Panel>
          </Group>
        </Panel>
      </Group>
    )
  })()

  return (
    <>
      <Box ref={hiddenHostRef} sx={{ display: 'none' }} />
      {portalContent}
      {layout}
    </>
  )
}

const GameAssignmentsPage = () => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const invalidateDashboardQueries = useInvalidateGameAssignmentDashboardQueries()
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
  const [storedPaneSlotFilters, setStoredPaneSlotFilters] = useLocalStorage<unknown>(
    GAME_ASSIGNMENTS_SLOT_FILTERS_STORAGE_KEY,
    buildDefaultPaneSlotFilters(),
  )
  const paneSlotFilters = useMemo(
    () => sanitizePaneSlotFilters(storedPaneSlotFilters, slotFilterOptions),
    [slotFilterOptions, storedPaneSlotFilters],
  )
  const topSlotFilterId = useMemo<number | null | 'mixed'>(() => {
    const values = Object.values(paneSlotFilters)
    const firstValue = values[0]
    if (values.every((value) => value === firstValue)) return firstValue
    return 'mixed'
  }, [paneSlotFilters])
  const [storedLayoutMode, setStoredLayoutMode] = useLocalStorage<unknown>(GAME_ASSIGNMENTS_LAYOUT_STORAGE_KEY, 'grid')
  const layoutMode = useMemo<LayoutMode>(
    () => (isLayoutMode(storedLayoutMode) ? storedLayoutMode : 'grid'),
    [storedLayoutMode],
  )
  const [expandedPaneId, setExpandedPaneId] = useState<GameAssignmentsPaneId | null>(null)
  const tableFontSize = '0.78125rem'
  const tableFontVar = 'var(--amber-table-font-size, 0.875rem)'

  const { data, isLoading, error } = useQuery(trpc.gameAssignments.getAssignmentDashboardData.queryOptions({ year }))
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
    if (!isLayoutMode(storedLayoutMode)) {
      setStoredLayoutMode('grid')
    }
  }, [setStoredLayoutMode, storedLayoutMode])

  useEffect(() => {
    if (doesStoredPaneSlotFiltersMatch(storedPaneSlotFilters, paneSlotFilters)) return
    setStoredPaneSlotFilters(paneSlotFilters)
  }, [paneSlotFilters, setStoredPaneSlotFilters, storedPaneSlotFilters])

  const handleUpdateAssignments = useCallback(
    async (payload: AssignmentUpdatePayload) => {
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

      setDashboardData((previous) => {
        if (!previous) return previous

        const removeKeys = new Set(payload.removes.map((assignment) => buildAssignmentKeyFromInput(assignment)))
        const nextAssignments = previous.assignments.filter(
          (assignment) => !removeKeys.has(buildAssignmentKeyFromRecord(assignment)),
        )

        const assignmentMap = new Map(
          nextAssignments.map((assignment) => [buildAssignmentKeyFromRecord(assignment), assignment]),
        )

        payload.adds.forEach((assignment) => {
          const game = previous.games.find((entry) => entry.id === assignment.gameId)
          const membership = previous.memberships.find((entry) => entry.id === assignment.memberId)
          if (!membership) return
          const resolvedGame =
            game ??
            (assignment.gameId > 0 && assignment.gameId <= configuration.numberOfSlots
              ? {
                  id: assignment.gameId,
                  name: 'No Game',
                  slotId: assignment.gameId,
                }
              : null)
          if (!resolvedGame) return

          assignmentMap.set(buildAssignmentKeyFromInput(assignment), {
            memberId: assignment.memberId,
            gameId: assignment.gameId,
            gm: assignment.gm,
            year: assignment.year,
            membership: {
              id: membership.id,
              user: {
                fullName: membership.user.fullName,
              },
            },
            game: {
              id: resolvedGame.id,
              name: resolvedGame.name,
              slotId: resolvedGame.slotId,
            },
          })
        })

        return {
          ...previous,
          assignments: Array.from(assignmentMap.values()),
        }
      })
    },
    [configuration.numberOfSlots, invalidateDashboardQueries, updateAssignmentsMutation, year],
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

      setDashboardData((previous) => {
        if (!previous) return previous

        const membership = previous.memberships.find((entry) => entry.id === result.gameChoice.memberId)
        if (!membership) return previous

        const game = result.gameChoice.gameId
          ? previous.games.find((entry) => entry.id === result.gameChoice.gameId)
          : null

        const nextChoice = {
          ...result.gameChoice,
          membership: {
            id: membership.id,
            user: {
              fullName: membership.user.fullName,
            },
          },
          game: game
            ? {
                id: game.id,
                name: game.name,
                slotId: game.slotId,
              }
            : null,
        }

        const filteredChoices = previous.choices.filter(
          (choice) => buildChoiceKey(choice) !== buildChoiceKey(result.gameChoice),
        )

        return {
          ...previous,
          choices: [...filteredChoices, nextChoice],
        }
      })
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
    (_event: MouseEvent<HTMLElement>, nextLayout: LayoutMode | null) => {
      if (nextLayout) {
        setStoredLayoutMode(nextLayout)
      }
    },
    [setStoredLayoutMode],
  )

  const handleToggleExpand = useCallback((paneId: GameAssignmentsPaneId) => {
    setExpandedPaneId((previous) => (previous === paneId ? null : paneId))
  }, [])
  const handlePaneSlotFilterChange = useCallback(
    (paneId: GameAssignmentsPaneId, slotFilterId: number | null) => {
      setStoredPaneSlotFilters({
        ...paneSlotFilters,
        [paneId]: slotFilterId,
      })
    },
    [paneSlotFilters, setStoredPaneSlotFilters],
  )
  const handleTopSlotFilterChange = useCallback(
    (slotFilterId: number | null) => {
      setStoredPaneSlotFilters({
        byGame: slotFilterId,
        byMember: slotFilterId,
        choices: slotFilterId,
        interest: slotFilterId,
      })
    },
    [setStoredPaneSlotFilters],
  )

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
          onResetAssignments={handleResetAssignments}
          onSetInitialAssignments={handleSetInitialAssignments}
          isBusy={
            updateAssignmentsMutation.isPending ||
            resetAssignmentsMutation.isPending ||
            setInitialAssignmentsMutation.isPending
          }
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
    </Page>
  )
}

export default GameAssignmentsPage
