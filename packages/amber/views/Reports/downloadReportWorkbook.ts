import type { ReportWorkbookData } from '@amber/server/src/api/contracts/reports'
import * as XLSX from 'xlsx/dist/xlsx.mini.min'

export const downloadReportWorkbook = ({
  filename,
  workbookData,
}: {
  filename: string
  workbookData: ReportWorkbookData
}) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(workbookData.rows, {
    header: workbookData.columns,
    ...(workbookData.columnFormats.length > 0 ? { cellDates: true } : {}),
  })

  workbookData.columnFormats.forEach(({ column, format }) => {
    const columnIndex = workbookData.columns.indexOf(column)
    if (columnIndex < 0) {
      return
    }

    const columnLetter = XLSX.utils.encode_col(columnIndex)
    for (let rowIndex = 0; rowIndex < workbookData.rows.length; rowIndex += 1) {
      const cellAddress = `${columnLetter}${rowIndex + 2}`
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].z = format
      }
    }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, workbookData.sheetName)
  XLSX.writeFile(workbook, filename, {
    ...(workbookData.columnFormats.length > 0 ? { cellDates: true } : {}),
    bookType: 'xlsx',
  })
}
