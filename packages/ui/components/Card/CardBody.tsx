import type { PropsWithChildren } from 'react'
import type React from 'react'

import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  sx?: SxProps<Theme>
}

export const CardBody: React.FC<PropsWithChildren<CardBodyProps>> = (props) => {
  const { className, children, sx, ...rest } = props
  const defaultSx: SxProps<Theme> = {
    padding: '0.9375rem 1.875rem',
    flex: '1 1 auto',
  }
  const mergedSx = [defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]
  return (
    <Box className={className} sx={mergedSx} {...rest}>
      {children}
    </Box>
  )
}
