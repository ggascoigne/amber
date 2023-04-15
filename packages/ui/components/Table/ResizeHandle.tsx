import { ReactElement } from 'react'

import { ColumnInstance } from 'react-table'

import { TableStyleOptions, useStyles } from './TableStyles'

export const ResizeHandle = <T extends Record<string, unknown>>({
  column,
  tableStyleOptions,
}: {
  column: ColumnInstance<T>
  tableStyleOptions: TableStyleOptions
}): ReactElement => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <div
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }} // override the useResizeColumns default
      className={cx({
        [classes.resizeHandle]: true,
        handleActive: column.isResizing,
      })}
    />
  )
}
