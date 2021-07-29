import { Button, Card, Theme, createStyles, makeStyles, useTheme } from '@material-ui/core'
import React, { MouseEventHandler, useCallback } from 'react'
import { Route, Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
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
  const profile = useProfile()
  const allowed = useSetting('allow.registrations', true)

  const match = useRouteMatch()
  const history = useHistory()

  const login = useCallback(
    async () => !isInitializing && loginWithRedirect && (await loginWithRedirect()),
    [isInitializing, loginWithRedirect]
  )

  const onCloseMembershipDialog: MouseEventHandler = () => {
    history.push(match.url)
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
            <Route
              path='/membership/new'
              render={() => <MembershipWizard open onClose={onCloseMembershipDialog} profile={profile!} />}
            />
            <p>
              If you are interested in attending AmberCon NW this year, please
              {allowed ? (
                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  className={classes.button}
                  disabled={!profile}
                  component={RouterLink}
                  to='/membership/new'
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
