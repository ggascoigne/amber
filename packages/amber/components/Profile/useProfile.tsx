import { useState } from 'react'

import { useNotification } from 'ui'

import { ProfileFormType } from './ProfileFormContent'

import { useGraphQL, GetUserByEmailDocument } from '../../client'
import { useUser } from '../../utils'

export const useProfile = (): ProfileFormType | null => {
  const { email } = useUser()
  const [lastEmail, setLastEmail] = useState('')

  const { error, data } = useGraphQL(GetUserByEmailDocument, { email: email ?? '' }, { enabled: !!email })
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

  return data.userByEmail ?? null
}
