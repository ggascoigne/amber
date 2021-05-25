import { Button, Card } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import React, { MouseEventHandler, useCallback, useState } from 'react'

import { dangerColor } from '../../assets/jss/material-kit-react'
import { useAuth } from '../../components/Acnw/Auth/Auth0'
import { IsLoggedIn, IsNotLoggedIn } from '../../components/Acnw/Auth/HasPermission'
import { useProfile } from '../../components/Acnw/Profile'
import CardBody from '../../components/MaterialKitReact/Card/CardBody'
import { useSetting } from '../../utils'
import { IsNotMember } from '../../utils/membership'
import { MembershipWizard } from './MembershipWizard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      paddingTop: 0,
    },
    button: {
      marginLeft: 10,
      [theme.breakpoints.down('sm')]: {
        marginTop: 10,
      },
    },
  })
)

export const BecomeAMember = () => {
  const classes = useStyles()
  const { isInitializing = true, loginWithRedirect } = useAuth()
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const profile = useProfile()
  const allowed = useSetting('allow.registrations', true)

  const login = useCallback(
    async () => !isInitializing && loginWithRedirect && (await loginWithRedirect()),
    [isInitializing, loginWithRedirect]
  )

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
            <h4>We have a new authentication system.</h4>

            <p>
              <strong>
                You must create a new account if you used the old site. Your old password won't work. Click the
                Login/Sign up button below and then click Sign Up on the form that opens.
              </strong>
            </p>

            <p>If you use the same email address you used on the old site, you will have access to your old data.</p>

            <p>
              Only after you have created a new account and confirmed your email will you be able to log in to the new
              site.
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
              <MembershipWizard open={showMembershipForm} onClose={onCloseMembershipDialog} profile={profile!} />
            )}
            <p>
              If you are interested in attending AmberCon NW this year, please
              {allowed ? (
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  onClick={openMembershipDialog}
                  className={classes.button}
                  disabled={!profile}
                >
                  Register
                </Button>
              ) : (
                <span> check back as we'll be opening registration soon.</span>
              )}
            </p>
          </IsLoggedIn>
        </CardBody>
      </Card>
    </IsNotMember>
  )
}
