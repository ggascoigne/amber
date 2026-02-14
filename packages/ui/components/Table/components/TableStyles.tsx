import type { CSSProperties, ReactNode, ForwardedRef } from 'react'
import { useRef, useState, memo, useMemo } from 'react'

import type { Theme } from '@mui/material'
import { Checkbox, styled } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import type { SxProps } from '@mui/material/styles'
import { alpha, lighten, darken } from '@mui/material/styles'
import type { TableProps } from '@mui/material/Table'
import MuiTableTable from '@mui/material/Table'
import type { TableBodyProps } from '@mui/material/TableBody'
import MuiTableBody from '@mui/material/TableBody'
import type { TableCellProps } from '@mui/material/TableCell'
import MuiTableCell from '@mui/material/TableCell'
import type { TableContainerProps } from '@mui/material/TableContainer'
import type { TableHeadProps } from '@mui/material/TableHead'
import MuiTableHead from '@mui/material/TableHead'
import type { TableRowProps } from '@mui/material/TableRow'
import MuiTableRow from '@mui/material/TableRow'
import useResizeObserver from '@react-hook/resize-observer'
import clsx from 'clsx'

import { fixedForwardRef } from '../../../utils'

export const tableDecorationZIndex = (theme: Theme) => theme.zIndex.fab - 1

export type CN = {
  className?: string
  style?: CSSProperties
  children?: ReactNode
  sx?: SxProps<Theme>
}

