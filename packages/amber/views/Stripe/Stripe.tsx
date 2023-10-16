import React, { MouseEventHandler, useState } from 'react'

import { Column, Row, TableInstance } from 'react-table'
import { GqlType, GraphQLError, Loader, notEmpty, Page, Table, ToFormValues } from 'ui'

import { StripeDialog } from './StripeDialog'

import { GetStripeQuery, useGraphQL, GetStripeDocument } from '../../client'

export type StripeValue = ToFormValues<GqlType<GetStripeQuery, ['stripes', 'nodes', number]>>

const columns: Column<StripeValue>[] = [
  { id: 'id', accessor: (originalRow) => originalRow?.id, width: 1 },
  { id: 'user', accessor: (originalRow) => originalRow?.data.metadata.userId, width: 1 },
  { id: 'year', accessor: (originalRow) => originalRow?.data.metadata.year, width: 1 },
  { id: 'metadata', accessor: (originalRow) => JSON.stringify(originalRow?.data.metadata) },
  { id: 'data', accessor: (originalRow) => JSON.stringify(originalRow?.data), width: 2 },
]

const Stripes: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<StripeValue[]>([])

  const { error, data, refetch } = useGraphQL(GetStripeDocument)

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { stripes } = data

  const list: StripeValue[] = stripes!.nodes.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refetch().then()
  }

  const onEdit = (instance: TableInstance<StripeValue>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<StripeValue>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  const getInitialValues = () => {
    const val = { ...selection[0], stringData: '' }
    val.stringData = JSON.stringify(val.data, null, 2)
    return val
  }

  return (
    <Page title='Stripes'>
      {showEdit && <StripeDialog open={showEdit} onClose={onCloseEdit} initialValues={getInitialValues()} />}
      <Table<StripeValue>
        name='users'
        data={list}
        columns={columns}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Stripes
