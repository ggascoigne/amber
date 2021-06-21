import { useGetAllUsersQuery } from 'client'
import { GraphQLError } from 'components/GraphQLError'
import React, { MouseEventHandler, useState } from 'react'
import { Column, Row, TableInstance } from 'react-table'
import { notEmpty } from 'utils'

import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { ProfileDialog, ProfileType } from '../../components/Profile'
import { Table } from '../../components/Table'

const columns: Column<ProfileType>[] = [
  { accessor: 'fullName' },
  { accessor: 'firstName' },
  { accessor: 'lastName' },
  { accessor: 'email' },
  { accessor: 'snailMailAddress' },
  { accessor: 'phoneNumber' },
]

const Users: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<ProfileType[]>([])

  const { error, data, refetch } = useGetAllUsersQuery()

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { users } = data

  const list: ProfileType[] = users!.nodes.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onEdit = (instance: TableInstance<ProfileType>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<ProfileType>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Users'>
      {showEdit && <ProfileDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<ProfileType>
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
