import { GraphQLError, Loader, Page, Table, numeric } from 'components/Acnw'
import get from 'lodash/get'
import React from 'react'

import {
  GetGames_games_edges_node,
  GetGames_games_edges_node_gameAssignments_nodes
} from '../../../__generated__/GetGames'
import { useGameQuery } from '../../../client/queries'

const getGms = (row: GetGames_games_edges_node) => {
  const playersOrEmpty = row.gameAssignments.nodes
  if (playersOrEmpty && playersOrEmpty.length) {
    const players = playersOrEmpty as GetGames_games_edges_node_gameAssignments_nodes[]
    return players
      .filter(val => val.gm !== 0)
      .map(val => get(val, 'member.user.profile.fullName', ''))
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

  return (
    <Page>
      <Table
        name='games'
        data={list}
        columns={columns}
        // onAdd={onAdd}
        // onDelete={(selection: number[]) => onDelete(selection, list)}
        // onEdit={(selection: number[]) => onEdit(selection, list)}
      />
    </Page>
  )
}
