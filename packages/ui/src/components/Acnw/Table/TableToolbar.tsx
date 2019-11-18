import { Button, IconButton, Theme, Toolbar, Tooltip, createStyles, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import CreateIcon from '@material-ui/icons/CreateOutlined'
import DeleteIcon from '@material-ui/icons/DeleteOutline'
import FilterListIcon from '@material-ui/icons/FilterList'
import ViewColumnsIcon from '@material-ui/icons/ViewColumn'
import classnames from 'classnames'
import React, { MouseEvent, PropsWithChildren, ReactElement, useCallback, useState } from 'react'
import { TableInstance } from 'react-table'

import { TableMouseEventHandler } from '../../../../types/react-table-config'
import { ColumnHidePage } from './ColumnHidePage'
import { FilterPage } from './FilterPage'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    leftButtons: {},
    rightButtons: {},
    leftIcons: {
      '&:first-of-type': {
        marginLeft: -12
      }
    },
    rightIcons: {
      padding: 12,
      marginTop: '-6px',
      width: 48,
      height: 48,
      '&:last-of-type': {
        marginRight: -12
      }
    }
  })
)

type ActionButton<T extends object> = {
  instance: TableInstance<T>
  icon?: JSX.Element
  onClick: TableMouseEventHandler
  enabled?: (instance: TableInstance<T>) => boolean
  label: string
  variant?: 'right' | 'left'
}

export const LabeledActionButton = <T extends object>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true
}: ActionButton<T>): ReactElement => {
  return (
    <Button variant='contained' color='primary' onClick={onClick(instance)} disabled={!enabled(instance)}>
      {icon}
      {label}
    </Button>
  )
}

export const SmallIconActionButton = <T extends object>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
  variant
}: ActionButton<T>) => {
  const classes = useStyles({})
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={classnames({ [classes.rightIcons]: variant === 'right', [classes.leftIcons]: variant === 'left' })}
          onClick={onClick(instance)}
          disabled={!enabled(instance)}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

type TableToolbar<T extends object> = {
  instance: TableInstance<T>
  onAdd?: TableMouseEventHandler
  onDelete?: TableMouseEventHandler
  onEdit?: TableMouseEventHandler
}

export function TableToolbar<T extends object>({
  instance,
  onAdd = () => () => null,
  onDelete = () => () => null,
  onEdit = () => () => null
}: PropsWithChildren<TableToolbar<T>>): ReactElement | null {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const handleColumnsClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setColumnsOpen(true)
    },
    [setAnchorEl, setColumnsOpen]
  )

  const handleFilterClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget)
      setFilterOpen(true)
    },
    [setAnchorEl, setFilterOpen]
  )

  function handleClose() {
    setColumnsOpen(false)
    setFilterOpen(false)
    setAnchorEl(undefined)
  }

  // toolbar with add, edit, delete, filter/search column select.
  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.leftButtons}>
        {onAdd && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<AddIcon />}
            onClick={onAdd}
            label='Add'
            enabled={({ state }: TableInstance<T>) => !state.selectedRowPaths || state.selectedRowPaths.length === 0}
            variant='left'
          />
        )}
        {onEdit && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<CreateIcon />}
            onClick={onEdit}
            label='Edit'
            enabled={({ state }: TableInstance<T>) => state.selectedRowPaths && state.selectedRowPaths.length === 1}
            variant='left'
          />
        )}
        {onDelete && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<DeleteIcon />}
            onClick={onDelete}
            label='Delete'
            enabled={({ state }: TableInstance<T>) => state.selectedRowPaths && state.selectedRowPaths.length > 0}
            variant='left'
          />
        )}
      </div>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T> instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
        <FilterPage<T> instance={instance} onClose={handleClose} show={filterOpen} anchorEl={anchorEl} />
        <SmallIconActionButton<T>
          instance={instance}
          icon={<ViewColumnsIcon />}
          onClick={() => handleColumnsClick}
          label='Show / hide columns'
          variant='right'
        />
        <SmallIconActionButton<T>
          instance={instance}
          icon={<FilterListIcon />}
          onClick={() => handleFilterClick}
          label='Filter by columns'
          variant='right'
        />
      </div>
    </Toolbar>
  )
}
