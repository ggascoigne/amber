import { GraphQLError, Loader, Page, Table, numeric } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import { Row, TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../../types/react-table-config'
import {
  GetGames_games_edges_node,
  GetGames_games_edges_node_gameAssignments_nodes
} from '../../../__generated__/GetGames'
import { useDeleteGame, useGameQuery } from '../../../client/queries'
import { GamesDialog } from './GamesDialog'

const getGms = (row: GetGames_games_edges_node) => {
  const playersOrEmpty = row.gameAssignments.nodes
  if (playersOrEmpty && playersOrEmpty.length) {
    const players = playersOrEmpty as GetGames_games_edges_node_gameAssignments_nodes[]
    return players
      .filter(val => val.gm !== 0)
      .map(val => val?.member?.user?.profile?.fullName || '')
      .join(', ')
  } else {
    return ''
  }
}

const columns = [
  {
    accessor: 'id',
    width: 100,
    filter: numeric
  },
  {
    accessor: 'slotId',
    width: 100,
    filter: numeric
  },
  {
    accessor: 'name'
  },
  {
    id: 'GM',
    accessor: getGms
  },
  {
    accessor: 'description'
  },
  {
    accessor: 'estimatedLength',
    width: 100,
    filter: numeric
  },
  {
    accessor: 'playerMax',
    width: 100,
    align: 'right',
    filter: numeric
  },
  {
    accessor: 'playerMin',
    width: 100,
    align: 'right',
    filter: numeric
  },
  {
    accessor: 'year',
    width: 100,
    align: 'right',
    filter: numeric
  }
]

export const Games: React.FC = () => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<GetGames_games_edges_node[]>([])
  const [deleteGame] = useDeleteGame()
  const { loading, error, data } = useGameQuery({
    year: 2018
  })

  if (loading || !data) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const { games } = data!

  const list: GetGames_games_edges_node[] = games!.edges.map(v => v.node).filter(i => i) as GetGames_games_edges_node[]

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<GetGames_games_edges_node>) => () => {
    const toDelete = instance.selectedFlatRows.map(r => r.original)
    const updater = toDelete.map(g => {
      return deleteGame({ variables: { input: { id: g.id } } })
    })
    Promise.all(updater).then(() => console.log('deleted'))
  }

  const onEdit = (instance: TableInstance<GetGames_games_edges_node>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map(r => r.original))
  }

  const onClick = (row: Row<GetGames_games_edges_node>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page>
      {showEdit && <GamesDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<GetGames_games_edges_node>
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
}
