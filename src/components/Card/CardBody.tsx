import React, { PropsWithChildren } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  cardBody: {
    padding: '0.9375rem 1.875rem',
    flex: '1 1 auto',
  },
})

interface CardBodyProps {
  className?: string
}

export const CardBody: React.FC<PropsWithChildren<CardBodyProps>> = (props) => {
  const { classes, cx } = useStyles()
  const { className, children, ...rest } = props
  const cardBodyClasses = cx(classes.cardBody, className)
  return (
    <div className={cardBodyClasses} {...rest}>
      {children}
    </div>
  )
}
