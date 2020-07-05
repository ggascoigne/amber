import { ApolloConsumer } from '@apollo/react-common'
import { Badge } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import { useAuth } from 'components/Acnw/Auth'
import Button from 'components/MaterialKitReact/CustomButtons/Button'
import CustomDropdown from 'components/MaterialKitReact/CustomDropdown/CustomDropdown'
import React, { useCallback } from 'react'

import type { Auth0User } from '../Auth'
import { HasPermission } from '../Auth/HasPermission'
import { Perms } from '../Auth/PermissionRules'

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

type ProfileImage = {
  user: Auth0User
}

const OurAvatar: React.FC<ProfileImage> = ({ user }) => {
  if (user.picture) {
    return <Avatar src={user.picture} />
  } else {
    const initials = user.nickname ? user.nickname[0] : '...'
    return <Avatar>{initials}</Avatar>
  }
}

const ProfileImage: React.FC<ProfileImage> = ({ user }) => (
  <HasPermission permission={Perms.IsAdmin} denied={() => <OurAvatar user={user} />}>
    <Badge
      overlap='circle'
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<VerifiedUserIcon style={{ color: '#fcc60a' }} />}
    >
      <OurAvatar user={user} />
    </Badge>
  </HasPermission>
)

type MenuButton = {
  user: Auth0User
  small: boolean
}

const MenuButton: React.FC<MenuButton> = ({ small, user }) => {
  const classes = useStyles()
  return small ? (
    <>
      <ProfileImage user={user} />
      <span className={classes.email}>{user.email}</span>
    </>
  ) : (
    <>
      <span className={classes.email}>{user.email}</span>
      <ProfileImage user={user} />
    </>
  )
}

type LoginMenu = {
  small?: boolean
}

export const LoginMenu: React.FC<LoginMenu> = ({ small = false }) => {
  const classes = useStyles()
  const { isAuthenticated, user, loginWithPopup, logout } = useAuth()
  const login = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault()
      return loginWithPopup && (await loginWithPopup())
    },
    [loginWithPopup]
  )
  return (
    <ApolloConsumer>
      {(client) =>
        isAuthenticated ? (
          <CustomDropdown
            right
            caret={false}
            hoverColor='black'
            buttonText={<MenuButton small={small} user={user!} />}
            buttonProps={{
              className: classes.navLink,
              color: 'transparent',
            }}
            dropdownList={[MENU_ITEM_SIGN_OUT]}
            onClick={(prop: string) => {
              if (prop === MENU_ITEM_SIGN_OUT) {
                client.resetStore()
                logout && logout()
              }
            }}
          />
        ) : (
          <Button className={classes.loginNavLink} onClick={login} color='transparent'>
            Login
          </Button>
        )
      }
    </ApolloConsumer>
  )
}
