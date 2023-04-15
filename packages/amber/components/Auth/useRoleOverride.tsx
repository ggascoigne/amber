import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

import type { Roles } from './PermissionRules'

const roleOverrideAtom = atom<Roles | undefined>(undefined)

export const useRoleOverride = () => useAtom(roleOverrideAtom)
