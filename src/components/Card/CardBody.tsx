import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(
  createStyles({
    cardBody: {
      padding: '0.9375rem 1.875rem',
      flex: '1 1 auto',
    },
  })
)

interface CardBodyProps {
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = (props) => {
  const classes = useStyles()
  const { className, children, ...rest } = props
  const cardBodyClasses = clsx(classes.cardBody, className)
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  )
}
