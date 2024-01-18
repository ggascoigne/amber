import React from 'react'

import { DialogContentText } from '@mui/material'
import { ContactEmail } from 'amber'

export const MembershipStepPayment: React.FC = () => {
  return (
    <>
      <DialogContentText>
        When you complete your registration you will receive an email confirmation. If you don't receive this
        confirmation, let us know as soon as possible at <ContactEmail />.
      </DialogContentText>
    </>
  )
}
