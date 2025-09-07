import React from 'react'

import { ConfigDate, ContactEmail } from '@amber/amber/components'
import { BetaWarning } from '@amber/amber/components/BetaWarning'
import { MdxWithExternalLinks, Page } from '@amber/ui'
import { Box } from '@mui/material'

import { DynamicMemberContent } from './Welcome'

import { Banner } from '../components/Banner'
import WelcomeContentVirtual from '../content/WelcomeContentVirtual.mdx'

// const useStyles = makeStyles()((theme: Theme) => ({
//   banner: {
//     textAlign: 'center',
//   },
//   deadline: {},
//   deadlineExpired: {
//     color: theme.palette.error.main,
//     '&:after': {
//       content: '" - date passed"',
//     },
//   },
//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingLeft: 24,
//     paddingRight: 24,
//   },
//   title: {
//     color: '#fff',
//     fontWeight: 300,
//     textTransform: 'none',
//   },
// }))

export const WelcomeVirtual = () => {
  const titleElement = (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Banner />
      </Box>
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
        , please contact the organizers by e-mail at <ContactEmail /> before registering.
      </p>
      <p>NOTE: all dates are tentative due to potential technological restrictions.</p>
      <ul>
        <li>
          <Box
            component='span'
            sx={{ color: (theme) => theme.palette.error.main, '&:after': { content: '" - date passed"' } }}
          >
            Games and Events due: <ConfigDate name='gameSubmissionDeadline' />
          </Box>
        </li>
        <li>
          <Box
            component='span'
            sx={{ color: (theme) => theme.palette.error.main, '&:after': { content: '" - date passed"' } }}
          >
            All attendee registrations due: <ConfigDate name='registrationDeadline' />
          </Box>
        </li>
        <li>
          <Box
            component='span'
            sx={{ color: (theme) => theme.palette.error.main, '&:after': { content: '" - date passed"' } }}
          >
            Game Book preview to GMs: <ConfigDate name='gameGmPreview' />
          </Box>
        </li>
        <li>
          <Box
            component='span'
            sx={{ color: (theme) => theme.palette.error.main, '&:after': { content: '" - date passed"' } }}
          >
            GM Feedback on Game Book: <ConfigDate name='gameGmFeedbackDeadline' />
          </Box>
        </li>
        <li>
          <span>
            Game Books open for selections: <ConfigDate name='gameBookOpen' />
          </span>
        </li>
        <li>
          <span>
            Game Selections due: <ConfigDate name='gameChoicesDue' />
          </span>
        </li>
        <li>
          <span>
            Schedule previews to GMs: <ConfigDate name='gmPreview' />
          </span>
        </li>
        <li>
          <span>
            Schedules SENT to all players: <ConfigDate name='schedulesSent' />
          </span>
        </li>
      </ul>
    </Page>
  )
}
