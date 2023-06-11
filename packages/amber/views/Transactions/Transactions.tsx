import React, { MouseEventHandler, useCallback, useState } from 'react'

import { Column, Row, TableInstance } from 'react-table'
import { GraphQLError, Loader, notEmpty, Page, Table } from 'ui'
import { TableMouseEventHandler } from 'ui/types/react-table-config'

import { TransactionDialog } from './TransactionDialog'

import { useDeleteTransactionMutation, useGetTransactionQuery } from '../../client'
import { useInvalidatePaymentQueries } from '../../client/querySets'
import { formatAmountForDisplay } from '../../utils'
import { TransactionValue } from '../../utils/transactionUtils'

const columns: Column<TransactionValue>[] = [
  { id: 'User', accessor: (originalRow) => originalRow?.user?.fullName },
  { id: 'Membership', accessor: (originalRow) => originalRow?.member?.year },
  {
    id: 'amount',
    accessor: (originalRow) => formatAmountForDisplay(originalRow.amount),
  },
  {
    id: 'Origin',
    accessor: (originalRow) => `${originalRow?.stripe ? 'Stripe: ' : ''}${originalRow?.userByOrigin?.fullName}`,
  },
  { accessor: 'timestamp' },
  { accessor: 'year' },
  { accessor: 'notes' },
  { id: 'data', accessor: (originalRow) => JSON.stringify(originalRow?.data) },
]

const Transactions: React.FC = React.memo(() => {
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<TransactionValue[]>([])
  const deleteTransaction = useDeleteTransactionMutation()

  const { error, data, refetch } = useGetTransactionQuery()

  const invalidatePaymentQueries = useInvalidatePaymentQueries()

  const clearSelectionAndRefresh = useCallback(() => {
    setSelection([])
    invalidatePaymentQueries()
  }, [invalidatePaymentQueries])

  const onAdd: TableMouseEventHandler<TransactionValue> = useCallback(
    () => () => {
      setShowEdit(true)
    },
    []
  )

  const onDelete = useCallback(
    (instance: TableInstance<TransactionValue>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((v) => deleteTransaction.mutateAsync({ input: { id: v.id } }))
      Promise.allSettled(updater).then(() => {
        console.log('deleted')
        clearSelectionAndRefresh()
        instance.toggleAllRowsSelected(false)
      })
    },
    [clearSelectionAndRefresh, deleteTransaction]
  )

  if (error) {
    return <GraphQLError error={error} />
  }

  if (!data) {
    return <Loader />
  }
  const { transactions } = data

  const list: TransactionValue[] = transactions!.nodes.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
    refetch().then()
  }

  const onEdit = (instance: TableInstance<TransactionValue>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<TransactionValue>) => {
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
      <Table<TransactionValue>
        name='users'
        data={list}
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
