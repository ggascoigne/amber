import type { ReactNode } from 'react'
import type React from 'react'

import { fixedForwardRef } from '@amber/ui'
import { Box, Container } from '@mui/material'
import type { SxProps, Theme, Breakpoint } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'

export const PageHeightFull = 'calc(100vh - 64px)' // 64 for the header, 24 * 2 for layout padding
export const PageHeight = 'calc(100vh - 112px)' // 64 for the header, 24 * 2 for layout padding

interface PageProps {
  children?: React.ReactNode
  title: string
  titleElement?: ReactNode
  hideTitle?: boolean
  sx?: SxProps<Theme>
  variant?: 'fill' | 'auto'
  maxWidth?: Breakpoint
}

const PageInternal = (
  { children, sx, variant = 'auto', hideTitle, title, maxWidth, titleElement }: PageProps,
  ref: React.ForwardedRef<any>,
) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Container
      ref={ref}
      maxWidth={maxWidth ?? false}
      sx={[
        {
          background: '#FFFFFF',
          position: 'relative',
          zIndex: 3,
        },
        variant === 'auto' &&
          (fullScreen
            ? fullScreen && {
                padding: 2,
              }
            : {
                margin: '0px 20px 0px',
                borderRadius: '6px',
                boxShadow: theme.mixins.boxShadow?.page,
                padding: 3,
                width: 'unset',
              }),
        variant === 'fill' && {
          '@media (min-width: 600px)': {
            p: 0,
          },
          width: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          padding: 0,
        },
        variant === 'fill' &&
          (fullScreen
            ? fullScreen && {
                height: PageHeightFull,
                mt: -3,
              }
            : {
                height: PageHeight,
                mx: 3,
                borderRadius: '6px',
                boxShadow: theme.mixins.boxShadow?.page,
              }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Head>
        <title>{title}</title>
      </Head>
      {hideTitle
        ? null
        : (titleElement ?? (
            <Box
              component='h1'
              sx={[
                {
                  fontSize: '2.25rem',
                  lineHeight: '1.5em',
                  fontWeight: 300,
                  color: 'inherit',
                  marginTop: '20px',
                  marginBottom: '10px',
                },
                variant === 'fill' && {
                  px: 3,
                },
              ]}
            >
              {title}
            </Box>
          ))}
      {children}
    </Container>
  )
}

export const Page = fixedForwardRef(PageInternal)
