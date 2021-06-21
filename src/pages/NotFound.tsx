import { Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Page } from 'components/Page'
import React from 'react'

export const NotFound = () => (
  <Page title='Not Found'>
    <Alert severity='error'>
      <b>404:</b> Page not found...
    </Alert>
    <Typography variant='body1' color='inherit'>
      Sorry, that link no longer exists.
    </Typography>
  </Page>
)
