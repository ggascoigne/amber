import create from 'zustand'
import { combine } from 'zustand/middleware'

export const useUserFilterState = create(
  combine({ userId: 0 }, (set) => ({
    setUser: (userId: number) => set((state) => ({ userId })),
    reset: () => set((state) => ({ userId: 0 })),
  }))
)
