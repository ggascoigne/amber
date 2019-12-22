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
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState
} from 'react-table'

declare module 'react-table' {
  export interface UseFlexLayoutInstanceProps<D extends object> {
    totalColumnsMinWidth: number
  }

  export interface UseFlexLayoutColumnProps<D extends object> {
    totalMinWidth: number
  }

  export interface TableOptions<D extends object>
    extends UseFiltersOptions<D>,
      UseSortByColumnOptions<D>,
      UsePaginationOptions<D>,
      UseRowSelectOptions<D>,
      UseSortByOptions<D>,
      UseResizeColumnsOptions<D> {}

  export interface TableInstance<D extends object>
    extends UseFiltersInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseFlexLayoutInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UseFiltersState<D>,
      UsePaginationState<D>,
      UseRowSelectState<D>,
      UseSortByState<D>,
      UseResizeColumnsState<D> {
    rowCount: number
  }

  export interface Column<D extends object = {}> extends UseFiltersColumnOptions<D>, UseResizeColumnsColumnOptions<D> {
    align?: string
  }

  export interface ColumnInstance<D extends object = {}>
    extends UseFiltersColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseFlexLayoutColumnProps<D>,
      UseSortByColumnProps<D> {}

  // export interface Cell<D extends object = {}> {}

  export interface Row<D extends object = {}> extends UseRowSelectRowProps<D> {}
}

export type TableMouseEventHandler = (instance: TableInstance<T>) => MouseEventHandler
