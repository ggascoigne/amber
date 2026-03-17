import { useMemo } from 'react'

import { Table } from '@amber/ui/components/Table'
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material'
import type { ColumnDef } from '@tanstack/react-table'

import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'
import RoomNameWithMembersCell from './RoomNameWithMembersCell'

import type { RoomMemberAssignmentRow } from '../types'

type RoomMemberMultiSelectCellProps = {
  roomId: number
  assignedMemberIds: Array<number>
  memberOptions: Array<{ id: number; fullName: string }>
  isMutationPending: boolean
  onChange: (args: { roomId: number; memberIds: Array<number> }) => Promise<void>
}

const RoomMemberMultiSelectCell = ({
  roomId,
  assignedMemberIds,
  memberOptions,
  isMutationPending,
  onChange,
}: RoomMemberMultiSelectCellProps) => {
  const memberOptionById = useMemo(
    () => new Map(memberOptions.map((memberOption) => [memberOption.id, memberOption])),
    [memberOptions],
  )
  const selectedMemberOptions = useMemo(
    () =>
      assignedMemberIds
        .map((assignedMemberId) => memberOptionById.get(assignedMemberId))
        .filter((memberOption) => !!memberOption),
    [assignedMemberIds, memberOptionById],
  )
  const selectedMemberLabel = useMemo(
    () => selectedMemberOptions.map((memberOption) => memberOption.fullName).join(', '),
    [selectedMemberOptions],
  )

  return (
    <Autocomplete<{ id: number; fullName: string }, true, false, false>
      multiple
      disableCloseOnSelect
      size='small'
      options={memberOptions}
      value={selectedMemberOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.fullName}
      filterSelectedOptions={false}
      disabled={isMutationPending}
      onChange={(_event, nextValue) => {
        const nextMemberIds = [...new Set(nextValue.map((memberOption) => memberOption.id))]

        onChange({
          roomId,
          memberIds: nextMemberIds,
        }).catch(() => undefined)
      }}
      renderTags={() => (
        <Box
          component='span'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedMemberLabel}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='standard'
          size='small'
          placeholder={selectedMemberOptions.length === 0 ? 'Unassigned' : ''}
          inputProps={{
            ...params.inputProps,
            'aria-label': `Assign members to room ${roomId}`,
          }}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
              padding: 0,
              minHeight: 0,
              height: '100%',
              alignItems: 'center',
              flexWrap: 'nowrap',
            },
            '& .MuiInputBase-input': {
              padding: 0,
              lineHeight: 'inherit',
              boxSizing: 'border-box',
              minWidth: '2ch',
            },
          }}
          onClick={(event) => event.stopPropagation()}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <Box
          component='li'
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
          }}
        >
          <Checkbox checked={selected} size='small' sx={{ mr: 1 }} />
          {option.fullName}
        </Box>
      )}
      sx={{
        minWidth: 360,
        '& .MuiAutocomplete-inputRoot': {
          padding: '0 !important',
        },
        '& .MuiAutocomplete-endAdornment': {
          right: 0,
        },
      }}
    />
  )
}

type AssignMembersToRoomsPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  rows: Array<RoomMemberAssignmentRow>
  isLoading: boolean
  isFetching: boolean
  isMutationPending: boolean
  memberOptions: Array<{ id: number; fullName: string }>
  onRoomEnabledChange: (args: { roomId: number; enabled: boolean }) => Promise<void>
  onRoomMembersChange: (args: { roomId: number; memberIds: Array<number> }) => Promise<void>
}

const AssignMembersToRoomsPane = ({
  isExpanded,
  onToggleExpand,
  rows,
  isLoading,
  isFetching,
  isMutationPending,
  memberOptions,
  onRoomEnabledChange,
  onRoomMembersChange,
}: AssignMembersToRoomsPaneProps) => {
  const columns = useMemo<Array<ColumnDef<RoomMemberAssignmentRow>>>(
    () => [
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
        accessorKey: 'roomType',
        header: 'Room Type',
      },
      {
        accessorKey: 'enabled',
        header: 'Enabled',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.enabled}
            size='small'
            disabled={isMutationPending}
            onChange={(_event, nextChecked) => {
              onRoomEnabledChange({
                roomId: row.original.roomId,
                enabled: nextChecked,
              }).catch(() => undefined)
            }}
            inputProps={{
              'aria-label': `Enable room ${row.original.roomDescription}`,
            }}
            sx={{ py: 0 }}
          />
        ),
      },
      {
        id: 'assignedMembers',
        header: 'Assigned Members',
        cell: ({ row }) => (
          <RoomMemberMultiSelectCell
            roomId={row.original.roomId}
            assignedMemberIds={row.original.assignedMemberIds}
            memberOptions={memberOptions}
            isMutationPending={isMutationPending}
            onChange={onRoomMembersChange}
          />
        ),
      },
    ],
    [isMutationPending, memberOptions, onRoomEnabledChange, onRoomMembersChange],
  )

  return (
    <RoomAssignmentsPaneShell
      title='Assign Members to Rooms'
      subtitle='Assign one or more attending members to each room.'
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <Table<RoomMemberAssignmentRow>
        name='room-assignment-room-member-assignments'
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

export default AssignMembersToRoomsPane
