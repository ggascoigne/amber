import IconButton from '@material-ui/core/IconButton'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import CreateIcon from '@material-ui/icons/Create'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useCallback } from 'react'

import { TableSelectedRows } from './types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    actions: {
      flex: '1 1 auto',
      textAlign: 'right',
      paddingRight: '24px'
    },
    createIcon: {},
    deleteIcon: {},
    [theme.breakpoints.down('sm')]: {
      actions: {
        textAlign: 'right'
      }
    },
    [theme.breakpoints.down('xs')]: {
      root: {
        display: 'block'
      },
      actions: {
        textAlign: 'center'
      }
    },
    '@media screen and (max-width: 480px)': {}
  })
)

interface CustomToolbarSelectDetails {
  selectedRows: TableSelectedRows
  displayData: { data: any[]; dataIndex: number }[]
  setSelectedRows: (rows: number[]) => void
}

interface CustomToolbarSelect extends CustomToolbarSelectDetails {
  onEdit: (selection: number[]) => void
  onDelete: (selection: number[]) => void
}

export const CustomToolbarSelect: React.FC<CustomToolbarSelect> = props => {
  const { onEdit, onDelete, selectedRows } = props
  const classes = useStyles()

  const onEditHandler = useCallback(() => {
    const rows = selectedRows.data.map(d => d.dataIndex)
    onEdit(rows)
  }, [onEdit, selectedRows])

  const onDeleteHandler = useCallback(() => {
    const rows = selectedRows.data.map(d => d.dataIndex)
    onDelete(rows)
  }, [onDelete, selectedRows])

  return (
    <div className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
      <div className={classes.actions}>
        <Tooltip title={'Edit'}>
          <IconButton className={classes.iconButton} onClick={onEditHandler} disabled={selectedRows.data.length !== 1}>
            <CreateIcon className={classes.createIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Delete'}>
          <IconButton className={classes.iconButton} onClick={onDeleteHandler}>
            <DeleteIcon className={classes.createIcon} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}
