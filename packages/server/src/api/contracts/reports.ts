import { z } from 'zod'

export const reportIdSchema = z.enum([
  'membershipReport',
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
])

export const reportWorkbookInputSchema = z.object({
  reportId: reportIdSchema,
  year: z.number().int().optional(),
})

export type ReportId = z.infer<typeof reportIdSchema>
export type ReportWorkbookInput = z.infer<typeof reportWorkbookInputSchema>

export type ReportCellValue = string | number | boolean | Date | null
export type ReportRow = Record<string, ReportCellValue>

export type ReportWorkbookData = {
  columns: Array<string>
  columnFormats: Array<{ column: string; format: string }>
  rows: Array<ReportRow>
  sheetName: string
}
