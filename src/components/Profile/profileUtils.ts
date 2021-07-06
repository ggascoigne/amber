import { useUpdateUserMutation } from '../../client'
import { onCloseHandler, pick } from '../../utils'
import { useNotification } from '../Notifications'
import { ProfileType } from './ProfileFormContent'

export const fromProfileValues = (profileValues: ProfileType) =>
  pick(profileValues, 'firstName', 'lastName', 'fullName', 'email', 'snailMailAddress', 'phoneNumber')

export const useEditProfile = (onClose?: onCloseHandler) => {
  const updateUser = useUpdateUserMutation()
  const [notify] = useNotification()

  return async (profileValues: ProfileType) =>
    await updateUser
      .mutateAsync({
        input: {
          id: profileValues.id!,
          patch: {
            ...fromProfileValues(profileValues),
          },
        },
      })
      .then(() => {
        if (onClose) {
          notify({ text: 'Profile updated', variant: 'success' })
          onClose()
        }
      })
      .catch((error) => {
        notify({ text: error.message, variant: 'error' })
      })
}
