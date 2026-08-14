import { useCallback } from 'react'

import { Subscribe } from '@tanstack/react-table'

import { RowCheckbox } from './TableStyles'

import type { AmberCoreTable, CellContext, RowData } from '../tableTypes'

type HeaderCheckboxProps<T extends RowData> = {
  table: AmberCoreTable<T>
}

const HeaderCheckboxView = <T extends RowData>({ table }: HeaderCheckboxProps<T>) => {
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

export const HeaderCheckbox = <T extends RowData>(props: HeaderCheckboxProps<T>) => (
  <Subscribe source={props.table.atoms.rowSelection}>{() => <HeaderCheckboxView {...props} />}</Subscribe>
)

export const CheckboxCellRenderer = <T extends RowData>({ row, table }: CellContext<T, unknown>) => (
  <Subscribe
    source={table.atoms.rowSelection}
    selector={() => ({
      isSelected: row.getIsSelected(),
      isSomeSelected: row.getIsSomeSelected(),
    })}
  >
    {({ isSelected, isSomeSelected }) => (
      <RowCheckbox
        checked={isSelected}
        indeterminate={isSomeSelected}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    )}
  </Subscribe>
)
