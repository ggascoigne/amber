import { Box, useTheme } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { PropsWithChildren, ReactNode } from 'react'
import Head from 'next/head'

interface PageProps {
  className?: string
  title: string
  titleElement?: ReactNode
  hideTitle?: boolean
  sx?: SxProps<Theme>
}

export const Page: React.FC<PropsWithChildren<PageProps>> = ({
  children,
  className,
  title,
  titleElement,
  hideTitle = false,
  sx,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      sx={[
        {
          background: '#FFFFFF',
          position: 'relative',
          zIndex: 3,
        },
        !fullScreen && {
          margin: '0px 20px 0px',
          borderRadius: '6px',
          boxShadow: theme.mixins.boxShadow?.page,
          padding: 3,
        },
        fullScreen && {
          padding: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Head>
        <title>{title}</title>
      </Head>
      {!hideTitle
        ? titleElement ?? (
            <Box
              component='h1'
              sx={{
                fontSize: '2.25rem',
                lineHeight: '1.5em',
                fontWeight: 300,
                color: 'inherit',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              {title}
            </Box>
          )
        : null}
      {children}
    </Box>
  )
}
