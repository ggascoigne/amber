import React from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Danger: React.FC = (props) => {
  const classes = useTypographyStyles()
  const { children } = props
  return <div className={classes.defaultFontStyle + ' ' + classes.dangerText}>{children}</div>
}
