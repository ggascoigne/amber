import React from 'react'

import { DialogContentText } from '@mui/material'
import { ConfigDate, ContactEmail, Link, useConfiguration } from 'amber'
import { CheckboxWithLabel, GridContainer, GridItem } from 'ui'

export const IntroStep = ({ prefix = '' }: { prefix?: string }) => {
  const configuration = useConfiguration()
  return (
    <>
      <DialogContentText>
        If you are accessing this site after{' '}
        <strong>
          <ConfigDate name='gameBookOpen' />
        </strong>
        , please contact the organizers by e-mail at <ContactEmail /> before registering.
      </DialogContentText>

      <DialogContentText>
        In order to run and play games offered through the convention, the first thing you must do is register. If you
        are not already familiar with format of an AmberCon, review the {configuration.title}{' '}
        <Link href='/about'>&ldquo;what you get and what it costs&rdquo; page</Link>.
      </DialogContentText>

      <DialogContentText>
        You should also review both our <Link href='/anti-harassment-policy'>Anti-Harassment Policy</Link> and our{' '}
        <Link href='/covid-policy'>COVID Policy</Link>.
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
}
