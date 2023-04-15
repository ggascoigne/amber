import React, { MouseEventHandler } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

interface DialogCloseProps {
  onClose: MouseEventHandler
}

export const DialogClose: React.FC<DialogCloseProps> = ({ onClose }) => {
  const { classes } = useStyles()
  return (
    <IconButton aria-label='Close' className={classes.closeButton} onClick={onClose} size='large'>
      <CloseIcon />
    </IconButton>
  )
}
