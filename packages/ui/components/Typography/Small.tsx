import React, { PropsWithChildren } from 'react'

import { Box } from '@mui/material'

export const Small: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Box sx={{ fontWeight: 400, lineHeight: '1', fontSize: '65%', color: '#777' }}>{children}</Box>
)
