import { RouterOutputs } from '@amber/server'
import { DateTime } from 'luxon'
import { z } from 'zod'

import { setVal } from './dot2val'

type SettingsQueryResult = RouterOutputs['settings']['getSettings']

let baseTimeZone: string | undefined

export function notEmpty<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export function pick<T, D extends keyof T = keyof T>(o: T, ...props: D[]): Pick<T, D> {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })))
}

const toNumber = () => z.string().transform((val) => (val ? parseInt(val, 10) : 0))

const toBoolean = () => z.string().transform((val) => (val ? val === 'true' : false))

const toDateTime = () =>
  z
    .string()
    .datetime({ offset: true })
    .transform((val) => (baseTimeZone ? DateTime.fromISO(val).setZone(baseTimeZone) : DateTime.fromISO(val)))

export const conventionInfoSchema = z.object({
  date: toDateTime(),
  virtual: toBoolean(),
  slots: toNumber(),
})

export const configurationSchema = z.object({
  title: z.string(),
  name: z.string(),
  abbr: z.string(),
  copyright: z.string(),
  contactEmail: z.string(),
  gameEmail: z.string(),
  webEmail: z.string(),
  startYear: toNumber(),
  firstDataYear: toNumber(),
  baseTimeZone: z.string(),
  year: toNumber(),

  conventionStartDate: toDateTime(),
  conventionEndDate: toDateTime(),
  mondayBeforeCon: toDateTime(),
  wednesdayAfterCon: toDateTime(),
  registrationOpen: toDateTime(),
  registrationDeadline: toDateTime(),
  paymentDeadline: toDateTime(),
  gameSubmissionDeadline: toDateTime(),
  gameGmPreview: toDateTime(),
  gameGmFeedbackDeadline: toDateTime(),
  gameBookOpen: toDateTime(),
  gameChoicesDue: toDateTime(),
  gmPreview: toDateTime(),
  schedulesSent: toDateTime(),
  lastCancellationFullRefund: toDateTime(),
  travelCoordination: toDateTime(),

  fourDayMembership: toNumber(),
  fourDayVoucher: toNumber(),
  threeDayMembership: toNumber(),
  threeDayVoucher: toNumber(),
  subsidizedMembership: toNumber(),
  subsidizedMembershipShort: toNumber(),
  deposit: toNumber(),
  virtual: toBoolean(),
  numberOfSlots: toNumber(),

  playerMin: toNumber(),
  playerMax: toNumber(),
  minPlayersFloor: toNumber(),
  minPlayersCeiling: toNumber(),
  maxPlayersFloor: toNumber(),
  maxPlayersCeiling: toNumber(),

  oregonHotelTax: z.string(),
  virtualCost: z.string(),
  moreThanDoubleOccupancySurcharge: z.string(),
  gameRoomCredit: z.string(),
  useUsAttendanceOptions: toBoolean(),

  // not used by ACNW - but stubbed out in the database to avoid type issues here that I can't be bothered to deal with :)
  hotelBookingCode: z.string(),
  hotelBookingUrl: z.string(),
  hotelBookingLastdate: toDateTime(),

  startDates: z.record(toNumber(), conventionInfoSchema),
})

export const flagSchema = z.record(z.string(), z.string())
export const urlSchema = z.record(z.string(), z.string())

export type ConventionInfo = z.infer<typeof conventionInfoSchema>
export type Configuration = z.infer<typeof configurationSchema>

export type ConfigurationType = Configuration
type DateFields<T> = { [K in keyof T]: T[K] extends DateTime ? K : never }[keyof T]
export type ConfigurationDates = Pick<ConfigurationType, DateFields<ConfigurationType>>
export type ConfigurationNonDates = Omit<ConfigurationType, DateFields<ConfigurationType> | 'startDates'>

export const getSettingsObject = (data: SettingsQueryResult | undefined) => {
  const settings = data?.map((n) => n && pick(n, 'id', 'code', 'type', 'value'))?.filter(notEmpty)
  const obj: any = {}
  settings?.forEach((i) => setVal(obj, i.code, i.value))
  // set global so we can use it in the transform
  baseTimeZone = obj?.config?.baseTimeZone

  const config = obj?.config ? configurationSchema.parse(obj.config) : undefined
  const flags = obj?.flag ? flagSchema.parse(obj.flag) : undefined
  const urls = obj?.url ? urlSchema.parse(obj.url) : undefined
  // console.log('getSettingsObject', { data, settings, obj, config, flags, urls })
  return { config, flags, urls }
}
