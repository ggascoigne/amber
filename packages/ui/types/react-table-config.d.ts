/* eslint-disable unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars */
import { ChangeEvent, MouseEventHandler, ReactNode } from 'react'

import {
  TableInstance,
  UseColumnOrderInstanceProps,
  UseColumnOrderState,
  UseExpandedHooks,
  UseExpandedInstanceProps,
  UseExpandedOptions,
  UseExpandedRowProps,
  UseExpandedState,
  UseFiltersColumnOptions,
  UseFiltersColumnProps,
  UseFiltersInstanceProps,
  UseFiltersOptions,
  UseFiltersState,
  UseGlobalFiltersColumnOptions,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  UseGlobalFiltersState,
  UseGroupByCellProps,
  UseGroupByColumnOptions,
  UseGroupByColumnProps,
  UseGroupByHooks,
  UseGroupByInstanceProps,
  UseGroupByOptions,
  UseGroupByRowProps,
  UseGroupByState,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseResizeColumnsColumnOptions,
  UseResizeColumnsColumnProps,
  UseResizeColumnsOptions,
  UseResizeColumnsState,
  UseRowSelectHooks,
  UseRowSelectInstanceProps,
  UseRowSelectOptions,
  UseRowSelectRowProps,
  UseRowSelectState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByHooks,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
} from 'react-table'

declare module 'react-table' {
  export interface UseFlexLayoutInstanceProps<D extends Record<string, unknown>> {
    totalColumnsMinWidth: number
  }

  export interface UseFlexLayoutColumnProps<D extends Record<string, unknown>> {
    totalMinWidth: number
  }

  export interface TableOptions<D extends Record<string, unknown>>
    extends UseExpandedOptions<D>,
      UseFiltersOptions<D>,
      UseFiltersOptions<D>,
      UseGlobalFiltersOptions<D>,
      UseGroupByOptions<D>,
      UsePaginationOptions<D>,
      UseResizeColumnsOptions<D>,
      UseRowSelectOptions<D>,
      UseSortByOptions<D> {
    name?: string
    hideSelectionUi?: boolean
    defaultColumnDisableGlobalFilter?: boolean
    updateData?: (rowIndex: number, columnId: string, value: any) => void
  }

  export interface Hooks<D extends Record<string, unknown> = unknown>
    extends UseExpandedHooks<D>,
      UseGroupByHooks<D>,
      UseRowSelectHooks<D>,
      UseSortByHooks<D> {}

  export interface TableInstance<D extends Record<string, unknown> = unknown>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseFiltersInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UseGroupByInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseFlexLayoutInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseSortByInstanceProps<D> {}

  export interface TableState<D extends Record<string, unknown> = unknown>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseFiltersState<D>,
      UseGlobalFiltersState<D>,
      UseGroupByState<D>,
      UsePaginationState<D>,
      UseResizeColumnsState<D>,
      UseRowSelectState<D>,
      UseSortByState<D> {
    rowCount: number
  }

  export interface CellEditorProps {
    value: any
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
  }

  export interface ColumnInterface<D extends Record<string, unknown> = unknown>
    extends UseFiltersColumnOptions<D>,
      UseGroupByColumnOptions<D>,
      UseGlobalFiltersColumnOptions<D>,
      UseResizeColumnsColumnOptions<D>,
      UseSortByColumnOptions<D> {
    align?: string
    dateFormat?: string
  }

  export interface ColumnInstance<D extends Record<string, unknown> = unknown>
    extends UseFiltersColumnProps<D>,
      UseGroupByColumnProps<D>,
      UseResizeColumnsColumnProps<D>,
      UseFlexLayoutColumnProps<D>,
      UseSortByColumnProps<D> {
    CellEditor?: (CellEditorProps) => ReactNode
  }

  export interface Cell<D extends Record<string, unknown> = unknown> extends UseGroupByCellProps<D> {}

  export interface Row<D extends Record<string, unknown> = unknown>
    extends UseExpandedRowProps<D>,
      UseGroupByRowProps<D>,
      UseRowSelectRowProps<D> {}

  export interface TableCommonProps {
    title?: string
    'aria-label'?: string
  }

  export interface TableSortByToggleProps {
    title?: string
  }

  export interface TableGroupByToggleProps {
    title?: string
  }
}

export interface TableMouseEventHandler<T extends Record<string, unknown>> {
  (instance: TableInstance<T>): MouseEventHandler
}
