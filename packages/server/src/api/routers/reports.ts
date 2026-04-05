import { reportWorkbookInputSchema } from '../contracts/reports'
import { getReportWorkbookData } from '../services/reporting'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const reportsRouter = createTRPCRouter({
  getWorkbookData: protectedProcedure
    .input(reportWorkbookInputSchema)
    .query(async ({ ctx, input }) => getReportWorkbookData(ctx, input)),
})
