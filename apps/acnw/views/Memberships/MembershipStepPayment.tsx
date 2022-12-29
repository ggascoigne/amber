import { DialogContentText } from '@mui/material'
import { useFormikContext } from 'formik'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { ContactEmail, useConfiguration } from 'amber'

import { getOwed } from './membershipUtils'
import { MembershipWizardFormValues } from './MembershipWizard'

const useStyles = makeStyles()({
  address: {
    paddingLeft: 20,
  },
})

export const MembershipStepPayment: React.FC = () => {
  const configuration = useConfiguration()
  const { classes } = useStyles()
  const { values } = useFormikContext<MembershipWizardFormValues>()
  const toPay = getOwed(configuration, values.membership)
  return (
    <>
      {toPay && (
        <>
          <DialogContentText>
            If possible please pay ${toPay} by check made out to <strong>Simone Cooper</strong>.
          </DialogContentText>
          <DialogContentText>and sent to</DialogContentText>

          <DialogContentText className={classes.address}>
            AmberCon NW
            <br />
            c/o Simone Cooper
            <br />
            8047 N. Syracuse St.
            <br />
            Portland, OR 97203-4939
          </DialogContentText>
          <DialogContentText>
            If you need to contact Simone, do so at <ContactEmail />
          </DialogContentText>

          <DialogContentText>
            We are working on ways to accept PayPal, but these may not be in place in time for the deadline.
          </DialogContentText>
        </>
      )}
      <DialogContentText>
        Click below to complete your registration. You will receive an email confirmation. If you don't receive this
        confirmation, let us know as soon as possible at <ContactEmail />.
      </DialogContentText>
    </>
  )
}
