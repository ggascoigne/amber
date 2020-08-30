import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { dangerColor } from 'assets/jss/material-kit-react'
import Acnw, { Loader } from 'components/Acnw'
import { useAuth } from 'components/Acnw/Auth'
import { Banner } from 'components/Acnw/Banner'
import { Page } from 'components/Acnw/Page'
import React, { Suspense } from 'react'

const ReactJson = React.lazy(() => import('@ggascoigne/react-json-view'))

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

export const Welcome: React.FC = () => {
  const classes = useStyles()
  const { isAuthenticated, user } = useAuth()

  return (
    <Page>
      <div className={classes.banner}>
        <Banner />
      </div>
      <h1>Welcome!</h1>

      {isAuthenticated && !!user ? (
        <div>
          <h2>User Profile</h2>
          <Suspense fallback={<Loader />}>
            <ReactJson src={user} indentWidth={2} enableClipboard={false} sortKeys />
          </Suspense>
        </div>
      ) : null}
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
