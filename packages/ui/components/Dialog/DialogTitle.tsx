import { Theme } from '@mui/material'
import MuiDialogTitle from '@mui/material/DialogTitle'
import React, { MouseEventHandler, PropsWithChildren } from 'react'
import { makeStyles } from 'tss-react/mui'

import { DialogClose } from './DialogClose'

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
  },
}))

interface DialogTitleProps {
  onClose?: MouseEventHandler
}

export const DialogTitle: React.FC<PropsWithChildren<DialogTitleProps>> = ({ children, onClose }) => {
  const { classes } = useStyles()
  return (
    <MuiDialogTitle className={classes.root} component='h6'>
      {children}
      {onClose && <DialogClose onClose={onClose} />}
    </MuiDialogTitle>
  )
}
