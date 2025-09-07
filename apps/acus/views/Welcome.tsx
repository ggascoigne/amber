import React from 'react'

import { ConfigDate, ContactEmail, MDY } from '@amber/amber/components'
import { BetaWarning } from '@amber/amber/components/BetaWarning'
import { Link } from '@amber/amber/components/Navigation'
import { IsMember } from '@amber/amber/utils'
import { MdxWithExternalLinks, Page } from '@amber/ui'
import { Box, Button } from '@mui/material'

import { BecomeAMember } from './Memberships'

import { Banner } from '../components'
import WelcomeContent from '../content/WelcomeContent.mdx'

export const DynamicMemberContent = () => (
  <>
    <BecomeAMember />
    <IsMember>
      <Button variant='outlined' color='primary' size='large' href='/gm' component={Link} style={{ marginTop: 8 }}>
        Become a GM
      </Button>
    </IsMember>
  </>
)

export const Welcome = () => {
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
        <WelcomeContent />
      </MdxWithExternalLinks>
      <DynamicMemberContent />

      <h2>Deadline dates this year</h2>
      <p>
        If you are accessing this site after{' '}
        <strong>
          <ConfigDate name='gameChoicesDue' format={MDY} />
        </strong>
        , please contact the organizers by e-mail at <ContactEmail /> before registering.
      </p>

      <ul>
        <li>
          <span>
            Registration Open: <ConfigDate name='registrationOpen' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Membership payment in full: <ConfigDate name='paymentDeadline' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Games and Events due: <ConfigDate name='gameSubmissionDeadline' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Game Book Preview to GMs: <ConfigDate name='gameGmPreview' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Game Books open for selections: <ConfigDate name='gameBookOpen' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Game Selections due: <ConfigDate name='gameChoicesDue' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Schedules sent to all GMs and Players: <ConfigDate name='schedulesSent' format={MDY} />
          </span>
        </li>
      </ul>
    </Page>
  )
}
