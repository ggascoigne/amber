import { useMemo } from 'react'

import { Box } from '@mui/material'
import type { Theme, SxProps } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import { tableDecorationZIndex } from './TableStyles'

import type { Action } from '../actions'
import { getEnabledActions, ToolbarButtonGroup } from '../actions'

type TableToolbarProps<T extends RowData> = {
  table: TableInstance<T>
  toolbarActions?: ReadonlyArray<Action<T>>
  systemActions?: ReadonlyArray<Action<T>>
  sx?: SxProps<Theme>
  displayGutter: boolean
}

export const TableToolbar = <T extends RowData>(props: TableToolbarProps<T>) => {
  const { sx, table, toolbarActions, systemActions, displayGutter } = props
  const { rowSelection } = table.getState()

  const selectedKeys = useMemo(() => Object.keys(rowSelection), [rowSelection])

  const enabledActions = useMemo(
    () => getEnabledActions(toolbarActions, table, selectedKeys),
    [selectedKeys, table, toolbarActions],
  )
  const activeSystemActions = useMemo(
    () => getEnabledActions(systemActions, table, selectedKeys),
    [selectedKeys, systemActions, table],
  )

  return (
    <Toolbar
      data-testid='TableToolbar'
      sx={[
        {
          position: 'sticky',
          left: 0,
          minHeight: '48px !important',
          zIndex: tableDecorationZIndex,
          width: '100%',
          backgroundColor: 'background.paper',
          color: 'primary.main',
          borderRadius: '4px 4px 0 0',
          px: displayGutter ? 3 : 2,
          '@media (min-width: 600px)': {
            px: displayGutter ? 3 : 2,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: 1,
        }}
        role='toolbar'
      >
        <ToolbarButtonGroup actions={enabledActions} table={table} selectedKeys={selectedKeys} />
        <Box sx={{ flexGrow: 1 }} />
        <ToolbarButtonGroup
          actions={activeSystemActions}
          table={table}
          selectedKeys={selectedKeys}
          anchorDirection='top-left'
        />
      </Box>
    </Toolbar>
  )
}
