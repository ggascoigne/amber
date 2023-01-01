import React, { MouseEventHandler, useState } from 'react'
import { Column, Row, TableInstance } from 'react-table'
import { GraphQLError, Loader, notEmpty, Page, Table } from 'ui'
import { useGetAllUsersAndProfilesQuery } from '../../client'
import { ProfileDialog } from '../../components/Profile'
import { UsersAndProfileType } from '../../components/Profile/profileUtils'

const columns: Column<UsersAndProfileType>[] = [
  { accessor: 'fullName' },
  { accessor: 'firstName' },
  { accessor: 'lastName' },
  { accessor: 'displayName' },
  { accessor: 'email' },
  { id: 'snailMailAddress', accessor: (originalRow) => originalRow?.profiles?.nodes?.[0]?.snailMailAddress },
  { id: 'phoneNumber', accessor: (originalRow) => originalRow?.profiles?.nodes?.[0]?.phoneNumber },
]

const Users: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<UsersAndProfileType[]>([])

  const { error, data, refetch } = useGetAllUsersAndProfilesQuery()

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { users } = data

  const list: UsersAndProfileType[] = users!.nodes.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refetch().then()
  }

  const onEdit = (instance: TableInstance<UsersAndProfileType>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<UsersAndProfileType>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Users'>
      {showEdit && <ProfileDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <Table<UsersAndProfileType>
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
