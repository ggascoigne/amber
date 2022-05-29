import { Popover } from '@mui/material'
import { DateTime } from 'luxon'
import React, { Suspense } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useGetConfig } from 'utils'
import { gitHash } from 'version'

import { HasPermission, Perms, useAuth } from './Auth'
import { Loader } from './Loader'

const ReactJson = React.lazy(() => import('react-json-view'))

const useStyles = makeStyles()({
  footer: {
    padding: '0.9375rem 0',
    textAlign: 'center',
    display: 'flex',
    zIndex: 2,
    position: 'relative',
  },
  container: {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '100%',
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
    fontSize: '0.75rem',
  },
  popup: {
    padding: 20,
  },
  versionInfo: {
    cursor: 'pointer',
  },
})

export const Footer: React.FC = (props) => {
  const { hasPermissions } = useAuth()
  const { classes } = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [config, getConfig] = useGetConfig()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (hasPermissions(Perms.IsAdmin)) {
      getConfig()
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const hash = gitHash.hash.length > 0 ? gitHash.hash.substring(0, 8) : 'dev'
  const open = Boolean(anchorEl)
  const commitDate = DateTime.fromISO(gitHash.date)
  const id = open ? 'simple-popover' : undefined
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <HasPermission permission={Perms.IsAdmin}>
          {open && (
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <div className={classes.popup}>
                <h3>Site configuration</h3>
                <Suspense fallback={<Loader />}>
                  <ReactJson
                    src={{
                      commitDate: commitDate.toLocaleString(DateTime.DATETIME_FULL),
                      authDomain: process.env.REACT_APP_AUTH0_DOMAIN,
                      config,
                    }}
                    enableClipboard={false}
                    indentWidth={2}
                  />
                </Suspense>
              </div>
            </Popover>
          )}
        </HasPermission>
        <span className={classes.versionInfo} onClick={handleClick}>
          {hash}
        </span>{' '}
        | &copy; {DateTime.fromJSDate(new Date()).year} amberconnw.org
      </div>
    </footer>
  )
}
