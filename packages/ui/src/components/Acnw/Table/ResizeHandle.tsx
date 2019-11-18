import cx from 'classnames'
import React from 'react'
import { ColumnInstance } from 'react-table'

import { useStyles } from './TableStyles'

export const ResizeHandle = <T extends {}>({ column }: { column: ColumnInstance<T> }) => {
  const classes = useStyles()
  return (
    <div
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }} // override the useResizeColumns default
      className={cx({
        [classes.resizeHandle]: true,
        [classes.resizeHandleActive]: column.isResizing
      })}
    >
      <div
        className={cx({
          [classes.resizeHandleLine]: true,
          [classes.resizeHandleFirstLine]: true,
          [classes.resizeHandleLineActive]: column.isResizing
        })}
      />
      <div
        className={cx({
          [classes.resizeHandleLine]: true,
          [classes.resizeHandleSecondLine]: true,
          [classes.resizeHandleLineActive]: column.isResizing
        })}
      />
    </div>
  )
}
