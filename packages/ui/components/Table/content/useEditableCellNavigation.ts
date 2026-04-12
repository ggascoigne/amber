import { useCallback } from 'react'

import type { Cell, Row, RowData } from '@tanstack/react-table'

import type { TableEditingState } from '../editing/useTableEditing'
import { isUserColumnId } from '../utils/tableUtils'

type UseEditableCellNavigationProps<TData extends RowData> = {
  editing: TableEditingState<TData>
  rows: Array<Row<TData>>
}

export const useEditableCellNavigation = <TData extends RowData>({
  editing,
  rows,
}: UseEditableCellNavigationProps<TData>) =>
  useCallback(
    (cell: Cell<TData, unknown>, direction: 'next' | 'previous') => {
      if (!editing.enabled) return false

      const editableCells: Array<Cell<TData, unknown>> = []

      rows.forEach((row) => {
        if (row.getIsGrouped()) return

        row.getVisibleCells().forEach((candidate) => {
          const isSelectable = isUserColumnId(candidate.column.id) && !candidate.column.getIsGrouped()
          if (!isSelectable) return
          if (!editing.isCellEditable(candidate)) return
          editableCells.push(candidate)
        })
      })

      const currentIndex = editableCells.findIndex((candidate) => candidate.id === cell.id)
      if (currentIndex < 0) return false

      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
      if (nextIndex < 0 || nextIndex >= editableCells.length) return false

      editing.startEditing(editableCells[nextIndex])
      return true
    },
    [editing, rows],
  )
