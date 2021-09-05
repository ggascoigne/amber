import { createStyles, makeStyles } from '@material-ui/core'
import CachedIcon from '@material-ui/icons/Cached'
import {
  GameFieldsFragment,
  GameGmsFragment,
  useDeleteGameMutation,
  useGetGamesByYearQuery,
  useGetMembershipsByYearQuery,
} from 'client'
import clsx from 'clsx'
import { YesBlankCell } from 'components/CellFormatters'
import { GraphQLError } from 'components/GraphQLError'
import { Table } from 'components/Table'
import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import type { Column, Row, TableInstance, TableState } from 'react-table'
import { notEmpty, useYearFilter } from 'utils'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { useUpdateGameAssignment } from './gameHooks'
import { GamesDialog } from './GamesDialog'

type Game = GameFieldsFragment & GameGmsFragment

export const getGms = (row: Game) => {
  const playersOrEmpty = row.gameAssignments.nodes
  if (playersOrEmpty.length) {
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
    disableGlobalFilter: false,
  },
  {
    Header: 'GM Names',
    accessor: 'gmNames',
    disableGlobalFilter: false,
  },
  {
    id: 'GM',
    accessor: getGms,
  },
  {
    accessor: 'description',
    disableGlobalFilter: false,
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
  { accessor: 'charInstructions', disableGlobalFilter: false },
  { accessor: 'playerPreference', disableGlobalFilter: false },
  { accessor: 'returningPlayers' },
  { accessor: 'playersContactGm' },
  { accessor: 'gameContactEmail' },
  { accessor: 'slotPreference' },
  { accessor: 'lateStart' },
  { accessor: 'lateFinish', Cell: YesBlankCell, sortType: 'basic' },
  { accessor: 'slotConflicts' },
  { accessor: 'message', disableGlobalFilter: false },
  { accessor: 'teenFriendly', Cell: YesBlankCell, sortType: 'basic' },
  { accessor: 'full', Cell: YesBlankCell, sortType: 'basic' },
]

const useStyles = makeStyles(() =>
  createStyles({
    fixBusy: {
      color: 'red',
    },
  })
)
const Games: React.FC = React.memo(() => {
  const [year] = useYearFilter()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Game[]>([])
  const deleteGame = useDeleteGameMutation()
  const [fixBusy, setFixBusy] = useState(false)
  const classes = useStyles()
  const { error, data, refetch } = useGetGamesByYearQuery({
    year,
  })
  const setGameGmAssignments = useUpdateGameAssignment()
  const { data: membershipData } = useGetMembershipsByYearQuery({
    year,
  })

  const membershipList = useMemo(
    () => membershipData?.memberships?.nodes.filter(notEmpty) ?? [],
    [membershipData?.memberships?.nodes]
  )

  const onUpdateGmNames = useCallback(
    (instance: TableInstance<Game>) => async () => {
      setFixBusy(true)
      const selected = instance.selectedFlatRows.map((r) => r.original)
      const queue: Promise<any>[] = []
      selected.forEach((game) => {
        queue.push(setGameGmAssignments(game.id, game.gmNames, membershipList))
      })
      await Promise.allSettled(queue)
      setFixBusy(false)
    },
    [membershipList, setGameGmAssignments]
  )

  const commands = useMemo(
    () => [
      {
        label: 'Fix GM Names',
        onClick: onUpdateGmNames,
        icon: <CachedIcon className={clsx({ [classes.fixBusy]: fixBusy })} />,
        enabled: ({ state }: TableInstance<Game>) => Object.keys(state.selectedRowIds).length > 0,
      },
    ],
    [classes.fixBusy, fixBusy, onUpdateGmNames]
  )

  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const { games } = data

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
    const updater = toDelete.map((g) => deleteGame.mutateAsync({ input: { id: g.id } }))
    Promise.allSettled(updater).then(() => console.log('deleted'))
  }

  const onEdit = (instance: TableInstance<Game>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Game>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  // const updateData = (rowIndex: number, columnId: string, value: any): void => {
  //   console.log(`{rowIndex, columnId, value} = ${JSON.stringify({ rowIndex, columnId, value }, null, 2)}`)
  // }

  return (
    <Page title='Games'>
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
        defaultColumnDisableGlobalFilter
        // updateData={updateData}
      />
    </Page>
  )
})

export default Games
