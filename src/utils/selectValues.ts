import { configDate } from '../components'
import { configuration } from './configuration'

export enum Attendance {
  ThursSun = 'Thurs-Sun',
  FriSun = 'Fri-Sun',
}

export const attendanceSelectValues = [
  {
    value: Attendance.ThursSun,
    text: `Full: $${configuration.fourDayMembership}.`,
  },
  {
    value: Attendance.FriSun,
    text: `Short: $${configuration.threeDayMembership}.`,
  },
]

export enum InterestLevel {
  Full = 'Full',
  Deposit = 'Deposit',
}

export const interestSelectValues = [
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

export enum BathroomType {
  EnSuite = 'en-suite',
  NoEnSuite = 'no en-suite',
  Other = 'other',
}

export const bathroomTypeSelectValues = [
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

export enum RoomPref {
  RoomWith = 'room-with',
  AssignMe = 'assign-me',
  Other = 'other',
}

export const roomPrefSelectValues = [
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
