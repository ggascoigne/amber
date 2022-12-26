import React, { MouseEventHandler, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CellProps, Column, Row, TableInstance } from 'react-table'

import { GqlType, GraphQLError, Loader, notEmpty, Page, Table, TooltipCell, YesBlankCell } from 'ui'
import { TableMouseEventHandler } from '../../types/react-table-config'
import {
  GetHotelRoomsQuery,
  useDeleteHotelRoomMutation,
  useGetHotelRoomsQuery,
  useGetMembershipByYearAndRoomQuery,
} from '../../client'
import { useYearFilter } from '../../utils'
import { useAvailableHotelRooms } from '../HotelRoomDetails/HotelRoomDetails'
import { HotelRoomTypeDialog } from './HotelRoomTypeDialog'

export type HotelRoom = GqlType<GetHotelRoomsQuery, ['hotelRooms', 'edges', number, 'node']>

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

export const RequestedRoomCell: React.FC<CellProps<HotelRoom>> = ({
  cell: { value, row },
  column: { align = 'left' },
}: CellProps<any>) => {
  const hotelRoomId = row.original.id
  const [year] = useYearFilter()

  const { data } = useGetMembershipByYearAndRoomQuery(
    {
      year,
      hotelRoomId,
    },
    {
      enabled: value > 0,
    }
  )
  const names = data?.memberships?.nodes
    .filter(notEmpty)
    .map((m) => m.user?.fullName)
    .filter(notEmpty)
  const tooltip = names?.length ? <RequestedNames names={names} /> : value
  return <TooltipCell text={value} align={align} tooltip={tooltip} />
}

const HotelRoomTypes: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<HotelRoom[]>([])
  const { getAvailableFromTotal, getAvailableFromQuantity, getTotal, getRequested } = useAvailableHotelRooms()

  const columns: Column<HotelRoom>[] = useMemo(
    () => [
      {
        Header: 'General',
        columns: [
          {
            accessor: 'id',
          },
          {
            accessor: 'description',
          },
          {
            accessor: 'rate',
          },
          {
            accessor: 'occupancy',
          },
          {
            id: 'requested',
            accessor: (row: HotelRoom) => getRequested(row),
            Cell: RequestedRoomCell,
          },
        ],
      },
      {
        Header: 'Pre Allocation',
        columns: [
          {
            id: 'availableFromQuantity',
            Header: 'Available',
            accessor: (row: HotelRoom) => getAvailableFromQuantity(row),
          },
          {
            accessor: 'quantity',
          },
        ],
      },
      {
        Header: 'Room associations',
        columns: [
          {
            id: 'available',
            accessor: (row: HotelRoom) => getAvailableFromTotal(row),
          },
          {
            id: 'total',
            accessor: (row: HotelRoom) => getTotal(row),
          },
        ],
      },
      {
        Header: 'Types',
        columns: [
          {
            accessor: 'gamingRoom',
            Cell: YesBlankCell,
            sortType: 'basic',
          },
          {
            accessor: 'bathroomType',
          },
          {
            accessor: 'type',
          },
        ],
      },
    ],
    [getAvailableFromTotal, getAvailableFromQuantity, getRequested, getTotal]
  )

  const deleteHotelRoom = useDeleteHotelRoomMutation()
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGetHotelRoomsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: HotelRoom[] = data.hotelRooms!.edges.map((v) => v.node).filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries(['getHotelRooms'])
  }

  const onAdd: TableMouseEventHandler<HotelRoom> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<HotelRoom>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((v) => deleteHotelRoom.mutateAsync({ input: { id: v.id } }))
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      clearSelectionAndRefresh()
      instance.toggleAllRowsSelected(false)
    })
  }

  const onEdit = (instance: TableInstance<HotelRoom>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<HotelRoom>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Hotel Room Types'>
      {showEdit && <HotelRoomTypeDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<HotelRoom>
        name='hotelRooms'
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

export default HotelRoomTypes
