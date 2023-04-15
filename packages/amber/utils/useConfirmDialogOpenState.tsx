import { useAtom } from 'jotai/react'
import { atom } from 'jotai/vanilla'

const confirmDialogOpenAtom = atom<boolean>(false)

export const useConfirmDialogOpen = () => useAtom(confirmDialogOpenAtom)
