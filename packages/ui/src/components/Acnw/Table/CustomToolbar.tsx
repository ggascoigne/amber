import IconButton from '@material-ui/core/IconButton'
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/Add'
import React, { MouseEventHandler } from 'react'

const defaultToolbarStyles = createStyles({
  iconButton: {
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    }
  },
  addIcon: {},
  NameCell: {
    fontWeight: 900
  }
})

interface ICustomToolbar {
  onAdd: MouseEventHandler
}

class _CustomToolbar extends React.Component<ICustomToolbar & WithStyles<typeof defaultToolbarStyles>> {
  render() {
    const { classes, onAdd } = this.props

    return (
      <React.Fragment>
        <Tooltip title={'Add'}>
          <IconButton className={classes.iconButton} onClick={onAdd}>
            <AddIcon className={classes.addIcon} />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    )
  }
}

export const CustomToolbar = withStyles(defaultToolbarStyles, { name: 'CustomToolbar' })(_CustomToolbar)
