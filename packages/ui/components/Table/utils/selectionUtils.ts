import type { RowData, Table as TableInstance } from '@tanstack/react-table'

export const zeroSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length < 1

export const oneSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length === 1

export const someSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length > 0

export const getSelectedRows = <T extends RowData>(table: TableInstance<T>, selectedKeys: string[]) => {
  const keyField = table.options.keyField ?? ('id' as any as keyof T)
  return table
    .getCoreRowModel()
    .flatRows.filter((row) => selectedKeys.includes(`${row.original[keyField]}`))
    .map((row) => row.original)
}
