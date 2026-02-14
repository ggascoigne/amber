import type { PropsWithChildren } from 'react'
import type React from 'react'

import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  className?: string
  plain?: boolean
  carousel?: boolean
  onClick?: () => void
  sx?: SxProps<Theme>
}

export const Card: React.FC<PropsWithChildren<CardProps>> = (props) => {
  const { className, children, plain, carousel, sx, ...rest } = props
  const defaultSx: SxProps<Theme> = {
    border: 0,
    mb: '30px',
    mt: '30px',
    borderRadius: '6px',
    color: 'rgba(0, 0, 0, 0.87)',
    background: '#fff',
    width: '100%',
    boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    wordWrap: 'break-word',
    fontSize: '.875rem',
    transition: 'all 300ms linear',
    ...(plain ? { background: 'transparent', boxShadow: 'none' } : {}),
    ...(carousel ? { overflow: 'hidden' } : {}),
  }
  const mergedSx = [defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]
  return (
    <Box className={className} sx={mergedSx} {...rest}>
      {children}
    </Box>
  )
}
