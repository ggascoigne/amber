import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'

import type { MenuEntry } from '@/Components/Navigation/MenuTypes'
import NavigationAppBar from '@/Components/Navigation/NavigationAppBar'
import NavigationDrawer from '@/Components/Navigation/NavigationDrawer'
import NavigationDrawerMobile from '@/Components/Navigation/NavigationDrawerMobile'
import { routes } from '@/routes'

type SideMenuProps = {
  onMenuChange: (expanded: boolean) => void
  expanded: boolean
  menu: MenuEntry[]
}

const SideMenu = ({ expanded, onMenuChange, menu }: SideMenuProps) => (
  <Box sx={{ display: ['none', 'block'] }}>
    <NavigationDrawer expanded={expanded} onMenuChange={onMenuChange} menu={menu} />
  </Box>
)

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme()
  const [menuExpand, setMenuExpand] = useState<boolean>(false)

  const onMenuChange = (data: boolean) => {
    setMenuExpand(data)
  }

  useEffect(() => {
    // Initialize menu state based on screen size
    const initializeMenuState = () => {
      if (typeof window !== 'undefined') {
        setMenuExpand(window.innerWidth >= theme.breakpoints.values.md)
      }
    }

    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth <= theme.breakpoints.values.md) {
        onMenuChange(false)
      }
    }

    initializeMenuState()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return undefined
  }, [theme.breakpoints.values.md])

  return (
    <>
      <NavigationAppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        <Box component='nav' sx={{ flex: '1 1 auto' }}>
          <SideMenu expanded={menuExpand} onMenuChange={onMenuChange} menu={routes} />
        </Box>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <NavigationDrawerMobile appExpand={menuExpand} onMenuChange={onMenuChange} menu={routes} />
          <Divider />
        </Box>
        <Box
          component='main'
          sx={{
            overflowY: 'auto',
            height: 'calc(100vh - 89.5px)' /* 56 for the header + 33.5 for the small menu toolbar */,
            flex: '1 1 auto',
            width: '100%',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            // todo: pretty sure that this bit is broken
            '@media (min-width: 0px)': {
              '@media (orientation: landscape)': {
                height: 'calc(100vh - 81.5px)' /* 48 for the header + 33.5 for the small menu toolbar */,
              },
            },
            '@media (min-width: 600px)': {
              height: 'calc(100vh - 64px)',
            },
            '@media (min-width: 900px)': {
              height: 'calc(100vh - 64px)' /* 56 for the header + 33.5 for the small menu toolbar */,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Layout
