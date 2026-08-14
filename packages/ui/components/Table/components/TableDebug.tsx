import type React from 'react'
import { Suspense, useMemo } from 'react'

import BugReportTwoToneIcon from '@mui/icons-material/BugReportTwoTone'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import superjson from 'superjson'

import { useTableContext } from './TableContext'

import { ObjectView } from '../../ObjectView'
import type { AmberTableState, RowData, Table as TableInstance } from '../tableTypes'

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

type TableDebugProps<TData extends RowData> = {
  enabled: boolean
  instance: TableInstance<TData>
}

type TableDebugViewProps<TData extends RowData> = {
  instance: TableInstance<TData>
  state: AmberTableState
  tableIndex: number
}

const TableDebugView = <TData extends RowData>({ instance, state, tableIndex }: TableDebugViewProps<TData>) => {
  const { rows } = instance.getRowModel()
  const originalRows = useMemo(() => rows.map((row) => row.original), [rows])

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
    state,
    headerGroups: instance.getHeaderGroups(),
    columns: instance.getAllLeafColumns(),
    rows: instance.getRowModel().rows,
    originalRows,
    options: filteredOptions,
  }

  return (
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
  )
}

export const TableDebug = <TData extends RowData>({ enabled, instance }: TableDebugProps<TData>) => {
  const [{ tableIndex, debugIsOpen }] = useTableContext()

  return enabled && debugIsOpen ? (
    <instance.Subscribe selector={(state) => state}>
      {(state) => <TableDebugView instance={instance} state={state} tableIndex={tableIndex} />}
    </instance.Subscribe>
  ) : null
}
