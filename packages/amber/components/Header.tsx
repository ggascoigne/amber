import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Hidden, IconButton, Theme, Toolbar, Typography } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'
import { Config, useGetConfig } from '../utils'

import { HasPermission, Perms } from './Auth'
import { UserSelector } from './UserSelector'
import { YearSelector } from './YearSelector'

const drawerWidth = 240

interface HeaderProps {
  title: string
  handleDrawerToggle: () => void
  rightMenu: (props?: any) => ReactNode
}

export const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, rightMenu, title }) => {
  const [config, getConfig] = useGetConfig()
  const [configDetails, setConfigDetails] = useState('')

  useEffect(() => {
    getConfig()
  }, [getConfig])

  useEffect(() => {
    const getConfigDetails = (conf: Config | undefined, href: string | undefined) => {
      if (
        href?.startsWith('https://amberconnw.org') ||
        href?.startsWith('https://ambercon.com') ||
        href?.startsWith('https://www.ambercon.com') ||
        href?.startsWith('https://acnw.org')
      )
        return ''
      return !conf ? '' : conf.local ? '(local)' : ['acnw', 'acus'].includes(conf.databaseName) ? '(test)' : '(prod)'
    }

    setConfigDetails(getConfigDetails(config, window.location.href))
  }, [config])

  return (
    <AppBar
      position='fixed'
      sx={(theme: Theme) => ({
        flex: '1 1 auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: drawerWidth,
        [theme.breakpoints.up('md')]: {
          width: `calc(100% - ${drawerWidth}px)`,
        },
      })}
    >
      <Toolbar sx={{ width: '100%' }}>
        <IconButton
          color='inherit'
          aria-label='Open drawer'
          onClick={handleDrawerToggle}
          sx={(theme: Theme) => ({
            marginRight: 20,
            [theme.breakpoints.up('md')]: {
              display: 'none',
            },
          })}
          size='large'
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' color='inherit' noWrap>
          {title}
        </Typography>
        &nbsp;{configDetails}
      </Toolbar>
      <HasPermission permission={Perms.IsAdmin}>
        <UserSelector />
      </HasPermission>
      <HasPermission permission={Perms.IsAdmin}>
        <YearSelector />
      </HasPermission>
      <Hidden mdDown implementation='css'>
        {rightMenu()}
      </Hidden>
    </AppBar>
  )
}
