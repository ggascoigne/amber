import { createContext, useContext } from 'react'

import { DateTime } from 'luxon'

export type ConventionInfo = {
  date: DateTime
  virtual: boolean
  slots: number
  skippedSlots?: number[] | undefined
}

export type Configuration = {
  title: string
  name: string
  abbr: string
  startDates: Record<number, ConventionInfo>
  contactEmail: string
  gameEmail: string
  webEmail: string
  conventionStartDate: DateTime
  conventionEndDate: DateTime
  year: number
  // the first year that we have data for
  firstYear: number
  // the first year that convention ran
  startYear: number
  startDay: number
  endDay: number
  registrationOpen: DateTime
  registrationDeadline: DateTime
  paymentDeadline: DateTime
  gameSubmissionDeadline: DateTime
  gameGmPreview: DateTime
  gameGmFeedbackDeadline: DateTime
  gameBookOpen: DateTime
  gameChoicesDue: DateTime
  gmPreview: DateTime
  schedulesSent: DateTime
  lastCancellationFullRefund: DateTime
  travelCoordination: DateTime
  mondayBeforeCon: DateTime
  wednesdayAfterCon: DateTime
  fourDayMembership: number
  fourDayVoucher: number
  threeDayMembership: number
  threeDayVoucher: number
  subsidizedMembership: number
  subsidizedMembershipShort: number
  deposit: number
  virtual: boolean
  numberOfSlots: number
  skippedSlots: number[] | undefined
  oregonHotelTax: string
  virtualCost: undefined
  moreThanDoubleOccupancySurcharge: string
  gameRoomCredit: string
  useUsAttendanceOptions: boolean
}

export type ConfigurationType = Configuration
type DateFields<T> = { [K in keyof T]: T[K] extends DateTime ? K : never }[keyof T]
export type ConfigurationDates = Pick<ConfigurationType, DateFields<ConfigurationType>>

export const configContext = createContext<Configuration | undefined>(undefined)

export const useConfiguration = () => {
  const config = useContext(configContext)
  if (!config) {
    throw new Error('useConfiguration must be used within a ConfigProvider')
  }
  return config
}

export const ConfigProvider = configContext.Provider
