import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

interface UrlSource {
  source: 'jump' | 'scroll'
  url: string
}

const urlSourceAtom = atom<UrlSource>({ source: 'jump', url: '' })

export const useUrlSource = () => useAtom(urlSourceAtom)
