import { Theme } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

import { Acnw, ConfigDate } from 'ui/components'
import { Banner } from 'ui/components/Banner'
import { BetaWarning } from 'ui/components/BetaWarning'
import { MdxWithExternalLinks } from 'ui/components/MdxWithExternalLinks'
import { Page } from 'ui/components/Page'
import WelcomeContentVirtual from '../content/WelcomeContentVirtual.mdx'
import { DynamicMemberContent } from './Welcome'

const useStyles = makeStyles()((theme: Theme) => ({
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
}))

export const WelcomeVirtual: React.FC = () => {
  const { classes } = useStyles()

  const titleElement = (
    <>
      <div className={classes.banner}>
        <Banner />
      </div>
      <BetaWarning />
      <h1>Welcome!</h1>
    </>
  )

  return (
    <Page title='Welcome' titleElement={titleElement}>
      <MdxWithExternalLinks>
        <WelcomeContentVirtual />
      </MdxWithExternalLinks>
      <DynamicMemberContent />

      <h2>Deadline dates this year</h2>
      <p>
        If you are accessing this site after{' '}
        <strong>
          <ConfigDate name='gameGmPreview' />
        </strong>
        , please contact the organizers by e-mail at <Acnw.ContactEmail /> before registering.
      </p>
      <p>NOTE: all dates are tentative due to potential technological restrictions.</p>
      <ul>
        <li>
          <span className={classes.deadlineExpired}>
            Games and Events due: <ConfigDate name='gameSubmissionDeadline' />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            All attendee registrations due: <ConfigDate name='registrationDeadline' />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            Game Book preview to GMs: <ConfigDate name='gameGmPreview' />
          </span>
        </li>
        <li>
          <span className={classes.deadlineExpired}>
            GM Feedback on Game Book: <ConfigDate name='gameGmFeedbackDeadline' />
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
            Schedule previews to GMs: <ConfigDate name='gmPreview' />
          </span>
        </li>
        <li>
          <span className={classes.deadline}>
            Schedules SENT to all players: <ConfigDate name='schedulesSent' />
          </span>
        </li>
      </ul>
    </Page>
  )
}
