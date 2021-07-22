import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
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

interface CardFooterProps {
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = (props) => {
  const classes = useStyles()
  const { className, children, ...rest } = props
  const cardFooterClasses = clsx(classes.cardFooter, className)
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  )
}
