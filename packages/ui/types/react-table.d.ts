// TypeScript Version: 3.5
// reflects react-table@7.0.0-beta.23

// note that if you are using this you might well want to investigate the use of
// patch-package to delete the index.d.ts file in the react-table package

declare module 'react-table' {
  import { ComponentType, DependencyList, EffectCallback, MouseEvent, ReactElement, ReactNode } from 'react'

  /**
   * The empty definitions of below provides a base definition for the parts used by useTable, that can then be extended in the users code.
   *
   * @example
   *  export interface TableOptions<D extends object = {}}>
   *    extends
   *      UseExpandedOptions<D>,
   *      UseFiltersOptions<D> {}
   */
  export interface TableOptions<D extends object> extends UseTableOptions<D> {}

  export interface TableInstance<D extends object = {}>
    extends Omit<TableOptions<D>, 'columns'>,
      UseTableInstanceProps<D> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface TableState<D extends object = {}> {} /* tslint:disable-line no-empty-interface */

  export interface Hooks<D extends object = {}> extends UseTableHooks<D> {}

  export interface Cell<D extends object = {}> extends UseTableCellProps<D> {}

  export interface Column<D extends object = {}> extends UseTableColumnOptions<D> {}

  export interface ColumnInstance<D extends object = {}> extends Omit<Column<D>, 'id'>, UseTableColumnProps<D> {}

  export interface HeaderGroup<D extends object = {}> extends ColumnInstance<D>, UseTableHeaderGroupProps<D> {}

  export interface Row<D extends object = {}> extends UseTableRowProps<D> {}

  /* #region useTable */
  export function useTable<D extends object = {}>(
    options: TableOptions<D>,
    ...plugins: Array<PluginHook<D>>
  ): TableInstance<D>

  /**
   * NOTE: To use custom options, use "Interface Merging" to add the custom options
   */
  export type UseTableOptions<D extends object> = {
    columns: Array<Column<D>>
    data: Array<D>
  } & Partial<{
    initialState: Partial<TableState<D>>
    reducer: (newState: TableState<D>, action: string, prevState: TableState<D>) => TableState<D>
    defaultColumn: Partial<Column<D>>
    initialRowStateKey: IdType<D>
    getSubRows: (originalRow: D, relativeIndex: number) => Array<D>
    getRowId: (originalRow: D, relativeIndex: number) => IdType<D>
    debug: boolean
  }>

  export interface UseTableHooks<D extends object> {
    columnsBeforeHeaderGroups: Array<(flatColumns: Array<Column<D>>, instance: TableInstance<D>) => Array<Column<D>>>
    columnsBeforeHeaderGroupsDeps: Array<(deps: any[], instance: TableInstance<D>) => any[]>
    useInstanceBeforeDimensions: Array<(instance: TableInstance<D>) => TableInstance<D>>
    useInstance: Array<(instance: TableInstance<D>) => TableInstance<D>>
    useRows: Array<(rows: Array<Row<D>>, instance: TableInstance<D>) => Array<Row<D>>>
    prepareRow: Array<(row: Row<D>, instance: TableInstance<D>) => Row<D>>

    // Prop Hooks
    getTableProps: Array<(instance: TableInstance<D>) => object>
    getTableBodyProps: Array<(instance: TableInstance<D>) => object>
    getRowProps: Array<(row: Row<D>, instance: TableInstance<D>) => object>
    getHeaderGroupProps: Array<(headerGroup: HeaderGroup<D>, instance: TableInstance<D>) => object>
    getHeaderProps: Array<(column: Column<D>, instance: TableInstance<D>) => object>
    getCellProps: Array<(cell: Cell<D>, instance: TableInstance<D>) => object>
  }

  export interface UseTableColumnOptions<D extends object>
    extends Accessor<D>,
      Partial<{
        columns: Array<Column<D>>
        show: boolean | ((instance: TableInstance<D>) => boolean)
        Header: Renderer<HeaderProps<D>>
        Cell: Renderer<CellProps<D>>
        width?: number
        minWidth?: number
        maxWidth?: number
      }> {}

  export interface UseTableInstanceProps<D extends object> {
    columns: Array<ColumnInstance<D>>
    flatColumns: Array<ColumnInstance<D>>
    headerGroups: Array<HeaderGroup<D>>
    headers: Array<ColumnInstance<D>>
    flatHeaders: Array<ColumnInstance<D>>
    rows: Array<Row<D>>
    getTableProps: (props?: object) => object
    getTableBodyProps: (props?: object) => object
    prepareRow: (row: Row<D>) => void
    rowPaths: string[]
    flatRows: Array<Row<D>>
    state: TableState<D>
    dispatch: TableDispatch<D>
    totalColumnsWidth: number
  }

