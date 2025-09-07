import React from 'react'

import { Grid, SxProps, Theme } from '@mui/material'
import type { GridProps } from '@mui/material/Grid'

interface GridItemProps extends GridProps {
  className?: string
  sx?: SxProps<Theme>
}

export const GridItem: React.FC<GridItemProps> = ({ children, className = '', sx, ...rest }) => {
  const defaultSx: SxProps<Theme> = {
    position: 'relative',
    width: '100%',
    minHeight: '1px',
    flexBasis: 'auto',
  }
  return (
    <Grid item {...rest} className={className} sx={[defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {children}
    </Grid>
  )
}
