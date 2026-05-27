import { z } from 'zod'

export const reportIdSchema = z.enum([
  'membershipReport',
  'donorReport',
  'gameReport',
  'discordGameReport',
  'gmReport',
  'gameAndPlayersReport',
  'roomReport',
  'membersWithoutGameChoicesReport',
  'gamesSchedulerReport',
  'membersForPlayerSchedulerReport',
  'gamesForPlayerSchedulerReport',
  'gameChoicesForPlayerSchedulerReport',
  'roomsByRoomReport',
  'roomsByGameReport',
  'gameAssignmentsReport',
  'voucherReport',
  'memberPaymentDetailsReport',
])

export const reportWorkbookInputSchema = z.object({
  reportId: reportIdSchema,
  year: z.number().int().optional(),
})

export const pdfReportIdSchema = z.enum(['memberLabels'])

export const reportPdfInputSchema = z.object({
  pdfReportId: pdfReportIdSchema,
  year: z.number().int().optional(),
})

export type ReportId = z.infer<typeof reportIdSchema>
export type ReportWorkbookInput = z.infer<typeof reportWorkbookInputSchema>
export type PdfReportId = z.infer<typeof pdfReportIdSchema>
export type ReportPdfInput = z.infer<typeof reportPdfInputSchema>

export type ReportCellValue = string | number | boolean | Date | null
export type ReportRow = Record<string, ReportCellValue>

export type ReportWorkbookData = {
  columns: Array<string>
  columnFormats: Array<{ column: string; format: string }>
  rows: Array<ReportRow>
  sheetName: string
}

export type ReportPdfData = {
  base64: string
  contentType: 'application/pdf'
  filenameLabel: string
}
