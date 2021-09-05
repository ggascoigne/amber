import { Checkbox, Theme, createStyles, makeStyles, styled } from '@material-ui/core'
import MuiTableTable from '@material-ui/core/Table'
import { TableTypeMap } from '@material-ui/core/Table/Table'
import MuiTableBody from '@material-ui/core/TableBody'
import { TableBodyTypeMap } from '@material-ui/core/TableBody/TableBody'
import MuiTableCell from '@material-ui/core/TableCell'
import { TableCellProps } from '@material-ui/core/TableCell/TableCell'
import MuiTableHead from '@material-ui/core/TableHead'
import { TableHeadTypeMap } from '@material-ui/core/TableHead/TableHead'
import MuiTableRow from '@material-ui/core/TableRow'
import { TableRowTypeMap } from '@material-ui/core/TableRow/TableRow'
import clsx from 'clsx'
import React, { CSSProperties } from 'react'

export interface TableStyleOptions {
  selectionStyle: 'row' | 'cell'
}

export const useStyles = makeStyles<Theme, TableStyleOptions>((theme: Theme) =>
  createStyles({
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
      '&:hover $resizeHandle': {
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
    tableRow: ({ selectionStyle }) => ({
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
    }),
    tableLabel: {},
    tableCell: ({ selectionStyle }) => ({
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
    }),
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
  })
)

interface CN {
  className?: string
  style?: CSSProperties
  tableStyleOptions: TableStyleOptions
}

export const TableTable: React.FC<Partial<TableTypeMap> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableTable className={clsx(className, classes.tableTable)} {...rest}>
      {children}
    </MuiTableTable>
  )
}

export const TableBody: React.FC<Partial<TableBodyTypeMap> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableBody className={clsx(className, classes.tableBody)} {...rest}>
      {children}
    </MuiTableBody>
  )
}

export const TableHead: React.FC<Partial<TableHeadTypeMap> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableHead className={clsx(className, classes.tableHead)} {...rest}>
      {children}
    </MuiTableHead>
  )
}

export const TableHeadRow: React.FC<Partial<TableRowTypeMap> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableRow className={clsx(className, classes.tableHeadRow)} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableHeadCell: React.FC<Partial<TableCellProps> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableCell className={clsx(className, classes.tableHeadCell)} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableRow: React.FC<Partial<TableRowTypeMap> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableRow className={clsx(className, classes.tableRow)} {...rest}>
      {children}
    </MuiTableRow>
  )
}

export const TableCell: React.FC<Partial<TableCellProps> & CN> = ({
  children,
  className,
  tableStyleOptions,
  ...rest
}) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <MuiTableCell className={clsx(className, classes.tableCell)} {...rest}>
      {children}
    </MuiTableCell>
  )
}

export const TableLabel: React.FC<CN> = ({ children, className, tableStyleOptions, ...rest }) => {
  const classes = useStyles(tableStyleOptions)
  return (
    <div className={clsx(className, classes.tableLabel)} {...rest}>
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
  areEqual
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
  areEqual
)
