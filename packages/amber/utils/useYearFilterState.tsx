import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

import { useConfiguration } from './configContext'

const yearFilterAtom = atom<number>(0)

export const useYearFilter = (): [number, (args: ((prev: number) => number) | number) => void] => {
  const configuration = useConfiguration()
  const [year, setter] = useAtom(yearFilterAtom)
  return [year === 0 ? configuration.year : year, setter]
}
