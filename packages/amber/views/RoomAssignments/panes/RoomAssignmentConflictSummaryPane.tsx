import { Table } from '@amber/ui/components/Table'
import { Box, FormControlLabel, Switch, Typography } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'

import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'
import RoomNameWithMembersCell from './RoomNameWithMembersCell'

import type { RoomAssignmentConflictRow } from '../types'

type ConflictIssueCellProps = {
  severity: RoomAssignmentConflictRow['severity']
  issueType: string
  detail: string
}

const ConflictIssueCell = ({ severity, issueType, detail }: ConflictIssueCellProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
    <Typography variant='body2' color={severity === 'error' ? 'error.main' : 'warning.main'} sx={{ fontWeight: 600 }}>
      {issueType}
    </Typography>
    <Typography variant='caption' color='text.secondary'>
      {detail}
    </Typography>
  </Box>
)

type ConflictGameCellProps = {
  gameName: string
  gmNames: Array<string>
}

const ConflictGameCell = ({ gameName, gmNames }: ConflictGameCellProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5 }}>
    <Box component='span'>{gameName}</Box>
    {gmNames.length > 0 ? (
      <Typography component='span' variant='caption' color='text.secondary'>
        ({gmNames.join(', ')})
      </Typography>
    ) : null}
  </Box>
)

const roomAssignmentConflictSummaryColumns: Array<ColumnDef<RoomAssignmentConflictRow>> = [
  {
    accessorKey: 'slotId',
    header: 'Slot',
    meta: {
      align: 'right',
    },
    size: 40,
    minSize: 40,
  },
  {
    accessorKey: 'gameName',
    header: 'Game',
    cell: ({ row }) => <ConflictGameCell gameName={row.original.gameName} gmNames={row.original.gmNames} />,
  },
  {
    accessorKey: 'roomDescription',
    header: 'Room',
    cell: ({ row }) => (
      <RoomNameWithMembersCell
        roomDescription={row.original.roomDescription}
        assignedMemberNames={row.original.assignedMemberNames}
      />
    ),
  },
  {
    id: 'issue',
    header: 'Issue',
    cell: ({ row }) => (
      <ConflictIssueCell
        severity={row.original.severity}
        issueType={row.original.issueType}
        detail={row.original.detail}
      />
    ),
  },
]

type RoomAssignmentConflictSummaryPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  slotId: number
  rows: Array<RoomAssignmentConflictRow>
  isLoading: boolean
  isFetching: boolean
  showAllSlots: boolean
  onShowAllSlotsChange: (nextValue: boolean) => void
}

const RoomAssignmentConflictSummaryPane = ({
  isExpanded,
  onToggleExpand,
  slotId,
  rows,
  isLoading,
  isFetching,
  showAllSlots,
  onShowAllSlotsChange,
}: RoomAssignmentConflictSummaryPaneProps) => (
  <RoomAssignmentsPaneShell
    title='Constraint Summary'
    subtitle={
      showAllSlots
        ? 'Capacity, accessibility, availability, and room-sharing issues across all slots.'
        : `Capacity, accessibility, availability, and room-sharing issues for Slot ${slotId}.`
    }
    isExpanded={isExpanded}
    onToggleExpand={onToggleExpand}
    controls={
      <FormControlLabel
        control={
          <Switch size='small' checked={showAllSlots} onChange={(_event, checked) => onShowAllSlotsChange(checked)} />
        }
        label='All Slots'
        sx={{ m: 0 }}
      />
    }
  >
    <Table<RoomAssignmentConflictRow>
      name='room-assignment-conflict-summary'
      data={rows}
      columns={roomAssignmentConflictSummaryColumns}
      isLoading={isLoading}
      isFetching={isFetching}
      enableRowSelection={false}
      enableGrouping={false}
      enableGlobalFilter={false}
      enableColumnFilters={false}
      enableFilters={false}
      displayPagination='never'
      compact
      debug={false}
      systemActions={[]}
      toolbarActions={[]}
      scrollBehavior='bounded'
      sx={{ flex: 1 }}
    />
  </RoomAssignmentsPaneShell>
)

export default RoomAssignmentConflictSummaryPane
