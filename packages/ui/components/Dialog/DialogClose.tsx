import React, { MouseEventHandler } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { SxProps, Theme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

interface DialogCloseProps {
  onClose: MouseEventHandler
}

export const DialogClose: React.FC<DialogCloseProps> = ({ onClose }) => {
  const defaultSx: SxProps<Theme> = (theme) => ({
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  })
  return (
    <IconButton aria-label='Close' onClick={onClose} size='large' sx={defaultSx}>
      <CloseIcon />
    </IconButton>
  )
}
