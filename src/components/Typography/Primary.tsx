import React, { PropsWithChildren } from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Primary: React.FC<PropsWithChildren<unknown>> = (props) => {
  const { classes } = useTypographyStyles()
  const { children } = props
  return <div className={classes.defaultFontStyle + ' ' + classes.primaryText}>{children}</div>
}
