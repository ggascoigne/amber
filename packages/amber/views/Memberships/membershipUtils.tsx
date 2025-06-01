import { CreateMembershipInputType } from '@amber/client'
import Yup from 'ui/utils/Yup'
import {} from 'yup'

import { Configuration } from '../../utils'

export const membershipValidationSchemaNW = Yup.object().shape({
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
): CreateMembershipInputType => ({
  userId,
  // note the difference in logic here is that NW wants to make users check their
  // dates since the dates are related to the eventual hotel room booking, and US
  // is just booking the convention itself
  arrivalDate: configuration.conventionStartDate.toJSDate(),
  attendance: configuration.isAcus ? '4' : 'Thurs-Sun',
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
})
