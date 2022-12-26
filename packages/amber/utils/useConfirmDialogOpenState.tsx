import { atom, useAtom } from 'jotai'

const confirmDialogOpenAtom = atom<boolean>(false)

export const useConfirmDialogOpen = () => useAtom(confirmDialogOpenAtom)
