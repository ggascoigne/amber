import { DateTime } from 'luxon'

const millisecondsPerDay = 24 * 60 * 60 * 1000
const excelEpochOffset = 25569

const toNearestUtcCalendarTimestamp = (value: Date | string): number => {
  const date = value instanceof Date ? value : DateTime.fromISO(value, { setZone: true }).toJSDate()
  const timestamp = date.getTime()
  if (Number.isNaN(timestamp)) {
    throw new Error('Invalid calendar date')
  }

  // Date-only form values historically arrived as midnight in the member's browser time zone.
  // The closest UTC midnight recovers that calendar date without depending on the current viewer's time zone.
  return Math.round(timestamp / millisecondsPerDay) * millisecondsPerDay
}

export const normalizeCalendarDateForTimeZone = (value: Date | string, timeZone: string): Date => {
  const calendarDate = new Date(toNearestUtcCalendarTimestamp(value))

  return DateTime.fromObject(
    {
      day: calendarDate.getUTCDate(),
      month: calendarDate.getUTCMonth() + 1,
      year: calendarDate.getUTCFullYear(),
    },
    { zone: timeZone },
  ).toJSDate()
}

export const toExcelCalendarDateSerial = (value: Date | string): number =>
  toNearestUtcCalendarTimestamp(value) / millisecondsPerDay + excelEpochOffset
