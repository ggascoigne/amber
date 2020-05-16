import Grid from '@material-ui/core/Grid'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'

const styles = {
  grid: {
    marginRight: '-15px',
    marginLeft: '-15px',
    width: 'auto',
  },
}

const useStyles = makeStyles(styles)

export default function GridContainer(props) {
  const classes = useStyles()
  const { children, className, ...rest } = props
  return (
    <Grid container {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  )
}

GridContainer.defaultProps = {
  className: '',
}

GridContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
