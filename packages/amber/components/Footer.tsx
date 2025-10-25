import React, { Suspense, useEffect, useRef } from 'react'

import { useGetConfigQuery } from '@amber/client'
import { Loader } from '@amber/ui'
import { Box, Popover } from '@mui/material'
import { DateTime } from 'luxon'

import { HasPermission, Perms, useAuth } from './Auth'

import { useConfiguration } from '../utils'
import { gitHash } from '../version'

const ReactJson = React.lazy(() => import('@microlink/react-json-view'))

const containerFluid = {
  paddingRight: '15px',
  paddingLeft: '15px',
  marginRight: 'auto',
  marginLeft: 'auto',
  width: '100%',
}
const container = {
  ...containerFluid,
  '@media (min-width: 576px)': {
    maxWidth: '540px',
  },
  '@media (min-width: 768px)': {
    maxWidth: '720px',
  },
  '@media (min-width: 992px)': {
    maxWidth: '960px',
  },
  '@media (min-width: 1200px)': {
    maxWidth: '1140px',
  },
}

export const Footer = () => {
  const { hasPermissions } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [reactJsonLoaded, setReactJsonLoaded] = React.useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const config = useGetConfigQuery()

  // Force popover to recalculate position when ReactJson loads
  useEffect(() => {
    if (reactJsonLoaded && popoverRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (popoverRef.current) {
          const popover = popoverRef.current.querySelector('[role="tooltip"]') as HTMLElement
          if (popover) {
            // Trigger a reflow/repaint
            popover.style.display = 'none'
            // popover.offsetHeight // Force reflow
            popover.style.display = ''
          }
        }
      }, 0)
    }
  }, [reactJsonLoaded])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (hasPermissions(Perms.IsAdmin)) {
      setAnchorEl(event.currentTarget)
      setReactJsonLoaded(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
    setReactJsonLoaded(false)
  }
  const hash = gitHash.hash.length > 0 ? gitHash.hash.substring(0, 8) : 'dev'
  const open = Boolean(anchorEl)
  const commitDate = DateTime.fromISO(gitHash.date)
  const id = open ? 'simple-popover' : undefined
  const configuration = useConfiguration()
  return (
    <Box
      component='footer'
      sx={{
        padding: '0.9375rem 0',
        textAlign: 'center',
        display: 'flex',
        zIndex: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ ...container, fontSize: '0.75rem' }}>
        <HasPermission permission={Perms.IsAdmin}>
          {open && (
            <Popover
              ref={popoverRef}
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box
                sx={{
                  padding: '20px',
                  minWidth: '300px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                }}
              >
                <Box component='h3' sx={{ marginTop: 0 }}>
                  Site configuration
                </Box>
                <Suspense fallback={<Loader />}>
                  <ReactJson
                    src={{
                      commitDate: commitDate.toLocaleString(DateTime.DATETIME_FULL),
                      config,
                    }}
                    enableClipboard={false}
                    indentWidth={2}
                  />
                  {/* Hidden element to trigger state change when ReactJson loads */}
                  <div style={{ display: 'none' }} ref={() => setReactJsonLoaded(true)} />
                </Suspense>
              </Box>
            </Popover>
          )}
        </HasPermission>
        <Box component='span' sx={{ cursor: 'pointer' }} onClick={handleClick}>
          {hash}
        </Box>{' '}
        | &copy; {DateTime.fromJSDate(new Date()).year} {configuration.copyright}
      </Box>
    </Box>
  )
}
