import { useCreateMembershipMutation, useGetHotelRoomsQuery, useUpdateMembershipByNodeIdMutation } from 'client'
import { Perms, useAuth } from 'components/Auth'
import { ProfileFormType } from 'components/Profile'
import { useQueryClient } from 'react-query'
import {
  Attendance,
  InterestLevel,
  ToFormValues,
  configuration,
  extractErrors,
  getSlotDescription,
  notEmpty,
  onCloseHandler,
  pick,
  useSendEmail,
  useSetting,
} from 'utils'
import Yup from 'utils/Yup'

import { useNotification } from '../../components/Notifications'
import { Membership } from '../../utils/apiTypes'

export interface MembershipFormContent {
  prefix?: string
}

export type MembershipType = ToFormValues<Membership> & {
  slotsAttendingData?: boolean[]
}

export type MembershipErrorType = Record<keyof MembershipType, string>

export const fromSlotsAttending = (membershipValues: MembershipType) => {
  const slotsAttendingData = Array(7).fill(false)
  // @ts-ignore
  membershipValues.slotsAttending?.split(',').forEach((i) => (slotsAttendingData[i - 1] = true))
  return slotsAttendingData
}

export const toSlotsAttending = (membershipValues: MembershipType) =>
  // convert an array of booleans to a comma separate list of slot numbers
  membershipValues.slotsAttendingData
    ?.map((v, i) => (v ? i + 1 : 0))
    .filter((v) => !!v)
    .join(',') ?? ''

export const fromMembershipValues = (membershipValues: MembershipType) =>
  pick(
    membershipValues,
    'userId',
    'arrivalDate',
    'attendance',
    'attending',
    'hotelRoomId',
    'departureDate',
    'interestLevel',
    'message',
    'offerSubsidy',
    'requestOldPrice',
    'roomPreferenceAndNotes',
    'roomingPreferences',
    'roomingWith',
    'volunteer',
    'year',
    'slotsAttending',
    'amountOwed',
    'amountPaid'
  )

export const membershipValidationSchema = Yup.object().shape({
  arrivalDate: Yup.date().required(),
  attendance: Yup.string().max(255).required(),
  departureDate: Yup.date().required(),
  interestLevel: Yup.string().max(255).required(),
  message: Yup.string().max(1024),
  roomPreferenceAndNotes: Yup.string().max(1024),
  roomingPreferences: Yup.string().max(255),
  roomingWith: Yup.string().max(250), // yeah really - schema is super inconsistent here
  skipSlots: Yup.string().max(20),
})

export const useEditMembership = (onClose: onCloseHandler) => {
  const createMembership = useCreateMembershipMutation()
  const updateMembership = useUpdateMembershipByNodeIdMutation()
  const queryClient = useQueryClient()
  const notify = useNotification()
  const sendEmail = useSendEmail()
  const sendAdminEmail = useSetting('send.admin.email')
  const { hasPermissions } = useAuth()
  const shouldSendEmail = !hasPermissions(Perms.IsAdmin, { ignoreOverride: true }) || sendAdminEmail

  const { data: roomData } = useGetHotelRoomsQuery()

  const sendMembershipConfirmation = (
    membershipId: number,
    profile: ProfileFormType,
    membershipValues: MembershipType,
    update = false
  ) => {
    const room = roomData
      ?.hotelRooms!.edges.map((v) => v.node)
      .filter(notEmpty)
      .find((r) => r.id === membershipValues.hotelRoomId)

    const slotDescriptions = membershipValues.slotsAttending
      ?.split(',')
      .map((i) => getSlotDescription({ year: configuration.year, slot: parseInt(i), local: true }))

    sendEmail({
      type: 'membershipConfirmation',
      body: {
        year: configuration.year,
        virtual: configuration.virtual,
        name: profile.fullName!,
        email: profile.email,
        address: profile.profiles?.nodes?.[0]?.snailMailAddress ?? undefined,
        phoneNumber: profile.profiles?.nodes?.[0]?.phoneNumber ?? undefined,
        update,
        url: `${window.location.origin}/membership`,
        membership: membershipValues,
        slotDescriptions,
        owed: getOwed(membershipValues),
        room,
      },
    })
  }

  return async (membershipValues: MembershipType, profile: ProfileFormType) => {
    if (membershipValues.nodeId) {
      await updateMembership
        .mutateAsync(
          {
            input: {
              nodeId: membershipValues.nodeId,
              patch: {
                ...fromMembershipValues(membershipValues),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries('getMembershipsByYear')
            },
          }
        )
        .then(() => {
          notify({ text: 'Membership updated', variant: 'success' })
          // create always sends email, but generally updates skip sending email about admin updates
          if (shouldSendEmail) {
            sendMembershipConfirmation(membershipValues.id!, profile, membershipValues, true)
          }
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createMembership
        .mutateAsync(
          {
            input: {
              membership: {
                ...fromMembershipValues(membershipValues),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries('getMembershipsByYear')
              queryClient.invalidateQueries('getMembershipByYearAndId')
            },
          }
        )
        .then((res) => {
          const membershipId = res?.createMembership?.membership?.id
          if (membershipId) {
            notify({ text: 'Membership created', variant: 'success' })
            sendMembershipConfirmation(membershipId, profile, membershipValues)
            onClose()
          } else {
            notify({ text: 'Membership creation failed', variant: 'error' })
          }
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const getDefaultMembership = (userId: number, isVirtual: boolean): MembershipType => ({
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

export const hasMembershipStepErrors = <T, D extends keyof T = keyof T>(name: string, errors: T, ...props: D[]) =>
  !!extractErrors(errors, ...props)

export const getOwed = (values: MembershipType) => {
  if (configuration.virtual) {
    return configuration.virtualCost
  }
  if (values.interestLevel === InterestLevel.Deposit) {
    return configuration.deposit
  }
  if (values.attendance === Attendance.ThursSun) {
    return configuration.fourDayMembership
  } else {
    return configuration.threeDayMembership
  }
}
