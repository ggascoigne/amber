import { useMemo } from 'react'

import { DateTime } from 'luxon'

import { Configuration, useConfiguration } from './configContext'

export const getPref = (values: { value: string; text: string }[], value: string) =>
  values.find((v) => v.value === value)?.text

export const PlayerPreference = {
  Any: 'any',
  RetOnly: 'ret-only',
  RetPref: 'ret-pref',
} as const

export const playerPreferenceOptions = [
  { value: PlayerPreference.Any, text: 'Any' },
  { value: PlayerPreference.RetOnly, text: 'Returning players only' },
  { value: PlayerPreference.RetPref, text: 'Returning players have preference, new players welcome.' },
]

export const getPlayerPreference = (value: string) => getPref(playerPreferenceOptions, value)

export const Attendance = {
  ThursSun: 'Thurs-Sun',
  FriSun: 'Fri-Sun',
  Subsidized: 'subsidized',
} as const

const getAttendanceOptions = (configuration: Configuration) => {
  if (configuration.isAcus) {
    return [
      {
        value: '1',
        text: '1 Day: $25.00',
      },
      {
        value: '2',
        text: '2 Day: $40.00',
      },
      {
        value: '3',
        text: '3 Day: $55.00',
      },
      {
        value: '4',
        text: '4 Day: $70.00',
      },
    ]
  } else
    return [
      {
        value: Attendance.ThursSun,
        text: 'Full, Thursday - Sunday',
      },
      {
        value: Attendance.FriSun,
        text: 'Short, Friday - Sunday',
      },
    ]
}

export const getAttendance = (configuration: Configuration, value: string) =>
  getPref(getAttendanceOptions(configuration), value)

export const useGetAttendanceOptions = () => {
  const configuration = useConfiguration()
  return useMemo(() => getAttendanceOptions(configuration), [configuration])
}

const getSubsidizedAttendanceOptions = (_configuration: Configuration) => [
  {
    value: Attendance.ThursSun,
    text: 'Full, Thursday - Sunday',
  },
  {
    value: Attendance.FriSun,
    text: 'Short, Friday - Sunday',
  },
  {
    value: Attendance.Subsidized,
    text: `Subsidized`,
  },
]

export const useGetSubsidizedAttendanceOptions = () => {
  const configuration = useConfiguration()
  return useMemo(() => getSubsidizedAttendanceOptions(configuration), [configuration])
}

const getCost = (
  configuration: Configuration,
  membership: { requestOldPrice: boolean; attendance: string; cost: number | null },
) =>
  configuration.isAcus
    ? getAttendance(configuration, membership.attendance)
    : `${getAttendance(configuration, membership.attendance)}: $${membership.cost}`

export const useGetCost = (membership: { requestOldPrice: boolean; attendance: string; cost: number | null }) => {
  const configuration = useConfiguration()
  return useMemo(() => getCost(configuration, membership), [configuration, membership])
}

export const InterestLevel = {
  Full: 'Full',
  Deposit: 'Deposit',
} as const

const getInterestOptions = (configuration: Configuration) => [
  {
    value: InterestLevel.Full,
    text: 'I am sending payment in full now',
  },
  {
    value: InterestLevel.Deposit,
    text: `I am paying a deposit of $${
      configuration.deposit
    }.00 now. I understand payment in full is due ${configuration.paymentDeadline.toLocaleString(DateTime.DATE_MED)}.`,
  },
]

export const getInterestLevel = (configuration: Configuration, value: string) =>
  getPref(getInterestOptions(configuration), value)

export const useGetInterestOptions = () => {
  const configuration = useConfiguration()
  return useMemo(() => getInterestOptions(configuration), [configuration])
}

export enum BathroomType {
  EnSuite = 'en-suite',
  NoEnSuite = 'no en-suite',
  Other = 'other',
}

export const bathroomTypeOptions = [
  {
    value: BathroomType.EnSuite,
    text: BathroomType.EnSuite,
  },
  {
    value: BathroomType.NoEnSuite,
    text: BathroomType.NoEnSuite,
  },
  {
    value: BathroomType.Other,
    text: BathroomType.Other,
  },
]

export const getBathroomType = (value: string) => getPref(bathroomTypeOptions, value)

export enum RoomPref {
  RoomWith = 'room-with',
  // AssignMe = 'assign-me',
  Other = 'other',
}

export const roomPrefOptions = [
  {
    value: RoomPref.RoomWith,
    text: 'I will be rooming with (list names)',
  },
  // {
  //   value: RoomPref.AssignMe,
  //   text: "I don't mind who I room with; please assign me a roommate. (Double Queen only.)",
  // },
  {
    value: RoomPref.Other,
    text: 'None',
  },
]

export const getRoomPref = (value: string) => getPref(roomPrefOptions, value)

export enum RoomType {
  Twin = 'twin',
  Queen = 'queen',
  King = 'king',
  DoubleQueen = 'double queen',
  Hostel = 'hostel',
  Family = 'family',
  Other = 'other',
}

export const roomTypeOptions = [
  { value: RoomType.Twin, text: 'Twin' },
  { value: RoomType.Queen, text: 'Queen' },
  { value: RoomType.King, text: 'King' },
  { value: RoomType.DoubleQueen, text: 'Double Queen' },
  { value: RoomType.Hostel, text: 'Hostel' },
  { value: RoomType.Family, text: 'Family' },
  { value: RoomType.Other, text: 'Other' },
]

export const getRoomType = (value: string) => getPref(roomTypeOptions, value)

export const useRealmOptions = (realm: string) => {
  const attendanceOptions = useGetAttendanceOptions()
  const interestOptions = useGetInterestOptions()
  return useMemo(() => {
    switch (realm) {
      case 'gamePlayerPref':
        return playerPreferenceOptions
      case 'attendance':
        return attendanceOptions
      case 'bathroomType':
        return bathroomTypeOptions
      case 'interest':
        return interestOptions
      case 'roomPref':
        return roomPrefOptions
      case 'roomType':
        return roomTypeOptions
      default:
        return undefined
    }
  }, [attendanceOptions, interestOptions, realm])
}
