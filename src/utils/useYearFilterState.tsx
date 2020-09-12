import create from 'zustand'
import { combine } from 'zustand/middleware'

import { configuration } from './configuration'

export const useYearFilterState = create(
  combine({ year: configuration.year }, (set) => ({
    setYear: (year: number) => set((state) => ({ year })),
    reset: () => set((state) => ({ year: configuration.year })),
  }))
)
