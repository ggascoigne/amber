import React, { MouseEventHandler, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Column, Row, TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../types/react-table-config'
import { GetHotelRoomsQuery, useDeleteHotelRoomMutation, useGetHotelRoomsQuery } from '../../client'
import { YesBlankCell } from '../../components/CellFormatters'
import { GraphQLError } from '../../components/GraphQLError'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import { GqlType, notEmpty } from '../../utils'
import { HotelRoomTypeDialog } from './HotelRoomTypeDialog'

export type HotelRoom = GqlType<GetHotelRoomsQuery, ['hotelRooms', 'edges', number, 'node']>

const columns: Column<HotelRoom>[] = [
  {
    accessor: 'description',
  },
  {
    accessor: 'bathroomType',
  },
  {
    accessor: 'occupancy',
  },
  {
    // todo - this needs calculating from the hotelRoomDetails table
    accessor: 'quantity',
  },
  {
    accessor: 'gamingRoom',
    Cell: YesBlankCell,
    sortType: 'basic',
  },
  {
    accessor: 'rate',
  },
  {
    accessor: 'type',
  },
]

const HotelRoomTypes: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<HotelRoom[]>([])

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
    queryClient.invalidateQueries('getHotelRooms')
  }

  const onAdd: TableMouseEventHandler = () => () => {
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
