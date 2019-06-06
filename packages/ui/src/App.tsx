import AppBar from '@material-ui/core/AppBar'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import { defaultFont } from 'assets/jss/material-kit-react'
import { Banner } from 'components/Acnw/Banner'
import { LoginMenu } from 'components/Acnw/LoginMenu'
import { MenuItems, SelectedContent, rootRoutes } from 'components/Acnw/Navigation'
import React, { Component } from 'react'

import withRoot from './utils/withRoot'

const drawerWidth = 240

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh'
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      flex: '1 1 auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: drawerWidth,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up('md')]: {
        display: 'none'
      }
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
      overflowX: 'hidden'
    },
    content: {
      minHeight: '100vh',
      width: '100%',
      flexGrow: 1,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
    list: {
      ...defaultFont,
      fontSize: '14px',
      margin: 0,
      paddingLeft: '0',
      listStyle: 'none',
      paddingTop: '0',
      paddingBottom: '0',
      color: 'inherit'
    },
    listItem: {
      float: 'left',
      color: 'inherit',
      position: 'relative',
      display: 'block',
      width: 'auto',
      margin: '0',
      padding: '0'
    },
    listItemText: {
      padding: '0 !important'
    }
  })

interface IApp extends WithStyles<typeof styles, true> {}

interface IAppState {
  mobileOpen: boolean
}

class App extends Component<IApp, IAppState> {
  state = {
    mobileOpen: false
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  render() {
    const { classes, theme } = this.props

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          <Banner to={'/'} />
        </div>
        <Divider />
        <MenuItems menuItems={rootRoutes} />
      </div>
    )

    const rightLinks: React.FC<{ small?: boolean }> = props => (
      <List className={classes.list}>
        <ListItem className={classes.listItem}>
          <LoginMenu {...props} />
        </ListItem>
      </List>
    )

    return (
      <div className={classes.root}>
        <AppBar position='fixed' className={classes.appBar}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='Open drawer'
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' color='inherit' noWrap>
              AmberCon Northwest
            </Typography>
          </Toolbar>
          <Hidden smDown implementation='css'>
            {rightLinks({})}
          </Hidden>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <Drawer
              variant='temporary'
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
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
                paper: classes.drawerPaper
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
      </div>
    )
  }
}

export default withRoot(withStyles(styles, { withTheme: true })(App))