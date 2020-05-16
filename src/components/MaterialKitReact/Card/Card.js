// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// core components
import styles from 'assets/jss/material-kit-react/components/cardStyle'
// nodejs library that concatenates classes
import classNames from 'classnames'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
import React from 'react'
// @material-ui/icons

const useStyles = makeStyles(styles)

export default function Card(props) {
  const classes = useStyles()
  const { className, children, plain, carousel, ...rest } = props
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardCarousel]: carousel,
    [className]: className !== undefined,
  })
  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  )
}

Card.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  plain: PropTypes.bool,
  carousel: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
}
