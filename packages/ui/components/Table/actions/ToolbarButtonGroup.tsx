// note that we're disabling this rule since functions are explicitly hoisted so this is safe
/* eslint @typescript-eslint/no-use-before-define: ["error", { "functions": false }] */
import { useMemo } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'
import { match, P } from 'ts-pattern'

import type { Action, UserAction } from './actions'
import { getEnabledActions, isUserAction } from './actions'
import { ColumnSelector } from './ColumnSelector'
import { Export } from './Export'
import { ActionButton, TableIconButton, ActionIconButton, RefreshButton } from './ToolbarButtons'

import { ButtonMenu } from '../../ButtonMenu'

type ToolbarButtonGroupProps<T extends RowData> = {
  actions: ReadonlyArray<Action<T>> | undefined
  table: TableInstance<T>
  selectedKeys: string[] | string
  anchorDirection?: 'top-left' | 'top-right'
  handleMenuClose?: () => void
  handleMenuOpen?: () => void
  compact?: boolean
}

export function ToolbarButtonGroup<T extends RowData>({
  actions,
  table,
  selectedKeys,
  anchorDirection = 'top-right',
  handleMenuClose,
  handleMenuOpen,
  compact = false,
}: ToolbarButtonGroupProps<T>) {
  const keys = useMemo(() => (Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]), [selectedKeys])

  return actions?.map((action) =>
    match(action)
      .with(P.when(isUserAction<T>), (a) => {
        if (a.type === 'icon') {
          return <ActionIconButton<T> key={a.label} action={a} table={table} selectedKeys={keys} compact={compact} />
        }
        return <ActionButton<T> key={a.label} action={a} table={table} selectedKeys={keys} compact={compact} />
      })
      .with({ action: 'columnSelect' }, (a) => (
        <ColumnSelector key={a.action} table={table} anchorDirection={anchorDirection} />
      ))
      .with({ action: 'export' }, (a) => <Export key={a.action} table={table} />)
      .with({ action: 'refresh' }, (a) => <RefreshButton key={a.action} onClick={a.onClick} />)
      .with({ action: 'menu' }, (a) => (
        <MenuButton
          key={a.action}
          table={table}
          actions={a.actions}
          selectedKeys={selectedKeys}
          handleMenuClose={handleMenuClose}
          handleMenuOpen={handleMenuOpen}
          collapse={a.collapse}
          compact={compact}
        />
      ))
      .exhaustive(),
  )
}

type MenuButtonProps<T extends RowData> = {
  actions: ReadonlyArray<UserAction<T>>
  table: TableInstance<T>
  selectedKeys: string[] | string
  handleMenuClose?: () => void
  handleMenuOpen?: () => void
  collapse?: boolean
  compact?: boolean
}

export function MenuButton<T extends RowData>({
  actions,
  table,
  selectedKeys,
  handleMenuClose,
  handleMenuOpen,
  collapse,
  compact = false,
}: MenuButtonProps<T>) {
  const enabledActions = useMemo(
    () => getEnabledActions(actions, table, selectedKeys, true) as UserAction<T>[],
    [actions, selectedKeys, table],
  )

  const buttonActions = useMemo(
    () =>
      enabledActions.map((a) => {
        const keys = Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]

        return {
          label: a.label,
          icon: a.icon,
          onClick: () => a.onClick(table, keys),
        }
      }),
    [enabledActions, selectedKeys, table],
  )

  if (!enabledActions?.length) {
    return null
  }

  if (enabledActions.length === 1 && collapse !== false) {
    return <ToolbarButtonGroup actions={enabledActions} table={table} selectedKeys={selectedKeys} compact={compact} />
  }

  return (
    <ButtonMenu
      id='actionButton-menu'
      component={TableIconButton}
      items={buttonActions}
      menuAnchorPosition='bottom'
      anchorDirection='top-right'
      icon={<MoreVertIcon />}
      label='Actions'
      aria-label='Actions'
      showLabel
      ignoreChildCheck
      sx={{
        flex: '0 1',
        alignSelf: 'baseline',
        whiteSpace: 'normal',
        '&:disabled': {
          opacity: 0.38,
        },
      }}
      data-testid='actions-button'
      onClose={handleMenuClose}
      onClick={handleMenuOpen}
      compact={compact}
    />
  )
}
