import type { ReactElement, MouseEvent, ChangeEvent } from 'react'
import { useCallback, useMemo } from 'react'

import { TablePagination as MuiTablePagination } from '@mui/material'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

export const rowsPerPageOptions = [10, 25, 50, 100, 250]

export function TablePagination<T extends RowData>({
  table,
  rowCount: userRowCount,
  displayRowsPerPage,
  paginationPageSizes = rowsPerPageOptions,
  compact = false,
}: {
  table: TableInstance<T>
  rowCount?: number
  displayRowsPerPage?: boolean
  paginationPageSizes?: Array<number>
  compact: boolean
}): ReactElement | null {
  const { setPageSize } = table
  const { pageSize, pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()
  const { count, page, pageSizes } = useMemo(() => {
    const onLastPage = pageIndex === pageCount - 1
    const dataRowCount = table.options.rowCount ?? table.getFilteredRowModel().rows.length
    const count1 = userRowCount === -1 ? (onLastPage ? dataRowCount : -1) : (userRowCount ?? dataRowCount)
    const page2 = pageIndex > pageCount * pageSize ? 0 : pageIndex
    const pageSizes1 = [...new Set([...paginationPageSizes, pageSize])].sort((a, b) => a - b)
    return { page: page2, count: count1, pageSizes: pageSizes1 }
  }, [pageCount, pageIndex, pageSize, paginationPageSizes, table, userRowCount])

  const handleChangePage = useCallback(
    (_event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      table.setPageIndex(newPage)
    },
    [table],
  )

  return pageCount ? (
    <MuiTablePagination
      rowsPerPageOptions={displayRowsPerPage ? pageSizes : []}
      component='div'
      count={count}
      rowsPerPage={pageSize}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPageSize(Number(e.target.value))
      }}
      data-testid='TablePagination'
      slotProps={{
        toolbar: {
          sx: { minHeight: compact ? '34px !important' : 'auto' },
        },
      }}
      sx={{ flexShrink: 0, '& p': { margin: 0 } }}
    />
  ) : null
}
