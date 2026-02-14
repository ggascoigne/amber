import type { MouseEventHandler, PropsWithChildren } from 'react'
import type React from 'react'

import type { SxProps, Theme } from '@mui/material'
import MuiDialogTitle from '@mui/material/DialogTitle'

import { DialogClose } from './DialogClose'

interface DialogTitleProps {
  onClose?: MouseEventHandler
}

export const DialogTitle: React.FC<PropsWithChildren<DialogTitleProps>> = ({ children, onClose }) => {
  const defaultSx: SxProps<Theme> = (theme) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
  })
  return (
    <MuiDialogTitle component='h6' sx={defaultSx}>
      {children}
      {onClose && <DialogClose onClose={onClose} />}
    </MuiDialogTitle>
  )
}
