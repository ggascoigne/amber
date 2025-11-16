import type React from 'react'
import { Suspense, useMemo } from 'react'

import { BugReportTwoTone as BugReportTwoToneIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import superjson from 'superjson'

import { useTableContext } from './TableContext'

import { ObjectView } from '../../ObjectView'

interface LoaderProps {
  error?: boolean
  retry?: (event: React.MouseEvent<HTMLElement>) => void
  timedOut?: boolean
  pastDelay?: boolean
}

export const Loader = ({ error, retry, timedOut, pastDelay }: LoaderProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flex: '1 0 auto',
    }}
  >
    {error && (
      <div>
        Error!{' '}
        <button type='submit' onClick={retry}>
          Retry
        </button>
      </div>
    )}
    {timedOut && (
      <div>
        Taking a long time...{' '}
        <button type='submit' onClick={retry}>
          Retry
        </button>
      </div>
    )}
    {pastDelay && <div>Loading...</div>}
    <CircularProgress sx={{ m: 2 }} />
  </Box>
)

export const TableDebugButton = ({ enabled }: { enabled: boolean }) => {
  const [, setOpen] = useTableContext()
  return enabled ? (
    <Tooltip title='Debug'>
      <Box sx={{ position: 'relative', pl: 2 }}>
        <IconButton onClick={() => setOpen((old) => ({ ...old, debugIsOpen: !old.debugIsOpen }))}>
          <BugReportTwoToneIcon />
        </IconButton>
      </Box>
    </Tooltip>
  ) : null
}

type TableDebugProps = {
  enabled: boolean
  instance: any
}

export const TableDebug = ({ enabled, instance }: TableDebugProps) => {
  const [{ tableIndex, debugIsOpen }] = useTableContext()
  const { rows } = instance.getRowModel()
  const originalRows = useMemo(() => rows.map((row: any) => row.original), [rows])

  const filteredOptions = useMemo(() => {
    const filtered: Record<string, any> = {}
    for (const [key, value] of Object.entries(instance.options)) {
      if (typeof value !== 'function' && typeof value !== 'object') {
        filtered[key] = value
      }
    }
    return filtered
  }, [instance.options])

  const obj = {
    tableIndex,
    state: instance.getState(),
    headerGroups: instance.getHeaderGroups(),
    columns: instance.getAllLeafColumns(),
    rows: instance.getRowModel().rows,
    originalRows,
    options: filteredOptions,
  }

  return enabled && debugIsOpen ? (
    <Box>
      <hr />
      <Box sx={{ pl: 3 }}>
        <Suspense fallback={<Loader />}>
          <Box
            sx={{
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            <ObjectView valueGetter={() => JSON.parse(superjson.stringify(obj)).json} name='root' expandLevel={1} />
          </Box>
        </Suspense>
      </Box>
    </Box>
  ) : null
}
