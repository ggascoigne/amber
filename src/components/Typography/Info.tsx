import React from 'react'

import { useTypographyStyles } from './typographyStyle'

export const Info: React.FC = (props) => {
  const classes = useTypographyStyles()
  const { children } = props
  return <div className={classes.defaultFontStyle + ' ' + classes.infoText}>{children}</div>
}
