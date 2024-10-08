import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { GqlType, GraphQLError, Loader, notEmpty, Page, Table, YesBlankCell } from 'ui'

import { HotelRoomDetailDialog } from './HotelRoomDetailDialog'

import {
  useGraphQL,
  useGraphQLMutation,
  GetHotelRoomDetailsQuery,
  DeleteHotelRoomDetailDocument,
  GetHotelRoomDetailsDocument,
  GetMembershipRoomsByYearDocument,
} from '../../client'
import { TableMouseEventHandler } from '../../types/react-table-config'
import { useFlag, useYearFilter } from '../../utils'
import { HotelRoom } from '../HotelRoomTypes/HotelRoomTypes'

export type HotelRoomDetail = GqlType<GetHotelRoomDetailsQuery, ['hotelRoomDetails', 'edges', number, 'node']>

export const useAvailableHotelRooms = () => {
  const { data: roomDetails } = useGraphQL(GetHotelRoomDetailsDocument)
  const [year] = useYearFilter()
  const { data: roomsByMember } = useGraphQL(
    GetMembershipRoomsByYearDocument,
    {
      year,
    },
    { gcTime: 30 * 1000 },
  )
  const shouldUseRoomTotal = useFlag('dev_use_detail_rome_quantities', false)

  const rooms: HotelRoomDetail[] | undefined = useMemo(
    () => roomDetails?.hotelRoomDetails?.edges.map((v) => v.node).filter(notEmpty),
    [roomDetails?.hotelRoomDetails],
  )
  const roomsInUse = useMemo(
    () =>
      roomsByMember?.memberships?.nodes
        ?.filter(notEmpty)
        .map((n) => n.hotelRoom)
        .filter(notEmpty),
    [roomsByMember?.memberships?.nodes],
  )

  const getTotal = useCallback(
    (room: HotelRoom): number => {
      function getAvailable(detail: HotelRoomDetail, r: HotelRoom): boolean {
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

const columns: Column<HotelRoomDetail>[] = [
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

const HotelRoomDetails: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<HotelRoomDetail[]>([])

  const deleteHotelRoomDetail = useGraphQLMutation(DeleteHotelRoomDetailDocument)
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGraphQL(GetHotelRoomDetailsDocument)

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: HotelRoomDetail[] = data.hotelRoomDetails!.edges.map((v) => v.node).filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries({ queryKey: ['getHotelRoomDetails'] })
  }

  const onAdd: TableMouseEventHandler<HotelRoomDetail> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<HotelRoomDetail>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((v) => deleteHotelRoomDetail.mutateAsync({ input: { id: v.id } }))
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      clearSelectionAndRefresh()
      instance.toggleAllRowsSelected(false)
    })
  }

  const onEdit = (instance: TableInstance<HotelRoomDetail>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<HotelRoomDetail>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Hotel Rooms'>
      {showEdit && <HotelRoomDetailDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<HotelRoomDetail>
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
