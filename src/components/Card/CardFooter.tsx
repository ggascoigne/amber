import { createStyles, makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import React from 'react'

const useStyles = makeStyles(
  createStyles({
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'transparent',
      padding: '0.9375rem 1.875rem',
    },
  })
)

type CardFooterProps = {
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = (props) => {
  const classes = useStyles()
  const { className, children, ...rest } = props
  const cardFooterClasses = classNames(classes.cardFooter, className)
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  )
}
