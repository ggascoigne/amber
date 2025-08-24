import React from 'react'

import { StripeRecord } from '@amber/client'
import { EditDialog } from 'ui'

import { StripeFormContent } from './StripeFormContent'

interface StripeDialogProps {
  open: boolean
  initialValues?: StripeRecord
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
