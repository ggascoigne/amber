import { normalizeCalendarDateForTimeZone } from '@amber/shared/src/calendarDate'

type MembershipDates = {
  arrivalDate: Date | string
  departureDate: Date | string
}

type NormalizedMembershipDates<Membership extends MembershipDates> = Omit<
  Membership,
  'arrivalDate' | 'departureDate'
> & {
  arrivalDate: Date
  departureDate: Date
}

export const normalizeMembershipDatesForPersistence = <Membership extends MembershipDates>(
  membership: Membership,
  timeZone: string,
): NormalizedMembershipDates<Membership> => ({
  ...membership,
  arrivalDate: normalizeCalendarDateForTimeZone(membership.arrivalDate, timeZone),
  departureDate: normalizeCalendarDateForTimeZone(membership.departureDate, timeZone),
})
