import { useCallback, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import { Box } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { buildSlotAssignmentScope } from './domain/assignmentScope'
import { buildAssignmentCountsByGameId, buildGameInterestSummaryRows } from './domain/assignmentSummaries'
import { buildInterestChoicesByGameId, buildInterestCountsByGameId, buildInterestRowsForGame } from './domain/interest'
import type { GameInterestRow, GameInterestSummaryRow } from './domain/types'
import { GameAssignmentsPanelHeader } from './GameAssignmentsPanelHeader'

import { buildGameCategoryByGameId } from '../../utils'

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
  const { filteredSlotGames, slotGameIdSet, scheduledAssignments } = useMemo(
    () =>
      buildSlotAssignmentScope({
        games: data.games,
        assignments: data.assignments,
        slotFilterId,
        userGamesOnly: true,
      }),
    [data.assignments, data.games, slotFilterId],
  )
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const slotGameIdsBySlotId = useMemo(() => {
    const gameIdsBySlotId = new Map<number, Array<number>>()
    filteredSlotGames.forEach((game) => {
      if (!game.slotId) return
      const gameIds = gameIdsBySlotId.get(game.slotId) ?? []
      gameIds.push(game.id)
      gameIdsBySlotId.set(game.slotId, gameIds)
    })
    return gameIdsBySlotId
  }, [filteredSlotGames])

  const choicesByGameId = useMemo(
    () =>
      buildInterestChoicesByGameId({
        choices: data.choices,
        attendingMemberIdSet,
        gameCategoryByGameId,
        slotGameIdSet,
        slotGameIdsBySlotId,
      }),
    [attendingMemberIdSet, data.choices, gameCategoryByGameId, slotGameIdSet, slotGameIdsBySlotId],
  )

  const interestCountsByGameId = useMemo(() => buildInterestCountsByGameId(choicesByGameId), [choicesByGameId])

  const gameRows = useMemo<Array<GameInterestSummaryRow>>(
    () =>
      buildGameInterestSummaryRows({
        games: filteredSlotGames,
        assignmentCountsByGameId,
        interestCountsByGameId,
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
      const interestRows = buildInterestRowsForGame({
        gameId,
        choices: choicesByGameId.get(gameId) ?? [],
        gameCategoryByGameId,
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
      <GameAssignmentsPanelHeader
        title='Game Interest Reference'
        titleId='game-interest-panel-title'
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
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
