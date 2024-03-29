import React from 'react'

import { FormikHelpers } from 'formik'
import { EditDialog } from 'ui'

import { TransactionFormContent } from './TransactionFormContent'
import { transactionValidationSchema } from './transactionValidationSchema'

import { useEditTransaction, useTransactionValues, TransactionValue } from '../../utils/transactionUtils'

interface TransactionDialogProps {
  open: boolean
  initialValues?: TransactionValue | null
  onClose: (event?: any) => void
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ open, onClose, initialValues }) => {
  const updateTransaction = useEditTransaction(onClose)
  const values = useTransactionValues(initialValues)

  const onSubmit = async (v: TransactionValue, _actions: FormikHelpers<TransactionValue>) => {
    await updateTransaction(v)
  }

  // console.log({ initialValues })

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Transaction'
      validationSchema={transactionValidationSchema}
      isEditing
    >
      <TransactionFormContent />
    </EditDialog>
  )
}
