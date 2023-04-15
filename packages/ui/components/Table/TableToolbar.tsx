import { MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CachedIcon from '@mui/icons-material/Cached'
import CreateIcon from '@mui/icons-material/CreateOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnsIcon from '@mui/icons-material/ViewColumn'
import { Button, IconButton, Theme, Toolbar, Tooltip } from '@mui/material'
import type { TableInstance } from 'react-table'
import { makeStyles } from 'tss-react/mui'

import { ColumnHidePage } from './ColumnHidePage'
import { FilterPage } from './FilterPage'

import type { TableMouseEventHandler } from '../../types/react-table-config'
import { camelToWords } from '../../utils'

export const useStyles = makeStyles()((_theme: Theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftButtons: {},
  rightButtons: {},
  leftIcons: {
    '&:first-of-type': {
      marginLeft: -12,
    },
  },
  rightIcons: {
    padding: 12,
    marginTop: '-6px',
    width: 48,
    height: 48,
    '&:last-of-type': {
      marginRight: -12,
    },
  },
}))

interface ActionButton<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  icon?: JSX.Element
  onClick: TableMouseEventHandler<T>
  enabled?: (instance: TableInstance<T>) => boolean
  label: string
  variant?: 'right' | 'left'
}

export const LabeledActionButton = <T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
}: ActionButton<T>): ReactElement => (
  <Button variant='outlined' color='primary' onClick={onClick(instance)} disabled={!enabled(instance)}>
    {icon}
    &nbsp;
    {label}
  </Button>
)

export const SmallIconActionButton = <T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
  variant,
}: ActionButton<T>) => {
  const { classes, cx } = useStyles()
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={cx({ [classes.rightIcons]: variant === 'right', [classes.leftIcons]: variant === 'left' })}
          onClick={onClick(instance)}
          disabled={!enabled(instance)}
          size='large'
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export interface Command<T extends Record<string, unknown>> {
  label: string
  onClick: TableMouseEventHandler<T>
  icon?: JSX.Element
  enabled: (instance: TableInstance<T>) => boolean
  type?: 'icon' | 'button'
}

interface TableToolbarProps<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  onAdd?: TableMouseEventHandler<T>
  onDelete?: TableMouseEventHandler<T>
  onEdit?: TableMouseEventHandler<T>
  onRefresh?: MouseEventHandler
  extraCommands?: Command<T>[]
}

export function TableToolbar<T extends Record<string, unknown>>({
  instance,
  onAdd,
  onDelete,
  onEdit,
  extraCommands = [],
  onRefresh,
}: PropsWithChildren<TableToolbarProps<T>>): ReactElement | null {
  const { columns } = instance
  const { classes } = useStyles()
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const hideableColumns = columns.filter((column) => !(column.id === '_selector'))

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

  const formatColumnValue = (c: any) => {
    const textColumnEnclosure = '"'
    return typeof c === 'string' ? `${textColumnEnclosure}${c.replaceAll('"', '""')}${textColumnEnclosure}` : c
  }

  function handleFileDownloadClick() {
    const columnSeparator = ','
    const rowSeparator = '\n'
    const timestamp = new Date().toISOString().replaceAll(/[-.]/g, '_')
    // console.log(instance)
    const filename = `${instance.name}-${timestamp}.csv`
    const csvHeaders = instance.visibleColumns
      .filter((fc) => fc.id !== '_selector')
      .map((c) => formatColumnValue(camelToWords(c.id)))
      .join(columnSeparator)
      .concat(rowSeparator)
    const csvData = instance.rows
      .map((r) => {
        instance.prepareRow(r)
        return r.cells
          .filter((fc) => fc.column.id !== '_selector')
          .map((c) => formatColumnValue(c.value))
          .join(columnSeparator)
      })
      .join(rowSeparator)
      .concat(rowSeparator)
    const csvContent = csvHeaders.concat(csvData)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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
            enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length === 0}
            variant='left'
          />
        )}
        {onEdit && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<CreateIcon />}
            onClick={onEdit}
            label='Edit'
            enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length === 1}
            variant='left'
          />
        )}
        {onDelete && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<DeleteIcon />}
            onClick={onDelete}
            label='Delete'
            enabled={({ state }: TableInstance<T>) => Object.keys(state.selectedRowIds).length > 0}
            variant='left'
          />
        )}
        {extraCommands.map((c) => {
          const { type = 'icon' } = c
          return type === 'icon' ? (
            <SmallIconActionButton<T>
              key={`command-${c.label}`}
              instance={instance}
              icon={c.icon}
              onClick={c.onClick}
              label={c.label}
              enabled={c.enabled}
              variant='left'
            />
          ) : (
            <LabeledActionButton<T>
              key={`command-${c.label}`}
              instance={instance}
              icon={c.icon}
              onClick={c.onClick}
              label={c.label}
              enabled={c.enabled}
            />
          )
        })}
      </div>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T> instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
        <FilterPage<T> instance={instance} onClose={handleClose} show={filterOpen} anchorEl={anchorEl} />
        {onRefresh && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<CachedIcon />}
            onClick={() => onRefresh}
            label='Refresh Table'
            variant='right'
          />
        )}
        {hideableColumns.length > 1 && (
          <SmallIconActionButton<T>
            instance={instance}
            icon={<ViewColumnsIcon />}
            onClick={() => handleColumnsClick}
            label='Show / hide columns'
            variant='right'
          />
        )}
        <SmallIconActionButton<T>
          instance={instance}
          icon={<FilterListIcon />}
          onClick={() => handleFilterClick}
          label='Filter by columns'
          variant='right'
        />
        <SmallIconActionButton<T>
          instance={instance}
          icon={<FileDownloadSharpIcon />}
          onClick={() => handleFileDownloadClick}
          label='Download as CSV'
          variant='right'
        />
      </div>
    </Toolbar>
  )
}
