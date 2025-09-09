import React from 'react'

import { ConfigDate, ContactEmail, MDY } from '@amber/amber/components'
import { BetaWarning } from '@amber/amber/components/BetaWarning'
import { Link } from '@amber/amber/components/Navigation'
import { IsMember } from '@amber/amber/utils'
import { MdxWithExternalLinks, Page } from '@amber/ui'
import { Box, Button } from '@mui/material'

import { BecomeAMember } from './Memberships'

import { Banner } from '../components/Banner'
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
          <ConfigDate name='gameGmPreview' format={MDY} />
        </strong>
        , please contact the organizers by e-mail at <ContactEmail /> before registering.
      </p>

      <ul>
        <li>
          <span>
            Registration Open: <ConfigDate name='registrationOpen' format={MDY} />
          </span>
        </li>
        {/*
        <li>
          <span className={classes.deadline}>
            Initial registration and deposits: <ConfigDate name='registrationDeadline' format={MDY}/>
          </span>
        </li>
*/}
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
        {/* and on home/gameBookClosed.gsp */}
        <li>
          <span>
            Game Book preview to GMs: <ConfigDate name='gameGmPreview' format={MDY} />
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
        {/* <li> */}
        {/*  <span className={classes.deadline}> */}
        {/*    Last date for cancellation with full refund: <ConfigDate name='gameSubmissionDeadline' format={MDY}/> */}
        {/*  </span> */}
        {/* </li> */}
        <li>
          <span>
            Schedule previews to GMs: <ConfigDate name='gmPreview' format={MDY} />
          </span>
        </li>
        <li>
          <span>
            Schedules SENT to all players: <ConfigDate name='schedulesSent' format={MDY} />
          </span>
        </li>
        {/* <li> */}
        {/*  <span className={classes.deadline}> */}
        {/*    Orders for shirts: October 9, <Acnw.ConventionYear /> */}
        {/*  </span> */}
        {/* </li> */}
        {/* referenced in shirtOrder / _form.gsp */}
        {/* <li>
          <span className={classes.deadline}>
            Travel coordination information due: <ConfigDate name='travelCoordination' format={MDY} />
          </span>
        </li> */}
        <li>
          <span>
            Last date for cancellation with partial refund:{' '}
            <ConfigDate name='lastCancellationFullRefund' format={MDY} />
          </span>
        </li>
        {/* <li> */}
        {/*  <span className={classes.deadline}> */}
        {/*    Wednesday dinner RSVP: October 23, <Acnw.ConventionYear /> */}
        {/*  </span> */}
        {/* </li> */}
      </ul>
    </Page>
  )
}
