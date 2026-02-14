import type { ReactElement } from 'react'

import type { RowData, Table as TableInstance } from '@tanstack/react-table'
import { match, P } from 'ts-pattern'

const HIDE_DISABLED_ACTIONS = false

export type TableMouseEventHandler<T extends RowData> = (table: TableInstance<T>) => void

export type TableSelectionMouseEventHandler<T extends RowData, R = void> = (
  table: TableInstance<T>,
  selectedKeys: string[],
) => R

export type UserAction<T extends RowData> = {
  label: string
  onClick: TableSelectionMouseEventHandler<T>
  icon?: ReactElement
  enabled?: (table: TableInstance<T>, selectedKeys: string[]) => boolean
  type?: 'default' | 'icon'
}

export type ColumnSelectorAction = { action: 'columnSelect' }

export type ExportAction = { action: 'export' }

export type RefreshAction = {
  action: 'refresh'
  onClick: () => void
}

export type MenuAction<T extends RowData> = {
  action: 'menu'
  actions: ReadonlyArray<UserAction<T>>
  collapse?: boolean
}

export type BuiltinAction = ColumnSelectorAction | RefreshAction | ExportAction

export const isBuiltinAction = <T extends RowData>(value: Action<T>): value is BuiltinAction =>
  Object.prototype.hasOwnProperty.call(value, 'action')

export const isUserAction = <T extends RowData>(value: Action<T>): value is UserAction<T> => !isBuiltinAction(value)

export type Action<T extends RowData> = UserAction<T> | BuiltinAction | MenuAction<T>

export const getEnabledActions = <T extends RowData>(
  actions: ReadonlyArray<Action<T>> | undefined,
  table: TableInstance<T>,
  selectedKeys: string[] | string,
  hideDisabled = HIDE_DISABLED_ACTIONS,
) => {
  const keys = Array.isArray(selectedKeys) ? selectedKeys : [selectedKeys]
  return hideDisabled
    ? actions?.filter((action) =>
        match(action)
          .with(P.when(isUserAction<T>), (a) => (a.enabled ? a.enabled(table, keys) : true))
          .otherwise(() => true),
      )
    : actions
}
