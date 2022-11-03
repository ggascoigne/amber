import { Divider, Drawer, Hidden, List, ListItem, Theme } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { Banner } from './components/Banner'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LoginButton } from './components/LoginButton'
import { MenuItems, rootRoutes, SelectedContent } from './components/Navigation'

const drawerWidth = 240

// @ts-ignore
const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    overflowX: 'hidden',
  },
  content: {
    minHeight: '100vh',
    width: '100%',
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  list: {
    fontSize: '14px',
    margin: 0,
    paddingLeft: '0',
    listStyle: 'none',
    paddingTop: '0',
    paddingBottom: '0',
    color: 'inherit',
  },
  listItem: {
    float: 'left',
    color: 'inherit',
    position: 'relative',
    display: 'block',
    width: 'auto',
    margin: '0',
    padding: '0',
  },
  listItemText: {
    padding: '0 !important',
  },
}))

const DrawerContents: React.FC<{ small?: boolean }> = ({ small = false }) => {
  const { classes } = useStyles()
  return (
    <>
      {!small && (
        <>
          <div className={classes.toolbar}>
            <Banner to='/' />
          </div>
          <Divider />
        </>
      )}
      <MenuItems menuItems={rootRoutes} />
      <div style={{ height: '100%' }} />
      <Footer />
    </>
  )
}

const RightMenu: React.FC<{ small?: boolean }> = (props) => {
  const { classes } = useStyles()
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <LoginButton {...props} />
      </ListItem>
    </List>
  )
}

export const App: React.FC = React.memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <Header handleDrawerToggle={handleDrawerToggle} rightMenu={RightMenu} />
      <nav className={classes.drawer}>
        <Hidden mdUp>
          <Drawer
            variant='temporary'
            anchor='left'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <RightMenu small />
            <Divider />
            <DrawerContents small />
          </Drawer>
        </Hidden>
        <Hidden mdDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            <DrawerContents />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SelectedContent routes={rootRoutes} />
      </main>
    </div>
  )
})
