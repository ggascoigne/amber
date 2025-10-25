import type { ReactElement } from 'react'
import { useMemo } from 'react'

import type { Theme } from '@mui/material'
import { styled, generateUtilityClasses } from '@mui/material'
import Box from '@mui/material/Box'
import type { TableRowProps } from '@mui/material/TableRow'
import MuiTableRow from '@mui/material/TableRow'
import type { Header, RowData } from '@tanstack/react-table'
import clsx from 'clsx'

import type { CN } from './TableStyles'
import { rowShared } from './TableStyles'

export const tableDecorationZIndex = (theme: Theme) => theme.zIndex.fab - 1

const TABLE_PREFIX = 'DataTable'

export const tableClasses = generateUtilityClasses(TABLE_PREFIX, [
  'resizeHandle',
  'resizeHandleActive',
  'resizeHandleLast',
])

const ResizeHandleRoot = styled(Box, {
  name: TABLE_PREFIX,
  slot: 'resizeHandle',
})(({ theme }) => ({
  position: 'absolute',
  cursor: 'col-resize',
  zIndex: 100,
  opacity: 0,
  borderLeft: `1px solid ${theme.palette.primary.light}`,
  borderRight: `1px solid ${theme.palette.primary.light}`,
  height: '50%',
  top: '25%',
  transition: 'all linear 100ms',
  right: '-1px',
  width: '3px',
  [`&.${tableClasses.resizeHandleActive}`]: {
    opacity: 1,
    border: 'none',
    backgroundColor: theme.palette.primary.light,
    height: 'calc(100% - 4px)',
    top: '2px',
    right: '-1px',
    width: '1px',
  },
  [`&.${tableClasses.resizeHandleLast}`]: {
    right: '1px',
  },
}))

export const TableHeadRow = ({ children, sx, ...rest }: Partial<TableRowProps> & CN) => {
  const componentSx = useMemo(
    () => [
      rowShared,
      {
        [`&:hover .${tableClasses.resizeHandle}`]: {
          opacity: 1,
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )

  return (
    <MuiTableRow data-testid='TableHeadRow' component='div' role='row' sx={componentSx} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const ResizeHandle = <T extends RowData>({
  header,
  isLast = false,
}: {
  header: Header<T, unknown>
  isLast?: boolean
}): ReactElement => {
  const className = clsx({
    [tableClasses.resizeHandle]: true,
    [tableClasses.resizeHandleActive]: header.column.getIsResizing(),
    [tableClasses.resizeHandleLast]: isLast,
  })
  return (
    <ResizeHandleRoot
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={className}
    />
  )
}
