import type { ReactElement } from 'react'

import type {
  Cell as TanStackCell,
  CellContext as TanStackCellContext,
  CellData,
  Column as TanStackColumn,
  ColumnDef as TanStackColumnDef,
  ColumnHelper as TanStackColumnHelper,
  FilterFn,
  Header as TanStackHeader,
  HeaderContext as TanStackHeaderContext,
  ReactTable,
  Row as TanStackRow,
  RowData,
  Table as TanStackTable,
  TableFeatures,
  TableOptions as TanStackTableOptions,
  TableState as TanStackTableState,
} from '@tanstack/react-table'
import { createColumnHelper as createTanStackColumnHelper } from '@tanstack/react-table'

import type { TableEditColumnConfig } from './editing/types'
import type { OptionsValue } from './filter/types'
import type { AmberTableFeatures } from './tableFeatures'

declare const amberTableMetaTypes: unique symbol
declare const amberColumnMetaTypes: unique symbol

export type AmberCell<TData extends RowData, TValue extends CellData = CellData> = TanStackCell<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberCellContext<TData extends RowData, TValue extends CellData = CellData> = TanStackCellContext<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberColumn<TData extends RowData, TValue extends CellData = CellData> = TanStackColumn<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberColumnDef<TData extends RowData, TValue extends CellData = CellData> = TanStackColumnDef<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberColumnHelper<TData extends RowData> = TanStackColumnHelper<AmberTableFeatures, TData>
export type AmberCoreTable<TData extends RowData> = TanStackTable<AmberTableFeatures, TData>
export type AmberFilterFn<TData extends RowData> = FilterFn<AmberTableFeatures, TData>
export type AmberHeader<TData extends RowData, TValue extends CellData = CellData> = TanStackHeader<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberHeaderContext<TData extends RowData, TValue extends CellData = CellData> = TanStackHeaderContext<
  AmberTableFeatures,
  TData,
  TValue
>
export type AmberRow<TData extends RowData> = TanStackRow<AmberTableFeatures, TData>
export type AmberTable<TData extends RowData> = ReactTable<AmberTableFeatures, TData>
export type AmberTableOptions<TData extends RowData> = TanStackTableOptions<AmberTableFeatures, TData>
export type AmberTableState = TanStackTableState<AmberTableFeatures>

export const createAmberColumnHelper = <TData extends RowData>(): AmberColumnHelper<TData> =>
  createTanStackColumnHelper<AmberTableFeatures, TData>()

// Familiar names keep the application-facing v8 type shape while binding v9's
// new feature generic to Amber's one shared feature registry.
export type Cell<TData extends RowData, TValue extends CellData = CellData> = AmberCell<TData, TValue>
export type CellContext<TData extends RowData, TValue extends CellData = CellData> = AmberCellContext<TData, TValue>
export type Column<TData extends RowData, TValue extends CellData = CellData> = AmberColumn<TData, TValue>
export type ColumnDef<TData extends RowData, TValue extends CellData = CellData> = AmberColumnDef<TData, TValue>
export type Header<TData extends RowData, TValue extends CellData = CellData> = AmberHeader<TData, TValue>
export type HeaderContext<TData extends RowData, TValue extends CellData = CellData> = AmberHeaderContext<TData, TValue>
export type Row<TData extends RowData> = AmberRow<TData>
export type Table<TData extends RowData> = AmberTable<TData>
export type TableOptions<TData extends RowData> = AmberTableOptions<TData>
export type TableState = AmberTableState
export const createColumnHelper = createAmberColumnHelper
export type { CellData, RowData } from '@tanstack/react-table'

export type FilterRenderProps<TData extends RowData> = {
  column: AmberColumn<TData>
  table: AmberCoreTable<TData>
  clear?: () => void
  meta?: FilterFlags<AmberTableFeatures, TData>
}

export type FilterFlags<TFeatures extends TableFeatures, TData extends RowData> = {
  filterRender?: (props: {
    column: TanStackColumn<TFeatures, TData>
    table: TanStackTable<TFeatures, TData>
    clear?: () => void
    meta?: FilterFlags<TFeatures, TData>
  }) => ReactElement
  alwaysShow?: boolean
  options?: Array<OptionsValue>
  multiple?: boolean
  clear?: () => void
  canBeCleared?: () => boolean
}

declare module '@tanstack/table-core' {
  interface TableMeta<in out TFeatures extends TableFeatures, in out TData extends RowData> {
    readonly [amberTableMetaTypes]?: { features: TFeatures; data: TData }
    name?: string
    enablePagination?: boolean
    enableTreeBehavior?: boolean
  }

  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    readonly [amberColumnMetaTypes]?: { features: TFeatures; data: TData; value: TValue }
    /** A readable name for the column. Defaults to a title-cased column id. */
    name?: string
    align?: 'left' | 'right'
    alwaysShowTooltip?: boolean
    filterFlags?: FilterFlags<TFeatures, TData>
    dateFormat?: string
    edit?: TableEditColumnConfig<TData>
  }
}
