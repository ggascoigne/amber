import React, { MouseEventHandler, useCallback, useState } from 'react'

import { useTRPC, useInvalidatePaymentQueries, Transaction } from '@amber/client'
import { Loader, Page, Table } from '@amber/ui'
import { TableMouseEventHandler } from '@amber/ui/types/react-table-config'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Column, Row, TableInstance } from 'react-table'

import { TransactionDialog } from './TransactionDialog'

import { TransportError } from '../../components/TransportError'
import { formatAmountForDisplay } from '../../utils'

const columns: Column<Transaction>[] = [
  { id: 'User', accessor: (originalRow) => originalRow?.user?.fullName },
  { id: 'Membership', accessor: (originalRow) => originalRow?.membership?.year },
  {
    id: 'amount',
    accessor: (originalRow) => formatAmountForDisplay(originalRow.amount),
  },
  {
    id: 'Origin',
    accessor: (originalRow) => `${originalRow?.stripe ? 'Stripe: ' : ''}${originalRow?.userByOrigin?.fullName}`,
  },
  { id: 'timestamp', accessor: (originalRow) => new Date(originalRow?.timestamp).toISOString() },
  { accessor: 'year' },
  { accessor: 'notes' },
  { id: 'data', accessor: (originalRow) => JSON.stringify(originalRow?.data) },
]

const Transactions = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const trpc = useTRPC()
  const [selection, setSelection] = useState<Transaction[]>([])
  const deleteTransaction = useMutation(trpc.transactions.deleteTransaction.mutationOptions())

  const { error, data, refetch } = useQuery(trpc.transactions.getTransactions.queryOptions())

  const invalidatePaymentQueries = useInvalidatePaymentQueries()

  const clearSelectionAndRefresh = useCallback(() => {
    setSelection([])
    invalidatePaymentQueries()
  }, [invalidatePaymentQueries])

  const onAdd: TableMouseEventHandler<Transaction> = useCallback(
    () => () => {
      setShowEdit(true)
    },
    [],
  )

  const onDelete = useCallback(
    (instance: TableInstance<Transaction>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((v) => deleteTransaction.mutateAsync({ id: v.id }))
      Promise.allSettled(updater).then(() => {
        console.log('deleted')
        clearSelectionAndRefresh()
        instance.toggleAllRowsSelected(false)
      })
    },
    [clearSelectionAndRefresh, deleteTransaction],
  )

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

  const onEdit = (instance: TableInstance<Transaction>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<Transaction>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  const getInitialValues = () => {
    const val = { ...selection[0], stringData: '' }
    val.stringData = JSON.stringify(val.data, null, 2)
    return val
  }

  return (
    <Page title='Transactions'>
      {showEdit && <TransactionDialog open={showEdit} onClose={onCloseEdit} initialValues={getInitialValues()} />}
      <Table<Transaction>
        name='users'
        data={data}
        columns={columns}
        onAdd={onAdd}
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        onRefresh={() => refetch()}
      />
    </Page>
  )
})

export default Transactions
