import { DateTime } from 'luxon'

import { configuration, pdxDate } from './configuration'

// note that specifying the time zone is important otherwise when you try and display the times in a different tz, it all screws up
const startDates: Record<number, { date: DateTime; virtual: boolean }> = {
  2012: { date: pdxDate({ year: 2012, month: 11, day: 8 }), virtual: false },
  2013: { date: pdxDate({ year: 2013, month: 11, day: 7 }), virtual: false },
  2014: { date: pdxDate({ year: 2014, month: 11, day: 6 }), virtual: false },
  2015: { date: pdxDate({ year: 2015, month: 11, day: 12 }), virtual: false },
  2016: { date: pdxDate({ year: 2016, month: 11, day: 3 }), virtual: false },
  2017: { date: pdxDate({ year: 2017, month: 11, day: 2 }), virtual: false },
  2018: { date: pdxDate({ year: 2018, month: 11, day: 1 }), virtual: false },
  2019: { date: pdxDate({ year: 2019, month: 10, day: 31 }), virtual: false },
  2020: { date: configuration.conventionStartDate, virtual: true },
}

// 1 : Thur 7-12
// 2 : Fri 9-1
// 3 : Fri 2-6.30
// 4 : Fri 8-12
// 5 : Sat 9-4.30
// 6 : Sat 7-12
// 7 : Sun 10-4.30

const getRegularSlotTimes = (year: number) => {
  const start = startDates[year].date
  // note that the convolutions here using both plus and set are because the DST change often happens over this date range
  // and just adding hours to the start date breaks
  return [
    /* 1 */ [start.plus({ hours: 19 }), start.plus({ hours: 24 })],
    /* 2 */ [start.plus({ day: 1 }).set({ hour: 9 }), start.plus({ day: 1 }).set({ hour: 13 })],
    /* 3 */ [start.plus({ day: 1 }).set({ hour: 14 }), start.plus({ day: 1 }).set({ hour: 18, minute: 30 })],
    /* 4 */ [start.plus({ day: 1 }).set({ hour: 20 }), start.plus({ day: 1 }).set({ hour: 24 })],
    /* 5 */ [start.plus({ day: 2 }).set({ hour: 9 }), start.plus({ day: 2 }).set({ hour: 16, minute: 30 })],
    /* 6 */ [start.plus({ day: 2 }).set({ hour: 19 }), start.plus({ day: 2 }).set({ hour: 24 })],
    /* 7 */ [start.plus({ day: 3 }).set({ hour: 10 }), start.plus({ day: 3 }).set({ hour: 16, minute: 30 })],
  ] as const
}

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

const getVirtualSlotTimes = (year: number) => {
  const start = startDates[year].date
  // note that the convolutions here using both plus and set are because the DST change often happens over this date range
  // and just adding hours to the start date breaks
  return [
    /* 1 */ [start.plus({ hours: 11 }), start.plus({ hours: 15 })],
    /* 2 */ [start.plus({ day: 1 }).set({ hour: 9 }), start.plus({ day: 1 }).set({ hour: 13 })],
    /* 3 */ [start.plus({ day: 1 }).set({ hour: 14 }), start.plus({ day: 1 }).set({ hour: 18 })],
    /* 4 */ [start.plus({ day: 2 }).set({ hour: 9 }), start.plus({ day: 2 }).set({ hour: 13 })],
    /* 5 */ [start.plus({ day: 2 }).set({ hour: 14 }), start.plus({ day: 2 }).set({ hour: 18 })],
    /* 6 */ [start.plus({ day: 3 }).set({ hour: 9 }), start.plus({ day: 3 }).set({ hour: 13 })],
    /* 7 */ [start.plus({ day: 3 }).set({ hour: 14 }), start.plus({ day: 3 }).set({ hour: 18 })],
  ] as const
}

export enum SlotFormat {
  DEFAULT,
  ALT,
  SHORT,
}

const formatSlot = (slot: number, s: DateTime, e: DateTime, altFormat: SlotFormat) => {
  switch (altFormat) {
    case SlotFormat.ALT:
      return `${s.toFormat('cccc')} Slot ${slot}: ${s.toFormat('t')} to ${e.toFormat('t ZZZZ')}`
    case SlotFormat.SHORT:
      return `Slot ${slot}: ${s.toFormat('t')} to ${e.toFormat('t ZZZZ')}`
    case SlotFormat.DEFAULT:
    default:
      return `Slot ${slot} ${s.toFormat('ccc, LLL d, t')} to ${e.toFormat('t ZZZZ')}`
  }
}

const formatSlotLocal = (slot: number, s: DateTime, e: DateTime, altFormat: SlotFormat) =>
  formatSlot(slot, s.setZone('local'), e.setZone('local'), altFormat)

export const getSlotTimes = (year: number) =>
  startDates[year].virtual ? getVirtualSlotTimes(year) : getRegularSlotTimes(year)

export const getSlotDescription = ({
  year,
  slot,
  local = false,
  altFormat = SlotFormat.DEFAULT,
}: {
  year: number
  slot: number
  local?: boolean
  altFormat?: SlotFormat
}) => {
  const [start, end] = getSlotTimes(year)[slot - 1]
  return local ? formatSlotLocal(slot, start, end, altFormat) : formatSlot(slot, start, end, altFormat)
}

// I thought that I could just check the TZ, but there turn out to be a ton of possible Pacific Time strings,
// this way cheats but is easy. And it re-uses a function that I know works
export const isNotPacificTime =
  getSlotDescription({
    year: 2020,
    slot: 1,
    local: true,
  }) !==
  getSlotDescription({
    year: 2020,
    slot: 1,
    local: false,
  })
