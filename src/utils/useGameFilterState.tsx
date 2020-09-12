import create from 'zustand'
import { combine } from 'zustand/middleware'

import { configuration } from './configuration'

type GameFilter = {
  slotId: number
  year: number
}

export const useGameFilterState = create(
  combine({ gameFilter: { slotId: 1, year: configuration.year } as GameFilter }, (set) => ({
    setGameFilter: (gameFilter: GameFilter) => set((state) => ({ gameFilter })),
  }))
)
