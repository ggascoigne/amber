import create from 'zustand'
import { combine } from 'zustand/middleware'

type ConfirmDialogOpenState = {
  open: boolean
}

export const useConfirmDialogOpenState = create(
  combine({ state: { open: false } as ConfirmDialogOpenState }, (set) => ({
    setState: (state: ConfirmDialogOpenState) => set((inp) => ({ state })),
  }))
)
