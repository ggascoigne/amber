import { DateTime } from 'luxon'

export const toDateTime = (date?: string | Date | null) => {
  if (date === undefined || date === null || date === '') {
    return undefined
  }
  return date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
}

export const formatDate = (date?: string | Date) => {
  const dateTime = toDateTime(date)
  if (dateTime === undefined) {
    return ''
  }
  return dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
}
