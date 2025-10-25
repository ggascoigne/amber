import type { PropsWithChildren } from 'react'
import type React from 'react'

import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'

type ColorTypes = 'warning' | 'success' | 'error' | 'info' | 'primary'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  color?: ColorTypes
  plain?: boolean
  sx?: SxProps<Theme>
}

export const CardHeader: React.FC<PropsWithChildren<CardHeaderProps>> = (props) => {
  const { className, children, color, plain, sx, ...rest } = props
  const defaultSx: SxProps<Theme> = (theme) => ({
    borderRadius: '3px',
    padding: '1rem 15px',
    ml: '15px',
    mr: '15px',
    mt: '-30px',
    border: 0,
    mb: 0,
    ...(plain ? { ml: 0, mr: 0 } : {}),
    ...(color === 'warning'
      ? {
          color: '#fff',
          background: `linear-gradient(60deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
          boxShadow: theme.mixins.boxShadow.warning,
        }
      : {}),
    ...(color === 'success'
      ? {
          color: '#fff',
          background: `linear-gradient(60deg, ${theme.palette.success.light}, ${theme.palette.success.main})`,
          boxShadow: theme.mixins.boxShadow.success,
        }
      : {}),
    ...(color === 'error'
      ? {
          color: '#fff',
          background: `linear-gradient(60deg, ${theme.palette.error.light}, ${theme.palette.error.main})`,
          boxShadow: theme.mixins.boxShadow.error,
        }
      : {}),
    ...(color === 'info'
      ? {
          color: '#fff',
          background: `linear-gradient(60deg, ${theme.palette.info.light}, ${theme.palette.info.main})`,
          boxShadow: theme.mixins.boxShadow.info,
        }
      : {}),
    ...(color === 'primary'
      ? {
          color: '#fff',
          background: `linear-gradient(60deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          boxShadow: theme.mixins.boxShadow.primary,
        }
      : {}),
  })
  const mergedSx = [defaultSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]
  return (
    <Box className={className} sx={mergedSx} {...rest}>
      {children}
    </Box>
  )
}
