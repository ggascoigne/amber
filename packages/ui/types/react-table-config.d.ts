import { MouseEventHandler } from 'react'
import {
  TableInstance,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsHeaderProps,
  UseResizeColumnsOptions,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  UseTableCellProps
} from 'react-table'

declare module 'react-table' {
  // new definitions
  export interface UseResizeColumnState {
    columnResizing: {
      columnWidths: number[]
    }
  }

  // end fixed definitions

  // export interface UseHideColumnsValues {
  //   setColumnHidden: (columnID: string | number, hide: boolean) => void
  // }
  //
  // export interface UseHideColumnsState {
  //   hiddenColumns: (string | number)[]
  // }

  export interface TableOptions<D extends object>  // UseExpandedOptions<D>,
    extends UseFiltersOptions<D>,
      UseSortByColumnOptions<D>,
      // UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseRowSelectOptions<D>,
      UseSortByOptions<D>,
      UseResizeColumnsOptions<D> {}

  export interface TableInstance<D extends object>  // UseColumnOrderInstanceProps<D>, // UseExpandedInstanceProps<D>,
    extends UseFiltersInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      // UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      // UseRowStateInstanceProps<D>,
      // UseHideColumnsValues,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>  // UseColumnOrderState<D>, // UseExpandedState<D>,
    extends UseFiltersState<D>,
      // UseGroupByState<D>,
      UsePaginationState<D>,
      UseRowSelectState<D>,
      UseSortByState<D>,
      // UseHideColumnsState,
      UseResizeColumnState {
    rowCount: number
  }

  export interface Column<D extends object = {}> extends UseFiltersColumnOptions<D>, UseResizeColumnsColumnOptions<D> {
    align?: string
  } // UseSortByColumnOptions<D> // UseGroupByColumnOptions<D>,

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseResizeColumnsHeaderProps<D>,
      // UseGroupByColumnProps<D>,
      UseSortByColumnProps<D> {}

  export interface Cell<D extends object = {}>
    extends UseTableCellProps<D> /*,
      UseGroupByCellProps<D>,
      UseRowStateCellProps<D>*/ {}

  export interface Row<D extends object = {}> extends UseRowSelectRowProps<D> /*,
      UseRowStateRowProps<D> */ {} // UseExpandedRowProps<D>, // UseGroupByRowProps<D>,
}

export type TableMouseEventHandler = (instance: TableInstance<T>) => MouseEventHandler
