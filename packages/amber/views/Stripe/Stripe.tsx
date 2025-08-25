import React, { MouseEventHandler, useState } from 'react'

import { StripeRecord, useTRPC } from '@amber/client'
import { useQuery } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'
import { Loader, Page, Table } from 'ui'

import { StripeDialog } from './StripeDialog'

import { TransportError } from '../../components/TransportError'

const columns: Column<StripeRecord>[] = [
  { id: 'id', accessor: (originalRow) => originalRow?.id, width: 1 },
  { id: 'user', accessor: (originalRow) => (originalRow?.data as any).metadata.userId, width: 1 },
  { id: 'year', accessor: (originalRow) => (originalRow?.data as any).metadata.year, width: 1 },
  { id: 'metadata', accessor: (originalRow) => JSON.stringify((originalRow?.data as any).metadata) },
  { id: 'data', accessor: (originalRow) => JSON.stringify(originalRow?.data), width: 2 },
]

const Stripes = React.memo(() => {
  const trpc = useTRPC()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<StripeRecord[]>([])

  const { error, data, refetch } = useQuery(trpc.stripe.getStripe.queryOptions())

  if (error) {
    return <TransportError error={error} />
  }

  if (!data) {
    return <Loader />
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refetch().then()
  }

  const onEdit = (instance: TableInstance<StripeRecord>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<StripeRecord>) => {
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
      <Table<StripeRecord>
        name='users'
        data={data}
        columns={columns}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Stripes
