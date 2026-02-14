import type { ReactElement, RefObject } from 'react'
import { useCallback } from 'react'

import { Skeleton } from '@mui/material'
import type { Theme, SxProps } from '@mui/material/styles'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { TableBody, TableCell, TableRow } from './TableStyles'

import { range } from '../../../utils'
import type { RowStyleType } from '../utils/tableUtils'

const measureElement = (element: Element) => element?.getBoundingClientRect().height

export const TableContentSkeleton = <T extends RowData>({
  table,
  sx,
  rowStyle,
  compact,
  useVirtualRows,
  tableContainerRef,
}: {
  table: TableInstance<T>
  sx?: SxProps<Theme>
  rowStyle: RowStyleType
  compact: boolean
  useVirtualRows?: boolean
  tableContainerRef: RefObject<HTMLDivElement | null>
}): ReactElement => {
  const { pageSize } = table.getState().pagination
  const headerGroup = table.getHeaderGroups()[table.getHeaderGroups().length - 1]

  const estimateRowHeight = compact ? 34.2 : 50.2
  const getVirtualRowKey = useCallback((virtualIndex: number) => virtualIndex, [])

  const rowVirtualizer = useVirtualizer({
    count: pageSize,
    estimateSize: () => estimateRowHeight, // estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    getItemKey: getVirtualRowKey,
    measureElement,
    overscan: 5,
  })
  const rowList = useVirtualRows ? rowVirtualizer.getVirtualItems() : range(pageSize)
  const tableHeight = rowVirtualizer.getTotalSize()

  return (
    <TableBody
      data-testid='loading-skeleton'
      sx={[
        useVirtualRows && {
          height: `${tableHeight}px`, // tells scrollbar how big the table is
          position: 'relative', // needed for absolute positioning of rows
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {rowList.map((_row, rowIndex) => (
        <TableRow
          key={rowIndex}
          sx={[
            rowStyle === 'flex' && {
              display: 'flex',
            },
          ]}
        >
          {headerGroup.headers.map((header, colIndex) => {
            const columnCanResize = header.column.getCanResize()
            return (
              <TableCell
                key={`cell_${rowIndex}_${colIndex}`}
                sx={[
                  {
                    width: header.getSize(),
                    py: 'var(--table-compact-spacing)',
                  },
                  rowStyle === 'flex' &&
                    columnCanResize && {
                      flex: `${header.getSize()} 0 auto`,
                    },
                  rowStyle === 'fixed' && {
                    '&:last-of-type': {
                      flex: '1 1 auto',
                    },
                  },
                ]}
              >
                <Skeleton sx={{ width: '100%' }} />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </TableBody>
  )
}
