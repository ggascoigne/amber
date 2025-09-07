import React, { CSSProperties, PropsWithChildren } from 'react'

import { Box, Checkbox, SxProps, Theme } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiTableTable from '@mui/material/Table'
import { TableTypeMap } from '@mui/material/Table/Table'
import MuiTableBody from '@mui/material/TableBody'
import { TableBodyTypeMap } from '@mui/material/TableBody/TableBody'
import MuiTableCell from '@mui/material/TableCell'
import { TableCellProps } from '@mui/material/TableCell/TableCell'
import MuiTableHead from '@mui/material/TableHead'
import { TableHeadTypeMap } from '@mui/material/TableHead/TableHead'
import MuiTableRow from '@mui/material/TableRow'
import { TableRowTypeMap } from '@mui/material/TableRow/TableRow'
import {} from '@mui/system'

export interface TableStyleOptions {
  selectionStyle: 'row' | 'cell'
}

interface CN {
  className?: string
  style?: CSSProperties
  sx?: SxProps<Theme>
  tableStyleOptions: TableStyleOptions
}

export const TableTable: React.FC<Partial<PropsWithChildren<TableTypeMap>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => {
  const sxDefault: SxProps<Theme> = {
    borderSpacing: 0,
    border: '1px solid rgba(224, 224, 224, 1)',
    width: '100%',
  }
  return (
    <MuiTableTable className={className} sx={[sxDefault, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </MuiTableTable>
  )
}

export const TableBody: React.FC<Partial<PropsWithChildren<TableBodyTypeMap>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => (
  <MuiTableBody className={className} sx={sx} {...rest}>
    {children}
  </MuiTableBody>
)

export const TableHead: React.FC<Partial<PropsWithChildren<TableHeadTypeMap>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => (
  <MuiTableHead className={className} sx={sx} {...rest}>
    {children}
  </MuiTableHead>
)

export const TableHeadRow: React.FC<Partial<PropsWithChildren<TableRowTypeMap>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => {
  const sxDefault: SxProps<Theme> = (theme) => ({
    outline: 0,
    verticalAlign: 'middle',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '&:hover .resize-handle': {
      opacity: 1,
    },
  })
  return (
    <MuiTableRow className={className} sx={[sxDefault, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableHeadCell: React.FC<Partial<PropsWithChildren<TableCellProps>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => {
  const sxDefault: SxProps<Theme> = (theme) => ({
    padding: '16px 1px 16px 16px',
    fontSize: '0.875rem',
    textAlign: 'left',
    verticalAlign: 'inherit',
    color: theme.palette.text.primary,
    fontWeight: 500,
    lineHeight: '1.5rem',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none',
    },
  })
  return (
    <MuiTableCell className={className} sx={[sxDefault, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableRow: React.FC<Partial<PropsWithChildren<TableRowTypeMap>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => {
  const sxDefault: SxProps<Theme> = {
    color: 'inherit',
    outline: 0,
    verticalAlign: 'middle',
    '&:hover': {
      backgroundColor: tableStyleOptions.selectionStyle === 'row' ? 'rgba(0, 0, 0, 0.07)' : undefined,
    },
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&.rowSelected': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '&:hover': {
        backgroundColor: tableStyleOptions.selectionStyle === 'row' ? 'rgba(0, 0, 0, 0.07)' : undefined,
      },
    },
    '&.clickable': {
      cursor: 'pointer',
    },
  }
  return (
    <MuiTableRow className={className} sx={[sxDefault, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableCell: React.FC<Partial<PropsWithChildren<TableCellProps>> & CN> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => {
  const sxDefault: SxProps<Theme> = {
    padding: '8px 16px',
    fontSize: '0.875rem',
    textAlign: 'left',
    fontWeight: 300,
    lineHeight: 1.3,
    verticalAlign: 'inherit',
    color: (theme: Theme) => theme.palette.text.primary,
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none',
    },
    '&:hover': {
      backgroundColor: tableStyleOptions.selectionStyle === 'cell' ? 'rgba(0, 0, 0, 0.07)' : undefined,
    },
  }
  return (
    <MuiTableCell className={className} sx={[sxDefault, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableLabel: React.FC<PropsWithChildren<CN>> = ({
  children,
  className,
  sx,
  tableStyleOptions,
  ...rest
}) => (
  <Box className={className} sx={sx} {...rest}>
    {children}
  </Box>
)

const areEqual = (prevProps: any, nextProps: any) =>
  prevProps.checked === nextProps.checked && prevProps.indeterminate === nextProps.indeterminate

export const HeaderCheckbox = React.memo(
  styled(Checkbox)({
    fontSize: '1rem',
    margin: '-8px 0 -8px -15px',
    padding: '8px 9px',
    '& svg': {
      width: '24px',
      height: '24px',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  }),
  areEqual,
)

export const RowCheckbox = React.memo(
  styled(Checkbox)({
    fontSize: '14px',
    margin: '-9px 0 -8px -15px',
    padding: '5px 9px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& svg': {
      width: 24,
      height: 24,
    },
  }),
  areEqual,
)
