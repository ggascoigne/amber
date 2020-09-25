import { useTheme } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...contentPageStyles(theme),
    small: {
      padding: 16,
    },
  })
)

type Page = {
  className?: string
}

export const Page: React.FC<Page> = ({ children, className }) => {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <div
      className={classNames({
        [classes.main]: true,
        [classes.mainRaised]: !fullScreen,
        [classes.small]: fullScreen,
        className,
      })}
    >
      {children}
    </div>
  )
}
