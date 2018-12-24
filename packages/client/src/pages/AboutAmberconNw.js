import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
import React from 'react'
import contentPageStyles from 'assets/jss/acnw/contentPage'

const styles = theme => ({
  ...contentPageStyles(theme)
})

const AboutAmberconNw = ({ classes }) => {
  return (
    <div className={classNames(classes.main, classes.mainRaised)}>
      <Typography variant='h3' color='inherit'>
        About AmberCon NW
      </Typography>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(AboutAmberconNw)
