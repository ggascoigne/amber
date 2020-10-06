import { MembershipFieldsFragment, useDeleteMembershipMutation, useGetMembershipsByYearQuery } from 'client'
import { GraphQLError, Loader, Page, Table, useProfile } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import type { Column, Row, TableInstance } from 'react-table'
import { configuration, notEmpty, useLocalStorage, useYearFilterState } from 'utils'

import type { TableMouseEventHandler } from '../../../types/react-table-config'
import { DateCell, YesNoCell } from '../../components/Acnw/Table/CellFormatters'
import { MembershipDialog } from './MembershipDialog'

type Membership = MembershipFieldsFragment

const columns: Column<Membership>[] = [
  {
    Header: 'Member',
    columns: [
      {
        accessor: 'id',
      },
      {
        id: 'firstName',
        accessor: (r: Membership) => r?.user?.firstName,
        width: 70,
      },
      {
        id: 'lastName',
        accessor: (r: Membership) => r?.user?.lastName,
        width: 100,
      },
    ],
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
        accessor: 'attending',
        Cell: YesNoCell,
      },
      {
        accessor: 'interestLevel',
      },
      {
        accessor: 'message',
      },
      {
        accessor: 'volunteer',
        Cell: YesNoCell,
      },
    ],
  },
]

const virtualColumns: Column<Membership>[] = [
  {
    Header: 'Member',
    columns: [
      {
        accessor: 'id',
        Header: 'Member ID',
        width: 50,
      },
      {
        id: 'userId',
        accessor: (r: Membership) => r?.user?.id,
        Header: 'User ID',
        width: 50,
      },
      {
        id: 'firstName',
        accessor: (r: Membership) => r?.user?.firstName,
        width: 70,
      },
      {
        id: 'lastName',
        accessor: (r: Membership) => r?.user?.lastName,
        width: 100,
      },
    ],
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
        Cell: YesNoCell,
      },
    ],
  },
]

export const Memberships: React.FC = React.memo(() => {
  const profile = useProfile()
  const year = useYearFilterState((state) => state.year)
  const [_, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)

  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Membership[]>([])
  const [deleteMembership] = useDeleteMembershipMutation()
  const { loading, error, data } = useGetMembershipsByYearQuery({
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
  const { memberships } = data!

  const list: Membership[] = memberships!.nodes.filter(notEmpty)

  const onAdd: TableMouseEventHandler = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Membership>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((m) =>
      deleteMembership({
        variables: { input: { id: m.id } },
        refetchQueries: ['getMembershipsByYear', 'getMembershipByYearAndId'],
      })
    )
    Promise.all(updater).then(() => {
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
    <Page>
      {showEdit && (
        <MembershipDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} profile={profile!} />
      )}
      <Table<Membership>
        name='members'
        data={list}
        columns={configuration.virtual ? virtualColumns : columns}
        onAdd={onAdd}
        disableGroupBy
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
      />
    </Page>
  )
})
