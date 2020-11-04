import * as ics from 'ics'
import { DateTime } from 'luxon'

import { configuration } from './configuration'

export interface ICalEvent {
  title: string
  description: string
  startTime: DateTime
  endTime: DateTime
}

const dtToArray = (d: DateTime) => {
  const fmt = 'y-LL-d-H-m'
  return d
    .toFormat(fmt)
    .split('-')
    .map((x) => parseInt(x, 10)) as [number, number, number, number, number]
}

export function buildUrl(events: ICalEvent[], useDataURL = false): string {
  const { error, value } = ics.createEvents(
    events.map((event) => ({
      productId: 'acnw',
      start: dtToArray(event.startTime),
      end: dtToArray(event.endTime),
      title: event.title,
      description: event.description,
      organizer: { email: configuration.contactEmail },
    }))
  )

  error && console.log(error)
  const url = value

  if (useDataURL) {
    return encodeURI(`data:text/calendar;charset=utf8,${url}`)
  } else {
    return url ?? ''
  }
}
