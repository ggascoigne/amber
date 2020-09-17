// todo: clean this up.  Right now this is stubbed out to
// make it easier to pull stuff over from V1

import { DateTime } from 'luxon'

export const pdxDate = ({ year, month, day }: { year: number; month: number; day: number }) =>
  DateTime.fromObject({ year, month, day, zone: 'America/Los_Angeles' })

const conventionStartDate = pdxDate({ year: 2020, month: 11, day: 5 })

const conventionDates = {
  year: conventionStartDate.year,
  startDay: conventionStartDate.day,
  endDay: conventionStartDate.day + 3,
}

export const configuration = {
  contactEmail: 'acnw@wyrdrune.com',
  conventionStartDate,
  conventionEndDate: conventionStartDate.plus({ days: 3 }),
  year: conventionDates.year,
  startDay: conventionDates.startDay,
  endDay: conventionDates.endDay,
  // normal years
  // registrationDeadline: pdxDate({ year: conventionDates.year, month: 7, day: 7 }),
  // paymentDeadline: pdxDate({ year: conventionDates.year, month: 8, day: 14 }),
  // gameSubmissionDeadline: pdxDate({ year: conventionDates.year, month: 8, day: 14 }),
  registrationDeadline: pdxDate({ year: conventionDates.year, month: 9, day: 25 }),
  paymentDeadline: pdxDate({ year: conventionDates.year, month: 8, day: 14 }),
  gameSubmissionDeadline: pdxDate({ year: conventionDates.year, month: 9, day: 28 }),
  gameGmPreview: pdxDate({ year: conventionDates.year, month: 10, day: 4 }),
  gameBookOpen: pdxDate({ year: conventionDates.year, month: 10, day: 6 }),
  gameChoicesDue: pdxDate({ year: conventionDates.year, month: 10, day: 11 }),
  gmPreview: pdxDate({ year: conventionDates.year, month: 10, day: 14 }),
  schedulesSent: pdxDate({ year: conventionDates.year, month: 10, day: 16 }),
  mondayBeforeCon: conventionStartDate.minus({ days: 3 }), // 11/2
  wednesdayAfterCon: conventionStartDate.plus({ days: 6 }), // 11/11
  dateRange: `${conventionStartDate.toFormat('MMMM')} ${conventionDates.startDay}-${conventionDates.endDay}, ${
    conventionDates.year
  }`,
  fourDayMembership: 130,
  fourDayVoucher: 70,
  threeDayMembership: 100,
  threeDayVoucher: 50,
  deposit: 30,
  virtual: true,
}
