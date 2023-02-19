import StarIcon from '@mui/icons-material/Star'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { Avatar, Badge, Button, Theme, Tooltip, Typography } from '@mui/material'
import fetch from 'isomorphic-fetch'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { QueryClient } from '@tanstack/react-query'
import { Box } from '@mui/system'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Children, useNotification } from 'ui'
import { useIsGm, useSetting } from '../utils'

import { Auth0User, Perms, Roles, useAuth, useRoleOverride } from './Auth'
import { LoginMenu } from './LoginMenu'
import { ProfileDialog, useProfile } from './Profile'

const MENU_ITEM_EDIT_PROFILE = 'Edit Profile'
const MENU_ITEM_RESET_PASSWORD = 'Password Reset'
const MENU_ITEM_VIEW_AS_ADMIN = 'View as Admin'
const MENU_ITEM_SIGN_OUT = 'Sign out'

const chosenRole = 'Regular User'

const MENU_ITEM_VIEW_AS_USER = `View as ${chosenRole}`

const roleName = {
  'Regular User': Roles.ROLE_USER,
  'Game Admin': Roles.ROLE_GAME_ADMIN,
  'Player Admin': Roles.ROLE_PLAYER_ADMIN,
}

interface ProfileImageProps {
  user: Auth0User
}

const OurAvatar: React.FC<ProfileImageProps> = ({ user }) => {
  if (user.picture) {
    return <Avatar src={user.picture} />
  }
  const initials = user.nickname ? user.nickname[0] : '...'
  return <Avatar>{initials}</Avatar>
}

const AdminBadge: React.FC<Children> = ({ children }) => (
  <Tooltip title='Site Administrator'>
    <Badge
      overlap='circular'
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<VerifiedUserIcon sx={{ color: '#fcc60a', width: '18px', height: '18px' }} />}
    >
      {children}
    </Badge>
  </Tooltip>
)

const GmBadge: React.FC<Children> = ({ children }) => (
  <Tooltip title='GMs always get stars at Ambercon'>
    <Badge
      overlap='circular'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      badgeContent={<StarIcon sx={{ color: '#fcc60a', width: '18px', height: '18px' }} />}
    >
      {children}
    </Badge>
  </Tooltip>
)

const ProfileImage: React.FC<ProfileImageProps> = ({ user }) => {
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const isGm = useIsGm()

  if (isAdmin) {
    if (isGm) {
      return (
        <GmBadge>
          <AdminBadge>
            <OurAvatar user={user} />
          </AdminBadge>
        </GmBadge>
      )
    }
    return (
      <AdminBadge>
        <OurAvatar user={user} />
      </AdminBadge>
    )
  }
  if (isGm) {
    return (
      <GmBadge>
        <OurAvatar user={user} />
      </GmBadge>
    )
  }
  return <OurAvatar user={user} />
}

interface MenuButtonProps {
  user: Auth0User
  small: boolean
}

const MenuButton: React.FC<MenuButtonProps> = ({ small, user }) => {
  const unverified = user.email_verified ? '' : ' (unverified)'
  return small ? (
    <Box sx={{ display: 'flex', flexDirection: 'row', ml: 1, alignItems: 'center' }}>
      <ProfileImage user={user} />
      <Typography component='span' sx={{ textTransform: 'none', padding: 2 }}>
        {user.email}
        {unverified}
      </Typography>
    </Box>
  ) : (
    <>
      <Typography component='span' sx={{ textTransform: 'none', padding: 2 }}>
        {user.email}
        {unverified}
      </Typography>
      <ProfileImage user={user} />
    </>
  )
}

