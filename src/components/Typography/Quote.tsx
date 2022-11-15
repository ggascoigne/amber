import React from 'react'

import { useTypographyStyles } from './typographyStyle'

interface QuoteProps {
  text: React.ReactNode
  author?: React.ReactNode
}

export const Quote: React.FC<QuoteProps> = (props) => {
  const { text, author } = props
  const { classes } = useTypographyStyles()
  return (
    <blockquote className={`${classes.defaultFontStyle} ${classes.quote}`}>
      <p className={classes.quoteText}>{text}</p>
      <small className={classes.quoteAuthor}>{author}</small>
    </blockquote>
  )
}
