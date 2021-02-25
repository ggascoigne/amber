import { TableSortLabel, TextField } from '@material-ui/core'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import cx from 'classnames'
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from 'react'
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
import { camelToWords, isDev, notEmpty, useDebounce } from 'utils'

import { FilterChipBar } from './FilterChipBar'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { ResizeHandle } from './ResizeHandle'
import { TableDebug } from './TableDebug'
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
  TableTable,
  useStyles,
} from './TableStyles'
import { Command, TableToolbar } from './TableToolbar'
import { TooltipCell } from './TooltipCell'
import { useInitialTableState } from './useInitialTableState'

// import { useFlexLayout } from './useFlexLayout'

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

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

// yes this is recursive, but the depth never exceeds three so it seems safe enough
const findFirstColumn = <T extends Record<string, unknown>>(columns: Array<ColumnInstance<T>>): ColumnInstance<T> =>
  columns[0].columns ? findFirstColumn(columns[0].columns) : columns[0]

function DefaultColumnFilter<T extends Record<string, unknown>>({ columns, column, gotoPage }: FilterProps<T>) {
  const { id, filterValue, setFilter, render } = column
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
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
        const value = e.target.value || undefined
        setFilter(value)
        if (value !== filterValue) gotoPage(0)
      }}
    />
  )
}

const getStyles = (props: any, disableResizing = false, align = 'left') => [
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
  hooks.allColumns.push((columns, { instance }) => [
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
    const selectionGroupHeader = headerGroups[0].headers[0]
    selectionGroupHeader.canResize = false
  })
}

const headerProps = <T extends Record<string, unknown>>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column.disableResizing, column.align)

const cellProps = <T extends Record<string, unknown>>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column.disableResizing, cell.column.align)

const DEFAULT_PAGE_SIZE = 25

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
  } = props
  const classes = useStyles()

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilter,
      numeric: numericTextFilter,
    }),
    []
  )

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

  const defaultColumn = React.useMemo<Partial<Column<T>>>(
    () => ({
      // disableFilter: true,
      // disableGroupBy: true,
      Filter: DefaultColumnFilter,
      Cell: TooltipCell,
      Header: DefaultHeader,
      aggregate: 'uniqueCount',
      Aggregated: ({ cell: { value } }: CellProps<T>) => `${value} Unique Values`,
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
      disableGlobalFilter: defaultColumnDisableGlobalFilter,
    }),
    [defaultColumnDisableGlobalFilter]
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
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      disableSortRemove: true,
    },
    ...hooks
  )

  const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    setInitialState(debouncedState)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && !cell.column.isGrouped && !cell.row.isGrouped && cell.column.id !== '_selector' && onClick(cell.row)
  }

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
      <TableTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            // there really is a key here, it's returned by getHeaderGroupProps
            // eslint-disable-next-line react/jsx-key
            <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const style = {
                  textAlign: column.align ? column.align : 'left ',
                } as CSSProperties
                return (
                  // there really is a key here, it's returned by getHeaderProps
                  // eslint-disable-next-line react/jsx-key
                  <TableHeadCell {...column.getHeaderProps(headerProps)}>
                    <div>
                      {column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        <TableSortLabel
                          active
                          direction={column.isGrouped ? 'desc' : 'asc'}
                          IconComponent={KeyboardArrowRight}
                          {...column.getGroupByToggleProps()}
                          className={classes.headerIcon}
                        />
                      ) : null}
                      {column.canSort ? (
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                          {...column.getSortByToggleProps()}
                          className={classes.tableSortLabel}
                          style={style}
                        >
                          {column.render('Header')}
                        </TableSortLabel>
                      ) : (
                        <TableLabel style={style}>{column.render('Header')}</TableLabel>
                      )}
                      {/*<div>{column.canFilter ? column.render('Filter') : null}</div>*/}
                    </div>
                    {column.canResize && <ResizeHandle column={column} />}
                  </TableHeadCell>
                )
              })}
            </TableHeadRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              // there really is a key here, it's returned by getRowProps
              // eslint-disable-next-line react/jsx-key
              <TableRow {...row.getRowProps()} className={cx({ rowSelected: row.isSelected, clickable: onClick })}>
                {row.cells.map((cell) => (
                  // there really is a key here, it's returned by getCellProps
                  // eslint-disable-next-line react/jsx-key
                  <TableCell {...cell.getCellProps(cellProps)} onClick={cellClickHandler(cell)}>
                    {cell.isGrouped ? (
                      // If it's a grouped cell, add an expander and row count
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
                        />{' '}
                        {cell.render('Cell', { editable: false })} ({row.subRows.length})
                      </>
                    ) : cell.isAggregated ? (
                      // If the cell is aggregated, use the Aggregated
                      // renderer for cell
                      cell.render('Aggregated')
                    ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                      // Otherwise, just render the regular cell
                      cell.render('Cell' /*, { editable: true }*/)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </TableTable>
      <TablePagination<T> instance={instance} />
      <TableDebug enabled={isDev} instance={instance} />
    </>
  )
}
