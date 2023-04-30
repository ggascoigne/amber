import { Attendance, Configuration, InterestLevel } from 'amber'
import type { MembershipType } from 'amber/utils/apiTypes'
import Yup from 'ui/utils/Yup'
import {} from 'yup'

export const getOwed = (configuration: Configuration, values: MembershipType): number | undefined => {
  if (configuration.virtual) {
    return parseInt(configuration.virtualCost, 10) || 0
  }
  if (values.interestLevel === InterestLevel.Deposit) {
    return configuration.deposit
  }
  if (configuration.useUsAttendanceOptions) {
    const acusPrices: Record<string, number> = {
      '1': 25,
      '2': 40,
      '3': 55,
      '4': 70,
    }
    return acusPrices[values.attendance] ?? 0
  } else {
    if (values.attendance === Attendance.ThursSun) {
      return values.requestOldPrice ? configuration.subsidizedMembership : configuration.fourDayMembership
    }
    return values.requestOldPrice ? configuration.subsidizedMembershipShort : configuration.threeDayMembership
  }
}

export const membershipValidationSchema = Yup.object().shape({
  attendance: Yup.string().max(255).required(),
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
  // eslint-disable-next-line unused-imports/no-unused-vars
  isVirtual: boolean
): MembershipType => ({
  userId,
  arrivalDate: configuration.conventionStartDate.toISO(),
  attendance: configuration.useUsAttendanceOptions ? '4' : 'Thurs-Sun',
  attending: true,
  hotelRoomId: 1, // dummy room
  departureDate: configuration.conventionEndDate.toISO(),
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
