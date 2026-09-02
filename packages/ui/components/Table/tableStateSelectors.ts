import type { AmberTableState, TableQueryState } from './tableTypes'

export type TableRenderState = Omit<AmberTableState, 'rowSelection'>

export const selectTableQueryState = (state: AmberTableState): TableQueryState => ({
  pagination: state.pagination,
  sorting: state.sorting,
  columnFilters: state.columnFilters,
  globalFilter: state.globalFilter,
})

export const selectTableRenderState = ({ rowSelection: _rowSelection, ...renderState }: AmberTableState) => renderState
