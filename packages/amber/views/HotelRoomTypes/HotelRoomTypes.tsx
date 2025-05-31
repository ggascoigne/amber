import React, { MouseEventHandler, useMemo, useState } from 'react'

import { HotelRoom, useTRPC } from '@amber/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CellProps, Column, Row, TableInstance } from 'react-table'
import { Loader, notEmpty, Page, Table, TooltipCell, YesBlankCell } from 'ui'

import { HotelRoomTypeDialog } from './HotelRoomTypeDialog'

import { TransportError } from '../../components/TransportError'
import { TableMouseEventHandler } from '../../types/react-table-config'
import { useYearFilter } from '../../utils'
import { useAvailableHotelRooms } from '../HotelRoomDetails/HotelRoomDetails'

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
}) => {
  const trpc = useTRPC()
  const hotelRoomId = row.original.id
  const [year] = useYearFilter()

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
  const tooltip = names?.length ? <RequestedNames names={names} /> : value
  return <TooltipCell text={value} align={align} tooltip={tooltip} />
}

const HotelRoomTypes: React.FC = () => {
  const trpc = useTRPC()
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
    [getAvailableFromTotal, getAvailableFromQuantity, getRequested, getTotal],
  )

  const deleteHotelRoom = useMutation(trpc.hotelRooms.deleteHotelRoom.mutationOptions())
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list = data.filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    queryClient.invalidateQueries({ queryKey: trpc.hotelRooms.getHotelRooms.queryKey() })
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
    const updater = toDelete.map((v) => deleteHotelRoom.mutateAsync({ id: v.id }))
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
