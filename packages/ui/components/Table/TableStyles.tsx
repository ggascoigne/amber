import React, { CSSProperties, PropsWithChildren } from 'react'

import { Checkbox, Theme } from '@mui/material'
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
import { makeStyles } from 'tss-react/mui'

export interface TableStyleOptions {
  selectionStyle: 'row' | 'cell'
}

export const useStyles = makeStyles<TableStyleOptions, 'resizeHandle'>()(
  (theme: Theme, { selectionStyle }, classes) => ({
    tableTable: {
      borderSpacing: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
      width: '100%',
    },
    tableHead: {},
    tableHeadRow: {
      outline: 0,
      verticalAlign: 'middle',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      [`&:hover .${classes.resizeHandle}`]: {
        opacity: 1,
      },
    },
    tableHeadCell: {
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
    },
    tableBody: {},
    tableRow: {
      color: 'inherit',
      outline: 0,
      verticalAlign: 'middle',
      '&:hover': {
        backgroundColor: selectionStyle === 'row' ? 'rgba(0, 0, 0, 0.07)' : undefined,
      },
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderBottom: 'none',
      },
      '&.rowSelected': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: selectionStyle === 'row' ? 'rgba(0, 0, 0, 0.07)' : undefined,
        },
      },
      '&.clickable': {
        cursor: 'pointer',
      },
    },
    tableLabel: {},
    tableCell: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      textAlign: 'left',
      fontWeight: 300,
      lineHeight: 1.3,
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none',
      },
      '&:hover': {
        backgroundColor: selectionStyle === 'cell' ? 'rgba(0, 0, 0, 0.07)' : undefined,
      },
    },
    resizeHandle: {
      position: 'absolute',
      cursor: 'col-resize',
      zIndex: 100,
      opacity: 0,
      borderLeft: `1px solid ${theme.palette.primary.light}`,
      borderRight: `1px solid ${theme.palette.primary.light}`,
      height: '50%',
      top: '25%',
      transition: 'all linear 100ms',
      right: -2,
      width: 3,
      '&.handleActive': {
        opacity: 1,
        border: 'none',
        backgroundColor: theme.palette.primary.light,
        height: 'calc(100% - 4px)',
        top: '2px',
        right: -1,
        width: 1,
      },
    },
    tableSortLabel: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 0,
        marginLeft: 2,
      },
    },
    headerIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 4,
        marginRight: 0,
      },
    },
    iconDirectionAsc: {
      transform: 'rotate(90deg)',
    },
    iconDirectionDesc: {
      transform: 'rotate(180deg)',
    },
    cellIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 3,
      },
    },
  }),
)

interface CN {
  className?: string
  style?: CSSProperties
  tableStyleOptions: TableStyleOptions
}

export const TableTable: React.FC<Partial<PropsWithChildren<TableTypeMap>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableTable className={cx(className, classes.tableTable)} {...rest}>
      {children}
    </MuiTableTable>
  )
}

export const TableBody: React.FC<Partial<PropsWithChildren<TableBodyTypeMap>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableBody className={cx(className, classes.tableBody)} {...rest}>
      {children}
    </MuiTableBody>
  )
}

export const TableHead: React.FC<Partial<PropsWithChildren<TableHeadTypeMap>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableHead className={cx(className, classes.tableHead)} {...rest}>
      {children}
    </MuiTableHead>
  )
}

export const TableHeadRow: React.FC<Partial<PropsWithChildren<TableRowTypeMap>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableRow className={cx(className, classes.tableHeadRow)} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableHeadCell: React.FC<Partial<PropsWithChildren<TableCellProps>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableCell className={cx(className, classes.tableHeadCell)} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableRow: React.FC<Partial<PropsWithChildren<TableRowTypeMap>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableRow className={cx(className, classes.tableRow)} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableCell: React.FC<Partial<PropsWithChildren<TableCellProps>> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <MuiTableCell className={cx(className, classes.tableCell)} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableLabel: React.FC<PropsWithChildren<CN>> = ({ children, className, tableStyleOptions, ...rest }) => {
  const { classes, cx } = useStyles(tableStyleOptions)
  return (
    <div className={cx(className, classes.tableLabel)} {...rest}>
      {children}
    </div>
  )
}

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
