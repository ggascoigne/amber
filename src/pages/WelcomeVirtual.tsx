import { Theme, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'

import { Acnw, ConfigDate } from '../components'
import { Banner } from '../components/Banner'
import { BetaWarning } from '../components/BetaWarning'
import { MdxWithExternalLinks } from '../components/MdxWithExternalLinks'
import { Page } from '../components/Page'
// @ts-ignore
import WelcomeContentVirtual from '../content/WelcomeContentVirtual.mdx'
import { DynamicMemberContent } from './Welcome'

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
