import React, { ReactNode, useCallback, useState } from 'react'

import { Children } from '@amber/ui'
import { Box, Divider, Drawer, List, ListItem } from '@mui/material'

import { Footer } from './Footer'
import { Header } from './Header'
import { LoginButton } from './LoginButton'
import { MenuItems, RootRoutes } from './Navigation'

const drawerWidth = 240

type DrawerContentsProps = { small?: boolean; rootRoutes: RootRoutes; banner: ReactNode }

const DrawerContents = ({ small = false, rootRoutes, banner }: DrawerContentsProps) => (
  <>
    {!small && (
      <>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })}>{banner}</Box>
        <Divider />
      </>
    )}
    <MenuItems menuItems={rootRoutes} />
    <div style={{ height: '100%' }} />
    <Footer />
  </>
)

const RightMenu = (props: { small?: boolean }) => (
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

export type LayoutProps = Children & { rootRoutes: RootRoutes; title: string; banner: ReactNode }

export const Layout: React.FC<LayoutProps> = React.memo(({ children, rootRoutes, title, banner }) => {
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
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
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
            <DrawerContents small rootRoutes={rootRoutes} banner={banner} />
          </Drawer>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
            <DrawerContents rootRoutes={rootRoutes} banner={banner} />
          </Drawer>
        </Box>
      </Box>
      <Box component='main' sx={{ minHeight: '100vh', width: '100%', flexGrow: 1, paddingTop: 3, paddingBottom: 3 }}>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        {children}
      </Box>
    </Box>
  )
})
