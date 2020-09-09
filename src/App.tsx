import {
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  MuiThemeProvider,
  Theme,
  createMuiTheme,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import { defaultFont } from 'assets/jss/material-kit-react'
import { Banner } from 'components/Acnw/Banner'
import { Footer } from 'components/Acnw/Footer'
import { LoginMenu } from 'components/Acnw/LoginMenu'
import { MenuItems, SelectedContent, rootRoutes } from 'components/Acnw/Navigation'
import React, { useCallback, useState } from 'react'

import { Header } from './components/Acnw'

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    body2: {
      fontWeight: 300,
    },
  },
  overrides: {
    MuiTableSortLabel: {
      root: {
        '&:hover': {
          color: 'inherit',
        },
      },
    },
  },
})

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      ...defaultFont,
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
