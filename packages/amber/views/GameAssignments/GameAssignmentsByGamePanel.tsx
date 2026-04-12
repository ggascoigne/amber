import { useCallback, useMemo, useRef, useState } from 'react'

import type { GameAssignmentDashboardData } from '@amber/client'
import type { TableAutocompleteOption, TableEditRowUpdate, TableRowValidationParams } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import { Box, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { CollapsibleInfoPanel } from './CollapsibleInfoPanel'
import type { DashboardAssignmentUpdatePayload } from './dashboardData'
import { buildSlotAssignmentScope } from './domain/assignmentScope'
import {
  buildAssignmentCountsByGameId,
  buildAssignmentsByGameId,
  buildChoicesByMemberSlot,
  buildEmptyMemberAssignmentCounts,
  buildGameAssignmentSummaryRows,
  buildMemberAssignmentCountsByMemberId,
} from './domain/assignmentSummaries'
import { formatGameName } from './domain/labels'
import {
  buildGameAssignmentAddPayload,
  buildGameAssignmentEditorRows,
  buildGameAssignmentPayloadFromUpdates,
  buildUpdatedGameAssignmentRowMemberSelection,
} from './domain/memberAssignments'
import { buildMoveOptions, buildMoveSelectOptions } from './domain/moveOptions'
import type { GameAssignmentEditorRow, GameAssignmentSummaryRow } from './domain/types'
import { GameAssignmentsPanelHeader } from './GameAssignmentsPanelHeader'

import { PlayerPreference } from '../../utils/selectValues'

type GameAssignmentsByGamePanelProps = {
  data: GameAssignmentDashboardData
  year: number
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  onUpdateAssignments: (payload: DashboardAssignmentUpdatePayload) => Promise<void>
  isExpanded?: boolean
  onToggleExpand?: () => void
  scrollBehavior?: 'none' | 'bounded'
}

export const GameAssignmentsByGamePanel = ({
  data,
  year,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  onUpdateAssignments,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameAssignmentsByGamePanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
  const draftIdRef = useRef(0)
  const { filteredSlotGames, scheduledAssignments } = useMemo(
    () =>
      buildSlotAssignmentScope({
        games: data.games,
        assignments: data.assignments,
        slotFilterId,
        includeAnyGame: true,
      }),
    [data.assignments, data.games, slotFilterId],
  )
  const assignmentsByGameId = useMemo(() => buildAssignmentsByGameId(scheduledAssignments), [scheduledAssignments])
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const choicesByMemberSlot = useMemo(() => buildChoicesByMemberSlot(data.choices), [data.choices])
  const memberAssignmentCountsByMemberId = useMemo(
    () => buildMemberAssignmentCountsByMemberId(scheduledAssignments, choicesByMemberSlot),
    [choicesByMemberSlot, scheduledAssignments],
  )

  const memberOptions = useMemo<Array<TableAutocompleteOption>>(
    () =>
      data.memberships
        .filter((membership) => membership.attending)
        .map((membership) => ({
          value: membership.id,
          label: membership.user.fullName ?? 'Unknown member',
        })),
    [data.memberships],
  )

  const memberNameById = useMemo(
    () => new Map(data.memberships.map((membership) => [membership.id, membership.user.fullName ?? 'Unknown member'])),
    [data.memberships],
  )

  const gameById = useMemo(() => new Map(data.games.map((game) => [game.id, game])), [data.games])

  const gameNameById = useMemo(
    () => new Map(filteredSlotGames.map((game) => [game.id, formatGameName(game)])),
    [filteredSlotGames],
  )

  const gameRows = useMemo<Array<GameAssignmentSummaryRow>>(
    () => buildGameAssignmentSummaryRows(filteredSlotGames, assignmentCountsByGameId),
    [assignmentCountsByGameId, filteredSlotGames],
  )

  const gameColumns = useMemo<Array<ColumnDef<GameAssignmentSummaryRow>>>(
    () => [
      {
        accessorKey: 'slotId',
        header: 'Slot',
        size: 70,
      },
      {
        accessorKey: 'name',
        header: 'Game',
        size: 260,
      },
      {
        accessorKey: 'overrun',
        header: 'Overrun',
        size: 100,
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
        size: 100,
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
        size: 90,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'playerMin',
        header: 'Min',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'playerMax',
        header: 'Max',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'assignedCount',
        header: 'Current',
        size: 85,
        meta: {
          align: 'right',
        },
      },
      {
        id: 'returning',
        header: 'Returning',
        size: 100,
        accessorFn: (row) => {
          const game = filteredSlotGames.find((gameEntry) => gameEntry.id === row.gameId)
          if (game?.playerPreference === PlayerPreference.RetOnly) return 'Only'
          if (game?.playerPreference === PlayerPreference.RetPref) return 'Preferred'
          return ''
        },
      },
    ],
    [filteredSlotGames],
  )

  const assignmentColumns = useMemo<Array<ColumnDef<GameAssignmentEditorRow>>>(
    () => [
      {
        accessorKey: 'memberId',
        header: 'Member',
        size: 220,
        cell: ({ getValue }) => {
          const memberId = Number(getValue())
          return memberNameById.get(memberId) ?? 'Unassigned'
        },
        meta: {
          edit: {
            type: 'autocomplete',
            placeholder: 'Member',
            isEditable: (row) => row.original.rowId.startsWith('new-'),
            autocomplete: {
              options: memberOptions,
            },
            setValue: (row: GameAssignmentEditorRow, value: unknown) => {
              const nextMemberId = value === null || value === undefined || value === '' ? null : Number(value)
              return buildUpdatedGameAssignmentRowMemberSelection({
                assignmentRow: row,
                memberId: nextMemberId,
                choicesByMemberSlot,
                memberAssignmentCountsByMemberId,
              })
            },
          },
        },
      },
      {
        accessorKey: 'priorityLabel',
        header: 'Priority',
        size: 110,
        sortingFn: (rowA, rowB) => rowA.original.prioritySortValue - rowB.original.prioritySortValue,
      },
      {
        accessorKey: 'moveToGameId',
        header: 'Move To',
        size: 260,
        cell: ({ getValue, row }) => {
          const gameId = Number(getValue())
          if (row.original.gameId === gameId) return ''
          return gameNameById.get(gameId) ?? 'Unknown game'
        },
        meta: {
          edit: {
            type: 'select',
            getOptions: (row) => {
              const options = buildMoveOptions({
                games: filteredSlotGames,
                assignmentCountsByGameId,
                choicesByMemberSlot,
                memberId: row.original.memberId,
                slotId: row.original.slotId,
              })
              return buildMoveSelectOptions(options)
            },
            parseValue: (value) => (value === '' ? null : Number(value)),
          },
        },
      },
      {
        accessorKey: 'counts.gmOrFirst',
        header: '1st/GM',
        size: 80,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.second',
        header: '2nd',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.third',
        header: '3rd',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.fourth',
        header: '4th',
        size: 70,
        meta: {
          align: 'right',
        },
      },
      {
        accessorKey: 'counts.other',
        header: 'Other',
        size: 80,
        meta: {
          align: 'right',
        },
      },
    ],
    [
      assignmentCountsByGameId,
      choicesByMemberSlot,
      gameNameById,
      memberAssignmentCountsByMemberId,
      memberNameById,
      memberOptions,
      filteredSlotGames,
    ],
  )

  const validateAssignmentRow = useCallback(({ updatedRow }: TableRowValidationParams<GameAssignmentEditorRow>) => {
    if (!updatedRow.memberId) return 'Member is required.'
    return null
  }, [])

  const handleSummaryRowClick = useCallback((row: Row<GameAssignmentSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<GameAssignmentSummaryRow>) => {
      const { gameId, slotId } = row.original
      const assignments = assignmentsByGameId.get(gameId) ?? []
      const expandedGame = gameById.get(gameId)
      const organizerMessage = expandedGame?.message?.trim()
      const assignmentRows = buildGameAssignmentEditorRows({
        assignments,
        choicesByMemberSlot,
        memberAssignmentCountsByMemberId,
        fallbackSlotId: slotId,
      })

      const handleSave = async (updates: Array<TableEditRowUpdate<GameAssignmentEditorRow>>) => {
        const payload = buildGameAssignmentPayloadFromUpdates({ updates, year })

        if (payload.adds.length === 0 && payload.removes.length === 0) return
        await onUpdateAssignments(payload)
      }

      const handleAddRow = async (assignment: GameAssignmentEditorRow) => {
        const payload = buildGameAssignmentAddPayload({ assignment, year })
        if (payload.adds.length === 0) return
        await onUpdateAssignments(payload)
      }

      const editingConfig = {
        enabled: true,
        onSave: handleSave,
        validateRow: validateAssignmentRow,
        addRow: {
          enabled: true,
          createRow: () => ({
            rowId: `new-${draftIdRef.current++}`,
            memberId: null,
            gameId,
            slotId: row.original.slotId,
            gm: 0,
            moveToGameId: gameId,
            priorityLabel: 'Other',
            prioritySortValue: Number.POSITIVE_INFINITY,
            counts: buildEmptyMemberAssignmentCounts(),
          }),
          onAddRow: handleAddRow,
          isNewRow: (assignment: GameAssignmentEditorRow) => assignment.rowId.startsWith('new-'),
        },
      }

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {organizerMessage ? (
            <CollapsibleInfoPanel
              defaultCollapsed
              expandAriaLabel='Expand organizer message'
              collapseAriaLabel='Collapse organizer message'
              toggleVisibility='auto'
              fillContainer
              rootSx={{ px: 2 }}
              collapsedContent={
                <Typography
                  variant='body2'
                  sx={{
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                  }}
                >
                  {organizerMessage}
                </Typography>
              }
              expandedContent={
                <Typography
                  variant='body2'
                  sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                >
                  {organizerMessage}
                </Typography>
              }
            />
          ) : null}
          <Table<GameAssignmentEditorRow>
            name={`game-assignments-${gameId}`}
            data={assignmentRows}
            columns={assignmentColumns}
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
            cellEditing={editingConfig}
            systemActions={[]}
            toolbarActions={[]}
            displayGutter={false}
            compact
            elevation={0}
            debug={false}
            scrollBehavior='none'
            variant='outlined'
            useVirtualRows={false}
          />
        </Box>
      )
    },
    [
      assignmentColumns,
      assignmentsByGameId,
      choicesByMemberSlot,
      gameById,
      memberAssignmentCountsByMemberId,
      onUpdateAssignments,
      validateAssignmentRow,
      year,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-assignments-by-game-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <GameAssignmentsPanelHeader
        title='Assignments by Game'
        titleId='game-assignments-by-game-title'
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      <Table<GameAssignmentSummaryRow>
        name='game-assignments-by-game'
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
        sx={{ flex: 1 }}
        variant='outlined'
      />
    </Box>
  )
}
