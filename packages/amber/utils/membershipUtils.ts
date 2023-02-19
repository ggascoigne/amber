import { notEmpty, OnCloseHandler, pick, useNotification } from 'ui'
import { useQueryClient } from '@tanstack/react-query'

import type { MembershipType } from './apiTypes'
import {} from 'yup'
import { Configuration, useConfiguration } from './configContext'
import { useCreateMembershipMutation, useGetHotelRoomsQuery, useUpdateMembershipByNodeIdMutation } from '../client'
import { useSendEmail } from './useSendEmail'
import { useSetting } from './settings'
import { Perms, ProfileFormType, useAuth } from '../components'
import { getSlotDescription } from './slotTimes'
import { extractErrors } from './extractErrors'

// NOTE that this isn't exported directly from 'amber/utils' since that causes
// circular import explosions

export interface MembershipFormContent {
  prefix?: string
}

export type MembershipErrorType = Record<keyof MembershipType, string>

export const fromSlotsAttending = (configuration: Configuration, membershipValues: MembershipType) => {
  const slotsAttendingData = Array(configuration.numberOfSlots).fill(false)
  // @ts-ignore
  // eslint-disable-next-line no-return-assign
  membershipValues.slotsAttending?.split(',').forEach((i) => (slotsAttendingData[i - 1] = true))
  return slotsAttendingData
}

export const toSlotsAttending = (membershipValues: MembershipType) =>
  // convert an array of booleans to a comma separate list of slot numbers
  membershipValues.slotsAttendingData
    ?.map((v: boolean, i: number) => (v ? i + 1 : 0))
    .filter((v: number) => !!v)
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

type GetOwed = (configuration: Configuration, values: MembershipType) => number | undefined

export const useEditMembership = (onClose: OnCloseHandler, getOwed: GetOwed) => {
  const configuration = useConfiguration()
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

    const slotDescriptions = membershipValues.slotsAttending?.split(',').map((i: string) =>
      getSlotDescription(configuration, {
        year: configuration.year,
        slot: parseInt(i, 10),
        local: configuration.virtual,
      })
    )

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
        owed: getOwed(configuration, membershipValues),
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
              queryClient.invalidateQueries(['getMembershipsByYear'])
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
              queryClient.invalidateQueries(['getMembershipsByYear'])
              queryClient.invalidateQueries(['getMembershipByYearAndId'])
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

export const hasMembershipStepErrors = <T, D extends keyof T = keyof T>(name: string, errors: T, ...props: D[]) =>
  !!extractErrors(errors, ...props)