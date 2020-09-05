import { makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { container } from 'assets/jss/material-kit-react.js'
import { DateTime } from 'luxon'
import React, { Suspense, useState } from 'react'
import { gitHash } from 'version'

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
})

const useStyles = makeStyles(footerStyle)

export const Footer: React.FC = (props) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <HasPermission permission={Perms.IsAdmin}>
          {open && (
            <Suspense fallback={<Loader />}>
              <ReactJson
                src={{
                  domain: process.env.REACT_APP_AUTH0_DOMAIN,
                }}
                collapsed={1}
                enableClipboard={false}
                indentWidth={2}
                sortKeys
              />
            </Suspense>
          )}
        </HasPermission>
        <span
          onClick={() => {
            setOpen((old) => !old)
          }}
        >
          {gitHash.substring(0, 8)}
        </span>{' '}
        | &copy; {DateTime.fromJSDate(new Date()).year} amberconnw.org
      </div>
    </footer>
  )
}
