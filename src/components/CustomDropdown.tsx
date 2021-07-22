import {
  Button,
  ClickAwayListener,
  Divider,
  Grow,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popperClose: {
      pointerEvents: 'none',
    },
    dropdown: {
      borderRadius: '3px',
      border: '0',
      boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
      top: '100%',
      zIndex: 1000,
      minWidth: '160px',
      padding: '5px 0',
      margin: '2px 0 0',
      fontSize: '14px',
      textAlign: 'left',
      listStyle: 'none',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
    },
    menuList: {
      padding: '0',
    },
    popperResponsive: {
      zIndex: 1200,
      [theme.breakpoints.down('sm')]: {
        zIndex: '1640',
        position: 'static',
        float: 'none',
        width: 'auto',
        marginTop: '0',
        backgroundColor: 'transparent',
        border: '0',
        boxShadow: 'none',
        color: 'black',
      },
    },
    dropdownItem: {
      fontSize: '13px',
      padding: '10px 20px',
      margin: '0 5px',
      borderRadius: '2px',
      position: 'relative',
      transition: 'all 150ms linear',
      display: 'block',
      clear: 'both',
      fontWeight: 400,
      height: 'fit-content',
      color: '#333',
      whiteSpace: 'nowrap',
      minHeight: 'unset',
    },
    blackHover: {
      '&:hover': {
        boxShadow: '0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(33, 33, 33, 0.4)',
        backgroundColor: '#212121',
        color: '#fff',
      },
    },
    primaryHover: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
        boxShadow: theme.mixins.boxShadow.warning,
      },
    },
    infoHover: {
      '&:hover': {
        backgroundColor: theme.palette.info.main,
        color: '#FFFFFF',
        boxShadow: theme.mixins.boxShadow.info,
      },
    },
    successHover: {
      '&:hover': {
        backgroundColor: theme.palette.success.main,
        color: '#FFFFFF',
        boxShadow: theme.mixins.boxShadow.success,
      },
    },
    warningHover: {
      '&:hover': {
        backgroundColor: theme.palette.warning.main,
        color: '#FFFFFF',
        boxShadow: theme.mixins.boxShadow.warning,
      },
    },
    errorHover: {
      '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: '#FFFFFF',
        boxShadow: theme.mixins.boxShadow.error,
      },
    },
    dropdownItemRTL: {
      textAlign: 'right',
    },
    dropdownDividerItem: {
      margin: '5px 0',
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
      height: '1px',
      overflow: 'hidden',
    },
    buttonIcon: {
      width: '20px',
      height: '20px',
    },
    caret: {
      transition: 'all 150ms ease-in',
      display: 'inline-block',
      width: '0',
      height: '0',
      marginLeft: '4px',
      verticalAlign: 'middle',
      borderTop: '4px solid',
      borderRight: '4px solid transparent',
      borderLeft: '4px solid transparent',
    },
    caretActive: {
      transform: 'rotate(180deg)',
    },
    caretRTL: {
      marginRight: '4px',
    },
    dropdownHeader: {
      display: 'block',
      padding: '0.1875rem 1.25rem',
      fontSize: '0.75rem',
      lineHeight: '1.428571',
      color: '#777',
      whiteSpace: 'nowrap',
      fontWeight: 'inherit',
      marginTop: '10px',
      minHeight: 'unset',
      '&:hover,&:focus': {
        backgroundColor: 'transparent',
        cursor: 'auto',
      },
    },
    noLiPadding: {
      padding: '0',
    },
  })
)

interface CustomDropdownProps {
  hoverColor?: 'black' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  buttonText: React.ReactNode
  buttonIcon?: React.ComponentType | string
  dropdownList: Array<any>
  buttonProps?: Record<string, string>
  dropup?: boolean
  dropdownHeader?: any
  rtlActive?: boolean
  caret?: boolean
  left?: boolean
  noLiPadding?: boolean
  onClick?: (name: string) => void
}

const getKeyValue =
  <T extends Record<string, unknown>>(obj: T) =>
  (key: keyof T) =>
    obj[key]

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  hoverColor = 'primary',
  buttonText,
  buttonIcon,
  dropdownList,
  buttonProps,
  dropup,
  dropdownHeader,
  rtlActive,
  caret,
  left,
  noLiPadding,
  onClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl?.contains(event.currentTarget)) {
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }
  const handleClose = (prop: string) => {
    setAnchorEl(null)
    onClick?.(prop)
  }
  const handleCloseAway = (event: React.MouseEvent<Document>) => {
    if (anchorEl?.contains(event.currentTarget)) {
      return
    }
    setAnchorEl(null)
  }
  const classes = useStyles({})

  const caretClasses = clsx({
    [classes.caret]: true,
    [classes.caretActive]: Boolean(anchorEl),
    [classes.caretRTL]: rtlActive,
  })
  const dropdownItem = clsx({
    [classes.dropdownItem]: true,
    [getKeyValue(classes)((hoverColor + 'Hover') as keyof typeof classes)]: true,
    [classes.noLiPadding]: noLiPadding,
    [classes.dropdownItemRTL]: rtlActive,
  })

  let icon = null
  switch (typeof buttonIcon) {
    case 'object':
      icon = React.createElement(buttonIcon, { className: classes.buttonIcon })
      break
    case 'string':
      icon = <Icon className={classes.buttonIcon}>{buttonIcon}</Icon>
      break
    default:
      icon = null
      break
  }

  return (
    <div>
      <div>
        <Button
          aria-label='Notifications'
          aria-owns={anchorEl ? 'menu-list' : undefined}
          aria-haspopup='true'
          {...buttonProps}
          onClick={handleClick}
        >
          {icon}
          {buttonText !== undefined ? buttonText : null}
          {caret ? <b className={caretClasses} /> : null}
        </Button>
      </div>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        disablePortal
        placement={dropup ? (left ? 'top-start' : 'top') : left ? 'bottom-start' : 'bottom'}
        className={clsx({
          [classes.popperClose]: !anchorEl,
          [classes.popperResponsive]: true,
        })}
      >
        {() => (
          <Grow
            in={Boolean(anchorEl)}
            // @ts-ignore
            id='menu-list'
            style={dropup ? { transformOrigin: '0 100% 0' } : { transformOrigin: '0 0 0' }}
          >
            <Paper className={classes.dropdown}>
              <ClickAwayListener onClickAway={handleCloseAway}>
                <MenuList role='menu' className={classes.menuList}>
                  {dropdownHeader !== undefined ? (
                    <MenuItem onClick={() => handleClose(dropdownHeader)} className={classes.dropdownHeader}>
                      {dropdownHeader}
                    </MenuItem>
                  ) : null}
                  {dropdownList.map((prop, key) => {
                    if (prop.divider) {
                      return (
                        <Divider
                          key={key}
                          onClick={() => handleClose('divider')}
                          className={classes.dropdownDividerItem}
                        />
                      )
                    }
                    return (
                      <MenuItem key={key} onClick={() => handleClose(prop)} className={dropdownItem}>
                        {prop}
                      </MenuItem>
                    )
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
