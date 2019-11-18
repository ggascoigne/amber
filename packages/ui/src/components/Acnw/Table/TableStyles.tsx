import { Checkbox, Theme, createStyles, makeStyles, styled } from '@material-ui/core'
import cx from 'classnames'
import React from 'react'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeadRow: {
      outline: 0,
      verticalAlign: 'middle',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      position: 'relative'
    },
    tableHeadCell: {
      padding: '16px 1px 16px 16px',
      fontSize: '0.875rem',
      textAlign: 'left',
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      letterSpacing: '0.01071em',
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      '&:hover $resizeHandleLine': {
        opacity: 1
      },
      // '&:nth-last-child(2) $resizeHandle': {
      //   width: theme.spacing(1),
      //   right: '1px'
      // },
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 3,
        marginLeft: 0
      }
    },
    resizeHandle: {
      position: 'absolute',
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      width: theme.spacing(1),
      top: 0,
      right: -theme.spacing(0.5),
      height: '100%',
      cursor: 'col-resize',
      zIndex: 100
    },
    resizeHandleLine: {
      opacity: 0,
      position: 'absolute',
      backgroundColor: theme.palette.primary.light,
      height: '50%',
      width: '1px',
      top: '25%',
      transition: 'all linear 100ms'
    },
    resizeHandleFirstLine: {
      left: `${theme.spacing(0.5) - 1}px`
    },
    resizeHandleSecondLine: {
      left: `${theme.spacing(0.5) + 1}px`
    },
    resizeHandleLineActive: {
      left: theme.spacing(0.5)
    },
    resizeHandleActive: {
      '& $resizeHandleLine': {
        opacity: '1',
        backgroundColor: theme.palette.primary.light,
        height: 'calc(100% - 4px)',
        top: '2px'
      }
    },
    tableCell: {
      // display: 'table-cell',
      padding: 16,
      fontSize: '0.875rem',
      textAlign: 'left',
      fontWeight: 300,
      lineHeight: 1.43,
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      letterSpacing: '0.01071em',
      verticalAlign: 'inherit',
      color: theme.palette.text.primary
    }
  })
)

export const AcnwTable = styled('div')({
  // width: '100%',
  // display: 'table',
  borderSpacing: 0,
  borderCollapse: 'collapse'
})

export const TableBody = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  width: '100%',
  flexDirection: 'column'
})

export const TableHead = styled('div')({
  // display: 'flex',
  // flex: '1 1 auto',
  // width: '100%'
})

export const TableHeadRow = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableHeadRow)} {...rest}>
      {children}
    </div>
  )
}

export const TableHeadCell = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableHeadCell)} {...rest}>
      {children}
    </div>
  )
}

export const TableRow = styled('div')({
  color: 'inherit',
  // display: 'table-row',
  outline: 0,
  verticalAlign: 'middle',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.07)'
  }
})

export const TableCell = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableCell)} {...rest}>
      {children}
    </div>
  )
}

export const TableLabel = styled('div')({
  // cursor: 'default',
  // display: 'inline-flex',
  // alignItems: 'center',
  // flexDirection: 'inherit',
  // justifyContent: 'flex-start',
  // verticalAlign: 'sub'
})

export const HeaderCheckbox = styled(Checkbox)({
  fontSize: '1rem',
  margin: '-8px 0',
  padding: '8px 9px',
  '& svg': {
    width: '24px',
    height: '24px'
  },
  '&:hover': {
    backgroundColor: 'transparent'
  }
})

export const RowCheckbox = styled(Checkbox)({
  fontSize: '14px',
  margin: '-9px 0 -8px 0',
  padding: '8px 9px 9px 9px',
  '&:hover': {
    backgroundColor: 'transparent'
  }
})
