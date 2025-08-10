import React, { MouseEventHandler, useState } from 'react'

import { UserAndProfile, useTRPC } from '@amber/client'
import { useQuery } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { Loader, notEmpty, Page, Table } from 'ui'

import { ProfileDialog } from '../../components/Profile'
import { TransportError } from '../../components/TransportError'

const columns: Column<UserAndProfile>[] = [
  { accessor: 'fullName' },
  { accessor: 'firstName' },
  { accessor: 'lastName' },
  { accessor: 'displayName' },
  { accessor: 'email' },
  { id: 'snailMailAddress', accessor: (originalRow) => originalRow?.profile?.[0]?.snailMailAddress },
  { id: 'phoneNumber', accessor: (originalRow) => originalRow?.profile?.[0]?.phoneNumber },
  { accessor: 'balance', filter: 'numeric' },
]

const Users = React.memo(() => {
  const trpc = useTRPC()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<UserAndProfile[]>([])

  const { error, data: users, refetch } = useQuery(trpc.users.getAllUsersAndProfiles.queryOptions())

  if (error) {
    return <TransportError error={error} />
  }

  if (!users) {
    return <Loader />
  }

  const list = users.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refetch().then()
  }

  const onEdit = (instance: TableInstance<UserAndProfile>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<UserAndProfile>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Users'>
      {showEdit && <ProfileDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table
        name='users'
        data={list}
        columns={columns}
        disableGroupBy
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Users
