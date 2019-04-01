import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import React from 'react'

const styles = (theme: Theme) =>
  createStyles({
    ...contentPageStyles(theme)
  })

interface IPage extends WithStyles<typeof styles> {
  className?: string
}

const _Page: React.FC<IPage> = ({ classes, children, className }) => {
  return <div className={classNames(classes.main, classes.mainRaised, className)}>{children}</div>
}

export const Page = withStyles(styles, { withTheme: true })(_Page)
