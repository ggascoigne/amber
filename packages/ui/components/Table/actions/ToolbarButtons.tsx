import type { MouseEventHandler, ReactElement } from 'react'
import { useCallback } from 'react'

import RefreshIcon from '@mui/icons-material/Refresh'
import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import type { UserAction } from './actions'

type TableIconButtonProps = {
  icon?: ReactElement
  onClick: MouseEventHandler<HTMLButtonElement>
  label: string
  enabled?: boolean
  compact?: boolean
  ['data-testid']?: string
}

export const TableIconButton = (props: TableIconButtonProps) => {
  const { icon, onClick, label, enabled = true, compact = false } = props
  return (
    <Tooltip title={label} aria-label={label} disableInteractive>
      <span>
        <IconButton
          onClick={onClick}
          disabled={!enabled}
          size={compact ? 'small' : 'medium'}
          data-testid={props['data-testid']}
          sx={{ margin: 'auto' }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )
}

type ActionButtonProps<T extends RowData> = {
  action: UserAction<T>
  table: TableInstance<T>
  selectedKeys: string[]
  compact?: boolean
  ['data-testid']?: string
}

export const ActionButton = <T extends RowData>(props: ActionButtonProps<T>) => {
  const { action, table, selectedKeys, compact = false } = props
  const { label, onClick, icon, enabled = () => true } = action
  const onClickHandler = useCallback(() => onClick(table, selectedKeys), [onClick, selectedKeys, table])

  return (
    <Button
      color='primary'
      onClick={onClickHandler}
      startIcon={icon}
      disabled={!enabled(table, selectedKeys)}
      size={compact ? 'small' : 'medium'}
      data-testid={props['data-testid']}
      sx={{ margin: 'auto' }}
    >
      {label}
    </Button>
  )
}

export const ActionIconButton = <T extends RowData>(props: ActionButtonProps<T>) => {
  const { action, table, selectedKeys, compact = false } = props
  const { label, onClick, icon, enabled = () => true } = action
  const onClickHandler = useCallback(() => onClick(table, selectedKeys), [onClick, selectedKeys, table])

  return (
    <TableIconButton
      onClick={onClickHandler}
      icon={icon}
      label={label}
      enabled={enabled(table, selectedKeys)}
      compact={compact}
      data-testid={props['data-testid']}
    />
  )
}

type RefreshButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const RefreshButton = ({ onClick }: RefreshButtonProps) => (
  <TableIconButton icon={<RefreshIcon />} onClick={onClick} label='Refresh' data-testid='refresh-button' />
)
