import type { MouseEvent, KeyboardEvent } from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import { Button } from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import { MenuContent } from './MenuContent'
import type { MenuEntry } from './MenuTypes'

import { isKeyboardEvent } from '../../utils/event'

type NavigationDrawerMobileProps = {
  appExpand: boolean
  onMenuChange: (expanded: boolean) => void
  menu: MenuEntry[]
}

export default function NavigationDrawerMobile({ appExpand, onMenuChange, menu }: NavigationDrawerMobileProps) {
  const toggleDrawer = (event: MouseEvent | KeyboardEvent) => {
    if (isKeyboardEvent(event) && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    onMenuChange(!appExpand)
  }

  return (
    <>
      <Button sx={{ py: 0.5, px: 2 }} startIcon={<MenuIcon />} onClick={toggleDrawer}>
        Menu
      </Button>
      <SwipeableDrawer
        open={appExpand}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        sx={{
          width: 250,
          display: ['block', 'none'],
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <MenuContent sx={{ width: 250 }} onItemClick={toggleDrawer} menu={menu} />
      </SwipeableDrawer>
    </>
  )
}
