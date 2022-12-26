import { Button, Menu, MenuItem } from '@mui/material'
import React from 'react'

interface LoginMenuProps {
  buttonText: React.ReactNode
  dropdownList: Array<any>
  buttonProps?: Record<string, string>
  onClick?: (name: string) => void
}

export const LoginMenu: React.FC<LoginMenuProps> = ({ buttonText, dropdownList, buttonProps, onClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
          {buttonText !== undefined ? buttonText : null}
        </Button>
      </div>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 0.5,
            '& .MuiMenuItem-root': {
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
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        {dropdownList.map((prop, key) => (
          <MenuItem key={key} onClick={() => onClick?.(prop)}>
            {prop}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
