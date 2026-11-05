import { reportPdfInputSchema, reportWorkbookInputSchema } from '../../contracts/reports'
import { getReportWorkbookData } from '../../services/reporting'
import { getBadgeBacksPdfData } from '../../services/reports/badgeBackPdfReport'
import { getGameRoomUsePdfData } from '../../services/reports/gameRoomUsePdfReport'
import { getGamesBySlotPdfData } from '../../services/reports/gamesBySlotPdfReport'
import { getMemberLabelsPdfData } from '../../services/reports/memberLabelsPdfReport'
import { getMemberSignupPdfData } from '../../services/reports/memberSignupPdfReport'
import { getPackInsertPdfData } from '../../services/reports/packInsertPdfReport'
import { getPlayersBySlotPdfData } from '../../services/reports/playersBySlotPdfReport'
import { getRoomsAndChairsPdfData } from '../../services/reports/roomsAndChairsPdfReport'
import { getScheduleByPlayerPdfData } from '../../services/reports/scheduleByPlayerPdfReport'
import { getWhereIsEleanorPdfData } from '../../services/reports/whereIsEleanorPdfReport'
import { createTRPCRouter, protectedProcedure } from '../../trpc'

export const reportsRouter = createTRPCRouter({
  getPdfData: protectedProcedure.input(reportPdfInputSchema).query(async ({ ctx, input }) => {
    if (input.pdfReportId === 'badgeBacks') {
      return getBadgeBacksPdfData(ctx, input)
    }
    if (input.pdfReportId === 'gamesBySlot') {
      return getGamesBySlotPdfData(ctx, input)
    }
    if (input.pdfReportId === 'memberSignup') {
      return getMemberSignupPdfData(ctx, input)
    }
    if (input.pdfReportId === 'gameRoomUse') {
      return getGameRoomUsePdfData(ctx, input)
    }
    if (input.pdfReportId === 'packInsert') {
      return getPackInsertPdfData(ctx, input)
    }
    if (input.pdfReportId === 'playersBySlot') {
      return getPlayersBySlotPdfData(ctx, input)
    }
    if (input.pdfReportId === 'roomsAndChairs') {
      return getRoomsAndChairsPdfData(ctx, input)
    }
    if (input.pdfReportId === 'scheduleByPlayer') {
      return getScheduleByPlayerPdfData(ctx, input)
    }
    if (input.pdfReportId === 'whereIsEleanor') {
      return getWhereIsEleanorPdfData(ctx, input)
    }
    return getMemberLabelsPdfData(ctx, input)
  }),
  getWorkbookData: protectedProcedure
    .input(reportWorkbookInputSchema)
    .query(async ({ ctx, input }) => getReportWorkbookData(ctx, input)),
})
