import type { RowData, Table as TableInstance } from '../tableTypes'

export const zeroSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length < 1

export const oneSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length === 1

export const someSelected = <T extends RowData>(_table: TableInstance<T>, selectedKeys: string[]) =>
  selectedKeys.length > 0

export const getSelectedRows = <T extends RowData>(table: TableInstance<T>, selectedKeys: string[]) =>
  table
    .getCoreRowModel()
    .flatRows.filter((row) => selectedKeys.includes(row.id))
    .map((row) => row.original)
