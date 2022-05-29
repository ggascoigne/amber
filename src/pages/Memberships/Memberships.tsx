import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import { useDeleteMembershipMutation, useGetMembershipsByYearQuery } from 'client'
import { BlankNoCell, DateCell, YesBlankCell } from 'components/CellFormatters'
import { useProfile } from 'components/Profile'
import { Table } from 'components/Table'
import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { useQueryClient } from 'react-query'
import { Column, Row, TableInstance, TableState } from 'react-table'
import { configuration, notEmpty, useLocalStorage, useYearFilter } from 'utils'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import { GraphQLError } from '../../components/GraphQLError'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { Membership } from '../../utils/apiTypes'
import { GameAssignmentDialog } from './GameAssignmentDialog'
import { MembershipWizard } from './MembershipWizard'

const initialState: Partial<TableState<Membership>> = {
  sortBy: [
    {
      id: 'lastName',
      desc: false,
    },
  ],
  hiddenColumns: [
    'hotelRoomId',
    'interestLevel',
    'message',
    'offerSubsidy',
    'requestOldPrice',
    'roomPreferenceAndNotes',
    'roomingPreferences',
    'roomingWith',
    'amountOwed',
    'amountPaid',
  ],
}

const memberColumns: Column<Membership>[] = [
  {
    accessor: 'id',
    Header: 'Member ID',
    width: 70,
  },
  {
    id: 'userId',
    accessor: (r: Membership) => r.user?.id,
    Header: 'User ID',
    width: 60,
  },
  {
    id: 'firstName',
    accessor: (r: Membership) => r.user?.firstName,
    width: 70,
    disableGlobalFilter: false,
  },
  {
    id: 'lastName',
    accessor: (r: Membership) => r.user?.lastName,
    width: 100,
    disableGlobalFilter: false,
  },
]

const columns: Column<Membership>[] = [
  {
    Header: 'Member',
    columns: memberColumns,
  },
  {
    Header: 'Attendance',
    columns: [
      {
        accessor: 'attendance',
        width: 60,
      },
      {
        accessor: 'arrivalDate',
        Cell: DateCell,
      },
      {
        accessor: 'departureDate',
        Cell: DateCell,
      },
      {
        accessor: 'interestLevel',
      },
      {
        accessor: 'message',
      },
      {
        accessor: 'volunteer',
        Cell: YesBlankCell,
        sortType: 'basic',
        width: 65,
      },
      {
        accessor: 'attending',
        Cell: BlankNoCell,
        sortType: 'basic',
        width: 65,
      },
      { accessor: 'hotelRoomId' },
      { accessor: 'offerSubsidy' },
      { accessor: 'requestOldPrice' },
      { accessor: 'roomPreferenceAndNotes' },
      { accessor: 'roomingPreferences' },
      { accessor: 'roomingWith' },
      { accessor: 'amountOwed' },
      { accessor: 'amountPaid' },
    ],
  },
]

const virtualColumns: Column<Membership>[] = [
  {
    Header: 'Member',
    columns: memberColumns,
  },
  {
    Header: 'Attendance',
    columns: [
      {
        accessor: 'slotsAttending',
      },
      {
        accessor: 'message',
      },
      {
        accessor: 'volunteer',
        Cell: YesBlankCell,
        width: 65,
      },
      {
        accessor: 'attending',
        Cell: BlankNoCell,
        width: 65,
      },
    ],
  },
]

const Memberships: React.FC = React.memo(() => {
  const profile = useProfile()
  const [year] = useYearFilter()
  const [_, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)

  const [showEdit, setShowEdit] = useState(false)
  const [showGameAssignment, setShowGameAssignment] = useState(false)
  const [selection, setSelection] = useState<Membership[]>([])
  const deleteMembership = useDeleteMembershipMutation()
  const queryClient = useQueryClient()
  const { error, data, refetch } = useGetMembershipsByYearQuery({
    year,
  })

  const onUpdateGameAssignments = useCallback(
    (instance: TableInstance<Membership>) => async () => {
      setShowGameAssignment(true)
      setSelection(instance.selectedFlatRows.map((r) => r.original))
    },
    []
  )

  const commands = useMemo(
    () => [
      {
        label: 'Edit Game Assignments',
        onClick: onUpdateGameAssignments,
        icon: <AssignmentIndIcon />,
        enabled: ({ state }: TableInstance<Membership>) => Object.keys(state.selectedRowIds).length === 1,
        type: 'button' as const,
      },
    ],
    [onUpdateGameAssignments]
  )

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { memberships } = data

  const list: Membership[] = memberships!.nodes.filter(notEmpty)

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setShowGameAssignment(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Membership>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((m) =>
      deleteMembership.mutateAsync(
        {
          input: { id: m.id },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('getMembershipsByYear')
            queryClient.invalidateQueries('getMembershipByYearAndId')
          },
        }
      )
    )
    Promise.allSettled(updater).then(() => {
      console.log('deleted')
      instance.toggleAllRowsSelected(false)
      setSelection([])
      setLastMembershipYear(0) // flush membership cache, not really correct, but it makes testing so much easier
    })
  }

  const onEdit = (instance: TableInstance<Membership>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Membership>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Membership'>
      {showEdit && (
        <MembershipWizard open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} profile={profile!} short />
      )}
      {showGameAssignment && (
        <GameAssignmentDialog open={showGameAssignment} onClose={onCloseEdit} membership={selection[0]} />
      )}
      <Table<Membership>
        name='members'
        data={list}
        columns={configuration.startDates[year].virtual ? virtualColumns : columns}
        onAdd={onAdd}
        disableGroupBy
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        initialState={initialState}
        extraCommands={commands}
        onRefresh={() => refetch()}
        defaultColumnDisableGlobalFilter
      />
    </Page>
  )
})

export default Memberships
