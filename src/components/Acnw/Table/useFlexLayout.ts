import { Cell, HeaderGroup, Hooks, Meta } from 'react-table'

export function useFlexLayout<D extends Record<string, unknown>>(hooks: Hooks<D>) {
  hooks.getTableBodyProps.push(getTableBodyProps)
  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)
  hooks.getHeaderProps.push(getHeaderProps)
  hooks.getCellProps.push(getCellProps)
}

useFlexLayout.pluginName = 'useFlexLayout'

const getTableBodyProps = <D extends Record<string, unknown>>(props: any, { instance }: Meta<D>) => [
  props,
  {
    style: {
      minWidth: `${instance.totalColumnsWidth}px`,
    },
  },
]

const getRowStyles = <D extends Record<string, unknown>>(props: any, { instance }: Meta<D>) => [
  props,
  {
    style: {
      display: 'flex',
      flex: '1 0 auto',
      minWidth: `${instance.totalColumnsMinWidth}px`,
    },
  },
]

const getHeaderProps = <D extends Record<string, unknown>>(
  props: any,
  { column }: Meta<D, { column: HeaderGroup<D> }>
) => [
  props,
  {
    style: {
      boxSizing: 'border-box',
      flex: `${column.totalWidth} 0 auto`,
      minWidth: `${column.totalMinWidth}px`,
      width: `${column.totalWidth}px`,
    },
  },
]

const getCellProps = <D extends Record<string, unknown>>(props: any, { cell }: Meta<D, { cell: Cell<D> }>) => [
  props,
  {
    style: {
      boxSizing: 'border-box',
      flex: `${cell.column.totalWidth} 0 auto`,
      minWidth: `${cell.column.totalMinWidth}px`,
      width: `${cell.column.totalWidth}px`,
    },
  },
]
