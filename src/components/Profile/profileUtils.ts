import { useQueryClient } from 'react-query'

import {
  GetAllUsersAndProfilesQuery,
  Maybe,
  useCreateProfileMutation,
  useUpdateProfileByNodeIdMutation,
  useUpdateUserMutation,
} from '../../client'
import { allUserQueries } from '../../client/querySets'
import { GqlType, Omit, ToFormValues, onCloseHandler, pick } from '../../utils'
import { useNotification } from '../Notifications'

export type UsersAndProfiles = GqlType<GetAllUsersAndProfilesQuery, ['users', 'nodes', number]>
type ProfileValues = ToFormValues<GqlType<UsersAndProfiles, ['profiles', 'nodes', number]>>

export type UsersAndProfileType = Omit<UsersAndProfiles, 'profiles' | 'nodeId' | '__typename'> & {
  profiles?:
    | {
        nodes?: (Maybe<ProfileValues> | undefined)[] | undefined
      }
    | undefined
}

export const userFromProfileValues = (profileValues: UsersAndProfileType) =>
  pick(profileValues, 'firstName', 'lastName', 'fullName', 'email')

export const profileFromProfileValues = (profileValues: UsersAndProfileType) => ({
  phoneNumber: profileValues?.profiles?.nodes?.[0]?.phoneNumber ?? '',
  snailMailAddress: profileValues?.profiles?.nodes?.[0]?.snailMailAddress ?? '',
})

export const useEditUserAndProfile = (onClose?: onCloseHandler) => {
  const updateUser = useUpdateUserMutation()
  const createProfile = useCreateProfileMutation()
  const updateProfile = useUpdateProfileByNodeIdMutation()
  const notify = useNotification()
  const queryClient = useQueryClient()

  const invalidateProfileQueries = () => {
    allUserQueries.map((q) => queryClient.invalidateQueries(q), { refetchActive: true, refetchInactive: true })
  }

  return async (profileValues: UsersAndProfileType) =>
    await updateUser
      .mutateAsync(
        {
          input: {
            id: profileValues.id,
            patch: {
              ...userFromProfileValues(profileValues),
            },
          },
        },
        {
          onSuccess: invalidateProfileQueries,
        }
      )
      .then(async () => {
        if (profileValues?.profiles?.nodes?.[0]?.nodeId) {
          await updateProfile.mutateAsync(
            {
              input: {
                nodeId: profileValues.profiles.nodes[0].nodeId,
                patch: {
                  userId: profileValues.id,
                  ...profileFromProfileValues(profileValues),
                },
              },
            },
            {
              onSuccess: invalidateProfileQueries,
            }
          )
        } else {
          await createProfile.mutateAsync(
            {
              input: {
                profile: {
                  userId: profileValues.id,
                  ...profileFromProfileValues(profileValues),
                },
              },
            },
            {
              onSuccess: invalidateProfileQueries,
            }
          )
        }
        if (onClose) {
          notify({ text: 'User updated', variant: 'success' })
          onClose()
        }
      })
      .catch((error) => {
        notify({ text: error.message, variant: 'error' })
      })
}

export const fillUserAndProfileValues = (values: UsersAndProfileType): UsersAndProfileType => ({
  id: values.id,
  email: values.email ?? '',
  firstName: values.firstName ?? '',
  lastName: values.lastName ?? '',
  fullName: values.fullName ?? '',
  profiles: {
    nodes: [
      {
        nodeId: values?.profiles?.nodes?.[0]?.nodeId,
        userId: values?.profiles?.nodes?.[0]?.userId ?? -1,
        phoneNumber: values?.profiles?.nodes?.[0]?.phoneNumber ?? '',
        snailMailAddress: values?.profiles?.nodes?.[0]?.snailMailAddress ?? '',
      },
    ],
  },
})
