import React, { MouseEventHandler, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Column, Row, TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../types/react-table-config'
import { GetGameRoomsQuery, useDeleteGameRoomMutation, useGetGameRoomsQuery } from '../../client'
import { YesBlankCell } from '../../components/CellFormatters'
import { GraphQLError } from '../../components/GraphQLError'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { Table } from '../../components/Table'
import { GqlType, notEmpty } from '../../utils'
import { GameRoomsDialog } from './GameRoomsDialog'

export type GameRoom = GqlType<GetGameRoomsQuery, ['rooms', 'nodes', 0]>

const columns: Column<GameRoom>[] = [
  {
    accessor: 'description',
  },
  {
    accessor: 'size',
  },
  {
    accessor: 'type',
  },
  {
    accessor: 'updated',
    Cell: YesBlankCell,
    sortType: 'basic',
  },
]

const GameRooms: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<GameRoom[]>([])

  const deleteGameRoom = useDeleteGameRoomMutation()
  const queryClient = useQueryClient()

  const { isLoading, error, data, refetch } = useGetGameRoomsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: GameRoom[] = data.rooms!.nodes.filter(notEmpty)

  const clearSelectionAndRefresh = () => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries('getGameRooms')
  }

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }

  const onDelete = (instance: TableInstance<GameRoom>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((v) => deleteGameRoom.mutateAsync({ input: { id: v.id } }))
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      clearSelectionAndRefresh()
      instance.toggleAllRowsSelected(false)
    })
  }

  const onEdit = (instance: TableInstance<GameRoom>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<GameRoom>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Game Rooms'>
      {showEdit && <GameRoomsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<GameRoom>
        name='gameRooms'
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

export default GameRooms