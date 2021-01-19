import { useTheme } from '@material-ui/core'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import classNames from 'classnames'
import React from 'react'
import { Helmet } from 'react-helmet-async'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...contentPageStyles(theme),
    small: {
      padding: 16,
    },
  })
)

type PageProps = {
  className?: string
  title: string
}

export const Page: React.FC<PageProps> = ({ children, className, title }) => {
  const classes = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <div
      className={classNames(
        {
          [classes.main]: true,
          [classes.mainRaised]: !fullScreen,
          [classes.small]: fullScreen,
        },
        className
      )}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  )
}
