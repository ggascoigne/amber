import { Popover } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { container } from 'assets/jss/material-kit-react.js'
import { DateTime } from 'luxon'
import React, { Suspense } from 'react'
import { gitHash } from 'version'

import { useGetConfig } from '../../utils/getConfig'
import { useAuth } from './Auth/Auth0'
import { HasPermission } from './Auth/HasPermission'
import { Perms } from './Auth/PermissionRules'
import { Loader } from './Loader'

const ReactJson = React.lazy(() => import('@ggascoigne/react-json-view'))

const footerStyle = createStyles({
  footer: {
    padding: '0.9375rem 0',
    textAlign: 'center',
    display: 'flex',
    zIndex: 2,
    position: 'relative',
  },
  container: {
    ...container,
    fontSize: '0.75rem',
  },
  popup: {
    padding: 20,
  },
})

const useStyles = makeStyles(footerStyle)

export const Footer: React.FC = (props) => {
  const { hasPermissions } = useAuth()
  const classes = useStyles()
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

  const hash = gitHash.length > 0 ? gitHash.substring(0, 8) : 'dev'
  const open = Boolean(anchorEl)
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
        <span onClick={handleClick}>{hash}</span> | &copy; {DateTime.fromJSDate(new Date()).year} amberconnw.org
      </div>
    </footer>
  )
}
