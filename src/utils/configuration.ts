// todo: clean this up.  Right now this is stubbed out to
// make it easier to pull stuff over from V1

import { DateTime } from 'luxon'

const conventionStartDate = DateTime.fromObject({ year: 2020, month: 11, day: 5, zone: 'America/Los_Angeles' })

const conventionDates = {
  year: conventionStartDate.year,
  startDay: conventionStartDate.day,
  endDay: conventionStartDate.day + 3,
}

export const configuration = {
  simEmail: 'simonepdx@gmail.com',
  guyEmail: 'guy@wyrdrune.com',
  amberEmail: 'unchangeling@gmail.com',
  noReplyEmail: 'acnw@wyrdrune.com',
  acnwEmail: 'acnw@wyrdrune.com',
  conventionStartDate,
  conventionEndDate: conventionStartDate.plus({ days: 3 }),
  year: conventionDates.year,
  startDay: conventionDates.startDay,
  endDay: conventionDates.endDay,
  registrationDeadline: DateTime.fromObject({ year: conventionDates.year, month: 7, day: 7 }),
  paymentDeadline: DateTime.fromObject({ year: conventionDates.year, month: 8, day: 14 }),
  gameSubmissionDeadline: DateTime.fromObject({ year: conventionDates.year, month: 8, day: 14 }),
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
