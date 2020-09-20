import {
  MembershipFieldsFragment,
  Node,
  useCreateMembershipMutation,
  useUpdateMembershipByNodeIdMutation,
} from 'client'
import { useNotification } from 'components/Acnw'
import { ProfileType } from 'components/Acnw/Profile'
import { configuration, onClose, useSendEmail } from 'utils'
import Yup from 'utils/Yup'

export type MembershipType = Omit<MembershipFieldsFragment, 'nodeId' | 'id' | '__typename'> &
  Partial<{ id: number }> &
  Partial<Node> & {
    slotsAttendingData?: boolean[]
  }

export const fromSlotsAttending = (membershipValues: MembershipType) => {
  const slotsAttendingData = Array(7).fill(false)
  // @ts-ignore
  membershipValues?.slotsAttending?.split(',').forEach((i) => (slotsAttendingData[i - 1] = true))
  return slotsAttendingData
}

export const toSlotsAttending = (membershipValues: MembershipType) =>
  // convert an array of booleans to a comma separate list of slot numbers
  membershipValues?.slotsAttendingData
    ?.map((v, i) => (v ? i + 1 : 0))
    .filter((v) => !!v)
    .join(',') || ''

export const fromMembershipValues = (membershipValues: MembershipType) => {
  const {
    userId,
    arrivalDate,
    attendance,
    attending,
    hotelRoomId,
    departureDate,
    interestLevel,
    message,
    offerSubsidy,
    requestOldPrice,
    roomPreferenceAndNotes,
    roomingPreferences,
    roomingWith,
    volunteer,
    year,
    slotsAttending,
    amountOwed,
    amountPaid,
  } = membershipValues

  return {
    userId,
    arrivalDate,
    attendance,
    attending,
    hotelRoomId,
    departureDate,
    interestLevel,
    message,
    offerSubsidy,
    requestOldPrice,
    roomPreferenceAndNotes,
    roomingPreferences,
    roomingWith,
    volunteer,
    year,
    slotsAttending,
    amountOwed,
    amountPaid,
  }
}

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

export const useEditMembership = (profile: ProfileType, onClose: onClose) => {
  const [createMembership] = useCreateMembershipMutation()
  const [updateMembership] = useUpdateMembershipByNodeIdMutation()
  const [notify] = useNotification()
  const [sendEmail] = useSendEmail()

  const sendMembershipConfirmation = (membershipId: number, profile: ProfileType, membershipValues: MembershipType) => {
    sendEmail({
      type: 'membershipConfirmation',
      body: JSON.stringify({
        year: configuration.year,
        name: profile?.fullName,
        email: profile?.email,
        url: `${window.location.origin}/members/${membershipId}`,
        membership: membershipValues,
      }),
    })
  }

  const createOrUpdateMembership = async (membershipValues: MembershipType) => {
    if (membershipValues.nodeId) {
      await updateMembership({
        variables: {
          input: {
            nodeId: membershipValues.nodeId!,
            patch: {
              ...fromMembershipValues(membershipValues),
            },
          },
        },
        refetchQueries: ['getMembershipsByYear'],
      })
        .then(() => {
          notify({ text: 'Membership updated', variant: 'success' })
          sendMembershipConfirmation(membershipValues.id!, profile!, membershipValues)
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createMembership({
        variables: {
          input: {
            membership: {
              ...fromMembershipValues(membershipValues),
            },
          },
        },
        refetchQueries: ['getMembershipsByYear', 'getMembershipByYearAndId'],
      })
        .then((res) => {
          const membershipId = res?.data?.createMembership?.membership?.id
          notify({ text: 'Membership created', variant: 'success' })
          sendMembershipConfirmation(membershipId!, profile!, membershipValues)
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
  return createOrUpdateMembership
}

export const getDefaultMembership = (userId: number): MembershipType => ({
  userId: userId!,
  arrivalDate: configuration.conventionStartDate.toISO(),
  attendance: 'Thurs-Sun',
  attending: true,
  hotelRoomId: 13, // no room required
  departureDate: configuration.conventionEndDate.toISO(),
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
