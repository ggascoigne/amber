import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { Acnw, ConfigDate } from 'components'
import { IsNotLoggedIn } from 'components/Auth'
import { Banner } from 'components/Banner'
import { Page } from 'components/Page'
import React from 'react'
import { IsMember, IsNotMember } from 'utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    banner: {
      textAlign: 'center',
    },
    deadline: {},
    deadlineExpired: {
      color: theme.palette.error.main,
      '&:after': {
        content: '" - date passed"',
      },
    },
  })
)

export const Welcome: React.FC = () => {
  const classes = useStyles()

  return (
    <Page title='Welcome'>
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
        <a href='https://www.mcmenamins.com/edgefield' target='_new'>
          McMenamins Edgefield Bed and Breakfast Resort
        </a>
        .
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

      <h2>Attending AmberCon NW</h2>

      <IsNotLoggedIn>
        <h4>New Authentication system.</h4>
        <p>
          We have a new authentication system. If you have an account from the old system, you can access it by signing
          up again using the same email address as before and then confirming that email address.
        </p>
        <p>
          Please note, that you can also login with either Facebook or Google. The same email advice applies in this
          case too.
        </p>
      </IsNotLoggedIn>

      <IsMember>Is a member</IsMember>
      <IsNotMember>
        <p>If you are interested in attending AmberCon NW this year, please Signup.</p>
      </IsNotMember>

      <h2>Deadline dates this year</h2>
      <ul>
        {/* search for Date Edit when changing */}
        <li>
          <span className={classes.deadline}>
            Initial registration and deposits: <ConfigDate name='registrationDeadline' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Membership payment in full: <ConfigDate name='gameSubmissionDeadline' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Games and Events due: <ConfigDate name='gameSubmissionDeadline' />
          </span>
        </li>
        {/* and on home/gameBookClosed.gsp */}
        <li>
          <span className={classes.deadline}>
            Game Book preview to GMs: <ConfigDate name='gameGmPreview' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Game Books open for selections: <ConfigDate name='gameBookOpen' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Game Selections due: <ConfigDate name='gameChoicesDue' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Last date for cancellation with full refund: <ConfigDate name='gameSubmissionDeadline' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Schedule previews to GMs: <ConfigDate name='gmPreview' />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Schedules SENT to all players: <ConfigDate name='schedulesSent' />
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
          <ConfigDate name='gameSubmissionDeadline' />
        </strong>
        , please contact the organizers by e-mail at <Acnw.ContactEmail /> before registering.
      </p>
      <br />
    </Page>
  )
}