  export interface UseTableHeaderGroupProps<D extends object> {
    headers: Array<ColumnInstance<D>>
    getHeaderGroupProps: (props?: object) => object
    totalHeaderCount: number
  }

  export interface UseTableColumnProps<D extends object> {
    id: IdType<D>
    isVisible: boolean
    render: (type: 'Header' | string, props?: object) => ReactNode
    getHeaderProps: (props?: object) => object
    parent: ColumnInstance<D>
    depth: number
    index: number
  }

  export interface UseTableRowProps<D extends object> {
    cells: Array<Cell<D>>
    values: Record<IdType<D>, CellValue>
    getRowProps: (props?: object) => object
    index: number
    original: D
    path: Array<IdType<D>>
    subRows: Array<Row<D>>
  }

  export interface UseTableCellProps<D extends object> {
    column: ColumnInstance<D>
    row: Row<D>
    value: CellValue
    getCellProps: (props?: object) => object
    render: (type: 'Cell' | string, userProps?: object) => ReactNode
  }

  export type HeaderProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
  }

  export type CellProps<D extends object> = TableInstance<D> & {
    column: ColumnInstance<D>
    row: Row<D>
    cell: Cell<D>
  }

  // NOTE: At least one of (id | accessor | Header as string) required
  export interface Accessor<D extends object> {
    accessor?:
      | IdType<D>
      | ((
          originalRow: D,
          index: number,
          sub: {
            subRows: D[]
            depth: number
            data: D[]
          }
        ) => CellValue)
    id?: IdType<D>
  }

  /* #endregion */

  // Plugins

  /* #region useColumnOrder */
  export function useColumnOrder<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useColumnOrder {
    const pluginName = 'useColumnOrder'
  }

  export interface UseColumnOrderState<D extends object> {
    columnOrder: Array<IdType<D>>
  }

  export interface UseColumnOrderInstanceProps<D extends object> {
    setColumnOrder: (updater: (columnOrder: Array<IdType<D>>) => Array<IdType<D>>) => void
  }

  /* #endregion */

  /* #region useExpanded */
  export function useExpanded<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useExpanded {
    const pluginName = 'useExpanded'
  }

  export type UseExpandedOptions<D extends object> = Partial<{
    manualExpandedKey: IdType<D>
    paginateExpandedRows: boolean
    getResetExpandedDeps: (instance: TableInstance<D>) => Array<any>
  }>

  export interface UseExpandedHooks<D extends object> {
    getExpandedToggleProps: Array<(row: Row<D>, instance: TableInstance<D>) => object>
  }

  export interface UseExpandedState<D extends object> {
    expanded: Array<IdType<D>>
  }

  export interface UseExpandedInstanceProps<D extends object> {
    rows: Array<Row<D>>
    toggleExpandedByPath: (path: Array<IdType<D>>, isExpanded: boolean) => void
    expandedDepth: number
  }

  export interface UseExpandedRowProps<D extends object> {
    isExpanded: boolean
    canExpand: boolean
    subRows: Array<Row<D>>
    toggleExpanded: (isExpanded?: boolean) => void
    getExpandedToggleProps: (props?: object) => object
  }

  /* #endregion */

  /* #region useFilters */
  export function useFilters<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useFilters {
    const pluginName = 'useFilters'
  }

  export type UseFiltersOptions<D extends object> = Partial<{
    manualFilters: boolean
    disableFilters: boolean
    defaultCanFilter: boolean
    filterTypes: Filters<D>
    getResetFiltersDeps: (instance: TableInstance<D>) => Array<any>
  }>

  export interface UseFiltersState<D extends object> {
    filters: Filters<D>
  }

  export type UseFiltersColumnOptions<D extends object> = Partial<{
    Filter: Renderer<FilterProps<D>>
    disableFilters: boolean
    defaultCanFilter: boolean
    filter: FilterType<D> | DefaultFilterTypes | keyof Filters<D>
  }>

  export interface UseFiltersInstanceProps<D extends object> {
    rows: Array<Row<D>>
    preFilteredRows: Array<Row<D>>
    setFilter: (columnId: IdType<D>, updater: ((filterValue: FilterValue) => FilterValue) | FilterValue) => void
    setAllFilters: (updater: Filters<D> | ((filters: Filters<D>) => Filters<D>)) => void
  }

  export interface UseFiltersColumnProps<D extends object> {
    canFilter: boolean
    setFilter: (updater: ((filterValue: FilterValue) => FilterValue) | FilterValue) => void
    filterValue: FilterValue
    preFilteredRows: Array<Row<D>>
    filteredRows: Array<Row<D>>
  }

  export type FilterProps<D extends object> = HeaderProps<D>
  export type FilterValue = any
  export type Filters<D extends object> = Record<IdType<D>, FilterValue>

  export type DefaultFilterTypes =
    | 'text'
    | 'exactText'
    | 'exactTextCase'
    | 'includes'
    | 'includesAll'
    | 'exact'
    | 'equals'
    | 'between'

  export interface FilterType<D extends object> {
    (rows: Array<Row<D>>, columnId: IdType<D>, filterValue: FilterValue, column: ColumnInstance<D>): Array<Row<D>>

    autoRemove?: (filterValue: FilterValue) => boolean
  }

  /* #endregion */

  /* #region useGroupBy */
  export function useGroupBy<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useGroupBy {
    const pluginName = 'useGroupBy'
  }

  export type UseGroupByOptions<D extends object> = Partial<{
    manualGroupBy: boolean
    disableGroupBy: boolean
    defaultCanGroupBy: boolean
    aggregations: Record<string, AggregatorFn<D>>
    groupByFn: (rows: Array<Row<D>>, columnId: IdType<D>) => Record<string, Row<D>>
    getResetGroupByDeps: (instance: TableInstance<D>) => Array<any>
  }>

  export interface UseGroupByHooks<D extends object> {
    getGroupByToggleProps: Array<(header: HeaderGroup<D>, instance: TableInstance<D>) => object>
  }

  export interface UseGroupByState<D extends object> {
    groupBy: Array<IdType<D>>
  }

  export type UseGroupByColumnOptions<D extends object> = Partial<{
    aggregate: Aggregator<D> | Array<Aggregator<D>>
    Aggregated: Renderer<CellProps<D>>
    disableGroupBy: boolean
    defaultCanGroupBy: boolean
    groupByBoundary: boolean
  }>

  export interface UseGroupByInstanceProps<D extends object> {
    rows: Array<Row<D>>
    preGroupedRows: Array<Row<D>>
    toggleGroupBy: (columnId: IdType<D>, toggle: boolean) => void
  }

  export interface UseGroupByColumnProps<D extends object> {
    canGroupBy: boolean
    isGrouped: boolean
    groupedIndex: number
    toggleGroupBy: () => void
    getGroupByToggleProps: (props?: object) => object
  }

  export interface UseGroupByRowProps<D extends object> {
    isAggregated: boolean
    groupByID: IdType<D>
    groupByVal: string
    values: Record<IdType<D>, AggregatedValue>
    subRows: Array<Row<D>>
    depth: number
    path: Array<IdType<D>>
    index: number
  }

  export interface UseGroupByCellProps<D extends object> {
    isGrouped: boolean
    isRepeatedValue: boolean
    isAggregated: boolean
  }

  export type DefaultAggregators = 'sum' | 'average' | 'median' | 'uniqueCount' | 'count'

  export type AggregatorFn<D extends object> = (
    columnValues: CellValue[],
    rows: Array<Row<D>>,
    isAggregated: boolean
  ) => AggregatedValue
  export type Aggregator<D extends object> = AggregatorFn<D> | DefaultAggregators | string
  export type AggregatedValue = any
  /* #endregion */

  /* #region usePagination */
  export function usePagination<D extends object = {}>(hooks: Hooks<D>): void

  export namespace usePagination {
    const pluginName = 'usePagination'
  }

  export type UsePaginationOptions<D extends object> = Partial<{
    pageCount: number
    manualPagination: boolean
    getResetPageDeps: (instance: TableInstance<D>) => Array<any>
    paginateExpandedRows: boolean
  }>

  export interface UsePaginationState<D extends object> {
    pageSize: number
    pageIndex: number
  }

  export interface UsePaginationInstanceProps<D extends object> {
    page: Array<Row<D>>
    pageCount: number
    pageOptions: number[]
    canPreviousPage: boolean
    canNextPage: boolean
    gotoPage: (updater: ((pageIndex: number) => number) | number) => void
    previousPage: () => void
    nextPage: () => void
    setPageSize: (pageSize: number) => void
    pageIndex: number
    pageSize: number
  }

  /* #endregion */

  /* #region useRowSelect */
  export function useRowSelect<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useRowSelect {
    const pluginName = 'useRowSelect'
  }

  export type UseRowSelectOptions<D extends object> = Partial<{
    manualRowSelectedKey: IdType<D>
    getResetSelectedRowPathsDeps: (instance: TableInstance<D>) => Array<any>
  }>

  export interface UseRowSelectHooks<D extends object> {
    getToggleRowSelectedProps: Array<(row: Row<D>, instance: TableInstance<D>) => object>
    getToggleAllRowsSelectedProps: Array<(instance: TableInstance<D>) => object>
  }

  export interface UseRowSelectState<D extends object> {
    selectedRowPaths: Array<IdType<D>>
  }

  export interface UseRowSelectInstanceProps<D extends object> {
    toggleRowSelected: (rowPath: IdType<D>, set?: boolean) => void
    toggleRowSelectedAll: (set?: boolean) => void
    getToggleAllRowsSelectedProps: (props?: object) => object
    isAllRowsSelected: boolean
    selectedFlatRows: Array<Row<D>>
  }

  export interface UseRowSelectRowProps<D extends object> {
    isSelected: boolean
    toggleRowSelected: (set?: boolean) => void
    getToggleRowSelectedProps: (props?: object) => object
  }

  /* #endregion */

  /* #region useRowState */
  export function useRowState<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useRowState {
    const pluginName = 'useRowState'
  }

  export type UseRowStateOptions<D extends object> = Partial<{
    initialRowStateAccessor: (row: Row<D>) => UseRowStateLocalState<D>
  }>

  export interface UseRowStateState<D extends object> {
    rowState: Partial<{
      cellState: UseRowStateLocalState<D>
      rowState: UseRowStateLocalState<D>
    }>
  }

  export interface UseRowStateInstanceProps<D extends object> {
    setRowState: (rowPath: string[], updater: UseRowUpdater) => void // Purposely not exposing action
    setCellState: (rowPath: string[], columnId: IdType<D>, updater: UseRowUpdater) => void
  }

  export interface UseRowStateRowProps<D extends object> {
    state: UseRowStateLocalState<D>
    setState: (updater: UseRowUpdater) => void
  }

  export interface UseRowStateCellProps<D extends object> {
    state: UseRowStateLocalState<D>
    setState: (updater: UseRowUpdater) => void
  }

  export type UseRowUpdater<T = unknown> = T | ((prev: T) => T)
  export type UseRowStateLocalState<D extends object, T = unknown> = Record<IdType<D>, T>
  /* #endregion */

  /* #region useSortBy */
  export function useSortBy<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useSortBy {
    const pluginName = 'useSortBy'
  }

  export type UseSortByOptions<D extends object> = Partial<{
    manualSorting: boolean
    disableSortBy: boolean
    defaultCanSort: boolean
    disableMultiSort: boolean
    isMultiSortEvent: (e: MouseEvent) => boolean
    maxMultiSortColCount: number
    disableSortRemove: boolean
    disabledMultiRemove: boolean
    orderByFn: (rows: Array<Row<D>>, sortFns: Array<SortByFn<D>>, directions: boolean[]) => Array<Row<D>>
    sortTypes: Record<string, SortByFn<D>>
    getResetSortByDeps: (instance: TableInstance<D>) => Array<any>
  }>

  export interface UseSortByHooks<D extends object> {
    getSortByToggleProps: Array<(column: Column<D>, instance: TableInstance<D>) => object>
  }

  export interface UseSortByState<D extends object> {
    sortBy: Array<SortingRule<D>>
  }

  export type UseSortByColumnOptions<D extends object> = Partial<{
    defaultCanSort: boolean
    disableSortBy: boolean
    sortDescFirst: boolean
    sortInverted: boolean
    sortType: SortByFn<D> | DefaultSortTypes | string
  }>

  export interface UseSortByInstanceProps<D extends object> {
    rows: Array<Row<D>>
    preSortedRows: Array<Row<D>>
    toggleSortBy: (columnId: IdType<D>, descending: boolean, isMulti: boolean) => void
  }

  export interface UseSortByColumnProps<D extends object> {
    canSort: boolean
    toggleSortBy: (descending: boolean, multi: boolean) => void
    getSortByToggleProps: (props?: object) => object
    clearSorting: () => void
    isSorted: boolean
    sortedIndex: number
    isSortedDesc: boolean | undefined
  }

  export type SortByFn<D extends object> = (rowA: Row<D>, rowB: Row<D>, columnId: IdType<D>) => 0 | 1 | -1

  export type DefaultSortTypes = 'alphanumeric' | 'datetime' | 'basic'

  export interface SortingRule<D> {
    id: IdType<D>
    desc?: boolean
  }

  /* #endregion */

  /* #region useAbsoluteLayout */
  export function useAbsoluteLayout<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useAbsoluteLayout {
    const pluginName = 'useAbsoluteLayout'
  }
  /* #endregion */

  /* #region useBlockLayout */
  export function useBlockLayout<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useBlockLayout {
    const pluginName = 'useBlockLayout'
  }
  /* #endregion */

  /* #region useResizeColumns */
  export function useResizeColumns<D extends object = {}>(hooks: Hooks<D>): void

  export namespace useResizeColumns {
    const pluginName = 'useResizeColumns'
  }

  export interface UseResizeColumnsOptions<D extends object> {
    disableResizing?: boolean
  }

  export interface UseResizeColumnsColumnOptions<D extends object> {
    disableResizing?: boolean
  }

  export interface UseResizeColumnsHeaderProps<D extends object> {
    getResizerProps: (props?: object) => object
    canResize: boolean
    isResizing: boolean
  }

  /* #endregion */

  type ElementDimensions = {
    left: number
    width: number
    outerWidth: number
    marginLeft: number
    marginRight: number
    paddingLeft: number
    paddingRight: number
    scrollWidth: number
  }

  export type UtilsType<D extends object> = {
    safeUseLayoutEffect: (effect: EffectCallback, deps?: DependencyList) => void
    findMaxDepth: (columns: Columns<D>, depth?: number) => any // to check column.reduce() return value
    decorateColumn: (
      columns: Column<D>,
      userDefaultColumn: Partial<Column<D>>,
      parent: Column<D>,
      depth: number,
      index: number
    ) => Column<D>
    decorateColumnTree: (
      columns: Column<D>,
      defaultColumn: Partial<Column<D>>,
      parent: Column<D>,
      depth: number
    ) => Array<Column<D>>
    makeHeaderGroups: (
      flatColumns: Array<ColumnInstance<D>>,
      defaultColumn: Partial<Column<D>>
    ) => Array<HeaderGroup<D>>
    determineHeaderVisibility: (instance: TableInstance<D>) => void
    getBy: (obj: any, path: string, def: string) => string // guess
    defaultOrderByFn: (arr: Array<Row<D>>, funcs: Array<SortByFn<D>>, dirs: Array<boolean>) => Array<Row<D>>
    getFirstDefined: (...props: any) => any
    defaultGroupByFn: (rows: Array<Row<D>>, columnId: IdType<D>) => Record<string, Row<D>>
    getElementDimensions: (element: ReactElement) => ElementDimensions
    flexRender: (component: ComponentType, props: any) => ReactElement
    mergeProps: (props: any) => any
    applyHooks: (hooks, initial, props) => any // todo
    applyPropHooks: (hooks, args) => any // todo
    warnUnknownProps: (props: any) => void
    sum: (arr: Array<any>) => number // todo
    isFunction: (a: any) => boolean
    flattenBy: (columns: Array<ColumnInstance<D>>, childKey: IdType<D>) => Array<ColumnInstance<D>>
    ensurePluginOrder: (
      plugins: Array<PluginHook<D>>,
      befores: Array<string>,
      pluginName: string,
      afters: Array<string>
    ) => void
    expandRows: (
      rows: Array<Row<D>>,
      {
        manualExpandedKey,
        expanded,
        expandSubRows = true
      }: { manualExpandedKey: string; expanded: Array<string>; expandSubRows?: boolean }
    ) => Array<string>
    functionalUpdate: (updater: any, old: Partial<TableState<D>>) => Partial<TableState<D>> // todo
  }

  // Additional API
  export const utils: UtilsType
  export const actions: Record<string, string>
  export const defaultColumn: Partial<Column>
  type TableReducer<S, A> = (prevState: S, action: A) => S | undefined
  export const reducerHandlers: Record<string, TableReducer<TableState, any>>

  // Helpers
  export type StringKey<D> = Extract<keyof D, string>
  export type IdType<D> = StringKey<D> | string
  export type CellValue = any

  export type Renderer<Props> = ComponentType<Props> | ReactNode

  export interface PluginHook<D extends object> {
    (hooks: Hooks<D>): void
    pluginName: string
  }

  export type TableAction = {
    type: keyof typeof actions | string
  }

  export type TableDispatch<D extends object, A extends TableAction> = (action: A) => void
}
