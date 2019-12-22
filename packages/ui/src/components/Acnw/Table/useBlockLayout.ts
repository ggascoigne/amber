import { Cell, HeaderGroup, Hooks, TableInstance } from 'react-table'

const cellStyles = {
  display: 'inline-block',
  boxSizing: 'border-box'
}

const getRowStyles = (props: any, { instance }: { instance: TableInstance }) => [
  props,
  {
    style: {
      display: 'flex',
      width: `${instance.totalColumnsWidth}px`
    }
  }
]

export const useBlockLayout = (hooks: Hooks) => {
  hooks.getRowProps.push(getRowStyles)
  hooks.getHeaderGroupProps.push(getRowStyles)

  hooks.getHeaderProps.push((props: object, { column }: { column: HeaderGroup }) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${column.totalWidth}px`
      }
    }
  ])

  hooks.getCellProps.push((props: object, { cell }: { cell: Cell }) => [
    props,
    {
      style: {
        ...cellStyles,
        width: `${cell.column.totalWidth}px`
      }
    }
  ])
}

useBlockLayout.pluginName = 'useBlockLayout'
