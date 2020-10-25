import { useGetAllUsersQuery } from 'client'
import React, { MouseEventHandler, useState } from 'react'
import { Column, Row, TableInstance } from 'react-table'

import { Page, ProfileDialog, ProfileType, Table } from '../../components/Acnw'
import { GraphQLError } from '../../components/Acnw/GraphQLError'
import { Loader } from '../../components/Acnw/Loader'
import { notEmpty } from '../../utils'

const columns: Column<ProfileType>[] = [
  { accessor: 'fullName' },
  { accessor: 'firstName' },
  { accessor: 'lastName' },
  { accessor: 'email' },
  { accessor: 'snailMailAddress' },
  { accessor: 'phoneNumber' },
]

export const Users: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<ProfileType[]>([])

  const { error, data, refetch } = useGetAllUsersQuery({ fetchPolicy: 'cache-and-network' })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { users } = data!

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
    <Page>
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
