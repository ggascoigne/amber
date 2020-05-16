import Grid from '@material-ui/core/Grid'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'

const styles = {
  grid: {
    position: 'relative',
    width: '100%',
    minHeight: '1px',
    paddingRight: '15px',
    paddingLeft: '15px',
    flexBasis: 'auto',
  },
}

const useStyles = makeStyles(styles)

export default function GridItem(props) {
  const classes = useStyles()
  const { children, className, ...rest } = props
  return (
    <Grid item {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  )
}

GridItem.defaultProps = {
  className: '',
}

GridItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
