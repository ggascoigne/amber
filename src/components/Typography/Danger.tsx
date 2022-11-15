import React, { PropsWithChildren } from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Danger: React.FC<PropsWithChildren<unknown>> = (props) => {
  const { classes } = useTypographyStyles()
  const { children } = props
  return <div className={`${classes.defaultFontStyle} ${classes.dangerText}`}>{children}</div>
}
