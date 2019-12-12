// copied from the example in https://github.com/tannerlinsley/react-table/issues/1428
// the version in the library is deprecated and about to be deleted.

import { useCallback } from 'react'
import { ColumnInstance, Hooks, TableInstance } from 'react-table'

function sum(arr: any[]) {
  return arr.reduce((prev, curr) => prev + curr, 0)
}

function getFirstDefined(...args: any[]) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i]
    }
  }
  return undefined
}

type ColInfo = {
  flex: any
  width?: number
  minWidth?: number
  maxWidth?: number
}

function getSizesForColumn<D extends object>(
  { columns: columnsInput, id, width, minWidth, maxWidth }: ColumnInstance<D>,
  defaultFlex: number
): ColInfo {
  let columnInfo: ColInfo[]
  if (columnsInput) {
    columnInfo = columnsInput
      .filter(col => col.show || col.isVisible)
      .map(column => getSizesForColumn(column, defaultFlex))
      .filter(c => c) as ColInfo[]

    if (!columnInfo || !columnInfo.length) {
      return {
        flex: width ? 0 : defaultFlex,
        width: width === 'auto' ? defaultFlex : getFirstDefined(width, minWidth, defaultFlex),
        minWidth,
        maxWidth
      }
    }

    const flex = sum(columnInfo.map(col => col.flex))
    width = sum(columnInfo.map(col => col.width))
    maxWidth = sum(columnInfo.map(col => col.maxWidth))
    minWidth = sum(columnInfo.map(col => col.minWidth))

    return {
      flex,
      width: width as number,
      minWidth,
      maxWidth
    }
  }

  return {
    flex: width ? 0 : defaultFlex,
    width: width === 'auto' ? defaultFlex : getFirstDefined(width, minWidth, defaultFlex),
    minWidth,
    maxWidth
  }
}

function getStylesForColumn<D extends object>(column: ColumnInstance<D>, defaultFlex: number) {
  const { flex, width, maxWidth } = getSizesForColumn(column, defaultFlex)

  const styles: any = {
    flex: `${flex} 0 auto`,
    width: `${width}px`
  }
  if (maxWidth) {
    styles['maxWidth'] = `${maxWidth}px`
  }

  if (column.align && column.align === 'right') {
    styles['justifyContent'] = 'flex-end'
    styles['display'] = 'flex'
  }
  return styles
}

function useInstance<D extends object>(instance: TableInstance<D>): void {
  const {
    columns,
    hooks: { getRowProps, getHeaderGroupProps, getHeaderProps, getCellProps }
  } = instance

  const defaultFlex = 1

  const visibleColumns = columns.filter(column => column.isVisible)

  let sumWidth = 0
  visibleColumns.forEach(column => {
    const { width, minWidth } = getSizesForColumn(column, defaultFlex)
    if (width) {
      sumWidth += width
    } else if (minWidth) {
      sumWidth += minWidth
    } else {
      sumWidth += defaultFlex
    }
  })

  const rowStyles = useCallback(
    (props: any) => [
      props,
      {
        style: {
          display: 'flex',
          minWidth: `${sumWidth}px`
        }
      }
    ],
    [sumWidth]
  )

  getRowProps.push(rowStyles)
  getHeaderGroupProps.push(rowStyles)

  getHeaderProps.push((props, instance, column) => [
    props,
    {
      style: {
        boxSizing: 'border-box',
        ...getStylesForColumn(column, defaultFlex)
      }
    }
  ])

  getCellProps.push((props, instance, cell) => [
    props,
    {
      style: {
        ...getStylesForColumn(cell.column, defaultFlex)
      }
    }
  ])
}

export function useFlexLayout<D extends object>(hooks: Hooks<D>): void {
  hooks.useInstance.push(useInstance)
}

useFlexLayout.pluginName = 'useFlexLayout'
