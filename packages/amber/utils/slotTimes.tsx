import { DateTime } from 'luxon'
import { Configuration } from './configContext'

export type SlotConfiguration = Pick<Configuration, 'startDates' | 'virtual' | 'year' | 'numberOfSlots'>

// ACNW
// 1 : Thur 7-12
// 2 : Fri 9-1
// 3 : Fri 2-6.30
// 4 : Fri 8-12
// 5 : Sat 9-4.30
// 6 : Sat 7-12
// 7 : Sun 10-4.30

// ACUS
// 1 : Thur 7-12
// 2 : Fri 9-1
// 3 : Fri 2-6.30
// 4 : Fri 8-12
// 5 : Sat 10-5
// 6 : Sat 7-12
// 7 : Sun 11-5
// 8 : Sun 7-12

const getRegularSlotTimes = ({ startDates, numberOfSlots }: SlotConfiguration, year: number) => {
  const start = startDates[year].date
  // note that the convolutions here using both plus and set are because the DST change often happens over this date range
  // and just adding hours to the start date breaks
  if (numberOfSlots === 7) {
    return [
      /* 1 */ [start.plus({ hours: 19 }), start.plus({ hours: 24 })],
      /* 2 */ [start.plus({ days: 1 }).set({ hour: 9 }), start.plus({ days: 1 }).set({ hour: 13 })],
      /* 3 */ [start.plus({ days: 1 }).set({ hour: 14 }), start.plus({ days: 1 }).set({ hour: 18, minute: 30 })],
      /* 4 */ [start.plus({ days: 1 }).set({ hour: 20 }), start.plus({ days: 1 }).set({ hour: 24 })],
      /* 5 */ [start.plus({ days: 2 }).set({ hour: 9 }), start.plus({ days: 2 }).set({ hour: 16, minute: 30 })],
      /* 6 */ [start.plus({ days: 2 }).set({ hour: 19 }), start.plus({ days: 2 }).set({ hour: 24 })],
      /* 7 */ [start.plus({ days: 3 }).set({ hour: 10 }), start.plus({ days: 3 }).set({ hour: 16, minute: 30 })],
    ] as const
  } else {
    return [
      /* 1 */ [start.plus({ hours: 19 }), start.plus({ hours: 24 })],
      /* 2 */ [start.plus({ days: 1 }).set({ hour: 9 }), start.plus({ days: 1 }).set({ hour: 13 })],
      /* 3 */ [start.plus({ days: 1 }).set({ hour: 14 }), start.plus({ days: 1 }).set({ hour: 18, minute: 30 })],
      /* 4 */ [start.plus({ days: 1 }).set({ hour: 20 }), start.plus({ days: 1 }).set({ hour: 24 })],
      /* 5 */ [start.plus({ days: 2 }).set({ hour: 10 }), start.plus({ days: 2 }).set({ hour: 17 })],
      /* 6 */ [start.plus({ days: 2 }).set({ hour: 19 }), start.plus({ days: 2 }).set({ hour: 24 })],
      /* 7 */ [start.plus({ days: 3 }).set({ hour: 11 }), start.plus({ days: 3 }).set({ hour: 17 })],
      /* 8 */ [start.plus({ days: 3 }).set({ hour: 19 }), start.plus({ days: 3 }).set({ hour: 24 })],
    ] as const
  }
}

// ACNW
// Virtual Times will be
// Thursday ACNW Welcome: 10 am Pacific.
// Thurs. Slot 1:  11 am to 3 pm Pacific
// Friday Slot 2:  9 am to 1 pm Pacific
// Fri. Slot 3: 2 pm to 6 pm Pacific
// Saturday Slot 4:  9 am to 1 pm Pacific
// Sat. Slot 5:  2 pm to 6 pm Pacific
// Sunday Slot 6:  9 am to 1 pm Pacific
// Sunday ACNW Farewell: 1:15 pm Pacific
// Sun. Slot 7: 2 pm to 6 pm Pacific

// PDT = Pacific Daylight time = summer, PST = Pacific Standard time = winter

// ACUS
// 1 : Thur 7-12
// 2 : Fri 10-2
// 3 : Fri 3-7
// 4 : Fri 8-12
// 5 : Sat 12-6
// 6 : Sat 7-12
// 7 : Sun 12-6
// 8 : Sun 7-11

