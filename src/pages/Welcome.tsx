import { Button } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { dangerColor } from 'assets/jss/material-kit-react'
import Acnw from 'components/Acnw'
import { useAuth } from 'components/Acnw/Auth'
import { Banner } from 'components/Acnw/Banner'
import { Page } from 'components/Acnw/Page'
import React, { useCallback } from 'react'

import { useGetMembershipQuery } from '../client'
import { Auth0User } from '../components/Acnw/Auth/Auth0'
import { IsNotLoggedIn } from '../components/Acnw/Auth/HasPermission'
import { useLocalStorage } from '../utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      textAlign: 'center',
    },
    deadline: {},
    deadlineExpired: {
      color: dangerColor,
      '&:after': {
        content: '" - date passed"',
      },
    },
  })
)

const NeedsLogin: React.FC = () => {
  const { loginWithPopup } = useAuth()
  const login = useCallback(async () => loginWithPopup && (await loginWithPopup()), [loginWithPopup])
  return (
    <>
      <p>
        Firstly you need to Register with the Ambercon NW site and login: &nbsp;
        <Button onClick={login} variant='contained'>
          click here to register/login
        </Button>
      </p>
      <p>
        Please note that site registration and login has changed from previous years. If you have games from previous
        years that you want to have easy access to, please ensure that you use the same email address as in previous
        years.
      </p>
    </>
  )
}

type IsUserAMember = {
  year: number
  user: Auth0User
  denied?: () => React.ReactElement | null
}

const nullOp = (): null => null

const IsUserAMember: React.FC<IsUserAMember> = ({ year, user, children = null, denied = nullOp }) => {
  const [lastMembershipYear, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)
  const { loading, error, data } = useGetMembershipQuery({ variables: { year, userId: user.userId } })
  if (lastMembershipYear !== year) {
    if (loading || !data) {
      return denied()
    }
    if (error) {
      console.log(`error = ${JSON.stringify(error, null, 2)}`)
    }
    if (data) {
      console.log(`data = ${JSON.stringify(data, null, 2)}`)
    }
    setLastMembershipYear(year)
  }
  return <>{children}</>
}

export const IsMember: React.FC = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && !!user) {
    return (
      <IsUserAMember year={2019} user={user}>
        {children}
      </IsUserAMember>
    )
  } else {
    return null
  }
}

export const IsNotMember: React.FC = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && !!user) {
    return <IsUserAMember year={2019} user={user} denied={() => <>{children}</>} />
  } else {
    return null
  }
}

export const Welcome: React.FC = () => {
  const classes = useStyles()

  return (
    <Page>
      <div className={classes.banner}>
        <Banner />
      </div>
      <h1>Welcome!</h1>

      <p>
        Our <Acnw.Ordinal /> annual AmberCon Northwest is a fully scheduled role-playing game convention devoted to
        Roger Zelazny's worlds of Amber using Phage Press's Amber Diceless RPG by Erick Wujcik, and to diceless and
        indie RPGs of all kinds.
      </p>

      <p>
        You can use this site to learn about the convention and its venue, McMenamins Edgefield Bed and Breakfast
        Resort; register for the convention; submit your game events to the organizers; and sign up for games as they
        become available.
      </p>
      <br />

      <p>
        AmberCon NW announcements also appear on our{' '}
        <a href='https://www.facebook.com/groups/464742576942907/' target='_new'>
          Facebook group page
        </a>
        .
      </p>
      <br />

      <p>
        For information about other AmberCons in the US and abroad, go to{' '}
        <a href='http://www.ambercons.com' target='_new'>
          www.ambercons.com
        </a>
      </p>

      <h2>Attending Virtual AmberCon NW</h2>

      <IsNotLoggedIn>
        <NeedsLogin />
      </IsNotLoggedIn>
      <IsMember>Is a member</IsMember>
      <IsNotMember>Is NOT member</IsNotMember>

      <h2>Deadline dates this year</h2>
      <ul>
        {/* search for Date Edit when changing */}
        <li>
          <span className={classes.deadlineExpired}>
            Initial registration and deposits: <Acnw.RegistrationDeadline />, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Membership payment in full: <Acnw.PaymentDeadline />, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Games and Events due: <Acnw.GameSubmissionDeadline />, <Acnw.ConventionYear />
          </span>
        </li>
        {/* and on home/gameBookClosed.gsp */}
        <li>
          <span className={classes.deadlineExpired}>
            Game Book preview to GMs: September 8 &amp; 9, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Game Books open for selections: September 13, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Game Selections due: September 18, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Last date for cancellation with full refund: September 18, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Schedule previews to GMs: September 24, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Schedules SENT to all players: September 26, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Orders for shirts: October 9, <Acnw.ConventionYear />
          </span>
        </li>
        {/* referenced in shirtOrder / _form.gsp */}
        <li>
          <span className={classes.deadline}>
            Travel coordination information due: October 16, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Last date for cancellation with partial refund: October 20, <Acnw.ConventionYear />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Wednesday dinner RSVP: October 23, <Acnw.ConventionYear />
          </span>
        </li>
      </ul>

      <p>
        If you are accessing this site after{' '}
        <strong>
          <Acnw.PaymentDeadline />
        </strong>
        , please contact the organizers by e-mail at <Acnw.SimoneEmail /> before registering.
      </p>
      <br />
    </Page>
  )
}
