import create from 'zustand'
import { combine } from 'zustand/middleware'

type UrlSource = {
  source: 'jump' | 'scroll'
  url: string
}

export const useUrlSourceState = create(
  combine({ urlSource: { source: 'jump', url: '' } as UrlSource }, (set) => ({
    setUrlSource: (urlSource: UrlSource) => set((state) => ({ urlSource })),
  }))
)
