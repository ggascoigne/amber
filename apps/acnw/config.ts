import { Configuration } from 'amber'
import { DateTime } from 'luxon'

const pdxDate = ({ year, month, day }: { year: number; month: number; day: number }) =>
  DateTime.fromObject({ year, month, day }, { zone: 'America/Los_Angeles' })

// note that specifying the time zone is important otherwise when you try and display the times in a different tz, it all screws up
const startDates: Record<number, { date: DateTime; virtual: boolean; slots: number }> = {
  2012: { date: pdxDate({ year: 2012, month: 11, day: 8 }), virtual: false, slots: 7 },
  2013: { date: pdxDate({ year: 2013, month: 11, day: 7 }), virtual: false, slots: 7 },
  2014: { date: pdxDate({ year: 2014, month: 11, day: 6 }), virtual: false, slots: 7 },
  2015: { date: pdxDate({ year: 2015, month: 11, day: 12 }), virtual: false, slots: 7 },
  2016: { date: pdxDate({ year: 2016, month: 11, day: 3 }), virtual: false, slots: 7 },
  2017: { date: pdxDate({ year: 2017, month: 11, day: 2 }), virtual: false, slots: 7 },
  2018: { date: pdxDate({ year: 2018, month: 11, day: 1 }), virtual: false, slots: 7 },
  2019: { date: pdxDate({ year: 2019, month: 10, day: 31 }), virtual: false, slots: 7 },
  2020: { date: pdxDate({ year: 2020, month: 11, day: 5 }), virtual: true, slots: 7 },
  2021: { date: pdxDate({ year: 2021, month: 11, day: 4 }), virtual: true, slots: 7 },
  2022: { date: pdxDate({ year: 2022, month: 11, day: 3 }), virtual: false, slots: 7 },
}

const THIS_YEAR = 2022

const conventionStartDate = startDates[THIS_YEAR].date

export const configuration: Configuration = {
  // static
  title: 'Ambercon NW',
  name: 'ACNW',
  abbr: 'acnw',
  contactEmail: 'acnw@wyrdrune.com',
  gameEmail: 'game@wyrdrune.com',
  webEmail: 'guy@wyrdrune.com',
  firstDataYear: 2012,
  startYear: 1997,
  baseTimeZone: 'America/Los_Angeles',

  // per-year
  year: THIS_YEAR,
  conventionStartDate,
  conventionEndDate: conventionStartDate.plus({ days: 3 }),
  mondayBeforeCon: conventionStartDate.minus({ days: 3 }),
  wednesdayAfterCon: conventionStartDate.plus({ days: 6 }),

  registrationOpen: pdxDate({ year: THIS_YEAR, month: 7, day: 15 }),
  registrationDeadline: pdxDate({ year: THIS_YEAR, month: 9, day: 2 }),
  paymentDeadline: pdxDate({ year: THIS_YEAR, month: 8, day: 12 }),
  gameSubmissionDeadline: pdxDate({ year: THIS_YEAR, month: 8, day: 15 }),
  gameGmPreview: pdxDate({ year: THIS_YEAR, month: 9, day: 2 }),
  gameGmFeedbackDeadline: pdxDate({ year: THIS_YEAR, month: 9, day: 23 }),
  gameBookOpen: pdxDate({ year: THIS_YEAR, month: 9, day: 5 }),
  gameChoicesDue: pdxDate({ year: THIS_YEAR, month: 9, day: 25 }),
  gmPreview: pdxDate({ year: THIS_YEAR, month: 9, day: 28 }),
  schedulesSent: pdxDate({ year: THIS_YEAR, month: 9, day: 30 }),
  lastCancellationFullRefund: pdxDate({ year: THIS_YEAR, month: 10, day: 19 }),
  travelCoordination: pdxDate({ year: THIS_YEAR, month: 10, day: 19 }),

  fourDayMembership: 220,
  fourDayVoucher: 70,
  threeDayMembership: 170,
  threeDayVoucher: 50,
  subsidizedMembership: 150,
  subsidizedMembershipShort: 120,
  deposit: 50,

  virtual: startDates[THIS_YEAR].virtual,
  numberOfSlots: startDates[THIS_YEAR].slots,
  oregonHotelTax: '13.95%',
  virtualCost: '',
  moreThanDoubleOccupancySurcharge: '$15',
  gameRoomCredit: '$120',
  useUsAttendanceOptions: false,

  // derived
  startDates,
}
