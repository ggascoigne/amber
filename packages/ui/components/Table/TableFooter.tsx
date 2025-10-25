import { Box } from '@mui/material'
import type { Theme, SxProps } from '@mui/material/styles'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import { TableDebug, TableDebugButton } from './components/TableDebug'
import { TablePagination } from './components/TablePagination'
import { tableDecorationZIndex } from './components/TableStyles'

type TableFooterInternalProps<T extends RowData> = {
  table: TableInstance<T>
  sx?: SxProps<Theme>
  rowCount?: number
  pagination?: 'default' | 'compact'
  compact: boolean
  debug: boolean
  displayPagination?: boolean
  paginationPageSizes?: Array<number>
}

export const TableFooter = <T extends RowData>({
  table,
  sx,
  rowCount,
  pagination = 'default',
  debug,
  displayPagination = false,
  paginationPageSizes,
  compact,
}: TableFooterInternalProps<T>) =>
  displayPagination || debug ? (
    <Box
      sx={[
        {
          position: 'sticky',
          left: 0,
          flexShrink: 0,
          backgroundColor: 'background.paper',
          zIndex: tableDecorationZIndex,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      data-testid='TableFooter'
    >
      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderRadius: '0 0 4px 4px',
            alignItems: 'center',
            pl: 1,
            pr: 1,
            borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <TableDebugButton enabled={debug} />
        <Box sx={{ flexGrow: 1 }} />
        {displayPagination && (
          <TablePagination
            table={table}
            rowCount={rowCount}
            displayRowsPerPage={pagination === 'default'}
            paginationPageSizes={paginationPageSizes}
            compact={compact}
          />
        )}
      </Box>
      <TableDebug enabled={debug} instance={table} />
    </Box>
  ) : null
