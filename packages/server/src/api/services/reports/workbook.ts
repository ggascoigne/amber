import type { ReportRow, ReportWorkbookData } from '../../contracts/reports'

export const defaultWorkbook = (rows: Array<ReportRow>): ReportWorkbookData => ({
  columns: rows[0] ? Object.keys(rows[0]) : [],
  columnFormats: [],
  rows,
  sheetName: 'Sheet1',
})
