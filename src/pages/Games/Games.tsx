import { createStyles, makeStyles } from '@material-ui/core'
import CachedIcon from '@material-ui/icons/Cached'
import classnames from 'classnames'
import {
  GameFieldsFragment,
  GameGmsFragment,
  useDeleteGameMutation,
  useGetGamesByYearQuery,
  useGetMembershipsByYearQuery,
} from 'client'
import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import type { Column, Row, TableInstance, TableState } from 'react-table'
import { notEmpty, useYearFilterState } from 'utils'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import { YesBlankCell } from '../../components/Acnw/Table/CellFormatters'
import { useUpdateGameAssignment } from './gameHooks'
import { GamesDialog } from './GamesDialog'

type Game = GameFieldsFragment & GameGmsFragment

export const getGms = (row: Game) => {
  const playersOrEmpty = row.gameAssignments.nodes
  if (playersOrEmpty && playersOrEmpty.length) {
    return playersOrEmpty
      .filter((val) => val)
      .filter((val) => val!.gm !== 0)
      .map((val) => val?.member?.user?.fullName ?? '')
      .join(', ')
  } else {
    return ''
  }
}

const initialState: Partial<TableState<Game>> = {
  sortBy: [
    {
      id: 'slotId',
      desc: false,
    },
  ],
  hiddenColumns: [
    'genre',
    'type',
    'setting',
    'charInstructions',
    'playerPreference',
    'returningPlayers',
    'playersContactGm',
    'gameContactEmail',
    'slotPreference',
    'lateStart',
    'lateFinish',
    'slotConflicts',
    'message',
    'teenFriendly',
    'year',
    'full',
  ],
}

const columns: Column<Game>[] = [
  {
    accessor: 'id',
    width: 100,
    filter: 'numeric',
  },
  {
    accessor: 'slotId',
    Header: 'Slot',
    width: 100,
    filter: 'numeric',
  },
  {
    accessor: 'name',
  },
  {
    Header: 'GM Names',
    accessor: 'gmNames',
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
  { accessor: 'genre' },
  { accessor: 'type' },
  { accessor: 'setting' },
  { accessor: 'charInstructions' },
  { accessor: 'playerPreference' },
  { accessor: 'returningPlayers' },
  { accessor: 'playersContactGm' },
  { accessor: 'gameContactEmail' },
  { accessor: 'slotPreference' },
  { accessor: 'lateStart' },
  { accessor: 'lateFinish', Cell: YesBlankCell },
  { accessor: 'slotConflicts' },
  { accessor: 'message' },
  { accessor: 'teenFriendly', Cell: YesBlankCell },
  { accessor: 'full', Cell: YesBlankCell },
]

const useStyles = makeStyles(() =>
  createStyles({
    fixBusy: {
      color: 'red',
    },
  })
)
export const Games: React.FC = React.memo(() => {
  const year = useYearFilterState((state) => state.year)
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Game[]>([])
  const [deleteGame] = useDeleteGameMutation()
  const [fixBusy, setFixBusy] = useState(false)
  const classes = useStyles()
  const { loading, error, data, refetch } = useGetGamesByYearQuery({
    variables: {
      year,
    },
    fetchPolicy: 'cache-and-network',
  })
  const setGameGmAssignments = useUpdateGameAssignment()
  const { data: membershipData } = useGetMembershipsByYearQuery({
    variables: {
      year,
    },
  })

  const membershipList = useMemo(() => membershipData?.memberships?.nodes?.filter(notEmpty) ?? [], [
    membershipData?.memberships?.nodes,
  ])

  const onUpdateGmNames = useCallback(
    (instance: TableInstance<Game>) => async () => {
      setFixBusy(true)
      const selected = instance.selectedFlatRows.map((r) => r.original)
      const queue: Promise<any>[] = []
      selected.forEach((game) => {
        queue.push(setGameGmAssignments(game.id, game.gmNames, membershipList))
      })
      await Promise.all(queue)
      setFixBusy(false)
    },
    [membershipList, setGameGmAssignments]
  )

  const commands = useMemo(
    () => [
      {
        label: 'Fix GM Names',
        onClick: onUpdateGmNames,
        icon: <CachedIcon className={classnames({ [classes.fixBusy]: fixBusy })} />,
        enabled: ({ state }: TableInstance<Game>) =>
          state.selectedRowIds && Object.keys(state.selectedRowIds).length > 0,
      },
    ],
    [classes.fixBusy, fixBusy, onUpdateGmNames]
  )

  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading || !data) {
    return <Loader />
  }

  const { games } = data!

  const list: Game[] = games!.edges
    .map((v) => v.node)
    .filter(notEmpty)
    .filter((g) => g.year === year)

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
        initialState={initialState}
        extraCommands={commands}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})
