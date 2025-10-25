import { useCallback } from 'react'

import type { CellContext, RowData, Table as TableInstance } from '@tanstack/react-table'

import { RowCheckbox } from './TableStyles'

type HeaderCheckboxProps<T extends RowData> = {
  table: TableInstance<T>
}

export const HeaderCheckbox = <T extends RowData>({ table }: HeaderCheckboxProps<T>) => {
  const areAllOnPageSelected = !!(
    table.getPaginationRowModel().rows.length && table.getPaginationRowModel().rows.every((r) => r.getIsSelected())
  )
  const isIndeterminate = !areAllOnPageSelected && table.getPaginationRowModel().rows.some((r) => r.getIsSelected())
  const onChange = useCallback(
    () => () => {
      table.toggleAllPageRowsSelected(undefined)
    },
    [table],
  )

  return (
    <RowCheckbox
      {...{
        checked: areAllOnPageSelected,
        indeterminate: isIndeterminate,
        onChange: onChange(),
      }}
    />
  )
}

export const CheckboxCellRenderer = <T extends RowData>({ row }: CellContext<T, any>) => (
  <RowCheckbox
    {...{
      checked: row.getIsSelected(),
      indeterminate: row.getIsSomeSelected(),
      disabled: !row.getCanSelect(),
      onChange: row.getToggleSelectedHandler(),
    }}
  />
)
