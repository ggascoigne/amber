import Button from '@material-ui/core/Button'
// @material-ui/core components
import makeStyles from '@material-ui/core/styles/makeStyles'
import buttonStyle from 'assets/jss/material-kit-react/components/buttonStyle'
import classNames from 'classnames'
import React from 'react'

// core components

const makeComponentStyles = makeStyles(buttonStyle)

type RegularButtonType = {
  color?:
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'rose'
    | 'white'
    | 'facebook'
    | 'twitter'
    | 'google'
    | 'github'
    | 'transparent'
  size?: 'sm' | 'lg'
  simple?: boolean
  round?: boolean
  fullWidth?: boolean
  disabled?: boolean
  block?: boolean
  link?: boolean
  justIcon?: boolean
  children?: React.ReactNode
  className?: string
  onClick?: React.EventHandler<any>
}

const RegularButton = React.forwardRef<HTMLButtonElement, RegularButtonType>((props, ref) => {
  const { color, round, children, fullWidth, disabled, simple, size, block, link, justIcon, className, ...rest } = props

  const classes = makeComponentStyles()

  const btnClasses = classNames(
    {
      [classes.button]: true,
      [classes.round]: round,
      [classes.fullWidth]: fullWidth,
      [classes.disabled]: disabled,
      [classes.simple]: simple,
      [classes.block]: block,
      [classes.link]: link,
      [classes.justIcon]: justIcon,
    },
    className,
    size && classes[size],
    color && classes[color]
  )
  return (
    <Button {...rest} ref={ref} className={btnClasses}>
      {children}
    </Button>
  )
})

export default RegularButton
