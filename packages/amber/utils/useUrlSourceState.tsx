import { atom } from 'jotai/vanilla'
import { useAtom } from 'jotai/react'

interface UrlSource {
  source: 'jump' | 'scroll'
  url: string
}

const urlSourceAtom = atom<UrlSource>({ source: 'jump', url: '' })

export const useUrlSource = () => useAtom(urlSourceAtom)
