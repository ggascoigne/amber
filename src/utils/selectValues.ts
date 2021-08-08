import { configDate } from '../components'
import { configuration } from './configuration'

export const getPref = (values: { value: string; text: string }[], value?: string) =>
  values.find((v) => v.value === value)?.text

export enum PlayerPreference {
  Any = 'any',
  RetOnly = 'ret-only',
  RetPref = 'ret-pref',
}

export const playerPreferenceOptions = [
  { value: PlayerPreference.Any, text: 'Any' },
  { value: PlayerPreference.RetOnly, text: 'Returning players only' },
  { value: PlayerPreference.RetPref, text: 'Returning players have preference, new players welcome.' },
]

export const getPlayerPreference = (value?: string) => getPref(playerPreferenceOptions, value)

export enum Attendance {
  ThursSun = 'Thurs-Sun',
  FriSun = 'Fri-Sun',
}

export const attendanceOptions = [
  {
    value: Attendance.ThursSun,
    text: `Full: $${configuration.fourDayMembership}.`,
  },
  {
    value: Attendance.FriSun,
    text: `Short: $${configuration.threeDayMembership}.`,
  },
]

export const getAttendance = (value?: string) => getPref(attendanceOptions, value)

export enum InterestLevel {
  Full = 'Full',
  Deposit = 'Deposit',
}

export const interestOptions = [
  {
    value: InterestLevel.Full,
    text: 'I am sending payment in full now',
  },
  {
    value: InterestLevel.Deposit,
    text: `I am paying a deposit of $${configuration.deposit} now. I understand payment in full is due ${configDate(
      'paymentDeadline'
    )}.`,
  },
]

export const getInterestLevel = (value?: string) => getPref(interestOptions, value)

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

export const getBathroomType = (value?: string) => getPref(bathroomTypeOptions, value)

export enum RoomPref {
  RoomWith = 'room-with',
  AssignMe = 'assign-me',
  Other = 'other',
}

export const roomPrefOptions = [
  {
    value: RoomPref.RoomWith,
    text: 'I will be rooming with (list names)',
  },
  {
    value: RoomPref.AssignMe,
    text: "I don't mind who I room with; please assign me a roommate. (Double Queen only.)",
  },
  {
    value: RoomPref.Other,
    text: 'None',
  },
]

export const getRoomPref = (value?: string) => getPref(roomPrefOptions, value)

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

export const getRoomType = (value?: string) => getPref(roomTypeOptions, value)

//---

export const getRealmOptions = (realm: string) => {
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
}
