import React from 'react'

import { DialogContentText } from '@mui/material'
import { ContactEmail, useConfiguration } from 'amber'
import { getMembershipCost } from 'amber/utils/transactionUtils'
import { useFormikContext } from 'formik'

import { MembershipWizardFormValues } from './MembershipWizard'

export const MembershipStepPayment: React.FC = () => {
  const configuration = useConfiguration()
  const { values } = useFormikContext<MembershipWizardFormValues>()
  const toPay = getMembershipCost(configuration, values.membership)

  return (
    <>
      {toPay && (
        <DialogContentText>
          Click <strong>SAVE</strong> to go to the electronic payment screen.
        </DialogContentText>
      )}
      <DialogContentText>
        When you complete your registration you will receive an email confirmation. If you don't receive this
        confirmation, let us know as soon as possible at <ContactEmail />.
      </DialogContentText>
    </>
  )
}
