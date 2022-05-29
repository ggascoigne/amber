import React, { PropsWithChildren } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: '0.9375rem 1.875rem',
  },
})

interface CardFooterProps {
  className?: string
}

export const CardFooter: React.FC<PropsWithChildren<CardFooterProps>> = (props) => {
  const { classes, cx } = useStyles()
  const { className, children, ...rest } = props
  const cardFooterClasses = cx(classes.cardFooter, className)
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  )
}
