import IconButton from '@material-ui/core/IconButton'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import React from 'react'

import { ITableSelectedRows } from './types'

const xsStyle = createStyles({
  root: {
    display: 'block'
  },
  actions: {
    textAlign: 'center'
  }
})

const smStyle = createStyles({
  actions: {
    textAlign: 'right'
  }
})

const toolbarStyles = (theme: Theme) =>
  createStyles({
    root: {},
    actions: {
      flex: '1 1 auto',
      textAlign: 'right',
      paddingRight: '24px'
    },
    createIcon: {},
    deleteIcon: {},
    [theme.breakpoints.down('sm')]: { ...(smStyle as any) },
    [theme.breakpoints.down('xs')]: { ...(xsStyle as any) },
    '@media screen and (max-width: 480px)': {}
  })

interface ICustomToolbarSelectDetails {
  selectedRows: ITableSelectedRows
  displayData: Array<{ data: any[]; dataIndex: number }>
  setSelectedRows: (rows: number[]) => void
}

interface ICustomToolbarSelect extends ICustomToolbarSelectDetails {
  onEdit: (selection: ITableSelectedRows) => void
  onDelete: (selection: ITableSelectedRows) => void
}

class _CustomToolbarSelect extends React.Component<ICustomToolbarSelect & WithStyles<typeof toolbarStyles>> {
  onEditHandler = () => {
    const { onEdit, selectedRows } = this.props
    onEdit(selectedRows)
  }

  onDeleteHandler = () => {
    const { onDelete, selectedRows } = this.props
    onDelete(selectedRows)
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
        <div className={classes.actions}>
          <Tooltip title={'Edit'}>
            <IconButton className={classes.iconButton} onClick={this.onEditHandler}>
              <CreateIcon className={classes.createIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title={'Delete'}>
            <IconButton className={classes.iconButton} onClick={this.onDeleteHandler}>
              <DeleteIcon className={classes.createIcon} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }
}

export const CustomToolbarSelect = withStyles(toolbarStyles, { name: 'CustomToolbarSelect' })(_CustomToolbarSelect)
