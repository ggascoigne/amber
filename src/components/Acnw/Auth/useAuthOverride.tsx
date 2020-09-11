import create from 'zustand'
import { combine } from 'zustand/middleware'

export const useAuthOverride = create(
  combine({ roleOverride: '' }, (set) => ({
    setRoleOverride: (newRole: string) => set((state) => ({ roleOverride: newRole })),
  }))
)
