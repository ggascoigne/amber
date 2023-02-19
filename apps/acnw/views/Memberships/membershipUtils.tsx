import Yup from 'ui/utils/Yup'
import { Attendance, Configuration, InterestLevel } from 'amber'

import {} from 'yup'
import { MembershipType } from 'amber/utils/apiTypes'

export const getOwed = (configuration: Configuration, values: MembershipType): number | undefined => {
  if (configuration.virtual) {
    return configuration.virtualCost
  }
  if (values.interestLevel === InterestLevel.Deposit) {
    return configuration.deposit
  }
  if (values.attendance === Attendance.ThursSun) {
    return values.requestOldPrice ? configuration.subsidizedMembership : configuration.fourDayMembership
  }
  return values.requestOldPrice ? configuration.subsidizedMembershipShort : configuration.threeDayMembership
}

export const membershipValidationSchema = Yup.object().shape({
  arrivalDate: Yup.date().required(),
  attendance: Yup.string().max(255).required(),
  departureDate: Yup.date().required(),
  interestLevel: Yup.string().max(255).required(),
  message: Yup.string().max(1024),
  roomPreferenceAndNotes: Yup.string().max(1024),
  roomingPreferences: Yup.string().max(255),
  roomingWith: Yup.string().max(250), // yeah, really - schema is super inconsistent here
  skipSlots: Yup.string().max(20),
})

export const getDefaultMembership = (
  configuration: Configuration,
  userId: number,
  isVirtual: boolean
): MembershipType => ({
  userId,
  arrivalDate: isVirtual ? configuration.conventionStartDate.toISO() : '',
  attendance: 'Thurs-Sun',
  attending: true,
  hotelRoomId: 13, // no room required
  departureDate: isVirtual ? configuration.conventionEndDate.toISO() : '',
  interestLevel: 'Full',
  message: '',
  offerSubsidy: false,
  requestOldPrice: false,
  roomPreferenceAndNotes: '',
  roomingPreferences: 'other',
  roomingWith: '',
  volunteer: false,
  year: configuration.year,
  slotsAttending: '',
  amountOwed: 0,
  amountPaid: 0,
})
