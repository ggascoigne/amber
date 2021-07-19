import { atom, useAtom } from 'jotai'

interface UrlSource {
  source: 'jump' | 'scroll'
  url: string
}

const urlSourceAtom = atom<UrlSource>({ source: 'jump', url: '' })

export const useUrlSource = () => useAtom(urlSourceAtom)
