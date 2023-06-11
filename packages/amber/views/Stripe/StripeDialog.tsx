import React from 'react'

import { EditDialog } from 'ui'

import { StripeValue } from './Stripe'
import { StripeFormContent } from './StripeFormContent'

interface StripeDialogProps {
  open: boolean
  initialValues?: StripeValue
  onClose: (event?: any) => void
}

export const StripeDialog: React.FC<StripeDialogProps> = ({ open, onClose, initialValues }) => {
  const onSubmit = async () => {
    onClose?.()
  }

  return (
    <EditDialog
      initialValues={initialValues!}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Stripe'
      isEditing
    >
      <StripeFormContent />
    </EditDialog>
  )
}
