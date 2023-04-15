import React, { MouseEventHandler, useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { GqlType, GraphQLError, Loader, notEmpty, Page, Table, YesBlankCell } from 'ui'

import { GameRoomsDialog } from './GameRoomsDialog'

import { GetGameRoomsQuery, useDeleteGameRoomMutation, useGetGameRoomsQuery } from '../../client'
import { TableMouseEventHandler } from '../../types/react-table-config'

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

  const clearSelectionAndRefresh = useCallback(() => {
    setSelection([])
    // noinspection JSIgnoredPromiseFromCall
    queryClient.invalidateQueries(['getGameRooms'])
  }, [queryClient])

  const onAdd: TableMouseEventHandler<GameRoom> = useCallback(
    () => () => {
      setShowEdit(true)
    },
    []
  )

  const onCloseEdit: MouseEventHandler = useCallback(() => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }, [clearSelectionAndRefresh])

  const onDelete = useCallback(
    (instance: TableInstance<GameRoom>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((v) => deleteGameRoom.mutateAsync({ input: { id: v.id } }))
      Promise.allSettled(updater).then(() => {
        console.log('deleted')
        clearSelectionAndRefresh()
        instance.toggleAllRowsSelected(false)
      })
    },
    [clearSelectionAndRefresh, deleteGameRoom]
  )

  const onEdit = useCallback(
    (instance: TableInstance<GameRoom>) => () => {
      setShowEdit(true)
      setSelection(instance.selectedFlatRows.map((r) => r.original))
    },
    []
  )

  const onClick = useCallback((row: Row<GameRoom>) => {
    setShowEdit(true)
    setSelection([row.original])
  }, [])

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const list: GameRoom[] = data.rooms!.nodes.filter(notEmpty)

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
