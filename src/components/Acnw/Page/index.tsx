import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...contentPageStyles(theme)
  })
)

type Page = {
  className?: string
}

export const Page: React.FC<Page> = ({ children, className }) => {
  const classes = useStyles()
  return <div className={classNames(classes.main, classes.mainRaised, className)}>{children}</div>
}
