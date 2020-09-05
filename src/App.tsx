import {
  AppBar,
  CssBaseline,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  MuiThemeProvider,
  Theme,
  Toolbar,
  Typography,
  createMuiTheme,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { defaultFont } from 'assets/jss/material-kit-react'
import { Banner } from 'components/Acnw/Banner'
import { Footer } from 'components/Acnw/Footer'
import { LoginMenu } from 'components/Acnw/LoginMenu'
import { MenuItems, SelectedContent, rootRoutes } from 'components/Acnw/Navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { Config, useGetConfig } from './utils/getConfig'

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
    appBar: {
      flex: '1 1 auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: drawerWidth,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up('md')]: {
        display: 'none',
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

export const App: React.FC = React.memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [config, getConfig] = useGetConfig()
  const [configDetails, setConfigDetails] = useState('')

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  useEffect(() => {
    getConfig()
  }, [getConfig])

  useEffect(() => {
    const getConfigDetails = (config: Config | undefined, href: string | undefined) => {
      // never show any sort of configuration debug on the two release sites
      // note that amberconnw.org is the real site
      // acnw.org is the "dev" release site
      if (href?.startsWith('https://amberconnw.org') || href?.startsWith('https://acnw.org')) return ''
      return !config ? '' : config.local ? '(local)' : config.databaseName !== 'acnw' ? '(test)' : '(prod)'
    }

    setConfigDetails(getConfigDetails(config, window.location.href))
  }, [config])

  const classes = useStyles()

  const drawer = (
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

  const rightLinks: React.FC<{ small?: boolean }> = (props) => (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <LoginMenu {...props} />
      </ListItem>
    </List>
  )

  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' noWrap>
              AmberCon Northwest
            </Typography>
            &nbsp;{configDetails}
          </Toolbar>
          <Hidden smDown implementation='css'>
            {rightLinks({})}
          </Hidden>
        </AppBar>
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
              {drawer}
              <Divider />
              {rightLinks({ small: true })}
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
              {drawer}
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
