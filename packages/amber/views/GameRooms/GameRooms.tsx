import React, { MouseEventHandler, useCallback, useState } from 'react'

import { useTRPC, GameRoom, useInvalidateGameRoomQueries } from '@amber/client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { Loader, Page, Table, YesBlankCell } from 'ui'

import { GameRoomsDialog } from './GameRoomsDialog'

import { TransportError } from '../../components/TransportError'
import { TableMouseEventHandler } from '../../types/react-table-config'

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

const GameRooms = () => {
  const trpc = useTRPC()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<GameRoom[]>([])

  const deleteGameRoom = useMutation(trpc.gameRooms.deleteGameRoom.mutationOptions())
  const { isLoading, error, data, refetch } = useQuery(trpc.gameRooms.getGameRooms.queryOptions())
  const invalidateGameRoomQueries = useInvalidateGameRoomQueries()

  const clearSelectionAndRefresh = useCallback(() => {
    setSelection([])
    invalidateGameRoomQueries()
  }, [invalidateGameRoomQueries])

  const onAdd: TableMouseEventHandler<GameRoom> = useCallback(
    () => () => {
      setShowEdit(true)
    },
    [],
  )

  const onCloseEdit: MouseEventHandler = useCallback(() => {
    setShowEdit(false)
    clearSelectionAndRefresh()
  }, [clearSelectionAndRefresh])

  const onDelete = useCallback(
    (instance: TableInstance<GameRoom>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((v) => deleteGameRoom.mutateAsync({ id: v.id }))
      Promise.allSettled(updater).then(() => {
        console.log('deleted')
        clearSelectionAndRefresh()
        instance.toggleAllRowsSelected(false)
      })
    },
    [clearSelectionAndRefresh, deleteGameRoom],
  )

  const onEdit = useCallback(
    (instance: TableInstance<GameRoom>) => () => {
      setShowEdit(true)
      setSelection(instance.selectedFlatRows.map((r) => r.original))
    },
    [],
  )

  const onClick = useCallback((row: Row<GameRoom>) => {
    setShowEdit(true)
    setSelection([row.original])
  }, [])

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  return (
    <Page title='Game Rooms'>
      {showEdit && <GameRoomsDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<GameRoom>
        name='gameRooms'
        data={data}
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
