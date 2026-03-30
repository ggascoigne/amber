import type { DateTime } from 'luxon'

import type { ReportId, ReportRow, ReportWorkbookData } from '../../contracts/reports'

export type ReportQueryOptions = {
  abbr: 'acnw' | 'acus'
  virtual: boolean
  year: number
}

export type ReportTransformOptions = {
  numberOfSlots: number
  start: DateTime | null
  virtual: boolean
}

export type ReportDefinition = {
  buildQuery: (options: ReportQueryOptions) => string
  supportsSite: (abbr: 'acnw' | 'acus') => boolean
  transform?: (rows: Array<ReportRow>, options: ReportTransformOptions) => ReportWorkbookData
}

export type ReportDefinitions = Record<ReportId, ReportDefinition>
