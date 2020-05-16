import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Snack from '@material-ui/core/SnackbarContent'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// @material-ui/icons
import Close from '@material-ui/icons/Close'
import styles from 'assets/jss/material-kit-react/components/snackbarContentStyle'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
// core components

const useStyles = makeStyles(styles)

export default function SnackbarContent(props) {
  const { message, color, close, icon } = props
  const classes = useStyles()
  let action = []
  const closeAlert = () => {
    setAlert(null)
  }
  if (close !== undefined) {
    action = [
      <IconButton className={classes.iconButton} key='close' aria-label='Close' color='inherit' onClick={closeAlert}>
        <Close className={classes.close} />
      </IconButton>,
    ]
  }
  let snackIcon = null
  switch (typeof icon) {
    case 'object':
      snackIcon = <props.icon className={classes.icon} />
      break
    case 'string':
      snackIcon = <Icon className={classes.icon}>{props.icon}</Icon>
      break
    default:
      snackIcon = null
      break
  }
  const [alert, setAlert] = React.useState(
    <Snack
      message={
        <div>
          {snackIcon}
          {message}
          {close !== undefined ? action : null}
        </div>
      }
      classes={{
        root: classes.root + ' ' + classes[color],
        message: classes.message + ' ' + classes.container,
      }}
    />
  )
  return alert
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['info', 'success', 'warning', 'danger', 'primary']),
  close: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}
