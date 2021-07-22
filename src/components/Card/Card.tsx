import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(
  createStyles({
    card: {
      border: '0',
      marginBottom: '30px',
      marginTop: '30px',
      borderRadius: '6px',
      color: 'rgba(0, 0, 0, 0.87)',
      background: '#fff',
      width: '100%',
      boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '0',
      wordWrap: 'break-word',
      fontSize: '.875rem',
      transition: 'all 300ms linear',
    },
    cardPlain: {
      background: 'transparent',
      boxShadow: 'none',
    },
    cardCarousel: {
      overflow: 'hidden',
    },
  })
)

interface CardProps {
  id?: string
  className?: string
  plain?: boolean
  carousel?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = (props) => {
  const classes = useStyles()
  const { className, children, plain, carousel, ...rest } = props
  const cardClasses = clsx(
    classes.card,
    {
      [classes.cardPlain]: plain,
      [classes.cardCarousel]: carousel,
    },
    className
  )
  return (
    <div className={cardClasses} {...rest}>
      {children}
    </div>
  )
}
