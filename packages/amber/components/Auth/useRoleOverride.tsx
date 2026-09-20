import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

import type { RolesType } from './PermissionRules'

const roleOverrideAtom = atom<RolesType | undefined>(undefined)

export const useRoleOverride = () => useAtom(roleOverrideAtom)
