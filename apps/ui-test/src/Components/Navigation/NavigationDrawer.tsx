import type { MouseEvent } from 'react'
import { useState } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

import { MenuContent } from './MenuContent'
import type { MenuEntry } from './MenuTypes'

const expandedWidth = 250
const shrunkenWidth = 60

type NavigationDrawerProps = {
  menu: MenuEntry[]
  expanded: boolean
  onMenuChange: (expanded: boolean) => void
}

function NavigationDrawer({ menu, expanded = false, onMenuChange }: NavigationDrawerProps) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const handleIconClick = () => {
    onMenuChange(!expanded)
  }

  const handleClick = (event: MouseEvent<Element>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Drawer
      variant='permanent'
      open={expanded}
      sx={{
        width: expanded ? expandedWidth : shrunkenWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
      PaperProps={{
        sx: {
          ...(expanded && {
            pt: 8,
            width: expandedWidth,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
          ...(!expanded && {
            pt: 8,
            width: shrunkenWidth,
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }),
        },
      }}
    >
      {/* LIST */}
      <MenuList sx={{ py: 0.5 }}>
        <MenuItem sx={{ justifyContent: 'flex-end' }} onClick={handleIconClick}>
          <ListItemIcon sx={{ minWidth: '27px', justifyContent: 'center' }}>
            {expanded ? <MenuOpenIcon color='action' /> : <MenuIcon color='action' />}
          </ListItemIcon>
        </MenuItem>
      </MenuList>
      <Divider />
      {expanded ? (
        <MenuContent menu={menu} />
      ) : (
        <>
          <MenuList sx={{ py: 0.5 }}>
            <MenuItem sx={{ justifyContent: 'flex-end' }} onClick={handleClick}>
              <ListItemIcon
                sx={{
                  minWidth: '27px',
                  justifyContent: 'center',
                }}
              >
                <MoreVertIcon />
              </ListItemIcon>
            </MenuItem>
          </MenuList>
          <Menu id='left-side-menu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuContent menu={menu} />
          </Menu>
        </>
      )}
    </Drawer>
  )
}

export default NavigationDrawer
