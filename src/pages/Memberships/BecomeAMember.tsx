import { Button, Card } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import React, { MouseEventHandler, useCallback, useState } from 'react'

import { dangerColor } from '../../assets/jss/material-kit-react'
import { useAuth } from '../../components/Acnw/Auth/Auth0'
import { IsLoggedIn, IsNotLoggedIn } from '../../components/Acnw/Auth/HasPermission'
import { useProfile } from '../../components/Acnw/Profile'
import CardBody from '../../components/MaterialKitReact/Card/CardBody'
import { IsNotMember } from '../../utils/membership'
import { MembershipWizard } from './MembershipWizard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      paddingTop: 0,
    },
  })
)

export const BecomeAMember = () => {
  const classes = useStyles()
  const { isInitializing = true, loginWithRedirect } = useAuth()
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const profile = useProfile()

  const login = useCallback(async () => !isInitializing && loginWithRedirect && (await loginWithRedirect()), [
    isInitializing,
    loginWithRedirect,
  ])

  const openMembershipDialog = () => {
    setShowMembershipForm(true)
  }

  const onCloseMembershipDialog: MouseEventHandler = () => {
    setShowMembershipForm(false)
  }

  return (
    <IsNotMember>
      <Card elevation={3}>
        <CardBody className={classes.card}>
          <h2>
            Attending <span style={{ color: dangerColor }}>virtual</span> AmberCon NW
          </h2>
          <IsNotLoggedIn>
            <h4>New Authentication system.</h4>
            <p>
              We have a new authentication system. If you have an account from the old system, you can access it by
              signing up again using the same email address as before and then confirming that email address.
            </p>
            <p>
              Please note, that you can also login with either Facebook or Google. The same email advice applies in this
              case too.
            </p>

            <Button variant='outlined' color='primary' size='large' onClick={login}>
              {' '}
              Login / Sign Up
            </Button>
          </IsNotLoggedIn>

          <IsLoggedIn>
            {showMembershipForm && (
              <MembershipWizard open={showMembershipForm} onClose={onCloseMembershipDialog} profile={profile} />
            )}
            <p>
              If you are interested in attending AmberCon NW this year, please
              <Button
                variant='outlined'
                color='primary'
                size='large'
                onClick={openMembershipDialog}
                style={{ marginLeft: 10, marginTop: 10 }}
                disabled={!profile}
              >
                Register
              </Button>
            </p>
          </IsLoggedIn>
        </CardBody>
      </Card>
    </IsNotMember>
  )
}
