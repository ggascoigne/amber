import React, { PropsWithChildren } from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Warning: React.FC<PropsWithChildren<unknown>> = (props) => {
  const { classes } = useTypographyStyles()
  const { children } = props
  return <div className={`${classes.defaultFontStyle} ${classes.warningText}`}>{children}</div>
}
