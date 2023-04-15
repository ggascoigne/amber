import React from 'react'

import { DialogContentText } from '@mui/material'
import { ContactEmail, useConfiguration } from 'amber'
import { useFormikContext } from 'formik'

import { getOwed } from './membershipUtils'
import { MembershipWizardFormValues } from './MembershipWizard'

export const MembershipStepPayment: React.FC = () => {
  const configuration = useConfiguration()
  const { values } = useFormikContext<MembershipWizardFormValues>()
  const toPay = getOwed(configuration, values.membership)
  return (
    <>
      {toPay ? (
        <>
          <DialogContentText>Payment by Venmo.</DialogContentText>
          <DialogContentText>Details to follow</DialogContentText>

          <DialogContentText>
            We are working on ways to accept Stripe, but these may not be in place in time for the deadline.
          </DialogContentText>
        </>
      ) : null}
      <DialogContentText>
        Click below to complete your registration. You will receive an email confirmation. If you don't receive this
        confirmation, let us know as soon as possible at <ContactEmail />.
      </DialogContentText>
    </>
  )
}
