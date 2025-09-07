import React, { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

export const Muted: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Box sx={{ fontWeight: 300, lineHeight: '1.5em', fontSize: '14px', color: '#777' }}>{children}</Box>
)
