import create from 'zustand'
import { combine } from 'zustand/middleware'

type UserInfo = {
  id: number
  email: string
}
export const useUserFilterState = create(
  combine({ userInfo: { id: 0, email: '' } }, (set) => ({
    setUser: (userInfo: UserInfo) => set((state) => ({ userInfo })),
  }))
)
