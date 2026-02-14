import { memo, useMemo } from 'react'

import type { RowData, Table as TableInstance } from '@tanstack/react-table'

import { TableRowHoverArea } from './TableStyles'

import type { Action, UserAction } from '../actions'
import { getEnabledActions, ToolbarButtonGroup } from '../actions'

const InternalRowHoverButtons = <T extends RowData>({
  table,
  rowActions,
  selectedKeys,
  visible,
  handleMenuClose,
  handleMenuOpen,
  compact = false,
}: {
  table: TableInstance<T>
  rowActions?: ReadonlyArray<Action<T>>
  selectedKeys: string[] | string
  visible: boolean
  compact?: boolean
  handleMenuClose: () => void
  handleMenuOpen: () => void
}) => {
  const enabledActions = useMemo(
    () => getEnabledActions(rowActions, table, selectedKeys, true) as UserAction<T>[],
    [rowActions, selectedKeys, table],
  )

  if (!enabledActions?.length) {
    return null
  }

  return (
    <TableRowHoverArea visible={visible}>
      <ToolbarButtonGroup
        table={table}
        actions={enabledActions}
        selectedKeys={selectedKeys}
        handleMenuClose={handleMenuClose}
        handleMenuOpen={handleMenuOpen}
        compact={compact}
      />
    </TableRowHoverArea>
  )
}

export const RowHoverButtons = memo(InternalRowHoverButtons) as typeof InternalRowHoverButtons
