import { useAuth } from 'components/Auth'
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

type UserInfo = {
  userId: number
  email: string
}

const userFilterAtom = atom<UserInfo>({ userId: 0, email: '' })

export const useUserFilter = () => useAtom(userFilterAtom)

// Note that the main purpose of this method is to allow for overriding the logged in user by an admin
// if you aren't an admin then userInfo.userId will always === 0
export const useUser = (): Partial<UserInfo> => {
  const { user } = useAuth()
  const [userInfo] = useUserFilter()
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
