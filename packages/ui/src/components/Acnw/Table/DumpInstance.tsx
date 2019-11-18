import { IconButton, Tooltip, createStyles, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import ReactJson from 'react-json-view'

import { DebugIcon } from '../../../icons'

const useStyles = makeStyles(
  createStyles({
    button: {
      marginTop: -72,
      marginLeft: 12
    }
  })
)

export const DumpInstance: React.FC<{
  enabled: boolean
  instance: any
}> = ({ enabled, instance }) => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  return enabled ? (
    <>
      <Tooltip title={'Debug'}>
        <span>
          <IconButton className={classes.button} onClick={() => setOpen(old => !old)}>
            <DebugIcon />
          </IconButton>
        </span>
      </Tooltip>
      {open && (
        <>
          <br />
          <br />
          <ReactJson src={instance} collapsed={1} indentWidth={2} />
        </>
      )}
    </>
  ) : null
}
