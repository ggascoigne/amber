import { TableSortLabel } from '@material-ui/core'
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect, useMemo } from 'react'
import {
  Cell,
  CellProps,
  Column,
  HeaderGroup,
  HeaderProps,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  useFilters,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table'

import { isDev } from '../../../utils/globals'
import { camelToWords } from '../../../utils/object'
import { useDebounce } from '../../../utils/useDebounce'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import { DumpInstance } from './DumpInstance'
import { FilterChipBar } from './FilterChipBar'
import { ResizeHandle } from './ResizeHandle'
import { TablePagination } from './TablePagination'
import {
  AcnwTable,
  HeaderCheckbox,
  RowCheckbox,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableLabel,
  TableRow
} from './TableStyles'
import { TableToolbar } from './TableToolbar'
import { TooltipCell } from './TooltipCell'
// import { useFlexLayout } from './useFlexLayout'

export interface Table<T extends object = {}> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
}

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => <>{camelToWords(column.id)}</>

const getStyles = <T extends object>(props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      flex: disableResizing ? undefined : props.style.flex,
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex'
    }
  }
]
const headerProps = <T extends object>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column?.disableResizing, column?.align)

const cellProps = <T extends object>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column?.disableResizing, cell.column?.align)

const selectionColumn = {
  id: '_selector',
  Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
    <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
  ),
  Cell: ({ row }: CellProps<any>) => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
  width: 59,
  disableResizing: true
}

export function Table<T extends object>(props: PropsWithChildren<Table<T>>): ReactElement {
  const { name, columns: originalColumns, onAdd, onDelete, onEdit, onClick } = props
  const columns = useMemo(() => [selectionColumn, ...originalColumns], [originalColumns])

  const hooks = [useFilters, useSortBy, useRowSelect, usePagination, useFlexLayout, useResizeColumns]

  const defaultColumn = React.useMemo<Partial<Column<T>>>(
    () => ({
      disableFilter: true,
      Filter: () => null,
      Cell: TooltipCell,
      Header: DefaultHeader,
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200 // maxWidth is only used as a limit for resizing
    }),
    []
  )

  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {})
  const instance = useTable<T>(
    {
      ...props,
      columns,
      defaultColumn,
      initialState
    },
    ...hooks
  )

  const { getTableProps, headerGroups, page, prepareRow, state } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && cell.column.id !== '_selector' && onClick(cell.row)
  }

  return (
    <>
      <TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit }} />
      <FilterChipBar<T> instance={instance} />
      <AcnwTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                const style = {
                  textAlign: column.align ? column.align : 'left '
                } as CSSProperties
                return (
                  <TableHeadCell {...column.getHeaderProps(headerProps)}>
                    {column.canSort ? (
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                        {...column.getSortByToggleProps()}
                        style={style}
                      >
                        {column.render('Header')}
                      </TableSortLabel>
                    ) : (
                      <TableLabel style={style}>{column.render('Header')}</TableLabel>
                    )}
                    {column.canResize && <ResizeHandle column={column} />}
                  </TableHeadCell>
                )
              })}
            </TableHeadRow>
          ))}
        </TableHead>
        <TableBody>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps(cellProps)} onClick={cellClickHandler(cell)}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </AcnwTable>
      <TablePagination<T> instance={instance} />
      <DumpInstance enabled={isDev} instance={instance} />
    </>
  )
}
