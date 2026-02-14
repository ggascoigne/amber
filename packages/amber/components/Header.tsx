import type { ReactNode } from 'react'
import type React from 'react'
import { useEffect, useState } from 'react'

import type { Config } from '@amber/client'
import { useGetConfigQuery } from '@amber/client'
import MenuIcon from '@mui/icons-material/Menu'
import type { Theme } from '@mui/material'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { HasPermission, Perms } from './Auth'
import { Balance } from './Balance'
import { UserSelector } from './UserSelector'
import { YearSelector } from './YearSelector'

const drawerWidth = 240

interface HeaderProps {
  title: string
  handleDrawerToggle: () => void
  rightMenu: (props?: any) => ReactNode
}

export const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, rightMenu, title }) => {
  const config = useGetConfigQuery()
  const [configDetails, setConfigDetails] = useState('')

  useEffect(() => {
    const getConfigDetails = (conf: Config | undefined, href: string | undefined) => {
      if (
        href?.startsWith('https://amberconnw.org') ||
        href?.startsWith('https://ambercon.com') ||
        href?.startsWith('https://www.ambercon.com') ||
        href?.startsWith('https://acnw.org')
      ) {
        return ''
      }
      const prefix = conf?.isFakeAuth ? '[FAKE AUTH] ' : ''
      return (
        prefix +
        (!conf
          ? ''
          : conf.local && conf.isTestDb
            ? '(local:test)'
            : conf.local
              ? '(local)'
              : ['acnw', 'acus'].includes(conf.databaseName)
                ? '(prod)'
                : '(aws:test)')
      )
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
      <HasPermission permission={Perms.IsLoggedIn}>
        <Balance />
      </HasPermission>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>{rightMenu()}</Box>
    </AppBar>
  )
}