const getVirtualSlotTimes = ({ startDates, numberOfSlots }: SlotConfiguration, year: number) => {
  const start = startDates[year].date
  // note that the convolutions here using both plus and set are because the DST change often happens over this date range
  // and just adding hours to the start date breaks
  if (numberOfSlots === 7) {
    return [
      /* 1 */ [start.plus({ hours: 11 }), start.plus({ hours: 15 })],
      /* 2 */ [start.plus({ days: 1 }).set({ hour: 9 }), start.plus({ days: 1 }).set({ hour: 13 })],
      /* 3 */ [
        start.plus({ days: 1 }).set({ hour: 14, minute: 30 }),
        start.plus({ days: 1 }).set({ hour: 18, minute: 30 }),
      ],
      /* 4 */ [start.plus({ days: 2 }).set({ hour: 9 }), start.plus({ days: 2 }).set({ hour: 13 })],
      /* 5 */ [
        start.plus({ days: 2 }).set({ hour: 14, minute: 30 }),
        start.plus({ days: 2 }).set({ hour: 18, minute: 30 }),
      ],
      /* 6 */ [start.plus({ days: 3 }).set({ hour: 9 }), start.plus({ days: 3 }).set({ hour: 13 })],
      /* 7 */ [
        start.plus({ days: 3 }).set({ hour: 14, minute: 30 }),
        start.plus({ days: 3 }).set({ hour: 18, minute: 30 }),
      ],
    ] as const
  } else {
    return [
      /* 1 */ [start.plus({ hours: 19 }), start.plus({ hours: 24 })],
      /* 2 */ [start.plus({ days: 1 }).set({ hour: 10 }), start.plus({ days: 1 }).set({ hour: 14 })],
      /* 3 */ [start.plus({ days: 1 }).set({ hour: 15 }), start.plus({ days: 1 }).set({ hour: 19 })],
      /* 4 */ [start.plus({ days: 1 }).set({ hour: 20 }), start.plus({ days: 1 }).set({ hour: 24 })],
      /* 5 */ [start.plus({ days: 2 }).set({ hour: 12 }), start.plus({ days: 2 }).set({ hour: 18 })],
      /* 6 */ [start.plus({ days: 2 }).set({ hour: 19 }), start.plus({ days: 2 }).set({ hour: 24 })],
      /* 7 */ [start.plus({ days: 3 }).set({ hour: 12 }), start.plus({ days: 3 }).set({ hour: 18 })],
      /* 8 */ [start.plus({ days: 3 }).set({ hour: 19 }), start.plus({ days: 3 }).set({ hour: 23 })],
    ] as const
  }
}

export enum SlotFormat {
  DEFAULT,
  ALT,
  SHORT,
  ALT_SHORT,
  SHORT_NO_TZ,
  TINY,
}

const mapping = { AM: 'am', PM: 'pm' }

const replaceAll = (str: string, mapObj: Record<string, string>) => {
  const re = new RegExp(Object.keys(mapObj).join('|'), 'g')
  return str.replace(re, (matched) => mapObj[matched])
}

const formatSlot = (slot: number, s: DateTime, e: DateTime, altFormat: SlotFormat) => {
  const res = (() => {
    switch (altFormat) {
      case SlotFormat.ALT:
        return `${s.toFormat('cccc')} Slot ${slot}: ${s.toFormat('t')} to ${e.toFormat('t ZZZZ')}`
      case SlotFormat.ALT_SHORT:
        return `${s.toFormat('cccc')} ${s.toFormat('t')} to ${e.toFormat('t ZZZZ')}`
      case SlotFormat.SHORT:
        return `Slot ${slot}: ${s.toFormat('ccc h:mm a')} to ${e.toFormat('h:mm a ZZZZ')}`
      case SlotFormat.SHORT_NO_TZ:
        return `${s.toFormat('cccc')} ${s.toFormat('t')} to ${e.toFormat('t')}`
      case SlotFormat.TINY:
        return `${s.toFormat('ccc')} ${s.toFormat('t')} to ${e.toFormat('t')}`
      case SlotFormat.DEFAULT:
      default:
        return `Slot ${slot} ${s.toFormat('ccc, LLL d, t')} to ${e.toFormat('t ZZZZ')}`
    }
  })()
  return replaceAll(res, mapping)
}

const formatSlotLocal = (slot: number, s: DateTime, e: DateTime, altFormat: SlotFormat) =>
  formatSlot(slot, s.setZone('local'), e.setZone('local'), altFormat)

export const getSlotTimes = (configuration: SlotConfiguration, year: number) =>
  configuration.startDates[year].virtual
    ? getVirtualSlotTimes(configuration, year)
    : getRegularSlotTimes(configuration, year)

export const getSlotDescription = (
  configuration: SlotConfiguration,
  {
    year,
    slot,
    local = false,
    altFormat = SlotFormat.DEFAULT,
    lateStart,
  }: {
    year: number
    slot: number
    local?: boolean
    altFormat?: SlotFormat
    lateStart?: DateTime
  }
) => {
  if (!slot) return 'unscheduled'
  const [start, end] = getSlotTimes(configuration, year)[slot - 1]
  const realStart = lateStart ?? start
  // console.log({ slot, start, end })
  return local ? formatSlotLocal(slot, realStart, end, altFormat) : formatSlot(slot, realStart, end, altFormat)
}

// I thought that I could just check the TZ, but there turn out to be a ton of possible Pacific Time strings,
// this way cheats but is easy. And it re-uses a function that I know works
export const isNotPacificTime = (configuration: SlotConfiguration) =>
  getSlotDescription(configuration, {
    year: configuration.year,
    slot: 1,
    local: true,
  }) !==
  getSlotDescription(configuration, {
    year: configuration.year,
    slot: 1,
    local: false,
  })

export const isMorningSlot = (slot: number) => [2, 5, 7].includes(slot)
export const isEveningSlot = (slot: number) => [1, 4, 6, 8].includes(slot)
