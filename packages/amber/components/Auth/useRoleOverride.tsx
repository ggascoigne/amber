import { atom } from 'jotai/vanilla'
import { useAtom } from 'jotai/react'

import { Roles } from './PermissionRules'

const roleOverrideAtom = atom<Roles | undefined>(undefined)

export const useRoleOverride = () => useAtom(roleOverrideAtom)