interface LoginButtonProps {
  small?: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({ small = false }) => {
  const { isLoading = true, user, hasPermissions } = useAuth()
  const notify = useNotification()
  const [authInitialized, setAuthInitialized] = useState(false)
  const [roleOverride, setRoleOverride] = useRoleOverride()
  const queryClient = new QueryClient()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const profile = useProfile()
  const disableLogin = useSetting('disable.login', false)

  useEffect(() => setAuthInitialized(!isLoading), [isLoading])

  const menuItems = useMemo(() => {
    const menu = [MENU_ITEM_EDIT_PROFILE]
    if (user?.sub?.startsWith('auth0')) menu.push(MENU_ITEM_RESET_PASSWORD)
    if (hasPermissions(Perms.IsAdmin, { ignoreOverride: true })) {
      if (!roleOverride) {
        menu.push(MENU_ITEM_VIEW_AS_USER)
      } else {
        menu.push(MENU_ITEM_VIEW_AS_ADMIN)
      }
    }
    menu.push(MENU_ITEM_SIGN_OUT)
    return menu
  }, [hasPermissions, roleOverride, user?.sub])

  const editProfile = useCallback(() => {
    setProfileOpen(true)
  }, [])

  const closeProfile = useCallback(() => {
    setProfileOpen(false)
  }, [])

  const resetPassword = useCallback(() => {
    fetch(`${window.location.origin}/api/resetPassword`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.text())
      .then((responseBody) => {
        try {
          const result = JSON.parse(responseBody)
          notify({
            text: result.message,
            variant: 'success',
          })
        } catch (e: any) {
          console.log(e)
          notify({
            text: e,
            variant: 'error',
          })
          return responseBody
        }
        return undefined
      })
  }, [notify])

  const viewAsUser = () => {
    if (!roleOverride) {
      setRoleOverride(roleName[chosenRole])
    } else {
      setRoleOverride(undefined)
    }
  }

  return user ? (
    <>
      <ProfileDialog open={profileOpen} onClose={closeProfile} initialValues={profile} />
      <LoginMenu
        buttonText={<MenuButton small={small} user={user!} />}
        buttonProps={{
          /*  @ts-ignore */
          sx: (theme: Theme) => ({
            color: 'inherit',
            position: 'relative',
            padding: '0 18px 0 0.9375rem',
            marginRight: '7px',
            fontWeight: 400,
            fontSize: '14px',
            textTransform: 'uppercase',
            borderRadius: '3px',
            lineHeight: '20px',
            textDecoration: 'none',
            margin: '0px',
            display: 'inline-flex',
            '&:hover,&:focus': {
              color: 'inherit',
              background: 'rgba(200, 200, 200, 0.2)',
            },
            [theme.breakpoints.down('md')]: {
              width: 'calc(100% - 30px)',
              marginBottom: '8px',
              marginTop: '8px',
              textAlign: 'left',
              '& > span:first-of-type': {
                justifyContent: 'flex-start',
              },
            },
          }),
        }}
        dropdownList={menuItems}
        onClick={(prop: string) => {
          switch (prop) {
            case MENU_ITEM_EDIT_PROFILE:
              editProfile()
              break
            case MENU_ITEM_VIEW_AS_ADMIN:
            case MENU_ITEM_VIEW_AS_USER:
              viewAsUser()
              break
            case MENU_ITEM_RESET_PASSWORD:
              resetPassword()
              break
            case MENU_ITEM_SIGN_OUT:
              queryClient.clear()
              router.push('/api/auth/logout')
              break
          }
        }}
      />
    </>
  ) : (
    <Button
      disabled={!authInitialized || disableLogin}
      sx={{
        position: 'relative',
        fontWeight: 400,
        textTransform: 'uppercase',
        fontSize: '12px',
        lineHeight: '20px',
        textDecoration: 'none',
        marginRight: '20px',
        display: 'inline-flex',
        padding: '12px 30px',
        color: 'inherit',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        '&:hover': {
          color: 'inherit',
          background: 'transparent',
          boxShadow: 'none',
        },
      }}
      component={Link}
      href='/api/auth/login'
    >
      Login
    </Button>
  )
}
