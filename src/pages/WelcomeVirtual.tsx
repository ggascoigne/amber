import { Button, Card } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { dangerColor } from 'assets/jss/material-kit-react'
import Acnw from 'components/Acnw'
import { Banner } from 'components/Acnw/Banner'
import { Page } from 'components/Acnw/Page'
import CardBody from 'components/MaterialKitReact/Card/CardBody'
import React, { MouseEventHandler, useState } from 'react'

import { IsLoggedIn, IsNotLoggedIn } from '../components/Acnw/Auth/HasPermission'
import { IsNotMember } from '../utils/membership'
import { MembershipDialog } from './Memberships/MembershipDialog'

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
    card: {
      paddingTop: 0,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
    },
    title: {
      color: '#fff',
      fontWeight: 300,
      textTransform: 'none',
    },
  })
)

export const WelcomeVirtual: React.FC = () => {
  const classes = useStyles()
  const [showMembershipForm, setShowMembershipForm] = useState(false)

  const openMembershipDialog = () => {
    setShowMembershipForm(true)
  }

  const onCloseMembershipDialog: MouseEventHandler = () => {
    setShowMembershipForm(false)
  }

  return (
    <Page>
      <div className={classes.banner}>
        <Banner />
      </div>
      <h1>Welcome!</h1>

      <p>
        AmberCon Northwest is a fully scheduled role-playing game convention in Troutdale, Oregon, just east of
        Portland. ACNW was originally devoted to Roger Zelazny's worlds of Amber and Phage Press's{' '}
        <strong>Amber Diceless RPG</strong> by Erick Wujcik. It has expanded over the years to encompass other diceless
        and indie RPGs of all kinds, and most recently Rite Publishing's <strong>Lords of Gossamer and Shadow</strong>,
        a new take and expansion upon the Amber Diceless gaming rules.
      </p>

      <p>
        <Acnw.ConventionYear /> marks AmberCon Northwest's <Acnw.Ordinal /> year at the venue that makes it unique,
        McMenamins Edgefield Bed and Breakfast Resort.
      </p>

      <p>
        Use this site to learn how an AmberCon works; explore the venue; register for the convention; submit game events
        to the organizers; sign up for games when the event book is published; and check out the event books from past
        AmberCon Northwests.
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

      <IsNotMember>
        <Card elevation={3}>
          <CardBody className={classes.card}>
            <h2>Attending Virtual AmberCon NW</h2>
            <IsNotLoggedIn>
              <h4>New Authentication system.</h4>
              <p>
                We have a new authentication system. If you have an account from the old system, you can access it by
                signing up again using the same email address as before and then confirming that email address.
              </p>
              <p>
                Please note, that you can also login with either Facebook or Google. The same email advice applies in
                this case too.
              </p>
            </IsNotLoggedIn>

            <IsLoggedIn>
              {showMembershipForm && <MembershipDialog open={showMembershipForm} onClose={onCloseMembershipDialog} />}

              <p>
                If you are interested in attending AmberCon NW this year, please{' '}
                <Button variant='outlined' color='primary' size='large' onClick={openMembershipDialog}>
                  {' '}
                  Signup
                </Button>
              </p>
            </IsLoggedIn>
          </CardBody>
        </Card>
      </IsNotMember>

      <h2>Deadline dates this year</h2>
      <ul>
        {/* search for Date Edit when changing */}
        <li>
          <span className={classes.deadlineExpired}>
            Initial registration and deposits: <Acnw.RegistrationDeadline />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Membership payment in full: <Acnw.PaymentDeadline />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Games and Events due: <Acnw.GameSubmissionDeadline />
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
