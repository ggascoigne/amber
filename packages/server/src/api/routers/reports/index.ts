import { reportPdfInputSchema, reportWorkbookInputSchema } from '../../contracts/reports'
import { getReportWorkbookData } from '../../services/reporting'
import { getMemberLabelsPdfData } from '../../services/reports/memberLabelsPdfReport'
import { createTRPCRouter, protectedProcedure } from '../../trpc'

export const reportsRouter = createTRPCRouter({
  getPdfData: protectedProcedure
    .input(reportPdfInputSchema)
    .query(async ({ ctx, input }) => getMemberLabelsPdfData(ctx, input)),
  getWorkbookData: protectedProcedure
    .input(reportWorkbookInputSchema)
    .query(async ({ ctx, input }) => getReportWorkbookData(ctx, input)),
})
