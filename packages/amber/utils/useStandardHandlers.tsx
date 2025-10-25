import { useCallback, useState } from 'react'

import type { TableSelectionMouseEventHandler } from '@amber/ui/components/Table'
import { getSelectedRows } from '@amber/ui/components/Table'
import type { Row, RowData } from '@tanstack/react-table'

export const useStandardHandlers = <T extends RowData>({
  deleteHandler,
  invalidateQueries,
  onCloseCallback,
}: {
  deleteHandler?: (selectedRows: T[]) => Promise<unknown>[]
  invalidateQueries?: () => void
  onCloseCallback?: () => void
}) => {
  const [showEdit, setShowEdit] = useState(false)

  // not exactly the table selection, more of a generic command target
  // since it can come from the per-row command where the selection doesn't change,
  // but the command target does.
  const [selection, setSelection] = useState<T[]>([])

  const handleCloseEdit = useCallback(() => {
    setShowEdit(false)
    onCloseCallback?.()
    setSelection([])
  }, [onCloseCallback])

  const onAdd = useCallback<TableSelectionMouseEventHandler<T>>(() => {
    setSelection([])
    setShowEdit(true)
  }, [])

  const onEdit = useCallback<TableSelectionMouseEventHandler<T>>((table, selectedKeys) => {
    setSelection(getSelectedRows(table, selectedKeys))
    setShowEdit(true)
  }, [])

  const onRowClick = useCallback((row: Row<T>) => {
    setSelection([row.original])
    setShowEdit(true)
  }, [])

  const onDelete = useCallback<TableSelectionMouseEventHandler<T>>(
    async (table, selectedKeys) => {
      if (deleteHandler) {
        const selectedRows = getSelectedRows(table, selectedKeys)
        if (!selectedRows.length) return Promise.resolve()
        const operations = selectedRows.map((row) => deleteHandler([row]))
        Promise.allSettled(operations).then(() => {
          invalidateQueries?.()
          table.resetRowSelection()
        })
      }
      return undefined
    },
    [deleteHandler, invalidateQueries],
  )

  const updateSelection = useCallback<TableSelectionMouseEventHandler<T, T[]>>((table, selectedKeys) => {
    const selectedRows = getSelectedRows(table, selectedKeys)
    setSelection(selectedRows)
    return selectedRows
  }, [])

  return {
    showEdit,
    selection,
    handleCloseEdit,
    onAdd,
    onEdit,
    onRowClick,
    onDelete,
    updateSelection,
  }
}
