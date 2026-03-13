import { useMemo } from 'react'

import { Table } from '@amber/ui/components/Table'
import { Box, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import RoomAssignmentSelect from './RoomAssignmentSelect'
import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'

import type { ManualGameRoomAssignmentRow, ManualRoomSelectOption } from '../types'

type ManualGameRoomAssignmentPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  slotId: number
  rows: Array<ManualGameRoomAssignmentRow>
  isLoading: boolean
  isFetching: boolean
  isMutationPending: boolean
  roomOptions: Array<ManualRoomSelectOption>
  onGameRoomChange: (args: { gameId: number; slotId: number; roomId: number | null }) => Promise<void>
}

type GameNameWithGmsCellProps = {
  gameName: string
  gmNames: Array<string>
}

const GameNameWithGmsCell = ({ gameName, gmNames }: GameNameWithGmsCellProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 0.5 }}>
    <Box component='span'>{gameName}</Box>
    {gmNames.length > 0 ? (
      <Typography component='span' variant='caption' color='text.secondary'>
        ({gmNames.join(', ')})
      </Typography>
    ) : null}
  </Box>
)

type ManualGameMemberRow = {
  id: string
  memberName: string
  roleLabel: string
}

const ManualGameRoomAssignmentPane = ({
  isExpanded,
  onToggleExpand,
  slotId,
  rows,
  isLoading,
  isFetching,
  isMutationPending,
  roomOptions,
  onGameRoomChange,
}: ManualGameRoomAssignmentPaneProps) => {
  const expandedColumns = useMemo<Array<ColumnDef<ManualGameMemberRow>>>(
    () => [
      {
        accessorKey: 'memberName',
        header: 'Member',
      },
      {
        accessorKey: 'roleLabel',
        header: 'Role',
        size: 90,
      },
    ],
    [],
  )

  const columns = useMemo<Array<ColumnDef<ManualGameRoomAssignmentRow>>>(
    () => [
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
        cell: ({ row }) => <GameNameWithGmsCell gameName={row.original.gameName} gmNames={row.original.gmNames} />,
      },
      {
        accessorKey: 'assignedCount',
        header: 'Current',
        meta: {
          align: 'right',
        },
        size: 60,
      },
      {
        id: 'assignRoom',
        header: 'Assign Room',
        cell: ({ row }) => (
          <RoomAssignmentSelect
            value={row.original.currentRoomId}
            disabled={isMutationPending}
            ariaLabel={`Manual room assignment for game ${row.original.gameId}`}
            options={roomOptions}
            selectedValueMode='roomWithMembers'
            showSizeColumn
            greyAssignedOptions
            onChange={(roomId) =>
              onGameRoomChange({
                gameId: row.original.gameId,
                slotId: row.original.slotId,
                roomId,
              })
            }
          />
        ),
      },
    ],
    [isMutationPending, roomOptions, onGameRoomChange],
  )

  const renderExpandedContent = (row: Row<ManualGameRoomAssignmentRow>) => {
    const memberRows: Array<ManualGameMemberRow> = [...row.original.members]
      .sort((left, right) => Number(right.gm) - Number(left.gm) || left.memberName.localeCompare(right.memberName))
      .map((member) => ({
        id: member.id,
        memberName: member.memberName,
        roleLabel: member.roleLabel,
      }))

    return (
      <Box sx={{ py: 1 }}>
        <Table<ManualGameMemberRow>
          name={`manual-game-room-assignment-members-${row.original.gameId}`}
          data={memberRows}
          columns={expandedColumns}
          keyField='id'
          disableStatePersistence
          enableSorting={false}
          enablePagination={false}
          enableRowSelection={false}
          enableGrouping={false}
          enableColumnFilters={false}
          enableGlobalFilter={false}
          enableFilters={false}
          displayPagination='never'
          compact
          elevation={0}
          debug={false}
          systemActions={[]}
          toolbarActions={[]}
          displayGutter={false}
          scrollBehavior='none'
          variant='outlined'
        />
      </Box>
    )
  }

  return (
    <RoomAssignmentsPaneShell
      title='Manual Game Room Assignment'
      subtitle={`Default room assignments for Slot ${slotId}.`}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <Table<ManualGameRoomAssignmentRow>
        name='room-assignment-manual-game-room-assignments'
        data={rows}
        columns={columns}
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
        renderExpandedContent={renderExpandedContent}
        expandedContentSx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRight: 'none',
          px: 0,
          py: 0,
        }}
        getRowCanExpand={(row) => row.original.members.length > 0}
        scrollBehavior='bounded'
        sx={{ flex: 1 }}
      />
    </RoomAssignmentsPaneShell>
  )
}

export default ManualGameRoomAssignmentPane
