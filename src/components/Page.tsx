import { useTheme } from '@mui/material'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  main: {
    background: '#FFFFFF',
    position: 'relative',
    zIndex: 3,
  },
  mainRaised: {
    margin: '0px 20px 0px',
    borderRadius: '6px',
    boxShadow: theme.mixins.boxShadow.page,
    padding: theme.spacing(3),
  },
  small: {
    padding: 16,
  },
  smaller: {
    fontSize: '2.25rem',
    lineHeight: '1.5em',
    fontWeight: 300,
    color: 'inherit',
    marginTop: 20,
    marginBottom: 10,
  },
}))

interface PageProps {
  className?: string
  title: string
  titleElement?: ReactNode
  hideTitle?: boolean
  smaller?: boolean
}

export const Page: React.FC<PropsWithChildren<PageProps>> = ({
  children,
  className,
  title,
  titleElement,
  hideTitle = false,
  smaller = false,
}) => {
  const { classes, cx } = useStyles()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <div
      className={cx(
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
      {!hideTitle ? titleElement ?? <h1 className={classes.smaller}>{title}</h1> : null}
      {children}
    </div>
  )
}
