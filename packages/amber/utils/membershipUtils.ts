import type { UserAndProfile, Transaction } from '@amber/client'
import { useInvalidateMembershipQueries, useTRPC } from '@amber/client'
import type { OnCloseHandler } from '@amber/ui'
import { notEmpty, pick, useNotification } from '@amber/ui'
import { useMutation, useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import {} from 'yup'

import type { MembershipConfirmationBodyUpdateType, MembershipType } from './apiTypes'
import type { Configuration } from './configContext'
import { useConfiguration } from './configContext'
import { extractErrors } from './extractErrors'
import { useFlag } from './settings'
import { getSlotDescription } from './slotTimes'
import { useEditMembershipTransaction, getMembershipCost } from './transactionUtils'
import { useSendEmail } from './useSendEmail'

import { Perms, useAuth } from '../components'

// NOTE that this isn't exported directly from '@amber/amber/utils' since that causes
// circular import explosions
export interface MembershipFormContent {
  prefix?: string
}

export type MembershipFormType = MembershipType & {
  membership?: string
  subsidizedAmount?: number
}

export type MembershipErrorType = Record<keyof MembershipFormType, string>

export const toLegacyApiMembership = (membershipValues: MembershipType) => ({
  ...membershipValues,
  id: membershipValues.id ?? undefined,
  arrivalDate: DateTime.fromJSDate(membershipValues.arrivalDate).toISO()!,
  departureDate: DateTime.fromJSDate(membershipValues.departureDate).toISO()!,
})

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
    'cost',
  )

export const useEditMembership = (onClose: OnCloseHandler) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const createMembership = useMutation(trpc.memberships.createMembership.mutationOptions())
  const updateMembership = useMutation(trpc.memberships.updateMembership.mutationOptions())
  const invalidateMembershipQueries = useInvalidateMembershipQueries()
  const createOrUpdateTransaction = useEditMembershipTransaction(onClose)
  const notify = useNotification()
  const sendEmail = useSendEmail()
  const sendAdminEmail = useFlag('send_admin_email')
  const { hasPermissions } = useAuth()
  const shouldSendEmail = !hasPermissions(Perms.IsAdmin, { ignoreOverride: true }) || sendAdminEmail

  const { data: roomData } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())

  // note that we pass in profile values since they might well have just been updated
  // and are later than the cached version off the membershipValues.
  const sendMembershipConfirmation = (
    profile: UserAndProfile,
    membershipValues: MembershipFormType,
    update: MembershipConfirmationBodyUpdateType = 'new',
  ) => {
    const room = roomData?.filter(notEmpty).find((r) => r.id === membershipValues.hotelRoomId)

    const slotDescriptions = membershipValues.slotsAttending?.split(',').map((i: string) =>
      getSlotDescription(configuration, {
        year: configuration.year,
        slot: parseInt(i, 10),
        local: configuration.virtual,
      }),
    )

    sendEmail({
      type: 'membershipConfirmation',
      body: [
        {
          year: configuration.year,
          virtual: configuration.virtual,
          name: profile.fullName!,
          email: profile.email,
          address: profile.profile?.[0]?.snailMailAddress ?? undefined,
          phoneNumber: profile.profile?.[0]?.phoneNumber ?? undefined,
          update,
          url: `${window.location.origin}/membership`,
          paymentUrl: `${window.location.origin}/payment`,
          membership: toLegacyApiMembership(membershipValues),
          slotDescriptions,
          // for new registrations don't rely on the profile value, it's out of date
          owed: update === 'new' ? getMembershipCost(configuration, membershipValues) : profile.balance,
          room,
        },
      ],
    })
  }

  return async (
    membershipValues: MembershipFormType,
    profile: UserAndProfile,
    usersTransactions: Transaction[] | undefined,
  ) => {
    if (membershipValues.id) {
      await updateMembership
        .mutateAsync(
          {
            id: membershipValues.id,
            data: {
              ...fromMembershipValues(membershipValues),
            },
          },
          {
            onSuccess: invalidateMembershipQueries,
          },
        )
        .then(async (res) => {
          const membershipId = res?.membership?.id
          // console.log(JSON.stringify(res, null, 2))

          notify({ text: 'Membership updated', variant: 'success' })
          // create always sends email, but generally updates skip sending email about admin updates
          if (shouldSendEmail) {
            sendMembershipConfirmation(profile, membershipValues, 'update')
          }
          await createOrUpdateTransaction(membershipValues, membershipId!, usersTransactions)
        })
        .catch((error: any) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createMembership
        .mutateAsync(
          {
            ...fromMembershipValues(membershipValues),
          },
          {
            onSuccess: invalidateMembershipQueries,
          },
        )
        .then(async (res) => {
          const membershipId = res?.membership?.id
          if (membershipId) {
            notify({ text: 'Membership created', variant: 'success' })
            sendMembershipConfirmation(profile, membershipValues)
            await createOrUpdateTransaction(membershipValues, membershipId, usersTransactions)
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
