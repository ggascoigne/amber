import { Typography, TypographyProps } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Important = <C extends React.ElementType>(props: TypographyProps<C, { component?: C }>) => {
  const classes = useTypographyStyles()
  const { children, className: userClassName, ...rest } = props
  return (
    <Typography
      className={clsx({ [classes.defaultFontStyle]: !props.variant }, classes.importantText, userClassName)}
      {...rest}
    >
      {children}
    </Typography>
  )
}
