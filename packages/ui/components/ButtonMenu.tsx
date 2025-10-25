import type { ReactElement } from 'react'
import React, { useCallback, useMemo } from 'react'

import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import type { MenuProps } from '@mui/material/Menu'

export type ButtonMenuItem = {
  label: string
  tooltip?: string
  icon?: ReactElement
  onClick?: () => void
  dataTest?: string
}

export type ButtonMenuProps = ButtonProps &
  Record<string, any> & {
    id: string
    items: ButtonMenuItem[]
    menuProps?: Partial<MenuProps>
    component?: React.ElementType
    menuAnchorPosition?: number | 'bottom' | 'top' | 'center'
    anchorDirection?: 'top-left' | 'top-right'
    manualAnchorEl?: Element
    onClose?: () => void
  }

export const ButtonMenu: React.FC<ButtonMenuProps> = ({
  id,
  items = [],
  menuProps,
  component: ButtonComponent = Button,
  children,
  onClick,
  menuAnchorPosition = 'bottom',
  anchorDirection = 'top-left',
  manualAnchorEl,
  onClose,
  ...rest
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
      onClick?.(event)
    },
    [onClick],
  )

  const handleClose = useCallback(() => {
    setAnchorEl(null)
    onClose?.()
  }, [onClose])

  const menuItems = useMemo(() => {
    const handleItemClick = (item: ButtonMenuItem) => () => {
      setAnchorEl(null)
      item.onClick?.()
      onClose?.()
    }
    return items.map((item) => {
      const line = (
        <MenuItem
          key={item.label}
          onClick={handleItemClick(item)}
          data-testid={item.dataTest ?? `menu-option-${item.label}`}
        >
          {item.icon && <ListItemIcon sx={{ color: 'inherit', minWidth: 'unset' }}>{item.icon}</ListItemIcon>}
          <ListItemText primary={item.label} />
        </MenuItem>
      )

      return item.tooltip ? (
        <Tooltip key={item.label} title={item.tooltip} aria-label={item.tooltip}>
          {line}
        </Tooltip>
      ) : (
        line
      )
    })
  }, [items, onClose])

  return (
    <>
      <ButtonComponent data-test='foo' aria-controls={id} aria-haspopup='true' onClick={handleClick} {...rest}>
        {children}
      </ButtonComponent>
      <Menu
        id={id}
        anchorOrigin={{
          vertical: menuAnchorPosition,
          horizontal: anchorDirection === 'top-left' ? 'left' : 'right',
        }}
        transformOrigin={
          anchorDirection === 'top-left'
            ? {
                vertical: 'top',
                horizontal: 'left',
              }
            : {
                vertical: 'top',
                horizontal: 'right',
              }
        }
        anchorEl={manualAnchorEl ?? anchorEl}
        keepMounted
        open={Boolean(manualAnchorEl ?? anchorEl)}
        onClose={handleClose}
        sx={{
          minWidth: '105px',
        }}
        {...menuProps}
      >
        {menuItems}
      </Menu>
    </>
  )
}
