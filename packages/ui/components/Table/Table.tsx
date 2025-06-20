import React, {
  CSSProperties,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import { TableSortLabel, TextField, Tooltip } from '@mui/material'
import {
  Cell,
  CellProps,
  Column,
  ColumnInstance,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  TableState,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'

import { CellEditor } from './CellEditor'
import { FilterChipBar } from './FilterChipBar'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { ResizeHandle } from './ResizeHandle'
import { TableDebug, TableDebugButton } from './TableDebug'
import { TablePagination } from './TablePagination'
import { TableSearch } from './TableSearch'
import {
  HeaderCheckbox,
  RowCheckbox,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableLabel,
  TableRow,
  TableStyleOptions,
  TableTable,
  useStyles,
} from './TableStyles'
import { Command, TableToolbar } from './TableToolbar'
import { TooltipCellRenderer } from './TooltipCellRenderer'
import { useInitialTableState } from './useInitialTableState'

import { camelToWords, isDev, notEmpty, useDebounce } from '../../utils'

export interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
  extraCommands?: Command<T>[]
  onRefresh?: MouseEventHandler
  initialState?: Partial<TableState<T>>
}

const DefaultHeader = <T extends Record<string, unknown>>({ column }: HeaderProps<T>) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

// yes this is recursive, but the depth never exceeds three, so it seems safe enough
const findFirstColumn = <T extends Record<string, unknown>>(columns: Array<ColumnInstance<T>>): ColumnInstance<T> =>
  columns[0]!.columns ? findFirstColumn(columns[0]!.columns) : columns[0]!

function DefaultColumnFilter<T extends Record<string, unknown>>({ columns, column, gotoPage }: FilterProps<T>) {
  const { id, filterValue, setFilter, render } = column
  const [value, setValue] = React.useState(filterValue ?? '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue ?? '')
  }, [filterValue])

  const isFirstColumn = findFirstColumn(columns) === column
  return (
    <TextField
      name={id}
      label={render('Header')}
      InputLabelProps={{ htmlFor: id }}
      value={value}
      autoFocus={isFirstColumn}
      variant='standard'
      onChange={handleChange}
      onBlur={(e) => {
        const v = e.target.value || undefined
        setFilter(v)
        if (v !== filterValue) gotoPage(0)
      }}
    />
  )
}

const getStyles = (props: any, _disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

const useSelectionUi = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns, { instance: _instance }) => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      Aggregated: undefined,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
    },
    ...columns,
  ])
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0]!.headers[0]!
    selectionGroupHeader.canResize = false
  })
}

const headerProps = <T extends Record<string, unknown>>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column.disableResizing, column.align)

const cellProps = <T extends Record<string, unknown>>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column.disableResizing, cell.column.align)

const DEFAULT_PAGE_SIZE = 25

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

