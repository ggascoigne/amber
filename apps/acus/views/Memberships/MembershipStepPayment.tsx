import React from 'react'

import { DialogContentText } from '@mui/material'
import { ContactEmail } from 'amber'

export const MembershipStepPayment: React.FC = () => (
  <DialogContentText>
    When you complete your registration you will receive an email confirmation. If you don&apos;t receive this
    confirmation, let us know as soon as possible at <ContactEmail />.
  </DialogContentText>
)
