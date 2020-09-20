import { Theme, makeStyles } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import createStyles from '@material-ui/core/styles/createStyles'
import CloseIcon from '@material-ui/icons/Close'
import React, { MouseEventHandler } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
)

type DialogClose = {
  onClose: MouseEventHandler
}

export const DialogClose: React.FC<DialogClose> = ({ onClose }) => {
  const classes = useStyles()
  return (
    <IconButton aria-label='Close' className={classes.closeButton} onClick={onClose}>
      <CloseIcon />
    </IconButton>
  )
}
