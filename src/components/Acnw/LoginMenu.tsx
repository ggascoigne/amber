import { ApolloConsumer } from '@apollo/client'
import { Badge, Tooltip } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import StarIcon from '@material-ui/icons/Star'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import Button from 'components/MaterialKitReact/CustomButtons/Button'
import CustomDropdown from 'components/MaterialKitReact/CustomDropdown/CustomDropdown'
import fetch from 'isomorphic-fetch'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useIsGm } from '../../utils'
import { useAuth } from './Auth/Auth0'
import { Auth0User, Perms, useAuthOverride, useToken } from './Auth/index'
import { useNotification } from './Notifications'
import { ProfileDialog, useProfile } from './Profile'

const MENU_ITEM_EDIT_PROFILE = 'Edit Profile'
const MENU_ITEM_RESET_PASSWORD = 'Password Reset'
const MENU_ITEM_VIEW_AS_USER = 'View as Regular User'
const MENU_ITEM_VIEW_AS_ADMIN = 'View as Admin'
const MENU_ITEM_SIGN_OUT = 'Sign out'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginNavLink: {
      position: 'relative',
      fontWeight: 400,
      fontSize: '12px',
      textTransform: 'uppercase',
      lineHeight: '20px',
      textDecoration: 'none',
      marginRight: '20px',
      display: 'inline-flex',
      color: 'inherit',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 30px)',
        marginBottom: '8px',
        marginTop: '8px',
        textAlign: 'left',
        '& > span:first-child': {
          justifyContent: 'flex-start',
        },
      },
    },
    email: {
      textTransform: 'none',
      padding: 15,
    },
  })
)

type ProfileImageProps = {
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

const AdminBadge: React.FC = ({ children }) => (
  <Badge
    overlap='circle'
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    badgeContent={<VerifiedUserIcon style={{ color: '#fcc60a' }} />}
  >
    {children}
  </Badge>
)

const GmBadge: React.FC = ({ children }) => (
  <Tooltip title='GMs always get stars at ACNW'>
    <Badge
      overlap='circle'
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      badgeContent={<StarIcon style={{ color: '#fcc60a' }} />}
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

type MenuButtonProps = {
  user: Auth0User
  small: boolean
}

const MenuButton: React.FC<MenuButtonProps> = ({ small, user }) => {
  const classes = useStyles()
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

type LoginMenuProps = {
  small?: boolean
}

export const LoginMenu: React.FC<LoginMenuProps> = ({ small = false }) => {
  const classes = useStyles()
  const { isInitializing = true, isAuthenticated, user, loginWithRedirect, logout, hasPermissions } = useAuth()
  const [jwtToken] = useToken()
  const [notify] = useNotification()
  const [profileOpen, setProfileOpen] = useState(false)
  const [authInitialized, setAuthInitialized] = useState(false)
  const roleOverride = useAuthOverride((state) => state.roleOverride)
  const setRoleOverride = useAuthOverride((state) => state.setRoleOverride)
  const profile = useProfile()

  useEffect(() => setAuthInitialized(!isInitializing), [isInitializing])

  const login = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      return loginWithRedirect && (await loginWithRedirect())
    },
    [loginWithRedirect]
  )

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
        } catch (e) {
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
      setRoleOverride('ROLE_USER')
    } else {
      setRoleOverride('')
    }
  }

  return (
    <ApolloConsumer>
      {(client) =>
        isAuthenticated ? (
          <>
            <ProfileDialog open={profileOpen} onClose={closeProfile} initialValues={profile} />
            <CustomDropdown
              right
              caret={false}
              hoverColor='black'
              buttonText={<MenuButton small={small} user={user!} />}
              buttonProps={{
                className: classes.navLink,
                color: 'transparent',
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
                    client.resetStore()
                    logout && logout()
                    break
                }
              }}
            />
          </>
        ) : (
          <Button disabled={!authInitialized} className={classes.loginNavLink} onClick={login} color='transparent'>
            Login
          </Button>
        )
      }
    </ApolloConsumer>
  )
}
