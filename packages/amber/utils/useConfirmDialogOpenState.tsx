import { atom } from 'jotai/vanilla'
import { useAtom } from 'jotai/react'

const confirmDialogOpenAtom = atom<boolean>(false)

export const useConfirmDialogOpen = () => useAtom(confirmDialogOpenAtom)
