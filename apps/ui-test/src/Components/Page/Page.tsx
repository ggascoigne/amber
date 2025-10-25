import type { ForwardedRef, ReactNode } from 'react'

import { Container, Typography } from '@mui/material'
import type { Breakpoint, SxProps, Theme } from '@mui/material/styles'

import { fixedForwardRef } from '../../utils'

type PageProps = {
  children?: ReactNode
  title?: string
  titleComponent?: ReactNode
  sx?: SxProps<Theme>
  variant?: 'fill' | 'auto'
  maxWidth?: Breakpoint
}

const PageHeight = 'calc(100vh - 64px)'

const PageInternal = (
  { children, sx, variant = 'fill', title, maxWidth, titleComponent }: PageProps,
  ref: ForwardedRef<any>,
) => (
  <Container
    ref={ref}
    maxWidth={maxWidth ?? false}
    sx={[
      {
        pt: [2, 2, 3],
        pb: [2, 2, 3],
      },
      variant === 'fill' && {
        height: PageHeight,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        minHeight: 0,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {titleComponent}
    {title && (
      <Typography
        variant='h4'
        component='h1'
        color='textPrimary'
        sx={{ px: 3, pt: 2 }}
        data-testid={`Page-Title:${title}`}
      >
        {title}
      </Typography>
    )}
    {children}
  </Container>
)

export const Page = fixedForwardRef(PageInternal)
