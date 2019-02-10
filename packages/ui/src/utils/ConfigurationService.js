// todo: clean this up.  Right now this is stubbed out to
// make it easier to pull stuff over from V1

const conventionDates = {
  year: 2017,
  startDay: 2,
  endDay: 5
}

const configurationService = {
  simEmail: 'simonepdx@gmail.com',
  guyEmail: 'guy@wyrdrune.com',
  amberEmail: 'unchangeling@gmail.com',
  noReplyEmail: 'acnw@wyrdrune.com',
  acnwEmail: 'acnw@wyrdrune.com',
  year: conventionDates.year,
  startDay: conventionDates.startDay,
  endDay: conventionDates.endDay,
  registrationDeadline: 'July 7',
  paymentDeadline: 'August 14',
  gameSubmissionDeadline: 'August 14',
  mondayBeforeCon: 'Nov 9',
  wednesdayAfterCon: 'Nov 18',
  mondayBeforeConAsDate: '10/30/17',
  wednesdayAfterConAsDate: '11/8/17',
  startDate: `Thursday November ${conventionDates.startDay}`,
  endDate: `Sunday November ${conventionDates.endDay}`,
  dateRange: `November ${conventionDates.startDay}-${conventionDates.endDay}, ${conventionDates.year}`,
  startDateAsDate: `11/${conventionDates.startDay}/${conventionDates.year}`,
  endDateAsDate: `11/${conventionDates.endDay}/${conventionDates.year}`,
  fourDayMembership: 130,
  fourDayVoucher: 70,
  threeDayMembership: 100,
  threeDayVoucher: 50,
  deposit: 30
}

export default configurationService
