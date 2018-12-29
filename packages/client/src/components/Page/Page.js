import { withStyles } from '@material-ui/core'

import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import React from 'react'

const styles = theme => ({
  ...contentPageStyles(theme)
})

const Page = ({ classes, children, className }) => {
  return <div className={classNames(classes.main, classes.mainRaised, className)}>{children}</div>
}

export default withStyles(styles, { withTheme: true })(Page)
