import type { PropsWithChildren } from 'react'
import type React from 'react'

import { Box } from '@mui/material'

export const Danger: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Box
    sx={(theme) => ({
      fontWeight: 300,
      lineHeight: '1.5em',
      fontSize: '14px',
      color: theme.palette.error.main,
    })}
  >
    {children}
  </Box>
)
