import { DialogContentText } from '@mui/material'
import { Acnw, ConfigDate } from 'components'
import React from 'react'
import { Link } from 'react-router-dom'

import { CheckboxWithLabel } from '../../components/Form'
import { GridContainer, GridItem } from '../../components/Grid'
import { configuration } from '../../utils'

export const IntroStep: React.FC<{ prefix?: string }> = ({ prefix = '' }) => (
  <>
    <DialogContentText>
      If you are accessing this site after{' '}
      <strong>
        <ConfigDate name='gameBookOpen' />
      </strong>
      , please contact the organizers by e-mail at <Acnw.ContactEmail /> before registering.
    </DialogContentText>

    <DialogContentText>
      In order to run and play games offered through the convention, the first thing you must do is register. If you are
      not already familiar with format of an AmberCon, review the AmberCon NW{' '}
      <Link to='/about-acnw'>"what you get and what it costs" page</Link>.
    </DialogContentText>

    <DialogContentText>
      <strong>
        Masks are required in all convention spaces, as is vaccination or proof of negative covid PCR test.
      </strong>
    </DialogContentText>

    <DialogContentText>
      You should also review both our <Link to='/antiHarassmentPolicy'>Anti-Harassment Policy</Link> and our{' '}
      <Link to='/covidPolicy'>COVID Policy</Link>.
      {configuration.virtual &&
        ' You will be asked to agree to abide by these policy, along with some adaptations specific to on-line interactions, when you first join the Discord server.'}
    </DialogContentText>
    {!configuration.virtual && (
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <CheckboxWithLabel
            label='Click here to indicate acceptance of these policies'
            name={`${prefix}acceptedPolicies`}
          />
        </GridItem>
      </GridContainer>
    )}
  </>
)
