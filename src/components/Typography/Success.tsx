import React, { PropsWithChildren } from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Success: React.FC<PropsWithChildren<unknown>> = (props) => {
  const { classes } = useTypographyStyles()
  const { children } = props
  return <div className={classes.defaultFontStyle + ' ' + classes.successText}>{children}</div>
}
