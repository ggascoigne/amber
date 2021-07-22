import { atom, useAtom } from 'jotai'

import { Roles } from './PermissionRules'

const roleOverrideAtom = atom<Roles | undefined>(undefined)

export const useRoleOverride = () => useAtom(roleOverrideAtom)
