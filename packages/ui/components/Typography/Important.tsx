import type React from 'react'

import type { SxProps, Theme, TypographyProps } from '@mui/material'
import { Typography } from '@mui/material'

export const Important = <C extends React.ElementType>(props: TypographyProps<C, { component?: C }>) => {
  const { children, className, sx, variant, ...rest } = props as TypographyProps<any, any> & {
    sx?: SxProps<Theme>
  }
  const defaultSx: SxProps<Theme> = (theme) => ({
    // apply base font style only when variant is not specified
    ...(variant ? {} : { fontWeight: 300, lineHeight: '1.5em', fontSize: '14px' }),
    color: theme.palette.error.main,
    fontVariant: 'small-caps',
    fontWeight: 500,
  })
  const mergedSx = [defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]
  return (
    <Typography className={className} sx={mergedSx} {...rest}>
      {children}
    </Typography>
  )
}
