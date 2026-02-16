import { useCallback, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { ShowExpandedToggle } from './ShowExpandedToggle'
import { SlotFilterSelect } from './SlotFilterSelect'
import type { DashboardChoice, GameAssignmentSummaryRow } from './utils'
import {
  buildAssignmentCountsByGameId,
  formatGameName,
  filterGamesWithSlots,
  getPriorityLabel,
  getPrioritySortValue,
  isScheduledAssignment,
} from './utils'

import { buildGameCategoryByGameId, isAnyGameCategory, isNoGameCategory, isUserGameCategory } from '../../utils'

type GameInterestRow = {
  rowId: string
  memberName: string
  priorityLabel: string
  prioritySortValue: number
  rank: number | null
}

type GameInterestSummaryRow = GameAssignmentSummaryRow & {
  overallInterest: number
}

type GameInterestPanelProps = {
  data: GameAssignmentDashboardData
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  scrollBehavior?: 'none' | 'bounded'
}

export const GameInterestPanel = ({
  data,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameInterestPanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
  const attendingMemberIdSet = useMemo(
    () => new Set(data.memberships.filter((membership) => membership.attending).map((membership) => membership.id)),
    [data.memberships],
  )
  const gameCategoryByGameId = useMemo(() => buildGameCategoryByGameId(data.games), [data.games])
  const slotGames = useMemo(
    () => filterGamesWithSlots(data.games).filter((game) => isUserGameCategory(game.category)),
    [data.games],
  )
  const filteredSlotGames = useMemo(
    () => (slotFilterId === null ? slotGames : slotGames.filter((game) => game.slotId === slotFilterId)),
    [slotFilterId, slotGames],
  )
  const slotGameIdSet = useMemo(() => new Set(filteredSlotGames.map((game) => game.id)), [filteredSlotGames])
  const scheduledAssignments = useMemo(
    () =>
      data.assignments.filter(
        (assignment) => isScheduledAssignment(assignment) && slotGameIdSet.has(assignment.gameId),
      ),
    [data.assignments, slotGameIdSet],
  )
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const slotGameIdsBySlotId = useMemo(() => {
    const gameIdsBySlotId = new Map<number, Array<number>>()
    filteredSlotGames.forEach((game) => {
      if (!game.slotId) return
      if (!isUserGameCategory(game.category)) return
      const gameIds = gameIdsBySlotId.get(game.slotId) ?? []
      gameIds.push(game.id)
      gameIdsBySlotId.set(game.slotId, gameIds)
    })
    return gameIdsBySlotId
  }, [filteredSlotGames])

  const choicesByGameId = useMemo(() => {
    const map = new Map<number, Array<DashboardChoice>>()
    data.choices.forEach((choice) => {
      if (!attendingMemberIdSet.has(choice.memberId)) return
      if (!choice.gameId) return
      const choiceCategory = gameCategoryByGameId.get(choice.gameId)
      if (isNoGameCategory(choiceCategory)) return

      if (isAnyGameCategory(choiceCategory)) {
        const gameIds = slotGameIdsBySlotId.get(choice.slotId) ?? []
        gameIds.forEach((gameId) => {
          const list = map.get(gameId) ?? []
          list.push(choice)
          map.set(gameId, list)
        })
        return
      }

      if (!slotGameIdSet.has(choice.gameId)) return
      const list = map.get(choice.gameId) ?? []
      list.push(choice)
      map.set(choice.gameId, list)
    })
    return map
  }, [attendingMemberIdSet, data.choices, gameCategoryByGameId, slotGameIdSet, slotGameIdsBySlotId])

  const interestCountsByGameId = useMemo(() => {
    const counts = new Map<number, number>()
    choicesByGameId.forEach((choices, gameId) => {
      const interestedMemberIds = new Set<number>()
      choices.forEach((choice) => {
        if (choice.rank === 0) return
        interestedMemberIds.add(choice.memberId)
      })
      counts.set(gameId, interestedMemberIds.size)
    })
    return counts
  }, [choicesByGameId])

  const gameRows = useMemo<Array<GameInterestSummaryRow>>(
    () =>
      filteredSlotGames.map((game) => {
        const counts = assignmentCountsByGameId.get(game.id)
        return {
          gameId: game.id,
          slotId: game.slotId ?? 0,
          name: formatGameName(game),
          playerMin: game.playerMin,
          playerMax: game.playerMax,
          assignedCount: counts?.assignedCount ?? 0,
          overrun: counts?.overrun ?? 0,
          shortfall: counts?.shortfall ?? game.playerMin,
          spaces: counts?.spaces ?? Math.max(0, game.playerMax),
          overallInterest: interestCountsByGameId.get(game.id) ?? 0,
        }
      }),
    [assignmentCountsByGameId, filteredSlotGames, interestCountsByGameId],
  )

  const gameColumns = useMemo<Array<ColumnDef<GameInterestSummaryRow>>>(
    () => [
      {
        accessorKey: 'slotId',
        header: 'Slot',
        size: 60,
      },
      {
        accessorKey: 'name',
        header: 'Game',
        size: 260,
      },
      {
        accessorKey: 'overrun',
        header: 'Overrun',
        size: 90,
        cell: ({ getValue }) => {
          const value = Number(getValue())
          return (
            <Box
              component='span'
              sx={{
                color: value > 0 ? 'error.main' : 'text.primary',
                fontWeight: value > 0 ? 'fontWeightBold' : 'inherit',
              }}
            >
              {value}
            </Box>
          )
        },
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'shortfall',
        header: 'Shortfall',
        size: 90,
        cell: ({ getValue }) => {
          const value = Number(getValue())
          return (
            <Box
              component='span'
              sx={{
                color: value > 0 ? 'error.main' : 'text.primary',
                fontWeight: value > 0 ? 'fontWeightBold' : 'inherit',
              }}
            >
              {value}
            </Box>
          )
        },
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'spaces',
        header: 'Spaces',
        size: 80,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'overallInterest',
        header: 'Interest',
        size: 90,
        meta: {
          align: 'right',
        },
      },
    ],
    [],
  )

  const interestColumns = useMemo<Array<ColumnDef<GameInterestRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
        size: 220,
      },
      {
        accessorKey: 'priorityLabel',
        header: 'Priority',
        size: 110,
        sortingFn: (rowA, rowB) => rowA.original.prioritySortValue - rowB.original.prioritySortValue,
      },
    ],
    [],
  )

  const handleSummaryRowClick = useCallback((row: Row<GameInterestSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<GameInterestSummaryRow>) => {
      const { gameId } = row.original
      const choices = choicesByGameId.get(gameId) ?? []
      const interestRowsByMemberId = new Map<number, GameInterestRow>()
      choices.forEach((choice) => {
        const { memberId, rank, membership, returningPlayer } = choice
        const existingRow = interestRowsByMemberId.get(memberId)
        const prioritySortValue = getPrioritySortValue(rank, returningPlayer)
        if (existingRow && existingRow.prioritySortValue <= prioritySortValue) return
        const priorityLabel = isAnyGameCategory(gameCategoryByGameId.get(choice.gameId ?? 0))
          ? `${getPriorityLabel(rank, returningPlayer)} (Any Game)`
          : getPriorityLabel(rank, returningPlayer)

        interestRowsByMemberId.set(memberId, {
          rowId: `choice-${gameId}-${memberId}`,
          memberName: membership.user.fullName ?? 'Unknown member',
          priorityLabel,
          prioritySortValue,
          rank,
        })
      })

      const interestRows: Array<GameInterestRow> = Array.from(interestRowsByMemberId.values()).sort((left, right) => {
        if (left.prioritySortValue !== right.prioritySortValue) {
          return left.prioritySortValue - right.prioritySortValue
        }
        return left.memberName.localeCompare(right.memberName)
      })

      return (
        <Table<GameInterestRow>
          name={`game-interest-${gameId}`}
          data={interestRows}
          columns={interestColumns}
          keyField='rowId'
          disableStatePersistence
          initialState={{ sorting: [{ id: 'priorityLabel', desc: false }] }}
          enablePagination={false}
          enableRowSelection={false}
          enableGrouping={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          enableFilters={false}
          displayPagination='never'
          systemActions={[]}
          toolbarActions={[]}
          displayGutter={false}
          compact
          variant='outlined'
          debug={false}
          scrollBehavior='none'
          useVirtualRows={false}
        />
      )
    },
    [choicesByGameId, gameCategoryByGameId, interestColumns],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-interest-panel-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography id='game-interest-panel-title' variant='h6' component='h2'>
          Game Interest Reference
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SlotFilterSelect
            slotFilterOptions={slotFilterOptions}
            slotFilterId={slotFilterId}
            onSlotFilterChange={onSlotFilterChange}
          />
          <ShowExpandedToggle checked={showExpandedOnly} onChange={setShowExpandedOnly} />
          {onToggleExpand ? (
            <IconButton
              aria-label={isExpanded ? 'Exit full view' : 'Expand panel'}
              onClick={onToggleExpand}
              size='small'
            >
              {isExpanded ? <CloseFullscreenIcon fontSize='small' /> : <OpenInFullIcon fontSize='small' />}
            </IconButton>
          ) : null}
        </Box>
      </Box>
      <Table<GameInterestSummaryRow>
        name='game-interest-reference'
        data={gameRows}
        columns={gameColumns}
        keyField='gameId'
        onRowClick={handleSummaryRowClick}
        enablePagination={false}
        enableRowSelection={false}
        enableGrouping={false}
        enableColumnFilters={false}
        enableGlobalFilter={false}
        enableFilters={false}
        displayPagination='never'
        renderExpandedContent={renderExpandedContent}
        highlightRow={(row) => row.original.overallInterest < row.original.playerMin}
        expandedContentSx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRight: 'none',
          px: 0,
          py: 0,
        }}
        getRowCanExpand={() => true}
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
        scrollBehavior={scrollBehavior}
        debug={false}
        systemActions={[]}
        toolbarActions={[]}
        sx={(theme) => ({
          flex: 1,
          '& .rowHighlighted': {
            backgroundColor: alpha(theme.palette.error.main, 0.09),
          },
          '& .rowHighlighted:hover, & .rowHighlighted:focus': {
            backgroundColor: alpha(theme.palette.error.main, 0.16),
          },
        })}
        variant='outlined'
      />
    </Box>
  )
}
