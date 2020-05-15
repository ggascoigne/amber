// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles'
// core components
import typographyStyle from 'assets/jss/material-kit-react/components/typographyStyle.jsx'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'

function Small({ ...props }) {
  const { classes, children } = props
  return <div className={classes.defaultFontStyle + ' ' + classes.smallText}>{children}</div>
}

Small.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(typographyStyle)(Small)
