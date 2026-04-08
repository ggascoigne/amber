import { useCallback, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData, UpsertGameChoiceBySlotInput } from '@amber/client'
import type { TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import { Box } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import { GameAssignmentsPanelHeader } from './GameAssignmentsPanelHeader'
import { MemberSubmissionDetailLayout } from './MemberSubmissionDetailLayout'
import type { MemberChoiceRow, MemberChoiceSummaryRow } from './utils'
import {
  buildAssignedSlotCountsByMemberId,
  buildChoiceEditorStateForMember,
  buildUpdatedChoiceRowGameSelection,
  buildChoiceUpsertsFromUpdates,
  buildChoicesByMemberId,
  buildGameChoiceOptionsForRow,
  buildMemberChoiceSummaryRows,
  buildSlotAssignmentScope,
  buildSubmissionsByMemberId,
  canEditChoiceRowGameSelection,
  getGameLabel,
  getPrioritySortValue,
} from './utils'

import { buildGameCategoryByGameId, useConfiguration } from '../../utils'

type GameChoicesPanelProps = {
  data: GameAssignmentDashboardData
  year: number
  onUpsertChoice: (input: UpsertGameChoiceBySlotInput) => Promise<void>
  slotFilterOptions: Array<number>
  slotFilterId: number | null
  onSlotFilterChange: (slotFilterId: number | null) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  scrollBehavior?: 'none' | 'bounded'
}

export const GameChoicesPanel = ({
  data,
  year,
  onUpsertChoice,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameChoicesPanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
  const configuration = useConfiguration()
  const { slotGameIdSet, scheduledAssignments } = useMemo(
    () =>
      buildSlotAssignmentScope({
        games: data.games,
        assignments: data.assignments,
        slotFilterId,
      }),
    [data.assignments, data.games, slotFilterId],
  )
  const assignedSlotCountsByMemberId = useMemo(
    () => buildAssignedSlotCountsByMemberId(scheduledAssignments),
    [scheduledAssignments],
  )
  const choicesByMemberId = useMemo(() => buildChoicesByMemberId(data.choices), [data.choices])
  const submissionsByMemberId = useMemo(() => buildSubmissionsByMemberId(data.submissions), [data.submissions])
  const gameById = useMemo(() => new Map(data.games.map((game) => [game.id, game])), [data.games])
  const gameCategoryByGameId = useMemo(() => buildGameCategoryByGameId(data.games), [data.games])

  const memberRows = useMemo<Array<MemberChoiceSummaryRow>>(
    () =>
      buildMemberChoiceSummaryRows({
        memberships: data.memberships,
        choicesByMemberId,
        submissionsByMemberId,
        assignedSlotCountsByMemberId,
        numberOfSlots: configuration.numberOfSlots,
      }),
    [
      assignedSlotCountsByMemberId,
      choicesByMemberId,
      configuration.numberOfSlots,
      data.memberships,
      submissionsByMemberId,
    ],
  )

  const memberColumns = useMemo<Array<ColumnDef<MemberChoiceSummaryRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
        size: 220,
        cell: ({ row }) => (
          <Box
            component='span'
            sx={{
              color: row.original.requiresAttention ? 'error.main' : 'text.primary',
            }}
          >
            {row.original.memberName}
          </Box>
        ),
      },
      {
        accessorKey: 'assignments',
        header: 'Assignments',
        size: 110,
        meta: {
          align: 'right',
        },
      },
    ],
    [],
  )

  const handleSummaryRowClick = useCallback((row: Row<MemberChoiceSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<MemberChoiceSummaryRow>) => {
      const { memberId } = row.original
      const choices = choicesByMemberId.get(memberId) ?? []
      const submission = submissionsByMemberId.get(memberId)
      const { choiceRows, gmGameIdBySlotId, previousRowIdByRowId } = buildChoiceEditorStateForMember({
        memberId,
        assignments: data.assignments,
        choices,
        configuration,
        gameCategoryByGameId,
        slotGameIdSet,
        slotFilterId,
      })
      const choiceColumns: Array<ColumnDef<MemberChoiceRow>> = [
        {
          accessorKey: 'slotLabel',
          header: 'Slot',
          size: 90,
        },
        {
          accessorKey: 'rankLabel',
          header: 'Priority',
          size: 110,
          sortingFn: (rowA, rowB) =>
            getPrioritySortValue(rowA.original.rank, rowA.original.returningPlayer) -
            getPrioritySortValue(rowB.original.rank, rowB.original.returningPlayer),
        },
        {
          accessorKey: 'gameId',
          header: 'Game',
          size: 260,
          cell: ({ getValue }) => getGameLabel(getValue<number | null>(), gameById),
          meta: {
            edit: {
              type: 'select',
              isEditable: (choiceRow, context) => {
                const previousRowId = previousRowIdByRowId.get(choiceRow.id)
                if (!previousRowId) return true
                const previousRow = context.table.getRowModel().rowsById[previousRowId]
                if (!previousRow) return false
                return canEditChoiceRowGameSelection({
                  previousGameId: context.getValue(previousRow, 'gameId') as number | null,
                  gameCategoryByGameId,
                })
              },
              getOptions: (choiceRow) => {
                const options = buildGameChoiceOptionsForRow({
                  games: data.games,
                  slotId: choiceRow.original.slotId,
                  rank: choiceRow.original.rank,
                  gmGameId: gmGameIdBySlotId.get(choiceRow.original.slotId),
                })
                return [...options, { value: '', label: 'No Selection' }]
              },
              parseValue: (value) => (value === '' ? null : Number(value)),
              setValue: (choiceRow, value) => {
                const gameId = value === null || value === undefined || value === '' ? null : Number(value)
                return buildUpdatedChoiceRowGameSelection({
                  choiceRow,
                  gameId,
                  gmGameId: gmGameIdBySlotId.get(choiceRow.slotId) ?? null,
                })
              },
            },
          },
        },
      ]

      const handleSave = async (updates: Array<TableEditRowUpdate<MemberChoiceRow>>) => {
        await Promise.all(buildChoiceUpsertsFromUpdates({ updates, year }).map(onUpsertChoice))
      }

      const editingConfig = {
        enabled: true,
        onSave: handleSave,
      }

      const message = submission?.message

      return (
        <MemberSubmissionDetailLayout submissionMessage={message}>
          <Box sx={{ minWidth: 0 }}>
            <Table<MemberChoiceRow>
              name={`member-choices-${memberId}`}
              data={choiceRows}
              columns={choiceColumns}
              keyField='rowId'
              disableStatePersistence
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
              variant='outlined'
              debug={false}
              scrollBehavior='none'
              useVirtualRows={false}
            />
          </Box>
        </MemberSubmissionDetailLayout>
      )
    },
    [
      choicesByMemberId,
      configuration,
      data.assignments,
      data.games,
      gameCategoryByGameId,
      gameById,
      submissionsByMemberId,
      onUpsertChoice,
      slotFilterId,
      slotGameIdSet,
      year,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-choices-panel-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <GameAssignmentsPanelHeader
        title='Member Choices'
        titleId='game-choices-panel-title'
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      <Table<MemberChoiceSummaryRow>
        name='game-choices-by-member'
        data={memberRows}
        columns={memberColumns}
        keyField='memberId'
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
