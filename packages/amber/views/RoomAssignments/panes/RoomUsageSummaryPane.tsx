import { Table } from '@amber/ui/components/Table'
import { FormControlLabel, Switch } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'

import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'
import RoomNameWithMembersCell from './RoomNameWithMembersCell'

import type { RoomUsageSummaryRow } from '../types'

const roomUsageSummaryColumns: Array<ColumnDef<RoomUsageSummaryRow>> = [
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
    accessorKey: 'size',
    header: 'Size',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'usageCount',
    header: 'Usage Count',
    meta: {
      align: 'right',
    },
  },
]

type RoomUsageSummaryPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  rows: Array<RoomUsageSummaryRow>
  isLoading: boolean
  isFetching: boolean
  showMemberRooms: boolean
  onShowMemberRoomsChange: (nextValue: boolean) => void
}

const RoomUsageSummaryPane = ({
  isExpanded,
  onToggleExpand,
  rows,
  isLoading,
  isFetching,
  showMemberRooms,
  onShowMemberRoomsChange,
}: RoomUsageSummaryPaneProps) => (
  <RoomAssignmentsPaneShell
    title='Room Usage Summary'
    subtitle='Total room assignment count across the convention year.'
    isExpanded={isExpanded}
    onToggleExpand={onToggleExpand}
    controls={
      <FormControlLabel
        control={
          <Switch
            size='small'
            checked={showMemberRooms}
            onChange={(_event, checked) => onShowMemberRoomsChange(checked)}
          />
        }
        label='Show member rooms'
        sx={{ m: 0 }}
      />
    }
  >
    <Table<RoomUsageSummaryRow>
      name='room-assignment-room-usage-summary'
      data={rows}
      columns={roomUsageSummaryColumns}
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

export default RoomUsageSummaryPane
