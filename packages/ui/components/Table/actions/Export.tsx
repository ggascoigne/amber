import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import { TableIconButton } from './ToolbarButtons'

import { camelToWords } from '../../../utils'
import { SELECTION_COLUMN_ID } from '../constants'

type ExportProps<T extends RowData> = {
  table: TableInstance<T>
}

const formatColumnValue = (c: any) => {
  const textColumnEnclosure = '"'
  return typeof c === 'string' ? `${textColumnEnclosure}${c.replaceAll('"', '""')}${textColumnEnclosure}` : c
}

export const Export = <T extends RowData>({ table }: ExportProps<T>) => {
  function handleFileDownloadClick() {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((column) => column.id !== SELECTION_COLUMN_ID && column.getIsVisible())
    const { rows } = table.getPrePaginationRowModel()
    const columnSeparator = ','
    const rowSeparator = '\n'
    const timestamp = new Date().toISOString().replaceAll(/[-.]/g, '_')
    const filename = `${table.options?.meta?.name}-${timestamp}.csv`
    const csvHeaders = visibleColumns
      .map((c) => formatColumnValue(camelToWords(c.id)))
      .join(columnSeparator)
      .concat(rowSeparator)
    const csvData = rows
      .map((r) =>
        r
          .getVisibleCells()
          .filter((fc) => fc.column.id !== SELECTION_COLUMN_ID)
          .map((c) => formatColumnValue(c.getValue()))
          .join(columnSeparator),
      )
      .join(rowSeparator)
      .concat(rowSeparator)
    const csvContent = csvHeaders.concat(csvData)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return <TableIconButton icon={<FileDownloadSharpIcon />} onClick={handleFileDownloadClick} label='Export to CSV' />
}
