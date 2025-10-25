import type { PropsWithChildren } from 'react'
import type React from 'react'

import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  sx?: SxProps<Theme>
}

export const CardFooter: React.FC<PropsWithChildren<CardFooterProps>> = (props) => {
  const { className, children, sx, ...rest } = props
  const defaultSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: '0.9375rem 1.875rem',
  }
  return (
    <Box className={className} sx={[defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </Box>
  )
}
