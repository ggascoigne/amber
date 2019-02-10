import Typography from '@material-ui/core/Typography'
import { Page } from 'components/Acnw/Page'
import SnackbarContent from 'components/MaterialKitReact/Snackbar/SnackbarContent.jsx'
import React from 'react'

export const NotFound = () => (
  <Page>
    <SnackbarContent
      message={
        <span>
          <b>404:</b> Page not found...
        </span>
      }
      color='danger'
      icon='error_outline'
    />
    <Typography variant='body1' color='inherit'>
      Sorry, that link no longer exists.
    </Typography>
  </Page>
)
