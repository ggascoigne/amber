import React, { useCallback } from 'react'

import type { Transaction } from '@amber/client'
import { useTRPC, useInvalidatePaymentQueries } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import { useQuery, useMutation } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { TransactionDialog } from './TransactionDialog'

import { Page } from '../../components'
import { TransportError } from '../../components/TransportError'
import { formatAmountForDisplay } from '../../utils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

const columns: ColumnDef<Transaction>[] = [
  { id: 'user', header: 'User', accessorFn: (row) => row?.user?.fullName },
  {
    id: 'membership',
    header: 'Membership',
    filterFn: 'numericText',
    accessorFn: (row) => row?.membership?.year,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorFn: (row) => formatAmountForDisplay(row.amount),
    filterFn: 'numericText',
    meta: { align: 'right' as const },
  },
  {
    id: 'origin',
    header: 'Origin',
    accessorFn: (row) => `${row?.stripe ? 'Stripe: ' : ''}${row?.userByOrigin?.fullName ?? ''}`,
  },
  {
    id: 'timestamp',
    header: 'Timestamp',
    accessorFn: (row) => new Date(row?.timestamp).toISOString(),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    filterFn: 'numericText',
    meta: { align: 'right' as const },
  },
  { accessorKey: 'notes', header: 'Notes' },
  {
    id: 'data',
    header: 'Data',
    accessorFn: (row) => JSON.stringify(row?.data),
  },
]

const Transactions = React.memo(() => {
  const trpc = useTRPC()
  const deleteTransaction = useMutation(trpc.transactions.deleteTransaction.mutationOptions())

  const {
    error,
    data = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery(trpc.transactions.getTransactions.queryOptions())

  const invalidatePaymentQueries = useInvalidatePaymentQueries()

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete } =
    useStandardHandlers<Transaction>({
      deleteHandler: (selectedRows) => selectedRows.map((row) => deleteTransaction.mutateAsync({ id: row.id })),
      invalidateQueries: invalidatePaymentQueries,
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
    <Page title='Transactions' variant='fill' hideTitle>
      {showEdit && <TransactionDialog open={showEdit} onClose={handleCloseEdit} initialValues={getInitialValues()} />}
      <Table<Transaction>
        title='Transactions'
        name='users'
        data={data}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onRowClick={onRowClick}
        refetch={refetch}
        enableGrouping={false}
      />
    </Page>
  )
})

export default Transactions
