import { Node, UserInput, useGetUserByEmailLazyQuery } from 'client'
import { useState } from 'react'
import { useUser } from 'utils'

import { useNotification } from '../Notifications'
import { ProfileType } from './ProfileFormContent'

export const useProfile = (): ProfileType | null => {
  const { email } = useUser()
  const [lastEmail, setLastEmail] = useState('')

  const [getProfile, { loading, error, data }] = useGetUserByEmailLazyQuery()
  const [notify] = useNotification()

  if (!email) return null

  if (loading) {
    return null
  }

  if (!data || (data && lastEmail !== email)) {
    lastEmail !== email && setLastEmail(email)
    getProfile({ variables: { email } })
    return null
  }

  if (error) {
    notify({ text: error.message, variant: 'error' })
    return null
  }

  return data!.userByEmail! as UserInput & Partial<Node>
}
