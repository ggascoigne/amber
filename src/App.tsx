import {
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  MuiThemeProvider,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import { Banner, Footer, LoginMenu, MenuItems, SelectedContent, rootRoutes } from 'components'
import React, { useCallback, useState } from 'react'

import { Header, theme } from './components'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      '.MuiListItem-root.Mui-selected': {
        backgroundColor: 'rgba(0,0,0,0.18)',
      },
      'ul, ol': {
        fontSize: 14,
      },
    },
    // "@global": {
    //   // MUI typography elements use REMs, so you can scale the global
    //   // font size by setting the font-size on the <html> element.
    //   body: {
    //     [theme.breakpoints.down("sm")]: {
    //       fontWeight:400
    //     },
    //   }
    // },
    // "@global": {
    //   // MUI typography elements use REMs, so you can scale the global
    //   // font size by setting the font-size on the <html> element.
    //   html: {
    //     fontSize: 12.5,
    //     [theme.breakpoints.up("sm")]: {
    //       fontSize: 14
    //     },
    //     [theme.breakpoints.up("md")]: {
    //       fontSize: 16
    //     },
    //     [theme.breakpoints.up("lg")]: {
    //       fontSize: 18
    //     }
    //   }
    // },
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
  })
)

const DrawerContents: React.FC = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.toolbar}>
        <Banner to='/' />
      </div>
      <Divider />
      <MenuItems menuItems={rootRoutes} />
      <div style={{ height: '100%' }} />
      <Footer />
    </>
  )
}

const RightMenu: React.FC<{ small?: boolean }> = (props) => {
  const classes = useStyles()
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <LoginMenu {...props} />
      </ListItem>
    </List>
  )
}

export const App: React.FC = React.memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

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
              <DrawerContents />
              <Divider />
              <RightMenu small />
            </Drawer>
          </Hidden>
          <Hidden smDown>
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
      </MuiThemeProvider>
    </div>
  )
})
