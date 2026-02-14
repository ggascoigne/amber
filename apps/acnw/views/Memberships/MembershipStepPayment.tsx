import React from 'react'

import { ContactEmail } from '@amber/amber'
import { DialogContentText } from '@mui/material'

export const MembershipStepPayment = () => (
  <DialogContentText>
    When you complete your registration you will receive an email confirmation. If you don&apos;t receive this
    confirmation, let us know as soon as possible at <ContactEmail />.
  </DialogContentText>
)
