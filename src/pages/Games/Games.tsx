import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import type { Column, Row, TableInstance } from 'react-table'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import {
  GameFieldsFragment,
  GameGmsFragment,
  useDeleteGameMutation,
  useGetGamesByYearQuery,
  useYearFilterQuery,
} from '../../client'
import { configuration } from '../../utils'
import { GamesDialog } from './GamesDialog'

type Game = GameFieldsFragment & GameGmsFragment

const getGms = (row: Game) => {
  const playersOrEmpty = row.gameAssignments.nodes
  if (playersOrEmpty && playersOrEmpty.length) {
    return playersOrEmpty
      .filter((val) => val)
      .filter((val) => val!.gm !== 0)
      .map((val) => val?.member?.user?.fullName || '')
      .join(', ')
  } else {
    return ''
  }
}

const columns: Column<Game>[] = [
  {
    accessor: 'id',
    width: 100,
    filter: 'numeric',
  },
  {
    accessor: 'slotId',
    width: 100,
    filter: 'numeric',
  },
  {
    accessor: 'name',
  },
  {
    id: 'GM',
    accessor: getGms,
  },
  {
    accessor: 'description',
  },
  {
    accessor: 'estimatedLength',
    width: 100,
    filter: 'numeric',
  },
  {
    accessor: 'playerMax',
    width: 100,
    align: 'right',
    filter: 'numeric',
  },
  {
    accessor: 'playerMin',
    width: 100,
    align: 'right',
    filter: 'numeric',
  },
  {
    accessor: 'year',
    width: 100,
    align: 'right',
    filter: 'numeric',
  },
]

export const Games: React.FC = React.memo(() => {
  const { data: yearQueryData } = useYearFilterQuery()
  const year = yearQueryData?.yearDetails?.year || configuration.year
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Game[]>([])
  const [deleteGame] = useDeleteGameMutation()
  const { loading, error, data } = useGetGamesByYearQuery({
    variables: {
      year,
    },
  })

  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading || !data) {
    return <Loader />
  }

  const { games } = data!

  const list: Game[] = games!.edges.map((v) => v.node).filter((i) => i) as Game[]

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Game>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((g) => deleteGame({ variables: { input: { id: g.id } } }))
    Promise.all(updater).then(() => console.log('deleted'))
  }

  const onEdit = (instance: TableInstance<Game>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Game>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page>
      {showEdit && <GamesDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<Game>
        name='games'
        data={list}
        columns={columns}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
      />
    </Page>
  )
})
