import { atom, useAtom } from 'jotai'

const roleOverrideAtom = atom<string | undefined>(undefined)

export const useRoleOverride = () => useAtom(roleOverrideAtom)
