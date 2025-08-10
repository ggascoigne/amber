import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { useTRPC, HotelRoomDetails as HotelRoomDetailsType, HotelRoom } from '@amber/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { Loader, notEmpty, Page, Table, YesBlankCell } from 'ui'

import { HotelRoomDetailDialog } from './HotelRoomDetailDialog'

import { TransportError } from '../../components/TransportError'
import { TableMouseEventHandler } from '../../types/react-table-config'
import { useFlag, useYearFilter } from '../../utils'

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
  return { getRoomAvailable, getAvailableFromTotal, getAvailableFromQuantity, getRequested, getTotal }
}

const columns: Column<HotelRoomDetailsType>[] = [
  {
    accessor: 'name',
  },
  {
    accessor: 'roomType',
  },
  {
    accessor: 'comment',
  },
  {
    accessor: 'reservedFor',
  },
  {
    accessor: 'bathroomType',
  },
  {
    accessor: 'gamingRoom',
    Cell: YesBlankCell,
    sortType: 'basic',
  },
  {
    accessor: 'enabled',
    Cell: YesBlankCell,
    sortType: 'basic',
  },
  {
    accessor: 'formattedRoomType',
  },
  {
    accessor: 'internalRoomType',
  },
  {
    accessor: 'reserved',
    Cell: YesBlankCell,
    sortType: 'basic',
  },
]

const HotelRoomDetails = () => {
  const trpc = useTRPC()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<HotelRoomDetailsType[]>([])

  const deleteHotelRoomDetail = useMutation(trpc.hotelRoomDetails.deleteHotelRoomDetail.mutationOptions())
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useQuery(trpc.hotelRoomDetails.getHotelRoomDetails.queryOptions())

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list = data.filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries({ queryKey: trpc.hotelRoomDetails.getHotelRoomDetails.queryKey() })
  }

  const onAdd: TableMouseEventHandler<HotelRoomDetailsType> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<HotelRoomDetailsType>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((v) => deleteHotelRoomDetail.mutateAsync({ id: v.id }))
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      clearSelectionAndRefresh()
      instance.toggleAllRowsSelected(false)
    })
  }

  const onEdit = (instance: TableInstance<HotelRoomDetailsType>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<HotelRoomDetailsType>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Hotel Rooms'>
      {showEdit && <HotelRoomDetailDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<HotelRoomDetailsType>
        name='hotelRoomDetails'
        data={list}
        columns={columns}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
}

export default HotelRoomDetails
