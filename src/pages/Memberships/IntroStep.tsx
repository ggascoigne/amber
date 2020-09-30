import { DialogContentText } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import { Link } from 'react-router-dom'

import Acnw, { ConfigDate } from '../../components/Acnw'

export const IntroStep: React.FC = () => (
  <>
    <DialogContent>
      <DialogContentText>
        If you are accessing this site after{' '}
        <strong>
          <ConfigDate name='gameBookOpen' />
        </strong>
        , please contact the organizers by e-mail at <Acnw.ContactEmail /> before registering.
      </DialogContentText>

      <DialogContentText>
        In order to run and play games offered through the convention, the first thing you must do is register. If you
        are not already familiar with format of an AmberCon, review the AmberCon NW "What you get and what it costs"
        page <Link to='/about-acnw'>here</Link>.
      </DialogContentText>

      <DialogContentText>
        You should also review our Anti-Harassment Policy <Link to='/antiHarassmentPolicy'>here</Link>. You will be
        asked to agree to abide by the policy, along with some adaptations specific to on-line interactions, when you
        first join the Discord server.
      </DialogContentText>
    </DialogContent>
  </>
)
