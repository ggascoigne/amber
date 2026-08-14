import { useCallback } from 'react'

import { RowCheckbox } from './TableStyles'

import type { AmberCoreTable, CellContext, RowData } from '../tableTypes'

type HeaderCheckboxProps<T extends RowData> = {
  table: AmberCoreTable<T>
}

export const HeaderCheckbox = <T extends RowData>({ table }: HeaderCheckboxProps<T>) => {
  const areAllOnPageSelected = !!(
    table.getPaginatedRowModel().rows.length && table.getPaginatedRowModel().rows.every((row) => row.getIsSelected())
  )
  const isIndeterminate = !areAllOnPageSelected && table.getPaginatedRowModel().rows.some((row) => row.getIsSelected())
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
