import { Table } from '@amber/ui/components/Table'
import type { ColumnDef } from '@tanstack/react-table'

import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'
import RoomNameWithMembersCell from './RoomNameWithMembersCell'

import type { CurrentSlotRoomAvailabilityRow } from '../types'

const currentSlotAvailableRoomsColumns: Array<ColumnDef<CurrentSlotRoomAvailabilityRow>> = [
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
]

type CurrentSlotRoomAvailabilityPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  slotId: number
  rows: Array<CurrentSlotRoomAvailabilityRow>
  isLoading: boolean
  isFetching: boolean
}

const CurrentSlotRoomAvailabilityPane = ({
  isExpanded,
  onToggleExpand,
  slotId,
  rows,
  isLoading,
  isFetching,
}: CurrentSlotRoomAvailabilityPaneProps) => (
  <RoomAssignmentsPaneShell
    title='Current Slot Room Availability'
    subtitle={`Available rooms for Slot ${slotId}.`}
    isExpanded={isExpanded}
    onToggleExpand={onToggleExpand}
  >
    <Table<CurrentSlotRoomAvailabilityRow>
      name='room-assignment-current-slot-availability'
      data={rows}
      columns={currentSlotAvailableRoomsColumns}
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

export default CurrentSlotRoomAvailabilityPane
