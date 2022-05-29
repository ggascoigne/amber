import StarIcon from '@mui/icons-material/Star'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { Avatar, Badge, Button, Theme, Tooltip } from '@mui/material'
import fetch from 'isomorphic-fetch'
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'
import { QueryClient } from 'react-query'
import { makeStyles } from 'tss-react/mui'
import { useIsGm } from 'utils'

import { Auth0User, Perms, Roles, useAuth, useRoleOverride, useToken } from './Auth'
import { LoginMenu } from './LoginMenu'
import { useNotification } from './Notifications'
import { ProfileDialog, useProfile } from './Profile'

const MENU_ITEM_EDIT_PROFILE = 'Edit Profile'
const MENU_ITEM_RESET_PASSWORD = 'Password Reset'
const MENU_ITEM_VIEW_AS_USER = 'View as Regular User'
const MENU_ITEM_VIEW_AS_ADMIN = 'View as Admin'
const MENU_ITEM_SIGN_OUT = 'Sign out'

const useStyles = makeStyles()((theme: Theme) => ({
  loginButton: {
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
  },
  navLink: {
    color: 'inherit',
    position: 'relative',
    padding: '0 18px 0 0.9375rem',
    marginRight: 7,
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
  },
  email: {
    textTransform: 'none',
    padding: 15,
  },
  badge: { color: '#fcc60a', width: 18, height: 18 },
}))

interface ProfileImageProps {
  user: Auth0User
}

const OurAvatar: React.FC<ProfileImageProps> = ({ user }) => {
  if (user.picture) {
    return <Avatar src={user.picture} />
  } else {
    const initials = user.nickname ? user.nickname[0] : '...'
    return <Avatar>{initials}</Avatar>
  }
}

const AdminBadge: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { classes } = useStyles()
  return (
    <Tooltip title='Site Administrator'>
      <Badge
        overlap='circular'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={<VerifiedUserIcon className={classes.badge} />}
      >
        {children}
      </Badge>
    </Tooltip>
  )
}

const GmBadge: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { classes } = useStyles()
  return (
    <Tooltip title='GMs always get stars at ACNW'>
      <Badge
        overlap='circular'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        badgeContent={<StarIcon className={classes.badge} />}
      >
        {children}
      </Badge>
    </Tooltip>
  )
}

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
    } else {
      return (
        <AdminBadge>
          <OurAvatar user={user} />
        </AdminBadge>
      )
    }
  } else {
    if (isGm) {
      return (
        <GmBadge>
          <OurAvatar user={user} />
        </GmBadge>
      )
    } else {
      return <OurAvatar user={user} />
    }
  }
}

interface MenuButtonProps {
  user: Auth0User
  small: boolean
}

const MenuButton: React.FC<MenuButtonProps> = ({ small, user }) => {
  const { classes } = useStyles()
  const unverified = user.email_verified ? '' : ' (unverified)'
  return small ? (
    <>
      <ProfileImage user={user} />
      <span className={classes.email}>
        {user.email}
        {unverified}
      </span>
    </>
  ) : (
    <>
      <span className={classes.email}>
        {user.email}
        {unverified}
      </span>
      <ProfileImage user={user} />
    </>
  )
}

interface LoginButtonProps {
  small?: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({ small = false }) => {
  const { classes } = useStyles()
  const { isInitializing = true, isAuthenticated, user, loginWithRedirect, logout, hasPermissions } = useAuth()
  const [jwtToken] = useToken()
  const notify = useNotification()
  const [profileOpen, setProfileOpen] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const [roleOverride, setRoleOverride] = useRoleOverride()
  const profile = useProfile()
  const queryClient = new QueryClient()

  useEffect(() => setAuthInitialized(!isInitializing), [isInitializing])

  const login = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      return loginWithRedirect && (await loginWithRedirect())
    },
    [loginWithRedirect]
  )

  const menuItems = useMemo(() => {
    const menu = [MENU_ITEM_EDIT_PROFILE]
    if (user?.sub.startsWith('auth0')) menu.push(MENU_ITEM_RESET_PASSWORD)
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
    fetch(window.location.origin + '/api/resetPassword', {
      method: 'post',
      headers: jwtToken
        ? {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          }
        : {
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
      })
  }, [notify, jwtToken])

  const viewAsUser = () => {
    if (!roleOverride) {
      setRoleOverride(Roles.ROLE_USER)
    } else {
      setRoleOverride(undefined)
    }
  }

  return isAuthenticated ? (
    <>
      <ProfileDialog open={profileOpen} onClose={closeProfile} initialValues={profile} />
      <LoginMenu
        buttonText={<MenuButton small={small} user={user!} />}
        buttonProps={{
          className: classes.navLink,
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
              logout?.()
              break
          }
        }}
      />
    </>
  ) : (
    <Button disabled={!authInitialized} className={classes.loginButton} onClick={login}>
      Login
    </Button>
  )
}
