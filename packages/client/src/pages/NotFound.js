import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import SnackbarContent from 'components/Snackbar/SnackbarContent.jsx'
import React from 'react'

const styles = theme => ({
  ...contentPageStyles(theme)
})

const NotFound = ({ classes }) => (
  <div className={classNames(classes.main, classes.mainRaised)}>
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
  </div>
)

export default withStyles(styles, { withTheme: true })(NotFound)
