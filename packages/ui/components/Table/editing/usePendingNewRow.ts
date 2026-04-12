import { useCallback, useMemo, useState } from 'react'

import type { RowData } from '@tanstack/react-table'

import type { DataTableEditingConfig } from './types'

type UsePendingNewRowProps<TData extends RowData> = {
  cellEditing?: DataTableEditingConfig<TData>
  data: Array<TData>
}

export const usePendingNewRow = <TData extends RowData>({ cellEditing, data }: UsePendingNewRowProps<TData>) => {
  const [pendingNewRow, setPendingNewRow] = useState<TData | null>(null)
  const addRowConfig = cellEditing?.addRow
  const canAddRow = !!cellEditing?.enabled && !!addRowConfig?.enabled && !pendingNewRow

  const handleAddRow = useCallback(() => {
    if (!cellEditing?.enabled || !addRowConfig?.enabled || pendingNewRow) return
    setPendingNewRow(addRowConfig.createRow())
  }, [addRowConfig, cellEditing?.enabled, pendingNewRow])

  const resolvedData = useMemo(() => (pendingNewRow ? [...data, pendingNewRow] : data), [data, pendingNewRow])

  const resolvedEditingConfig = useMemo(() => {
    if (!cellEditing) return undefined
    if (!cellEditing.addRow?.enabled) return cellEditing

    return {
      ...cellEditing,
      addRow: {
        ...cellEditing.addRow,
        onAddRow: async (row: TData) => {
          await cellEditing.addRow?.onAddRow(row)
          setPendingNewRow(null)
        },
      },
      onDiscard: () => {
        cellEditing.onDiscard?.()
        setPendingNewRow(null)
      },
    }
  }, [cellEditing])

  return {
    canAddRow,
    handleAddRow,
    pendingNewRow,
    resolvedData,
    resolvedEditingConfig,
  }
}
