import React, { useCallback } from 'react'

import type { StripeRecord } from '@amber/client'
import { useTRPC } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { StripeDialog } from './StripeDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

const columns: ColumnDef<StripeRecord>[] = [
  { id: 'id', header: 'ID', accessorFn: (row) => row?.id, size: 5 },
  {
    id: 'user',
    header: 'User',
    accessorFn: (row) => (row?.data as any)?.metadata?.userId,
    size: 5,
  },
  {
    id: 'year',
    header: 'Year',
    accessorFn: (row) => (row?.data as any)?.metadata?.year,
    size: 5,
  },
  {
    id: 'metadata',
    header: 'Metadata',
    accessorFn: (row) => JSON.stringify((row?.data as any)?.metadata),
    size: 40,
  },
  {
    id: 'data',
    header: 'Data',
    accessorFn: (row) => JSON.stringify(row?.data),
    size: 40,
  },
]

const Stripes = React.memo(() => {
  const trpc = useTRPC()

  const { error, data = [], refetch, isLoading, isFetching } = useQuery(trpc.stripe.getStripe.queryOptions())

  const { showEdit, selection, handleCloseEdit, onEdit, onRowClick } = useStandardHandlers<StripeRecord>({
    deleteHandler: undefined,
  })

  const getInitialValues = useCallback(() => {
    const val = { ...selection[0], stringData: '' }
    val.stringData = JSON.stringify(val.data, null, 2)
    return val
  }, [selection])

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page title='Stripe Log' variant='fill' hideTitle>
      {showEdit && <StripeDialog open={showEdit} onClose={handleCloseEdit} initialValues={getInitialValues()} />}
      <Table<StripeRecord>
        title='Stripe Log'
        name='stripe'
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onEdit={onEdit}
        onRowClick={onRowClick}
        refetch={refetch}
        enableGrouping={false}
      />
    </Page>
  )
})

export default Stripes
