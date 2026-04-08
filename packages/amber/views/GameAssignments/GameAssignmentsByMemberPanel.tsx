import { useCallback, useMemo, useState } from 'react'

import type { GameAssignmentDashboardData } from '@amber/client'
import type { TableEditRowUpdate } from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import { Box } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import type { DashboardAssignmentUpdatePayload } from './dashboardData'
import { GameAssignmentsPanelHeader } from './GameAssignmentsPanelHeader'
import { MemberSubmissionDetailLayout } from './MemberSubmissionDetailLayout'
import type { MemberAssignmentEditorRow, MemberAssignmentSummaryRow } from './utils'
import {
  buildAssignedSlotCountsByMemberId,
  buildAssignmentCountsByGameId,
  buildAssignmentsByMemberId,
  buildChoicesByMemberSlot,
  buildMemberAssignmentPayloadFromUpdates,
  buildMemberAssignmentCountsByMemberId,
  buildMemberAssignmentEditorRows,
  buildMemberAssignmentSummaryRows,
  buildMoveOptions,
  buildMoveSelectOptions,
  buildSubmissionsByMemberId,
  buildSlotAssignmentScope,
  buildUpdatedMemberAssignmentRowGameSelection,
  formatGameName,
} from './utils'

import { useConfiguration } from '../../utils'

type GameAssignmentsByMemberPanelProps = {
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

export const GameAssignmentsByMemberPanel = ({
  data,
  year,
  slotFilterOptions,
  slotFilterId,
  onSlotFilterChange,
  onUpdateAssignments,
  isExpanded = false,
  onToggleExpand,
  scrollBehavior = 'bounded',
}: GameAssignmentsByMemberPanelProps) => {
  const [showExpandedOnly, setShowExpandedOnly] = useState(false)
  const configuration = useConfiguration()
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
  const assignmentsByMemberId = useMemo(() => buildAssignmentsByMemberId(scheduledAssignments), [scheduledAssignments])
  const assignedSlotCountsByMemberId = useMemo(
    () => buildAssignedSlotCountsByMemberId(scheduledAssignments),
    [scheduledAssignments],
  )
  const assignmentCountsByGameId = useMemo(
    () => buildAssignmentCountsByGameId(filteredSlotGames, scheduledAssignments),
    [filteredSlotGames, scheduledAssignments],
  )
  const choicesByMemberSlot = useMemo(() => buildChoicesByMemberSlot(data.choices), [data.choices])
  const memberAssignmentCountsByMemberId = useMemo(
    () => buildMemberAssignmentCountsByMemberId(scheduledAssignments, choicesByMemberSlot),
    [choicesByMemberSlot, scheduledAssignments],
  )
  const submissionsByMemberId = useMemo(() => buildSubmissionsByMemberId(data.submissions), [data.submissions])

  const gameById = useMemo(() => new Map(filteredSlotGames.map((game) => [game.id, game])), [filteredSlotGames])
  const expectedAssignmentCount = slotFilterId === null ? configuration.numberOfSlots : 1

  const memberRows = useMemo<Array<MemberAssignmentSummaryRow>>(
    () =>
      buildMemberAssignmentSummaryRows({
        memberships: data.memberships,
        submissionsByMemberId,
        assignedSlotCountsByMemberId,
        memberAssignmentCountsByMemberId,
        expectedAssignmentCount,
      }),
    [
      assignedSlotCountsByMemberId,
      data.memberships,
      expectedAssignmentCount,
      memberAssignmentCountsByMemberId,
      submissionsByMemberId,
    ],
  )

  const memberColumns = useMemo<Array<ColumnDef<MemberAssignmentSummaryRow>>>(
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
      {
        accessorKey: 'counts.gmOrFirst',
        header: '1st/GM',
        size: 90,
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
    [],
  )

  const slotColumns = useMemo<Array<ColumnDef<MemberAssignmentEditorRow>>>(
    () => [
      {
        accessorKey: 'slotLabel',
        header: 'Slot',
        size: 90,
      },
      {
        accessorKey: 'gameId',
        header: 'Move To',
        size: 260,
        cell: ({ getValue }) => {
          const gameId = getValue<number | null>()
          if (gameId === null) return ''
          return formatGameName(gameById.get(gameId))
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
            setValue: (row: MemberAssignmentEditorRow, value: unknown) => {
              const gameId = value === null || value === undefined || value === '' ? null : Number(value)
              return buildUpdatedMemberAssignmentRowGameSelection({
                assignmentRow: row,
                gameId,
                gameById,
                choicesByMemberSlot,
              })
            },
          },
        },
      },
      {
        accessorKey: 'priorityLabel',
        header: 'Priority',
        size: 120,
        sortingFn: (rowA, rowB) => rowA.original.prioritySortValue - rowB.original.prioritySortValue,
      },
    ],
    [assignmentCountsByGameId, choicesByMemberSlot, filteredSlotGames, gameById],
  )

  const handleSummaryRowClick = useCallback((row: Row<MemberAssignmentSummaryRow>) => {
    if (!row.getCanExpand()) return
    row.toggleExpanded()
  }, [])

  const renderExpandedContent = useCallback(
    (row: Row<MemberAssignmentSummaryRow>) => {
      const { memberId } = row.original
      const submission = submissionsByMemberId.get(memberId)
      const assignments = assignmentsByMemberId.get(memberId) ?? []
      const slotRows = buildMemberAssignmentEditorRows({
        memberId,
        assignments,
        choicesByMemberSlot,
        gameById,
        numberOfSlots: configuration.numberOfSlots,
        slotFilterId,
      })

      const handleSave = async (updates: Array<TableEditRowUpdate<MemberAssignmentEditorRow>>) => {
        const payload = buildMemberAssignmentPayloadFromUpdates({ updates, year })

        if (payload.adds.length === 0 && payload.removes.length === 0) return
        await onUpdateAssignments(payload)
      }

      const editingConfig = {
        enabled: true,
        onSave: handleSave,
      }

      const message = submission?.message

      return (
        <MemberSubmissionDetailLayout submissionMessage={message}>
          <Box sx={{ minWidth: 0 }}>
            <Table<MemberAssignmentEditorRow>
              name={`member-assignments-${memberId}`}
              data={slotRows}
              columns={slotColumns}
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
      assignmentsByMemberId,
      choicesByMemberSlot,
      configuration.numberOfSlots,
      gameById,
      onUpdateAssignments,
      slotFilterId,
      submissionsByMemberId,
      year,
      slotColumns,
    ],
  )

  return (
    <Box
      component='section'
      aria-labelledby='game-assignments-by-member-title'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        gap: 1,
        flex: scrollBehavior === 'bounded' ? 1 : undefined,
      }}
    >
      <GameAssignmentsPanelHeader
        title='Assignments by Member'
        titleId='game-assignments-by-member-title'
        slotFilterOptions={slotFilterOptions}
        slotFilterId={slotFilterId}
        onSlotFilterChange={onSlotFilterChange}
        showExpandedOnly={showExpandedOnly}
        onShowExpandedOnlyChange={setShowExpandedOnly}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      <Table<MemberAssignmentSummaryRow>
        name='game-assignments-by-member'
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
