import { IconButton, Theme, Tooltip, createStyles, makeStyles } from '@material-ui/core'
import BugReportTwoToneIcon from '@material-ui/icons/BugReportTwoTone'
import clsx from 'clsx'
import { atom, useAtom } from 'jotai'
import React, { Suspense } from 'react'

import { Loader } from '../Loader'

const ReactJson = React.lazy(() => import('@ggascoigne/react-json-view'))

const debugIsOpen = atom<boolean>(false)
export const useDebugIsOpen = () => useAtom(debugIsOpen)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: -2,
      '& svg': {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  })
)

export const TableDebugButton: React.FC<{ enabled: boolean; instance: any }> = ({ enabled, instance }) => {
  const classes = useStyles()
  const [, setOpen] = useDebugIsOpen()
  return enabled ? (
    <Tooltip title='Debug'>
      <div style={{ position: 'relative' }}>
        <IconButton
          className={clsx({ [classes.button]: instance?.rows?.length })}
          onClick={() => setOpen((old) => !old)}
        >
          <BugReportTwoToneIcon />
        </IconButton>
      </div>
    </Tooltip>
  ) : null
}

export const TableDebug: React.FC<{
  enabled: boolean
  instance: any
}> = ({ enabled, instance }) => {
  const [isOpen] = useDebugIsOpen()
  return enabled && isOpen ? (
    <>
      <br />
      <br />
      <Suspense fallback={<Loader />}>
        <ReactJson src={{ ...instance }} collapsed={1} indentWidth={2} enableClipboard={false} sortKeys />
      </Suspense>
    </>
  ) : null
}