export const TableContainer = ({ children, sx, ...rest }: Partial<TableContainerProps> & CN) => {
  const componentSx = useMemo(
    () => [
      {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )
  return (
    <Paper data-testid='TableContainerSortOf' sx={componentSx} {...rest}>
      {children}
    </Paper>
  )
}

export const TableTable = ({ children, sx, ...rest }: Partial<TableProps> & CN) => {
  const componentSx = useMemo(
    () => [
      {
        borderSpacing: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )
  return (
    <MuiTableTable data-testid='TableTable' component='div' role='table' sx={componentSx} {...rest}>
      {children}
    </MuiTableTable>
  )
}

export const TableBody = ({ children, sx, ...rest }: Partial<TableBodyProps> & CN) => {
  const componentSx = useMemo(
    () => [
      {
        width: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )
  return (
    <MuiTableBody data-testid='TableBody' component='div' role='rowgroup' sx={componentSx} {...rest}>
      {children}
    </MuiTableBody>
  )
}

export const TableHead = ({ children, sx, ...rest }: Partial<TableHeadProps> & CN) => {
  const componentSx = useMemo(
    () => [
      {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        zIndex: tableDecorationZIndex,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )
  return (
    <MuiTableHead data-testid='TableHead' component='div' role='rowgroup' sx={componentSx} {...rest}>
      {children}
    </MuiTableHead>
  )
}

export const rowShared = {
  outline: 0,
  verticalAlign: 'middle',
  flexDirection: 'row',
  display: 'flex',
  width: '100%',
  minWidth: 'fit-content',
  position: 'relative',
  // borderBottomWidth: '1px',
  // borderBottomStyle: 'solid',
  // borderBottomColor: 'divider',
}

const getActionButtonSx =
  (pageElevation: number | undefined) =>
  // Define CSS variables at the root of the style object
  (theme: Theme) => ({
    // CSS variable definitions
    '--action-btn-bg': theme.palette.background.paper,
    '--action-btn-hover': theme.palette.action.hover,
    '--action-btn-selected': lighten(alpha(theme.palette.primary.main, 1), 0.8),
    '--action-btn-hover-selected': lighten(alpha(theme.palette.primary.main, 1), 0.75),
    ...theme.applyStyles('dark', {
      '--action-btn-selected': darken(alpha(theme.palette.primary.main, 1), 0.68),
      '--action-btn-hover-selected': darken(alpha(theme.palette.primary.main, 1), 0.64),
      '--action-btn-bg-img':
        pageElevation === 0
          ? 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))'
          : 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    }),
    '.actionButtonContent': {
      backgroundColor: 'var(--action-btn-bg)',
      backgroundImage: 'var(--action-btn-bg-img)',
      '::before': {
        backgroundColor: 'var(--action-btn-bg)',
        mixBlendMode: 'multiply',
      },
    },
    '&.clickable': {
      cursor: 'pointer',
      '&:hover, &:focus': {
        backgroundColor: 'var(--action-btn-hover)',
        '.actionButtonContent': {
          backgroundColor: 'var(--action-btn-hover)',
        },
      },
    },
    '&.rowHighlighted': {
      backgroundColor: 'var(--action-btn-selected)',
      '.actionButtonContent': {
        backgroundColor: 'var(--action-btn-selected)',
        backgroundImage: 'none',
      },
      '&:hover': {
        backgroundColor: 'var(--action-btn-hover-selected)',
        '.actionButtonContent': {
          backgroundColor: 'var(--action-btn-hover-selected)',
        },
      },
      '&:not(:hover) .actionButton.visible': {
        '.actionButtonContent': {
          backgroundColor: 'var(--action-btn-selected)',
          '::before': {
            backgroundColor: 'var(--action-btn-selected)',
          },
        },
      },
    },
    '&:hover .actionButton, .actionButton.visible': {
      opacity: 1,
      transition: 'opacity .2s',
    },
  })

export const TableRow = fixedForwardRef(
  (
    { children, sx, pageElevation, ...rest }: Partial<TableRowProps> & CN & { pageElevation?: number; offset?: number },
    ref: ForwardedRef<any>,
  ) => {
    const componentSx = useMemo(
      () => [rowShared, getActionButtonSx(pageElevation), ...(Array.isArray(sx) ? sx : [sx])],
      [pageElevation, sx],
    )

    return (
      <MuiTableRow data-testid='TableRow' component='div' role='row' ref={ref} sx={componentSx} {...rest}>
        {children}
      </MuiTableRow>
    )
  },
)

const TableRowHoverAreaSx = {
  actionButton: {
    position: 'sticky',
    right: 0,
    left: 0,
    // we toggle opacity rather than display since display none isn't a valid popup target
    // and causes all sorts of issues with tooltips and menus.  Opacity 0, leaves the dom
    // element alone and avoids this issue.
    opacity: 0,
  },
  actionButtonContent: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '100%',
    pr: 1,
    pointerEvents: 'all',
  },
}

export const TableRowHoverArea = ({ children, visible }: { children?: ReactNode; visible: boolean }) => {
  const [contentSize, setContentSize] = useState({ height: 0, width: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  const sx = useMemo(
    () => ({
      actionButtonWrapper: {
        position: 'absolute',
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: '400px',
        height: 'calc(100% - 1px)', // don't overwrite the bottom boarder
        pointerEvents: 'none',
        '.actionButtonContent::before': {
          // note that everything to do with color is handled in the css for the row
          // size and position is here since it requires ref access
          content: '""',
          position: 'absolute',
          right: 0,
          pr: 1,
          width: `${contentSize.width}px`,
          height: `${contentSize.height}px`,
          zIndex: -1,
        },
      },
    }),
    [contentSize.height, contentSize.width],
  )

  useResizeObserver(contentRef, () => {
    const element = contentRef.current
    if (element) {
      setContentSize({
        height: element.clientHeight ?? 0,
        width: element.clientWidth ?? 0,
      })
    }
  })

  // I want a zero width anchor to be sticky so that it's always on screen,
  // but I need the actual button bar to take real space, so use the outer
  // component as the anchor for the absolutely positioned full width child,
  // which effectively floats
  return (
    <Box
      className={clsx('actionButton', { visible })}
      // note that this is a span so that it isn't affected by the last-of-type css rule
      // that matches the real cells.
      component='span'
      sx={TableRowHoverAreaSx.actionButton}
    >
      <Box sx={sx.actionButtonWrapper}>
        <Box
          ref={contentRef}
          className='actionButtonContent'
          sx={TableRowHoverAreaSx.actionButtonContent}
          role='toolbar'
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

const cellShared = {
  fontSize: 'var(--amber-table-font-size, 0.875rem)',
  textAlign: 'left',
  verticalAlign: 'inherit',
  lineHeight: 1.3,
  '&:last-of-type': {
    borderRight: 'none',
  },
  // borderBottom: 'none',
  minWidth: 0,
  color: 'text.primary',

  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'divider',
  borderRightWidth: '1px',
  borderRightStyle: 'solid',
  borderRightColor: 'divider',
}

export const TableHeadCell = ({ children, sx, ...rest }: Partial<TableCellProps> & CN) => {
  const componentSx = useMemo(
    () => [
      cellShared,
      {
        position: 'relative',
        color: 'text.secondary',
        backgroundColor: 'background.paper',
        px: 2,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )
  return (
    <MuiTableCell data-testid='TableHeadCell' component='div' role='columnheader' sx={componentSx} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableCell = ({ children, sx, ...rest }: Partial<TableCellProps> & CN) => {
  const componentSx = useMemo(() => [cellShared, ...(Array.isArray(sx) ? sx : [sx])], [sx])
  return (
    <MuiTableCell data-testid='TableCell' component='div' role='cell' sx={componentSx} {...rest}>
      {children}
    </MuiTableCell>
  )
}

const areCheckboxesEqual = (prevProps: any, nextProps: any) =>
  prevProps.checked === nextProps.checked && prevProps.indeterminate === nextProps.indeterminate

const RowCheckboxImpl = styled(Checkbox)(({ theme }) => ({
  fontSize: '14px',
  margin: theme.spacing(-1.25, 0, -1, -2),
  padding: '4px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '& svg': {
    width: 24,
    height: 24,
  },
  '& span': {
    zIndex: 2,
  },
}))

export const RowCheckbox = memo(
  (props) => (
    <Box
      sx={{
        pl: 2,
      }}
    >
      <RowCheckboxImpl {...props} />
    </Box>
  ),
  areCheckboxesEqual,
)
