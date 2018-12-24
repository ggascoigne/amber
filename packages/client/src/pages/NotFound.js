import withStyles from '@material-ui/core/styles/withStyles'
import notificationsStyles from 'assets/jss/material-kit-react/views/componentsSections/notificationsStyles.jsx'

import SnackbarContent from 'components/Snackbar/SnackbarContent.jsx'
import React from 'react'

const NotFound = () => (
  <SnackbarContent
    message={
      <span>
        <b>404:</b> Page not found...
      </span>
    }
    color='danger'
    icon='error_outline'
  />
)

export default withStyles(notificationsStyles)(NotFound)
