import { useCallback, useMemo } from 'react'

import type { HotelRoomDetails as HotelRoomDetailsType, HotelRoom } from '@amber/client'
import { useTRPC } from '@amber/client'
import { notEmpty } from '@amber/ui'
import { YesBlankCell } from '@amber/ui/components/CellFormatters'
import { Table } from '@amber/ui/components/Table'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { HotelRoomDetailDialog } from './HotelRoomDetailDialog'

import { useInvalidateHotelRoomDetailsQueries } from '../../../client/src/invalidate'
import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useFlag, useYearFilter } from '../../utils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

export const useAvailableHotelRooms = () => {
  const trpc = useTRPC()
  const { data: roomDetails } = useQuery(trpc.hotelRoomDetails.getHotelRoomDetails.queryOptions())
  const [year] = useYearFilter()
  const { data: roomsByMember } = useQuery(
    trpc.memberships.getMembershipRoomsByYear.queryOptions(
      {
        year,
      },
      { gcTime: 30 * 1000 },
    ),
  )
  const shouldUseRoomTotal = useFlag('dev_use_detail_rome_quantities', false)

  const rooms: HotelRoomDetailsType[] | undefined = useMemo(() => roomDetails?.filter(notEmpty), [roomDetails])
  const roomsInUse = useMemo(
    () =>
      roomsByMember
        ?.filter(notEmpty)
        .map((n) => n.hotelRoom)
        .filter(notEmpty),
    [roomsByMember],
  )

  const getTotal = useCallback(
    (room: HotelRoom): number => {
      function getAvailable(detail: HotelRoomDetailsType, r: HotelRoom): boolean {
        return (
          detail.gamingRoom === r.gamingRoom &&
          detail.bathroomType === r.bathroomType &&
          detail.roomType === r.type &&
          !detail.reserved
        )
      }

      if (room.id === 13 /* no room */ || room.id === 14 /* sharing */) return 999
      return rooms?.filter((detail) => getAvailable(detail, room)).length ?? 0
    },
    [rooms],
  )

  const getRequested = useCallback(
    (room: HotelRoom): number => {
      if (room.id === 13 /* no room */ || room.id === 14 /* sharing */) return 0
      return roomsInUse?.filter((h) => h.id === room.id).length ?? 0
    },
    [roomsInUse],
  )

  const getAvailableFromTotal = useCallback(
    (room: HotelRoom): number => getTotal(room) - getRequested(room),
    [getRequested, getTotal],
  )

  const getAvailableFromQuantity = useCallback(
    (room: HotelRoom): number => room.quantity - getRequested(room),
    [getRequested],
  )

  const getRoomAvailable = shouldUseRoomTotal ? getAvailableFromTotal : getAvailableFromQuantity
  return {
    getRoomAvailable,
    getAvailableFromTotal,
    getAvailableFromQuantity,
    getRequested,
    getTotal,
  }
}

const columns: ColumnDef<HotelRoomDetailsType>[] = [
  {
    accessorKey: 'name',
    enableGrouping: false,
  },
  {
    accessorKey: 'roomType',
  },
  {
    accessorKey: 'comment',
    enableGrouping: false,
  },
  {
    accessorKey: 'reservedFor',
    enableGrouping: false,
  },
  {
    accessorKey: 'bathroomType',
  },
  {
    accessorKey: 'gamingRoom',
    cell: YesBlankCell,
  },
  {
    accessorKey: 'enabled',
    cell: YesBlankCell,
  },
  {
    accessorKey: 'formattedRoomType',
    enableGrouping: false,
  },
  {
    accessorKey: 'internalRoomType',
  },
  {
    accessorKey: 'reserved',
    cell: YesBlankCell,
    enableGrouping: false,
  },
]

const HotelRoomDetails = () => {
  const trpc = useTRPC()
  const deleteHotelRoomDetail = useMutation(trpc.hotelRoomDetails.deleteHotelRoomDetail.mutationOptions())

  const {
    isLoading,
    isFetching,
    error,
    data = [],
    refetch,
  } = useQuery(trpc.hotelRoomDetails.getHotelRoomDetails.queryOptions())

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } =
    useStandardHandlers<HotelRoomDetailsType>({
      deleteHandler: (selectedRows) => selectedRows.map((row) => deleteHotelRoomDetail.mutateAsync({ id: row.id })),
      invalidateQueries: useInvalidateHotelRoomDetailsQueries,
    })

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Hotel Rooms' variant='fill' hideTitle>
      {showEdit && <HotelRoomDetailDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table<HotelRoomDetailsType>
        title='Hotel Rooms'
        name='hotelRoomDetails'
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

export default HotelRoomDetails
