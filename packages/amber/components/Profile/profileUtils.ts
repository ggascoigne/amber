import { useTRPC, UserAndProfile, useInvalidateUserQueries } from '@amber/client'
import { useMutation } from '@tanstack/react-query'
import { OnCloseHandler, pickAndConvertNull, useNotification } from 'ui'

export const userFromProfileValues = (profileValues: UserAndProfile) => {
  const values = pickAndConvertNull(profileValues, 'firstName', 'lastName', 'fullName', 'displayName', 'email')
  return {
    ...values,
    displayName: values.displayName?.length ? values.displayName : values.fullName,
  }
}

export const profileFromProfileValues = (profileValues: UserAndProfile) => ({
  phoneNumber: profileValues?.profile?.[0]?.phoneNumber ?? '',
  snailMailAddress: profileValues?.profile?.[0]?.snailMailAddress ?? '',
})

export const useEditUserAndProfile = (onClose?: OnCloseHandler) => {
  const trpc = useTRPC()
  const updateUser = useMutation(trpc.users.updateUser.mutationOptions())
  const createProfile = useMutation(trpc.users.createProfile.mutationOptions())
  const updateProfile = useMutation(trpc.users.updateProfile.mutationOptions())
  const notify = useNotification()
  const invalidateUserQueries = useInvalidateUserQueries()

  return async (profileValues: UserAndProfile) =>
    updateUser
      .mutateAsync({
        id: profileValues.id,
        data: {
          ...userFromProfileValues(profileValues),
        },
      })
      .then(async () => {
        if (profileValues?.profile?.[0]?.id) {
          await updateProfile.mutateAsync(
            {
              id: profileValues.profile[0].id,
              data: {
                ...profileFromProfileValues(profileValues),
              },
            },
            {
              onSuccess: invalidateUserQueries,
            },
          )
        } else {
          await createProfile.mutateAsync(
            {
              userId: profileValues.id,
              ...profileFromProfileValues(profileValues),
            },
            {
              onSuccess: invalidateUserQueries,
            },
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

export const fillUserAndProfileValues = (values: UserAndProfile): UserAndProfile => ({
  id: values.id,
  email: values.email ?? '',
  firstName: values.firstName ?? '',
  lastName: values.lastName ?? '',
  fullName: values.fullName ?? '',
  displayName: values.displayName ?? '',
  balance: 0,
  profile: [
    {
      id: values?.profile?.[0]?.id,
      userId: values?.profile?.[0]?.userId ?? -1,
      phoneNumber: values?.profile?.[0]?.phoneNumber ?? '',
      snailMailAddress: values?.profile?.[0]?.snailMailAddress ?? '',
    },
  ],
})
