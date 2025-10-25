import type { GameRoom } from '@amber/client'
import { useTRPC, useInvalidateGameRoomQueries } from '@amber/client'
import { YesBlankCell } from '@amber/ui/components/CellFormatters'
import { Table } from '@amber/ui/components/Table'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { GameRoomsDialog } from './GameRoomsDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

const columns: ColumnDef<GameRoom>[] = [
  {
    accessorKey: 'description',
  },
  {
    accessorKey: 'size',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'type',
  },
  {
    accessorKey: 'updated',
    cell: YesBlankCell,
  },
]

const GameRooms = () => {
  const trpc = useTRPC()
  const deleteGameRoom = useMutation(trpc.gameRooms.deleteGameRoom.mutationOptions())
  const { isLoading, isFetching, error, data = [], refetch } = useQuery(trpc.gameRooms.getGameRooms.queryOptions())
  const invalidateGameRoomQueries = useInvalidateGameRoomQueries()

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } = useStandardHandlers<GameRoom>({
    deleteHandler: (selectedRows) => selectedRows.map((row) => deleteGameRoom.mutateAsync({ id: row.id })),
    invalidateQueries: invalidateGameRoomQueries,
  })

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Game Rooms' variant='fill' hideTitle>
      {showEdit && <GameRoomsDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table<GameRoom>
        title='Game Rooms'
        name='gameRooms'
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
        enableGrouping={false}
      />
    </Page>
  )
}

export default GameRooms