export function Table<T extends Record<string, unknown>>(props: PropsWithChildren<TableProps<T>>): ReactElement {
  const {
    name,
    columns,
    onAdd,
    onDelete,
    onEdit,
    onClick,
    extraCommands,
    onRefresh,
    initialState: userInitialState = {},
    hideSelectionUi = false,
    defaultColumnDisableGlobalFilter = false,
    updateData,
  } = props

  const tableStyleOptions: TableStyleOptions = useMemo(
    () => ({
      selectionStyle: updateData ? 'cell' : 'row',
    }),
    [updateData],
  )

  const { classes, cx } = useStyles(tableStyleOptions)

  const hooks = [
    useColumnOrder,
    useGlobalFilter,
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    hideSelectionUi ? undefined : useSelectionUi,
  ].filter(notEmpty)

  const defaultColumn = useMemo<Partial<Column<T>>>(
    () => ({
      // disableFilter: true,
      // disableGroupBy: true,
      Filter: DefaultColumnFilter,
      Cell: TooltipCellRenderer,
      Header: DefaultHeader,
      aggregate: 'uniqueCount',
      Aggregated: ({ cell: { value } }: CellProps<T>) => <>{value} Unique Values</>,
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      // the logic for this is weird.  If you set the default column value for disableGlobalFilter to true then you pass
      // disableGlobalFilter: false on those columns that you want to be able to search upon
      // todo: make this more intuitive
      disableGlobalFilter: defaultColumnDisableGlobalFilter,
      CellEditor,
    }),
    [defaultColumnDisableGlobalFilter],
  )

  const [initialState, setInitialState] = useInitialTableState(`tableState:${name}`, columns, {
    pageSize: DEFAULT_PAGE_SIZE,
    ...userInitialState,
  })

  const instance = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
      updateData,
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      disableSortRemove: true,
    },
    ...hooks,
  )

  const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    setInitialState(debouncedState)
  }, [setInitialState, debouncedState])

  const cellClickHandler = useCallback(
    (cell: Cell<T>) => () => {
      onClick && !cell.column.isGrouped && !cell.row.isGrouped && cell.column.id !== '_selector' && onClick(cell.row)
    },
    [onClick],
  )

  const { role: _tableRole, ...tableProps } = getTableProps()
  const { role: _tableBodyRole, ...tableBodyProps } = getTableBodyProps()
  return (
    <>
      {!hideSelectionUi ? (
        <>
          <TableSearch instance={instance} />
          <TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit, extraCommands, onRefresh }} />
          <FilterChipBar<T> instance={instance} />
        </>
      ) : (
        <div>
          <br />
        </div>
      )}
      <TableTable {...tableProps} tableStyleOptions={tableStyleOptions}>
        <TableHead tableStyleOptions={tableStyleOptions}>
          {headerGroups.map((headerGroup) => {
            const {
              key: headerGroupKey,
              title: _headerGroupTitle,
              role: _headerGroupRole,
              ...getHeaderGroupProps
            } = headerGroup.getHeaderGroupProps()
            return (
              <TableHeadRow key={headerGroupKey} {...getHeaderGroupProps} tableStyleOptions={tableStyleOptions}>
                {headerGroup.headers.map((column) => {
                  const style = {
                    textAlign: column.align ?? 'left ',
                  } as CSSProperties
                  const { key: headerKey, role: _headerRole, ...getHeaderProps } = column.getHeaderProps(headerProps)
                  const { title: groupTitle = '', ...columnGroupByProps } = column.getGroupByToggleProps()
                  const { title: sortTitle = '', ...columnSortByProps } = column.getSortByToggleProps()

                  return (
                    <TableHeadCell key={headerKey} {...getHeaderProps} tableStyleOptions={tableStyleOptions}>
                      {column.canGroupBy && (
                        <Tooltip title={groupTitle}>
                          <TableSortLabel
                            active
                            direction={column.isGrouped ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowRight}
                            {...columnGroupByProps}
                            className={classes.headerIcon}
                          />
                        </Tooltip>
                      )}
                      {column.canSort ? (
                        <Tooltip title={sortTitle}>
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                            {...columnSortByProps}
                            className={classes.tableSortLabel}
                            style={style}
                          >
                            {column.render('Header')}
                          </TableSortLabel>
                        </Tooltip>
                      ) : (
                        <TableLabel style={style} tableStyleOptions={tableStyleOptions}>
                          {column.render('Header')}
                        </TableLabel>
                      )}
                      {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                      {column.canResize && <ResizeHandle column={column} tableStyleOptions={tableStyleOptions} />}
                    </TableHeadCell>
                  )
                })}
              </TableHeadRow>
            )
          })}
        </TableHead>
        <TableBody {...tableBodyProps} tableStyleOptions={tableStyleOptions}>
          {page.map((row) => {
            prepareRow(row)
            const { key: rowKey, role: _rowRole, ...getRowProps } = row.getRowProps()
            return (
              <TableRow
                key={rowKey}
                {...getRowProps}
                className={cx({ rowSelected: row.isSelected, clickable: !!onClick })}
                tableStyleOptions={tableStyleOptions}
              >
                {row.cells.map((cell) => {
                  const { key: cellKey, role: _cellRole, ...getCellProps } = cell.getCellProps(cellProps)
                  return (
                    <TableCell
                      key={cellKey}
                      {...getCellProps}
                      onClick={cellClickHandler(cell)}
                      tableStyleOptions={tableStyleOptions}
                    >
                      {cell.isGrouped ? (
                        <>
                          <TableSortLabel
                            classes={{
                              iconDirectionAsc: classes.iconDirectionAsc,
                              iconDirectionDesc: classes.iconDirectionDesc,
                            }}
                            active
                            direction={row.isExpanded ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowUp}
                            {...row.getToggleRowExpandedProps()}
                            className={classes.cellIcon}
                          />
                          {cell.render('Cell', { editable: false })} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </TableTable>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <TableDebugButton enabled={isDev} instance={instance} />
        <div />
        <TablePagination<T> instance={instance} />
      </div>
      <TableDebug enabled={isDev} instance={instance} />
    </>
  )
}

// Table.whyDidYouRender = true
