import { makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { container } from 'assets/jss/material-kit-react.js'
import { DateTime } from 'luxon'
import React from 'react'
import { gitHash } from 'version'

const footerStyle = createStyles({
  footer: {
    padding: '0.9375rem 0',
    textAlign: 'center',
    display: 'flex',
    zIndex: 2,
    position: 'relative',
  },
  container: {
    ...container,
    fontSize: '0.75rem',
  },
})

const useStyles = makeStyles(footerStyle)

export const Footer: React.FC = (props) => {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        {gitHash.substring(0, 8)} | &copy; {DateTime.fromJSDate(new Date()).year} amberconnw.org
      </div>
    </footer>
  )
}
