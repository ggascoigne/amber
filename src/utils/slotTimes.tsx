import { DateTime } from 'luxon'

import { configuration } from './configuration'

// note that specifying the time zone is important otherwise when you try and display the times in a different tz, it all screws up
const startDates: Record<number, { date: DateTime; virtual: boolean }> = {
  2012: { date: DateTime.fromObject({ year: 2012, month: 11, day: 8, zone: 'America/Los_Angeles' }), virtual: false },
  2013: { date: DateTime.fromObject({ year: 2013, month: 11, day: 7, zone: 'America/Los_Angeles' }), virtual: false },
  2014: { date: DateTime.fromObject({ year: 2014, month: 11, day: 6, zone: 'America/Los_Angeles' }), virtual: false },
  2015: { date: DateTime.fromObject({ year: 2015, month: 11, day: 12, zone: 'America/Los_Angeles' }), virtual: false },
  2016: { date: DateTime.fromObject({ year: 2016, month: 11, day: 3, zone: 'America/Los_Angeles' }), virtual: false },
  2017: { date: DateTime.fromObject({ year: 2017, month: 11, day: 2, zone: 'America/Los_Angeles' }), virtual: false },
  2018: { date: DateTime.fromObject({ year: 2018, month: 11, day: 1, zone: 'America/Los_Angeles' }), virtual: false },
  2019: { date: DateTime.fromObject({ year: 2019, month: 10, day: 31, zone: 'America/Los_Angeles' }), virtual: false },
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

const formatSlot = (s: DateTime, e: DateTime) => `${s.toFormat('ccc, LLL d, t')} to ${e.toFormat('t ZZZZ')}`

const formatSlotLocal = (s: DateTime, e: DateTime) => formatSlot(s.setZone('local'), e.setZone('local'))

export const getSlotTimes = (year: number) =>
  startDates[year].virtual ? getVirtualSlotTimes(year) : getRegularSlotTimes(year)

export const getSlotDescription = ({
  year,
  slot,
  local = false,
}: {
  year: number
  slot: 1 | 2 | 3 | 4 | 5 | 6 | 7
  local?: boolean
}) => {
  const [start, end] = getSlotTimes(year)[slot - 1]
  return local ? `Slot ${slot} ${formatSlotLocal(start, end)}` : `Slot ${slot} ${formatSlot(start, end)}`
}

// I thought that I could just check the TZ, but there turn out to be a ton of possible Pacific Time strings,
// this way cheats but is easy. Aand it re-uses a function that I know works
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
