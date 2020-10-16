import { Checkbox, Theme, createStyles, makeStyles, styled } from '@material-ui/core'
import cx from 'classnames'
import React from 'react'

// note that this isn't actually a hook, it just generally follows that naming convention.
// because we want to use it outside of a component, we're just calling it as a function and
// avoiding the hook eslint validation by not calling it useStyles
const getClasses = makeStyles((theme: Theme) =>
  createStyles({
    tableTable: {
      borderSpacing: 0,
      border: '1px solid rgba(224, 224, 224, 1)',
    },
    tableHead: {},
    tableHeadRow: {
      outline: 0,
      verticalAlign: 'middle',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      position: 'relative',
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
    tableBody: {
      display: 'flex',
      flex: '1 1 auto',
      width: '100%',
      flexDirection: 'column',
    },
    tableRow: {
      color: 'inherit',
      outline: 0,
      verticalAlign: 'middle',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
      },
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderBottom: 'none',
      },
      '&.rowSelected': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
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
      lineHeight: 1.43,
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none',
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
  })
)

export const useStyles = getClasses

type StyleKeyType = keyof ReturnType<typeof getClasses>
type StyledDiv<P = unknown> = React.FC<JSX.IntrinsicElements['div'] & P>

//  The material UI styled method doesn't allow for using the theme
const styledDiv: StyledDiv<{ styledDivClassname: StyleKeyType }> = ({
  children,
  className,
  styledDivClassname,
  ...rest
}) => {
  const classes = getClasses()
  return (
    <div className={cx(className, classes[styledDivClassname])} {...rest}>
      {children}
    </div>
  )
}

export const TableTable: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableTable', ...props })
export const TableBody: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableBody', ...props })
export const TableHead: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableHead', ...props })
export const TableHeadRow: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableHeadRow', ...props })
export const TableHeadCell: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableHeadCell', ...props })
export const TableRow: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableRow', ...props })
export const TableCell: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableCell', ...props })
export const TableLabel: StyledDiv = (props) => styledDiv({ styledDivClassname: 'tableLabel', ...props })

export const HeaderCheckbox = styled(Checkbox)({
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
})

export const RowCheckbox = styled(Checkbox)({
  fontSize: '14px',
  margin: '-9px 0 -8px -15px',
  padding: '8px 9px 9px 9px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '& svg': {
    width: 24,
    height: 24,
  },
})
