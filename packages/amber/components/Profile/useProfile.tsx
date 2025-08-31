import { useState } from 'react'

import { UserAndProfile, useTRPC } from '@amber/client'
import { useNotification } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { useUser } from '../../utils'

export const useProfile = (): UserAndProfile | null => {
  const trpc = useTRPC()
  const { email } = useUser()
  const [lastEmail, setLastEmail] = useState('')

  const { error, data } = useQuery(trpc.users.getUserByEmail.queryOptions({ email: email ?? '' }, { enabled: !!email }))
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

  return data ?? null
}
