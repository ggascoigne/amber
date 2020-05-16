// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import styles from 'assets/jss/material-kit-react/components/cardBodyStyle'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
// @material-ui/icons

const useStyles = makeStyles(styles)

export default function CardBody(props) {
  const classes = useStyles()
  const { className, children, ...rest } = props
  const cardBodyClasses = classNames({
    [classes.cardBody]: true,
    [className]: className !== undefined,
  })
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  )
}

CardBody.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
