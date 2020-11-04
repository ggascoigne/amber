import * as ics from 'ics'
import { DateTime } from 'luxon'

// import { configuration } from './configuration'

export interface ICalEvent {
  title: string
  description: string
  startTime: DateTime
  endTime: DateTime
  url: string
}

const dtToArray = (d: DateTime) => {
  const fmt = 'y-LL-d-H-m'
  const val = d
    .setZone('local')
    .toFormat(fmt)
    .split('-')
    .map((x) => parseInt(x, 10)) as [number, number, number, number, number]
  // console.log(`val = ${JSON.stringify(val, null, 2)}`)
  return val
}

export function buildUrl(events: ICalEvent[]): string {
  const { error, value } = ics.createEvents(
    events.map((event) => ({
      productId: 'acnw',
      start: dtToArray(event.startTime),
      end: dtToArray(event.endTime),
      title: event.title,
      description: event.description,
      // organizer: { email: configuration.contactEmail },
      url: event.url,
    }))
  )

  error && console.log(error)

  if (value) {
    return URL.createObjectURL(new Blob([value], { type: 'text/calendar' }))
  } else {
    return ''
  }
}
