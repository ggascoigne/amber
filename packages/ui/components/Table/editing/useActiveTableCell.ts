import { useCallback, useRef, useState } from 'react'

import type { Cell, RowData } from '@tanstack/react-table'

import { normalizeValueForInput } from './editingValidation'
import type { TableEditingCell } from './internalTypes'

type UseActiveTableCellProps<TData extends RowData> = {
  commitPendingValue: (cell: {
    column: Cell<TData, unknown>['column']
    row: Cell<TData, unknown>['row']
    value: unknown
  }) => void
  enabled: boolean
  getPendingValue: (cell: Cell<TData, unknown>) => unknown
  isCellEditable: (cell: Cell<TData, unknown>) => boolean
}

export const useActiveTableCell = <TData extends RowData>({
  commitPendingValue,
  enabled,
  getPendingValue,
  isCellEditable,
}: UseActiveTableCellProps<TData>) => {
  const [activeCell, setActiveCell] = useState<TableEditingCell | null>(null)
  const [activeValue, setActiveValue] = useState<unknown>('')
  const [activeCellTouched, setActiveCellTouched] = useState(false)

  const activeCellRef = useRef<{ row: Cell<TData, unknown>['row']; column: Cell<TData, unknown>['column'] } | null>(
    null,
  )
  const activeValueRef = useRef<unknown>('')
  const activeCellTouchedRef = useRef(false)

  const startEditing = useCallback(
    (cell: Cell<TData, unknown>) => {
      if (!enabled || !isCellEditable(cell)) return
      if (activeCell?.rowId === cell.row.id && activeCell.columnId === cell.column.id) return

      if (activeCellRef.current && activeCellTouchedRef.current) {
        commitPendingValue({
          row: activeCellRef.current.row,
          column: activeCellRef.current.column,
          value: activeValueRef.current,
        })
      }

      activeCellTouchedRef.current = false
      setActiveCellTouched(false)

      activeCellRef.current = { row: cell.row, column: cell.column }
      setActiveCell({ rowId: cell.row.id, columnId: cell.column.id })

      const normalizedValue = normalizeValueForInput(getPendingValue(cell))
      activeValueRef.current = normalizedValue
      setActiveValue(normalizedValue)
    },
    [activeCell, commitPendingValue, enabled, getPendingValue, isCellEditable],
  )

  const updateActiveValue = useCallback((value: unknown) => {
    if (!Object.is(activeValueRef.current, value)) {
      activeCellTouchedRef.current = true
      setActiveCellTouched(true)
    }

    activeValueRef.current = value
    setActiveValue(value)
  }, [])

  const commitActiveCellChanges = useCallback(() => {
    if (!enabled || !activeCellRef.current) return
    if (!activeCellTouchedRef.current) return

    commitPendingValue({
      row: activeCellRef.current.row,
      column: activeCellRef.current.column,
      value: activeValueRef.current,
    })

    activeCellTouchedRef.current = false
    setActiveCellTouched(false)
  }, [commitPendingValue, enabled])

  const cancelActiveCell = useCallback(() => {
    activeCellRef.current = null
    activeValueRef.current = ''
    activeCellTouchedRef.current = false
    setActiveCell(null)
    setActiveValue('')
    setActiveCellTouched(false)
  }, [])

  return {
    activeCell,
    activeValue,
    activeCellTouched,
    cancelActiveCell,
    commitActiveCellChanges,
    startEditing,
    updateActiveValue,
  }
}
