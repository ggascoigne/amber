import { DateTime } from 'luxon'
import { Configuration } from 'amber'

const dtwDate = ({ year, month, day }: { year: number; month: number; day: number }) =>
  DateTime.fromObject({ year, month, day }, { zone: 'America/Detroit' })

// note that specifying the time zone is important otherwise when you try and display the times in a different tz, it all screws up
const startDates: Record<number, { date: DateTime; virtual: boolean; slots: number; skippedSlots?: Array<number> }> = {
  2017: { date: dtwDate({ year: 2017, month: 4, day: 6 }), virtual: false, slots: 8 },
  2018: { date: dtwDate({ year: 2018, month: 3, day: 22 }), virtual: false, slots: 8 },
  2019: { date: dtwDate({ year: 2019, month: 4, day: 11 }), virtual: false, slots: 8 },
  2020: { date: dtwDate({ year: 2020, month: 4, day: 2 }), virtual: true, slots: 8 },
  2021: { date: dtwDate({ year: 2021, month: 3, day: 25 }), virtual: true, slots: 8 },
  2022: { date: dtwDate({ year: 2022, month: 4, day: 7 }), virtual: true, slots: 8 },
  2023: { date: dtwDate({ year: 2023, month: 3, day: 16 }), virtual: false, slots: 8 },
}

const THIS_YEAR = 2023

const conventionStartDate = startDates[THIS_YEAR].date

export const configuration: Configuration = {
  title: 'Ambercon US',
  name: 'Ambercon',
  abbr: 'acus',
  startDates,
  contactEmail: 'acnw@wyrdrune.com',
  gameEmail: 'game@wyrdrune.com',
  webEmail: 'guy@wyrdrune.com',
  conventionStartDate,
  conventionEndDate: conventionStartDate.plus({ days: 3 }),
  year: THIS_YEAR,
  firstYear: 2017,
  startYear: 1991,
  startDay: conventionStartDate.day,
  endDay: conventionStartDate.day + 3,
  registrationOpen: dtwDate({ year: conventionStartDate.year, month: 1, day: 1 }),
  registrationDeadline: dtwDate({ year: conventionStartDate.year, month: 2, day: 15 }),
  paymentDeadline: dtwDate({ year: conventionStartDate.year, month: 2, day: 15 }),

  gameSubmissionDeadline: dtwDate({ year: conventionStartDate.year, month: 1, day: 17 }),
  gameGmPreview: dtwDate({ year: conventionStartDate.year, month: 1, day: 24 }),
  gameGmFeedbackDeadline: dtwDate({ year: conventionStartDate.year, month: 1, day: 29 }),
  gameBookOpen: dtwDate({ year: conventionStartDate.year, month: 1, day: 30 }),
  gameChoicesDue: dtwDate({ year: conventionStartDate.year, month: 2, day: 7 }),
  gmPreview: dtwDate({ year: conventionStartDate.year, month: 2, day: 14 }),
  schedulesSent: dtwDate({ year: conventionStartDate.year, month: 2, day: 16 }),

  lastCancellationFullRefund: dtwDate({ year: conventionStartDate.year, month: 2, day: 28 }),
  travelCoordination: dtwDate({ year: conventionStartDate.year, month: 10, day: 19 }),
  mondayBeforeCon: conventionStartDate.minus({ days: 3 }), // 11/2
  wednesdayAfterCon: conventionStartDate.plus({ days: 6 }), // 11/11

  fourDayMembership: 220,
  fourDayVoucher: 70,
  threeDayMembership: 170,
  threeDayVoucher: 50,
  subsidizedMembership: 150,
  subsidizedMembershipShort: 120,
  deposit: 50,

  virtual: startDates[THIS_YEAR].virtual,
  numberOfSlots: startDates[THIS_YEAR].slots,
  skippedSlots: startDates[THIS_YEAR].skippedSlots,
  oregonHotelTax: '13.95%',
  virtualCost: undefined,
  moreThanDoubleOccupancySurcharge: '$15',
  gameRoomCredit: '$120',
}
