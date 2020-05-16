// mterial-ui components
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const styles = {
  clearfix: {
    '&:after,&:before': {
      display: 'table',
      content: '" "',
    },
    '&:after': {
      clear: 'both',
    },
  },
}

const useStyles = makeStyles(styles)

export default function Clearfix() {
  const classes = useStyles()
  return <div className={classes.clearfix} />
}

Clearfix.propTypes = {}
