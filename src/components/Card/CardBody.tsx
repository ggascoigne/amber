import { createStyles, makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import React from 'react'

const useStyles = makeStyles(
  createStyles({
    cardBody: {
      padding: '0.9375rem 1.875rem',
      flex: '1 1 auto',
    },
  })
)

type CardBodyProps = {
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = (props) => {
  const classes = useStyles()
  const { className, children, ...rest } = props
  const cardBodyClasses = classNames(classes.cardBody, className)
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  )
}
