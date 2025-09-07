import React, { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

export const Warning: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Box
    sx={(theme) => ({
      fontWeight: 300,
      lineHeight: '1.5em',
      fontSize: '14px',
      color: theme.palette.warning.main,
    })}
  >
    {children}
  </Box>
)
