import { useMemo, useState } from 'react'

import { SelectColumnFilter, Table } from '@amber/ui/components/Table'
import { Box, Button, Checkbox } from '@mui/material'
import type { ColumnDef, TableState } from '@tanstack/react-table'

import RoomAssignmentsPaneShell from './RoomAssignmentsPaneShell'

import type { RoomSlotAvailabilityRow } from '../types'

type RoomSlotAvailabilityCheckboxCellProps = {
  roomId: number
  roomDescription: string
  slotId: number
  checked: boolean
  onChange: (args: { roomId: number; slotId: number; isAvailable: boolean }) => Promise<void>
}

const RoomSlotAvailabilityCheckboxCell = ({
  roomId,
  roomDescription,
  slotId,
  checked,
  onChange,
}: RoomSlotAvailabilityCheckboxCellProps) => (
  <Checkbox
    checked={checked}
    size='small'
    onChange={(_event, nextChecked) => {
      onChange({
        roomId,
        slotId,
        isAvailable: nextChecked,
      }).catch(() => undefined)
    }}
    slotProps={{
      input: {
        'aria-label': `Room ${roomDescription} slot ${slotId} availability`,
      },
    }}
    sx={{ py: 0 }}
  />
)

type RoomSlotAvailabilityPaneProps = {
  isExpanded: boolean
  onToggleExpand: () => void
  rows: Array<RoomSlotAvailabilityRow>
  isLoading: boolean
  isFetching: boolean
  slotIds: Array<number>
  onRoomSlotAvailabilityChange: (args: { roomId: number; slotId: number; isAvailable: boolean }) => Promise<void>
  onSetAllRoomsFullAvailability: (roomIds: Array<number>) => Promise<void>
}

const RoomSlotAvailabilityPane = ({
  isExpanded,
  onToggleExpand,
  rows,
  isLoading,
  isFetching,
  slotIds,
  onRoomSlotAvailabilityChange,
  onSetAllRoomsFullAvailability,
}: RoomSlotAvailabilityPaneProps) => {
  const [tableState, setTableState] = useState<TableState | undefined>(undefined)

  const globalFilterSearch = useMemo(() => {
    const globalFilterValue = tableState?.globalFilter

    if (typeof globalFilterValue === 'string') {
      return globalFilterValue.toLowerCase().trim()
    }

    if (
      typeof globalFilterValue === 'object' &&
      globalFilterValue &&
      'value' in globalFilterValue &&
      typeof globalFilterValue.value === 'string'
    ) {
      return globalFilterValue.value.toLowerCase().trim()
    }

    return ''
  }, [tableState?.globalFilter])

  const roomTypeFilterValues = useMemo(() => {
    const roomTypeColumnFilter = tableState?.columnFilters?.find((columnFilter) => columnFilter.id === 'roomType')

    if (Array.isArray(roomTypeColumnFilter?.value)) {
      return roomTypeColumnFilter.value.map((filterValue) => String(filterValue))
    }

    if (roomTypeColumnFilter?.value) {
      return [String(roomTypeColumnFilter.value)]
    }

    return []
  }, [tableState?.columnFilters])

  const filteredRoomIds = useMemo(
    () =>
      rows
        .filter((roomSlotAvailabilityRow) => {
          if (roomTypeFilterValues.length > 0 && !roomTypeFilterValues.includes(roomSlotAvailabilityRow.roomType)) {
            return false
          }

          if (!globalFilterSearch) {
            return true
          }

          return (
            roomSlotAvailabilityRow.roomDescription.toLowerCase().includes(globalFilterSearch) ||
            roomSlotAvailabilityRow.roomType.toLowerCase().includes(globalFilterSearch)
          )
        })
        .map((roomSlotAvailabilityRow) => roomSlotAvailabilityRow.roomId),
    [globalFilterSearch, roomTypeFilterValues, rows],
  )

  const columns = useMemo<Array<ColumnDef<RoomSlotAvailabilityRow>>>(() => {
    const baseColumns: Array<ColumnDef<RoomSlotAvailabilityRow>> = [
      {
        accessorKey: 'roomDescription',
        header: 'Room',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'roomType',
        header: 'Room Type',
        meta: {
          filterFlags: {
            filterRender: SelectColumnFilter,
            options: [...new Set(rows.map((row) => row.roomType))].sort((left, right) => left.localeCompare(right)),
            alwaysShow: true,
          },
        },
      },
    ]

    const slotColumns = slotIds.map(
      (slotId): ColumnDef<RoomSlotAvailabilityRow> => ({
        id: `slot_${slotId}`,
        header: `Slot ${slotId}`,
        size: 80,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <RoomSlotAvailabilityCheckboxCell
            roomId={row.original.roomId}
            roomDescription={row.original.roomDescription}
            slotId={slotId}
            checked={row.original.slotAvailabilityBySlotId[slotId] ?? true}
            onChange={onRoomSlotAvailabilityChange}
          />
        ),
      }),
    )

    return [...baseColumns, ...slotColumns]
  }, [onRoomSlotAvailabilityChange, rows, slotIds])

  return (
    <RoomAssignmentsPaneShell
      title='Room Slot Availability'
      subtitle='Toggle room availability by slot for this year. This is mostly informational and does not block assignments.'
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
        <Button
          size='small'
          variant='outlined'
          disabled={filteredRoomIds.length === 0}
          onClick={() => {
            onSetAllRoomsFullAvailability(filteredRoomIds).catch(() => undefined)
          }}
        >
          Set All Rooms Full Availability
        </Button>
      </Box>
      <Table<RoomSlotAvailabilityRow>
        name='room-assignment-slot-availability'
        data={rows}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        handleStateChange={setTableState}
        enableRowSelection={false}
        enableGrouping={false}
        enableGlobalFilter
        enableColumnFilters
        enableFilters
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

export default RoomSlotAvailabilityPane
