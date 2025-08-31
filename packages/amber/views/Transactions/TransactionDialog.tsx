import React from 'react'

import { EditDialog } from '@amber/ui'
import { FormikHelpers } from 'formik'

import { TransactionFormContent } from './TransactionFormContent'
import { transactionValidationSchema } from './transactionValidationSchema'

import { useEditTransaction, useTransactionValues, TransactionFormValue } from '../../utils/transactionUtils'

interface TransactionDialogProps {
  open: boolean
  initialValues?: TransactionFormValue | null
  onClose: (event?: any) => void
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ open, onClose, initialValues }) => {
  const updateTransaction = useEditTransaction(onClose)
  const values = useTransactionValues(initialValues)

  const onSubmit = async (v: TransactionFormValue, _actions: FormikHelpers<TransactionFormValue>) => {
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
