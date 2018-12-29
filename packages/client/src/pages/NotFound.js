import Typography from '@material-ui/core/Typography'
import SnackbarContent from 'components/Snackbar/SnackbarContent.jsx'
import React from 'react'
import Page from 'components/Page/Page'

const NotFound = () => (
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

export default NotFound
