import { atom, useAtom } from 'jotai'

import { configuration } from './configuration'

const yearFilterAtom = atom<number>(configuration.year)

export const useYearFilter = () => useAtom(yearFilterAtom)
