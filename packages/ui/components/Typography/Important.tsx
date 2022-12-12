import { Typography, TypographyProps } from '@mui/material'
import React from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Important = <C extends React.ElementType>(props: TypographyProps<C, { component?: C }>) => {
  const { classes, cx } = useTypographyStyles()
  const { children, className: userClassName, ...rest } = props
  return (
    <Typography
      className={cx({ [classes.defaultFontStyle]: !props.variant }, classes.importantText, userClassName)}
      {...rest}
    >
      {children}
    </Typography>
  )
}
