import React, { Suspense } from 'react'

import BugReportTwoToneIcon from '@mui/icons-material/BugReportTwoTone'
import { IconButton, Tooltip } from '@mui/material'
import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

import { Loader } from '../Loader'

const ReactJson = React.lazy(() => import('@microlink/react-json-view'))

const debugIsOpen = atom<boolean>(false)
export const useDebugIsOpen = () => useAtom(debugIsOpen)

export const TableDebugButton: React.FC<{ enabled: boolean; instance: any }> = ({ enabled, instance }) => {
  const [, setOpen] = useDebugIsOpen()
  const buttonSx = instance?.rows?.length ? { ml: -0.25, '& svg': { width: '1.5rem', height: '1.5rem' } } : undefined
  return enabled ? (
    <Tooltip title='Debug'>
      <div style={{ position: 'relative' }}>
        <IconButton onClick={() => setOpen((old) => !old)} size='large' sx={buttonSx}>
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
