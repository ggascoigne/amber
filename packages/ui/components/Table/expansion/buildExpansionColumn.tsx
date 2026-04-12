import Box from '@mui/material/Box'
import type { ColumnDef, RowData } from '@tanstack/react-table'

import { RowExpansionButton } from '../components/RowExpansionButton'
import { EXPAND_COLUMN_ID, EXPAND_COLUMN_SIZE } from '../constants'

export const buildExpansionColumn = <TData extends RowData>(hasExpandedContent: boolean): ColumnDef<TData> | null =>
  hasExpandedContent
    ? {
        id: EXPAND_COLUMN_ID,
        header: '',
        enableResizing: false,
        enableGrouping: false,
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        size: EXPAND_COLUMN_SIZE,
        minSize: EXPAND_COLUMN_SIZE,
        maxSize: EXPAND_COLUMN_SIZE,
        cell: ({ row }) => (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RowExpansionButton row={row} />
          </Box>
        ),
      }
    : null
