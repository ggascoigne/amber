import { DialogContent, DialogContentText, createStyles, makeStyles } from '@material-ui/core'
import { Acnw } from 'components'
import React from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    address: {
      paddingLeft: 20,
    },
  })
)

export const FinalStep: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <DialogContent>
        <DialogContentText>
          If possible please pay $15 by check made out to <strong>Simone Cooper</strong>.
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
          If you need to contact Simone, do so at <Acnw.ContactEmail />
        </DialogContentText>

        <DialogContentText>
          We are working on ways to accept PayPal, but these may not be in place in time for the deadline, October 11.
        </DialogContentText>

        <DialogContentText>
          Click below to complete your registration. You will receive an email confirmation.
        </DialogContentText>
      </DialogContent>
    </>
  )
}
