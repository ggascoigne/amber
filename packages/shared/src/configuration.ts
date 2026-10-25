import type { output } from 'zod/mini'
import { DateTime } from 'luxon'
import { enum as zEnum, iso, object, parse, pipe, record, string, transform } from 'zod/mini'

import { setVal } from './dot2val'

type SettingsQueryResult = { code: string; id: number; type: string; value: string }[]

let baseTimeZone: string | undefined

const notEmpty = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined

const pick = <T, D extends keyof T = keyof T>(o: T, ...props: D[]): Pick<T, D> =>
  Object.assign({}, ...props.map((prop) => ({ [prop]: o[prop] })))

const toNumber = () =>
  pipe(
    string(),
    transform((value) => (value ? parseInt(value, 10) : 0)),
  )

const toBoolean = () =>
  pipe(
    string(),
    transform((value) => (value ? value === 'true' : false)),
  )

const toDateTime = () =>
  pipe(
    iso.datetime({ offset: true }),
    transform((value) => (baseTimeZone ? DateTime.fromISO(value).setZone(baseTimeZone) : DateTime.fromISO(value))),
  )

export const conventionInfoSchema = object({
  date: toDateTime(),
  virtual: toBoolean(),
  slots: toNumber(),
})

export const configurationSchema = pipe(
  object({
    title: string(),
    name: string(),
    abbr: zEnum(['acnw', 'acus']),
    copyright: string(),
    contactEmail: string(),
    gameEmail: string(),
    webEmail: string(),
    startYear: toNumber(),
    firstDataYear: toNumber(),
    baseTimeZone: string(),
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

    oregonHotelTax: string(),
    virtualCost: string(),
    moreThanDoubleOccupancySurcharge: string(),
    gameRoomCredit: string(),

    // not used by ACNW - but stubbed out in the database to avoid type issues here that I can't be bothered to deal with :)
    hotelBookingCode: string(),
    hotelBookingUrl: string(),
    hotelBookingLastdate: toDateTime(),

    useUsAttendanceOptions: toBoolean(),

    startDates: record(toNumber(), conventionInfoSchema),
  }),
  transform((data) => ({
    ...data,
    isAcnw: data.abbr === 'acnw',
    isAcus: data.abbr === 'acus',
  })),
)

export const flagSchema = record(string(), string())
export const urlSchema = record(string(), string())

export type ConventionInfo = output<typeof conventionInfoSchema>
export type Configuration = output<typeof configurationSchema>

export type ConfigurationType = Configuration
type DateFields<T> = {
  [K in keyof T]: T[K] extends DateTime ? K : never
}[keyof T]
export type ConfigurationDates = Pick<ConfigurationType, DateFields<ConfigurationType>>
export type ConfigurationNonDates = Omit<ConfigurationType, DateFields<ConfigurationType> | 'startDates'>

export const getSettingsObject = (data: SettingsQueryResult | undefined) => {
  const settings = data?.map((n) => n && pick(n, 'id', 'code', 'type', 'value'))?.filter(notEmpty)
  const obj: any = {}
  settings?.forEach((i) => setVal(obj, i.code, i.value))
  // set global so we can use it in the transform
  baseTimeZone = obj?.config?.baseTimeZone

  const config = obj?.config ? parse(configurationSchema, obj.config) : undefined
  const flags = obj?.flag ? parse(flagSchema, obj.flag) : undefined
  const urls = obj?.url ? parse(urlSchema, obj.url) : undefined
  // console.log('getSettingsObject', { data, settings, obj, config, flags, urls })
  return { config, flags, urls }
}
