import { Theme } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/Add'
import { createStyles, makeStyles } from '@material-ui/styles'
import React, { MouseEventHandler } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      color: '#fff',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)'
      }
    },
    addIcon: {}
  })
)

interface CustomToolbar {
  onAdd: MouseEventHandler
}

export const CustomToolbar: React.FC<CustomToolbar> = ({ onAdd }) => {
  const classes = useStyles()
  return (
    <Tooltip title={'Add'}>
      <IconButton className={classes.iconButton} onClick={onAdd}>
        <AddIcon className={classes.addIcon} />
      </IconButton>
    </Tooltip>
  )
}
