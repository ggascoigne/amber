import { useMemo } from 'react'

import { Table } from '@amber/ui/components/Table'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Typography } from '@mui/material'
import type { ColumnDef, Row } from '@tanstack/react-table'

import RoomAssignmentSelect from './RoomAssignmentSelect'
import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'
import RoomNameWithMembersCell from './RoomNameWithMembersCell'

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
  onAddOverrideRoom: (args: { gameId: number; slotId: number; roomId: number | null }) => Promise<void>
  onRemoveRoomAssignment: (id: bigint) => Promise<void>
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

type ManualOverrideAssignmentsCellProps = {
  row: ManualGameRoomAssignmentRow
  roomOptions: Array<ManualRoomSelectOption>
  isMutationPending: boolean
  onAddOverrideRoom: (args: { gameId: number; slotId: number; roomId: number | null }) => Promise<void>
  onRemoveRoomAssignment: (id: bigint) => Promise<void>
}

const ManualOverrideAssignmentsCell = ({
  row,
  roomOptions,
  isMutationPending,
  onAddOverrideRoom,
  onRemoveRoomAssignment,
}: ManualOverrideAssignmentsCellProps) => {
  const assignedRoomIds = useMemo(
    () =>
      new Set([
        ...(row.currentRoomId ? [row.currentRoomId] : []),
        ...row.overrideAssignments.map((overrideAssignment) => overrideAssignment.roomId),
      ]),
    [row.currentRoomId, row.overrideAssignments],
  )
  const availableOverrideOptions = useMemo(
    () => roomOptions.filter((roomOption) => !assignedRoomIds.has(roomOption.id)),
    [assignedRoomIds, roomOptions],
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, width: '100%', minWidth: 0, overflow: 'hidden' }}>
      {row.overrideAssignments.map((overrideAssignment) => (
        <Box
          key={`${row.gameId}-${overrideAssignment.id.toString()}`}
          sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}
        >
          <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
            <RoomNameWithMembersCell
              roomDescription={overrideAssignment.roomDescription}
              assignedMemberNames={overrideAssignment.assignedMemberNames}
            />
          </Box>
          <IconButton
            size='small'
            aria-label={`Remove override room ${overrideAssignment.roomDescription} for game ${row.gameId}`}
            disabled={isMutationPending}
            onClick={() => {
              onRemoveRoomAssignment(overrideAssignment.id).catch(() => undefined)
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      ))}
      <RoomAssignmentSelect
        value={null}
        disabled={isMutationPending || availableOverrideOptions.length === 0}
        ariaLabel={`Add override room for game ${row.gameId}`}
        options={availableOverrideOptions}
        selectedValueMode='description'
        showSizeColumn
        greyAssignedOptions
        emptyDisplayLabel={availableOverrideOptions.length === 0 ? 'No override rooms available' : ''}
        includeEmptyOption={false}
        minWidth={220}
        onChange={(roomId) =>
          onAddOverrideRoom({
            gameId: row.gameId,
            slotId: row.slotId,
            roomId,
          })
        }
      />
    </Box>
  )
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
  onAddOverrideRoom,
  onRemoveRoomAssignment,
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
        size: 50,
        minSize: 50,
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
        accessorKey: 'currentRoomSize',
        header: 'Room Size',
        meta: {
          align: 'right',
        },
        size: 80,
        cell: ({ row }) => row.original.currentRoomSize ?? '',
      },
      {
        accessorKey: 'roomSpace',
        header: 'Room Space',
        meta: {
          align: 'right',
        },
        size: 90,
        cell: ({ row }) => row.original.roomSpace ?? '',
      },
      {
        id: 'assignRoom',
        header: 'Assign Room',
        size: 260,
        cell: ({ row }) => (
          <RoomAssignmentSelect
            value={row.original.currentRoomId}
            disabled={isMutationPending}
            ariaLabel={`Manual room assignment for game ${row.original.gameId}`}
            options={roomOptions}
            selectedValueMode='roomWithMembers'
            selectedValueSecondaryText={row.original.currentRoomAssignmentReason}
            showSizeColumn
            greyAssignedOptions
            minWidth={220}
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
      {
        id: 'overrideRooms',
        header: 'Override Rooms',
        size: 320,
        cell: ({ row }) => (
          <ManualOverrideAssignmentsCell
            row={row.original}
            roomOptions={roomOptions}
            isMutationPending={isMutationPending}
            onAddOverrideRoom={onAddOverrideRoom}
            onRemoveRoomAssignment={onRemoveRoomAssignment}
          />
        ),
      },
    ],
    [isMutationPending, onAddOverrideRoom, onGameRoomChange, onRemoveRoomAssignment, roomOptions],
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
      title='Room Assignment'
      subtitle={`Default and override room assignments for Slot ${slotId}.`}
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
