import React from 'react'

import { Grid } from '@mui/material'
import type { GridProps } from '@mui/material/Grid'

interface GridContainerProps extends GridProps {
  className?: string
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, sx, className = '', ...rest }) => (
  <Grid
    container
    {...rest}
    sx={[
      {
        ...{ width: 'auto' },
      },
      // You cannot spread `sx` directly because `SxProps` (typeof sx) can be an array.
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    className={className}
  >
    {children}
  </Grid>
)
