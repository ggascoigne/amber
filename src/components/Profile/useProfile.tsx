import { useGetUserByEmailQuery } from 'client'
import { useState } from 'react'
import { useUser } from 'utils'

import { useAuth } from '../Auth'
import { useNotification } from '../Notifications'
import { ProfileFormType } from './ProfileFormContent'

export const useProfile = (): ProfileFormType | null => {
  const { email } = useUser()
  const [lastEmail, setLastEmail] = useState('')
  const { isAuthenticated } = useAuth()

  const { error, data } = useGetUserByEmailQuery(
    { email: email ?? '' },
    { enabled: !!isAuthenticated && !!email && email !== lastEmail }
  )
  const notify = useNotification()

  if (!email || !data) {
    return null
  }

  if (lastEmail !== email) {
    lastEmail !== email && setLastEmail(email)
    return null
  }

  if (error) {
    notify({ text: error.message, variant: 'error' })
    return null
  }

  return data.userByEmail ? data.userByEmail : null
}
