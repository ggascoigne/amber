import { useMemo } from 'react'

import { Table } from '@amber/ui/components/Table'
import type { ColumnDef } from '@tanstack/react-table'

import RoomAssignmentSelect from './RoomAssignmentSelect'
import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'

import type { MemberRoomAssignmentRow, RoomSelectOption } from '../types'

type MemberRoomAssignmentsPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  rows: Array<MemberRoomAssignmentRow>
  isLoading: boolean
  isFetching: boolean
  isMutationPending: boolean
  roomOptions: Array<RoomSelectOption>
  onMemberRoomChange: (args: { memberId: number; roomId: number | null }) => Promise<void>
}

const MemberRoomAssignmentsPane = ({
  isExpanded,
  onToggleExpand,
  rows,
  isLoading,
  isFetching,
  isMutationPending,
  roomOptions,
  onMemberRoomChange,
}: MemberRoomAssignmentsPaneProps) => {
  const columns = useMemo<Array<ColumnDef<MemberRoomAssignmentRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
      },
      {
        id: 'assignedRoom',
        header: 'Assigned Room',
        cell: ({ row }) => (
          <RoomAssignmentSelect
            value={row.original.assignedRoomId}
            disabled={isMutationPending}
            ariaLabel={`Assign room for member ${row.original.memberId}`}
            options={roomOptions}
            onChange={(roomId) =>
              onMemberRoomChange({
                memberId: row.original.memberId,
                roomId,
              })
            }
          />
        ),
      },
      {
        accessorKey: 'sharingLabel',
        header: 'Sharing',
      },
    ],
    [isMutationPending, onMemberRoomChange, roomOptions],
  )

  return (
    <RoomAssignmentsPaneShell
      title='Member Room Assignments'
      subtitle='Assign, move, or remove member-room associations used for room planning priorities.'
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <Table<MemberRoomAssignmentRow>
        name='room-assignment-member-room-assignments'
        data={rows}
        columns={columns}
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
}

export default MemberRoomAssignmentsPane
