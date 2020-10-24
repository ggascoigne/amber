import { Theme, makeStyles } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import createStyles from '@material-ui/core/styles/createStyles'
import Typography from '@material-ui/core/Typography'
import React, { MouseEventHandler } from 'react'

import { DialogClose } from './DialogClose'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      margin: 0,
      padding: theme.spacing(2),
    },
  })
)

interface DialogTitleProps {
  onClose?: MouseEventHandler
}

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, onClose }) => {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant='h6'>{children}</Typography>
      {onClose && <DialogClose onClose={onClose} />}
    </MuiDialogTitle>
  )
}
