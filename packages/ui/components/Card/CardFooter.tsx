import React, { PropsWithChildren } from 'react'

import { Box, SxProps, Theme } from '@mui/material'

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
