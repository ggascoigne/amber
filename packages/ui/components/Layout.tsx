import { Box, Divider, Drawer, Hidden, List, ListItem } from '@mui/material'
import React, { useCallback, useState } from 'react'

import { Banner } from './Banner'
import { Footer } from './Footer'
import { Header } from './Header'
import { LoginButton } from './LoginButton'
import { MenuItems, RootRoutes } from './Navigation'
import { Children } from '../utils'

const drawerWidth = 240

const DrawerContents: React.FC<{ small?: boolean; rootRoutes: RootRoutes }> = ({ small = false, rootRoutes }) => (
  <>
    {!small && (
      <>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })}>
          <Banner to='/' />
        </Box>
        <Divider />
      </>
    )}
    <MenuItems menuItems={rootRoutes} />
    <div style={{ height: '100%' }} />
    <Footer />
  </>
)

const RightMenu: React.FC<{ small?: boolean }> = (props) => (
  <List
    sx={{
      fontSize: '14px',
      m: 0,
      listStyle: 'none',
      pl: '0',
      pt: '0',
      pb: '0',
      color: 'inherit',
    }}
  >
    <ListItem
      sx={{
        float: 'left',
        color: 'inherit',
        position: 'relative',
        display: 'block',
        width: 'auto',
        m: 0,
        p: 0,
      }}
    >
      <LoginButton {...props} />
    </ListItem>
  </List>
)

export const Layout: React.FC<Children & { rootRoutes: RootRoutes; title: string }> = React.memo(
  ({ children, rootRoutes, title }) => {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = useCallback(() => {
      setMobileOpen(!mobileOpen)
    }, [mobileOpen])

    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header handleDrawerToggle={handleDrawerToggle} rightMenu={RightMenu} title={title} />
        <Box
          component='nav'
          sx={(theme) => ({
            [theme.breakpoints.up('md')]: {
              width: drawerWidth,
              flexShrink: 0,
            },
          })}
        >
          <Hidden mdUp>
            <Drawer
              variant='temporary'
              anchor='left'
              open={mobileOpen}
              onClose={handleDrawerToggle}
              PaperProps={{
                sx: {
                  width: drawerWidth,
                  overflowX: 'hidden',
                },
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              <RightMenu small />
              <Divider />
              <DrawerContents small rootRoutes={rootRoutes} />
            </Drawer>
          </Hidden>
          <Hidden mdDown>
            <Drawer
              PaperProps={{
                sx: {
                  width: drawerWidth,
                  overflowX: 'hidden',
                },
              }}
              variant='permanent'
              open
            >
              <DrawerContents rootRoutes={rootRoutes} />
            </Drawer>
          </Hidden>
        </Box>
        <Box component='main' sx={{ minHeight: '100vh', width: '100%', flexGrow: 1, paddingTop: 3, paddingBottom: 3 }}>
          <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
          {children}
        </Box>
      </Box>
    )
  }
)
