import React, { useCallback, useMemo, useState } from 'react'

import type { Game } from '@amber/client'
import { useTRPC } from '@amber/client'
import { notEmpty } from '@amber/ui'
import type { Action, TableSelectionMouseEventHandler } from '@amber/ui/components/Table'
import { Table, someSelected, getSelectedRows } from '@amber/ui/components/Table'
import CachedIcon from '@mui/icons-material/Cached'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef, TableState } from '@tanstack/react-table'

import { useUpdateGameAssignment } from './gameHooks'
import { GamesDialog } from './GamesDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useYearFilter } from '../../utils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

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

const initialState: Partial<TableState> = {
  sorting: [
    {
      id: 'slotId',
      desc: false,
    },
  ],
  columnVisibility: {
    genre: false,
    type: false,
    setting: false,
    charInstructions: false,
    playerPreference: false,
    returningPlayers: false,
    playersContactGm: false,
    gameContactEmail: false,
    slotPreference: false,
    lateStart: false,
    lateFinish: false,
    slotConflicts: false,
    message: false,
    teenFriendly: false,
    year: false,
    full: false,
  },
}

const columns: ColumnDef<Game>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 100,
    filterFn: 'numericText',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'slotId',
    header: 'Slot',
    size: 100,
    filterFn: 'numericText',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'name',
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'gmNames',
    header: 'GM Names',
    enableGlobalFilter: true,
  },
  {
    id: 'gm',
    header: 'GM',
    accessorFn: (row) => getGms(row),
  },
  {
    accessorKey: 'description',
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'estimatedLength',
    size: 100,
    filterFn: 'numericText',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'playerMax',
    size: 100,
    filterFn: 'numericText',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'playerMin',
    size: 100,
    filterFn: 'numericText',
    meta: {
      align: 'right',
    },
  },
  {
    accessorKey: 'year',
    size: 100,
    enableColumnFilter: false,
    meta: {
      align: 'right',
    },
  },
  { accessorKey: 'genre' },
  { accessorKey: 'type' },
  { accessorKey: 'setting' },
  { accessorKey: 'charInstructions', enableGlobalFilter: true },
  { accessorKey: 'playerPreference', enableGlobalFilter: true },
  { accessorKey: 'returningPlayers' },
  { accessorKey: 'playersContactGm' },
  { accessorKey: 'gameContactEmail' },
  { accessorKey: 'slotPreference' },
  { accessorKey: 'lateStart' },
  {
    accessorKey: 'lateFinish',
    cell: ({ getValue }) => (getValue() ? 'Yes' : ''),
  },
  { accessorKey: 'slotConflicts' },
  { accessorKey: 'message', enableGlobalFilter: true },
  {
    accessorKey: 'teenFriendly',
    cell: ({ getValue }) => (getValue() ? 'Yes' : ''),
  },
  {
    accessorKey: 'full',
    cell: ({ getValue }) => (getValue() ? 'Yes' : ''),
  },
  { accessorKey: 'roomId' },
]

const Games = React.memo(() => {
  const trpc = useTRPC()
  const [year] = useYearFilter()
  const deleteGame = useMutation(trpc.games.deleteGame.mutationOptions())
  const [fixBusy, setFixBusy] = useState(false)
  const { error, data, refetch, isLoading, isFetching } = useQuery(
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

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } = useStandardHandlers<Game>({
    deleteHandler: (selectedRows) => selectedRows.map((row) => deleteGame.mutateAsync({ id: row.id })),
  })

  const membershipList = useMemo(() => membershipData?.filter(notEmpty) ?? [], [membershipData])

  const fixGmNames = useCallback<TableSelectionMouseEventHandler<Game>>(
    async (table, selectedKeys) => {
      const selectedRows = getSelectedRows(table, selectedKeys)
      if (!selectedRows.length) return Promise.resolve()
      setFixBusy(true)
      const queue = selectedRows.map((row) => setGameGmAssignments(row.id, row.gmNames, membershipList))
      try {
        await Promise.allSettled(queue)
        return undefined
      } finally {
        setFixBusy(false)
      }
    },
    [membershipList, setGameGmAssignments],
  )

  const toolbarActions = useMemo<Action<Game>[]>(
    () => [
      {
        label: 'Fix GM Names',
        type: 'icon',
        icon: <CachedIcon sx={fixBusy ? { color: 'red' } : undefined} />,
        onClick: (table, selectedKeys) => {
          if (!selectedKeys.length) return
          fixGmNames(table, selectedKeys)
        },
        enabled: someSelected,
      },
    ],
    [fixBusy, fixGmNames],
  )

  const list = useMemo(() => (data ?? []).filter((g) => g.year === year), [data, year])

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Games' variant='fill' hideTitle>
      {showEdit && <GamesDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table<Game>
        title='Games'
        name='games'
        data={list}
        columns={columns}
        initialState={initialState}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
        additionalToolbarActions={toolbarActions}
        defaultColumnDisableGlobalFilter
        enableGrouping={false}
      />
    </Page>
  )
})

export default Games
