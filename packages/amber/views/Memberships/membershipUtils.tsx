import Yup from 'ui/utils/Yup'
import {} from 'yup'

import { Attendance, Configuration } from '../../utils'
import { MembershipFormType } from '../../utils/membershipUtils'

export const membershipValidationSchemaNW = Yup.object().shape({
  arrivalDate: Yup.date().required(),
  attendance: Yup.string().max(255).required(),
  membership: Yup.string().max(255).required(),
  departureDate: Yup.date().required(),
  interestLevel: Yup.string().max(255).required(),
  message: Yup.string().max(1024),
  roomPreferenceAndNotes: Yup.string().max(1024),
  roomingPreferences: Yup.string().max(255),
  roomingWith: Yup.string().max(250), // yeah, really - schema is super inconsistent here
  skipSlots: Yup.string().max(20),
  subsidizedAmount: Yup.number().when('membership', {
    is: Attendance.Subsidized,
    then: (schema) => schema.required('Required for subsidized membership').min(20, 'Must be at least $20'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

export const membershipValidationSchemaUS = Yup.object().shape({
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
  _isVirtual: boolean,
): MembershipFormType =>
  ({
    userId,
    // note the difference in logic here is that NW wants to make users check their
    // dates since the dates are related to the eventual hotel room booking, and US
    // is just booking the convention itself
    arrivalDate: configuration.conventionStartDate.toJSDate(),
    attendance: configuration.isAcus ? '4' : Attendance.ThursSun,
    membership: Attendance.ThursSun,
    subsidizedAmount: configuration.subsidizedMembership,
    attending: true,
    hotelRoomId: configuration.isAcus ? 1 : 13,
    departureDate: configuration.conventionEndDate.toJSDate(),
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
    cost: 0,
  }) as const
