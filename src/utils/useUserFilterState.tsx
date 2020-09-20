import { useMemo } from 'react'
import create from 'zustand'
import { combine } from 'zustand/middleware'

import { useAuth } from '../components/Acnw/Auth/Auth0'

type UserInfo = {
  userId: number
  email: string
}
export const useUserFilterState = create(
  combine({ userInfo: { userId: 0, email: '' } }, (set) => ({
    setUser: (userInfo: UserInfo) => set((state) => ({ userInfo })),
  }))
)

// Note that the main purpose of this method is to allow for overriding the logged in user by an admin
// if you aren't an admin then userInfo.userId will always === 0
export const useUser = (): Partial<UserInfo> => {
  const { user } = useAuth()
  const userInfo = useUserFilterState((state) => state.userInfo)
  return useMemo(() => {
    if (userInfo.userId) {
      return { ...userInfo }
    } else {
      const userId = user?.userId
      const email = user?.email
      return { userId, email }
    }
  }, [user?.email, user?.userId, userInfo])
}
