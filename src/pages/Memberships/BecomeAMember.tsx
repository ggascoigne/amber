import { Button, Card, Theme, createStyles, makeStyles, useTheme } from '@material-ui/core'
import React, { MouseEventHandler, useCallback, useState } from 'react'
import { IsNotMember, configuration, useSetting } from 'utils'

import { IsLoggedIn, IsNotLoggedIn, useAuth } from '../../components/Auth'
import { CardBody } from '../../components/Card'
import { useProfile } from '../../components/Profile'
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
  const theme = useTheme()

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
          {configuration.virtual ? (
            <h2>
              Attending <span style={{ color: theme.palette.error.main }}>virtual</span> AmberCon NW
            </h2>
          ) : (
            <h2>Attending AmberCon NW</h2>
          )}
          <IsNotLoggedIn>
            <Button variant='outlined' color='primary' size='large' onClick={login}>
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
