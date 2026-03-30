import { defaultWorkbook, reportDefinitions } from './reports'
import { getRuntimeSettingsTx } from './runtimeSettings'

import type { Context } from '../context'
import type { ReportRow, ReportWorkbookData, ReportWorkbookInput } from '../contracts/reports'
import { inRlsTransaction } from '../inRlsTransaction'

export const getReportWorkbookData = async (ctx: Context, input: ReportWorkbookInput): Promise<ReportWorkbookData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const definition = reportDefinitions[input.reportId]
    if (!definition.supportsSite(settings.abbr)) {
      throw new Error(`Report ${input.reportId} is not available for ${settings.abbr}`)
    }

    const year = input.year ?? settings.year
    const rows = (await tx.$queryRawUnsafe(
      definition.buildQuery({
        abbr: settings.abbr,
        virtual: settings.virtual,
        year,
      }),
    )) as Array<ReportRow>

    if (!definition.transform) {
      return defaultWorkbook(rows)
    }

    const startDateConfig = settings.startDates[year]
    return definition.transform(rows, {
      numberOfSlots: settings.numberOfSlots,
      start: startDateConfig?.date ?? null,
      virtual: startDateConfig?.virtual ?? settings.virtual,
    })
  })
