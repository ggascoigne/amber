import { useState } from 'react'

import type { UserAndProfile } from '@amber/client'
import { useTRPC } from '@amber/client'
import { useNotification } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { useUser } from '../../utils'

export const useProfile = (): UserAndProfile | null => {
  const trpc = useTRPC()
  const { userId } = useUser()
  const [lastUserId, setLastUserId] = useState(0)

  const { error, data } = useQuery(
    trpc.users.getUserAndProfile.queryOptions(
      { id: userId ?? 0 },
      {
        enabled: !!userId,
        staleTime: 10 * 60 * 1000, // 10 minutes - user data may change more frequently
      },
    ),
  )
  const notify = useNotification()

  if (!userId || !data) {
    return null
  }

  if (lastUserId !== userId) {
    setLastUserId(userId)
    return null
  }

  if (error) {
    notify({ text: error.message, variant: 'error' })
    return null
  }

  return data ?? null
}
