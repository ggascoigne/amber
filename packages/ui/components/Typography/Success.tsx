import type { PropsWithChildren } from 'react'
import type React from 'react'

import { Box } from '@mui/material'

export const Success: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Box
    sx={(theme) => ({
      fontWeight: 300,
      lineHeight: '1.5em',
      fontSize: '14px',
      color: theme.palette.success.main,
    })}
  >
    {children}
  </Box>
)
