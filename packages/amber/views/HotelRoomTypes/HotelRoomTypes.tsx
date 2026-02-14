import type React from 'react'
import { useMemo } from 'react'

import type { HotelRoom } from '@amber/client'
import { useTRPC } from '@amber/client'
import { notEmpty } from '@amber/ui'
import { YesBlankCell } from '@amber/ui/components/CellFormatters'
import { Table, TooltipCell, getCellSx } from '@amber/ui/components/Table'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

import { HotelRoomTypeDialog } from './HotelRoomTypeDialog'

import { useInvalidateHotelRoomsQueries } from '../../../client/src/invalidate'
import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useYearFilter } from '../../utils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'
import { useAvailableHotelRooms } from '../HotelRoomDetails/HotelRoomDetails'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RequestedNames: React.FC<{ names: string[] }> = ({ names }) => (
  <>
    Requested by
    <br />
    <ul>
      {names.map((n) => (
        <li key={`${n}`}>{n}</li>
      ))}
    </ul>
  </>
)

export const RequestedRoomCell = (props: CellContext<HotelRoom, number>) => {
  const value = props.getValue<number>() ?? 0
  const trpc = useTRPC()
  const hotelRoomId = props.row.original.id
  const [year] = useYearFilter()
  const sx = getCellSx(props)

  const { data } = useQuery(
    trpc.memberships.getMembershipByYearAndRoom.queryOptions(
      {
        year,
        hotelRoomId,
      },
      {
        enabled: value > 0,
      },
    ),
  )
  const names = data
    ?.filter(notEmpty)
    .map((m) => m.user?.fullName)
    .filter(notEmpty)
  const tooltipContent = names?.length ? names.join(', ') : String(value)
  return <TooltipCell text={String(value)} sx={sx} tooltip={tooltipContent} />
}

const HotelRoomTypes = () => {
  const trpc = useTRPC()
  const { getAvailableFromTotal, getAvailableFromQuantity, getTotal, getRequested } = useAvailableHotelRooms()

  const columns: ColumnDef<HotelRoom>[] = useMemo(
    () => [
      {
        header: 'General',
        columns: [
          {
            accessorKey: 'id',
            header: 'ID',
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
          {
            accessorKey: 'description',
            header: 'Description',
            enableGrouping: false,
          },
          {
            accessorKey: 'rate',
            header: 'Rate',
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
          {
            accessorKey: 'occupancy',
            header: 'Occupancy',
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
          {
            id: 'requested',
            header: 'Requested',
            accessorFn: (row) => getRequested(row),
            cell: RequestedRoomCell,
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
        ],
      },
      {
        header: 'Pre Allocation',
        columns: [
          {
            id: 'availableFromQuantity',
            header: 'Available',
            accessorFn: (row) => getAvailableFromQuantity(row),
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
          {
            accessorKey: 'quantity',
            header: 'Quantity',
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
        ],
      },
      {
        header: 'Room associations',
        columns: [
          {
            id: 'available',
            header: 'Available',
            accessorFn: (row) => getAvailableFromTotal(row),
            enableGrouping: false,
            meta: { align: 'right' as const },
          },
          {
            id: 'total',
            header: 'Total',
            enableGrouping: false,
            accessorFn: (row) => getTotal(row),
            meta: { align: 'right' as const },
          },
        ],
      },
      {
        header: 'Types',
        columns: [
          {
            accessorKey: 'gamingRoom',
            header: 'Gaming Room',
            cell: YesBlankCell,
          },
          {
            accessorKey: 'bathroomType',
            header: 'Bathroom Type',
          },
          {
            accessorKey: 'type',
            header: 'Type',
          },
        ],
      },
    ],
    [getAvailableFromQuantity, getAvailableFromTotal, getRequested, getTotal],
  )

  const deleteHotelRoom = useMutation(trpc.hotelRooms.deleteHotelRoom.mutationOptions())

  const { isLoading, isFetching, error, data = [], refetch } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } = useStandardHandlers<HotelRoom>({
    deleteHandler: (selectedRows) => selectedRows.map((row) => deleteHotelRoom.mutateAsync({ id: row.id })),
    invalidateQueries: useInvalidateHotelRoomsQueries,
  })

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Hotel Room Types' variant='fill' hideTitle>
      {showEdit && <HotelRoomTypeDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table<HotelRoom>
        title='Hotel Room Types'
        name='hotelRooms'
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
      />
    </Page>
  )
}

export default HotelRoomTypes
