import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { Game, useTRPC } from '@amber/client'
import { Loader, notEmpty, Page, Table, YesBlankCell } from '@amber/ui'
import CachedIcon from '@mui/icons-material/Cached'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Column, Row, TableInstance, TableState } from 'react-table'
import { makeStyles } from 'tss-react/mui'

import { useUpdateGameAssignment } from './gameHooks'
import { GamesDialog } from './GamesDialog'

import { TransportError } from '../../components/TransportError'
import type { TableMouseEventHandler } from '../../types/react-table-config'
import { useYearFilter } from '../../utils'

export const getGms = (row: Game) => {
  const playersOrEmpty = row.gameAssignment
  if (playersOrEmpty.length) {
    return playersOrEmpty
      .filter((val) => val)
      .filter((val) => val!.gm !== 0)
      .map((val) => val?.membership?.user?.fullName ?? '')
      .join(', ')
  }
  return ''
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
    disableFilters: true,
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
  { accessor: 'roomId' },
]

const useStyles = makeStyles()({
  fixBusy: {
    color: 'red',
  },
})

const Games = React.memo(() => {
  const trpc = useTRPC()
  const [year] = useYearFilter()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Game[]>([])
  const deleteGame = useMutation(trpc.games.deleteGame.mutationOptions())
  const [fixBusy, setFixBusy] = useState(false)
  const { classes, cx } = useStyles()
  const { error, data, refetch } = useQuery(
    trpc.games.getGamesByYear.queryOptions({
      year,
    }),
  )
  const setGameGmAssignments = useUpdateGameAssignment()
  const { data: membershipData } = useQuery(
    trpc.memberships.getMembershipsByYear.queryOptions({
      year,
    }),
  )

  const membershipList = useMemo(() => membershipData?.filter(notEmpty) ?? [], [membershipData])

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
    [membershipList, setGameGmAssignments],
  )

  const commands = useMemo(
    () => [
      {
        label: 'Fix GM Names',
        onClick: onUpdateGmNames,
        icon: <CachedIcon className={cx({ [classes.fixBusy]: fixBusy })} />,
        enabled: ({ state }: TableInstance<Game>) => Object.keys(state.selectedRowIds).length > 0,
      },
    ],
    [classes.fixBusy, cx, fixBusy, onUpdateGmNames],
  )

  if (error) {
    return <TransportError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const list: Game[] = data.filter((g) => g.year === year)

  const onAdd: TableMouseEventHandler<Game> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Game>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((g) => deleteGame.mutateAsync({ id: g.id }))
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
