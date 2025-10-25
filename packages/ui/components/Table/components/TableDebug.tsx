import React, { Suspense, useMemo } from 'react'

import { BugReportTwoTone as BugReportTwoToneIcon } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Tooltip, useColorScheme, useTheme } from '@mui/material'
import superjson from 'superjson'

import { useTableContext } from './TableContext'

const ReactJsonView = React.lazy(() => import('@microlink/react-json-view'))

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

export const useJsonTheme = () => {
  const theme = useTheme()
  const { colorScheme } = useColorScheme()

  const dark = {
    base00: theme.palette.background.paper,
    base01: '#2E3C43',
    base02: '#314549',
    base03: '#546E7A',
    base04: '#B2CCD6',
    base05: '#EEFFFF',
    base06: '#EEFFFF',
    base07: '#fff',
    base08: '#F07178',
    base09: '#C3E88D',
    base0A: '#FFCB6B',
    base0B: '#F78C6C',
    base0C: '#89DDFF',
    base0D: '#82AAFF',
    base0E: '#C792EA',
    base0F: '#F78C6C',
  }

  const light = {
    base00: theme.palette.background.paper,
    base01: '#E7EAEC',
    base02: '#CCEAE7',
    base03: '#CCD7DA',
    base04: '#8796B0',
    base05: '#80CBC4',
    base06: '#80CBC4',
    base07: '#222',
    base08: '#FF5370',
    base09: '#F76D47',
    base0A: '#FFB62C',
    base0B: '#91B859',
    base0C: '#39ADB5',
    base0D: '#6182B8',
    base0E: '#7C4DFF',
    base0F: '#E53935',
  }

  return colorScheme === 'dark' ? dark : light
}

type TableDebugProps = {
  enabled: boolean
  instance: any
}

export const TableDebug = ({ enabled, instance }: TableDebugProps) => {
  const [{ tableIndex, debugIsOpen }] = useTableContext()
  const jsonTheme = useJsonTheme()
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

  return enabled && debugIsOpen ? (
    <Box>
      <hr />
      <Box sx={{ pl: 3 }}>
        <Suspense fallback={<Loader />}>
          <Box
            sx={{
              maxHeight: '400px',
              overflow: 'auto',
              '& .react-json-view': {
                '& span': {
                  fontSize: '0.75rem !important',
                },
              },
            }}
          >
            <ReactJsonView
              src={
                JSON.parse(
                  superjson.stringify({
                    tableIndex,
                    state: instance.getState(),
                    headerGroups: instance.getHeaderGroups(),
                    columns: instance.getAllLeafColumns(),
                    rows: instance.getRowModel().rows,
                    originalRows,
                    options: filteredOptions,
                  }),
                ).json
              }
              collapsed={1}
              indentWidth={2}
              enableClipboard={false}
              sortKeys
              theme={jsonTheme}
            />
          </Box>
        </Suspense>
      </Box>
    </Box>
  ) : null
}
