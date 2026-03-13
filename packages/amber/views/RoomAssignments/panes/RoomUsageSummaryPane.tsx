import { Table } from '@amber/ui/components/Table'
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
}

const RoomUsageSummaryPane = ({
  isExpanded,
  onToggleExpand,
  rows,
  isLoading,
  isFetching,
}: RoomUsageSummaryPaneProps) => (
  <RoomAssignmentsPaneShell
    title='Room Usage Summary'
    subtitle='Total room assignment count across the convention year.'
    isExpanded={isExpanded}
    onToggleExpand={onToggleExpand}
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
      disableStatePersistence
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
