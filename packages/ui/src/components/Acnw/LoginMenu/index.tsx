import { ApolloConsumer } from '@apollo/react-common'
import Avatar from '@material-ui/core/Avatar'
import { Theme, makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import { AuthConsumer } from 'components/Acnw/Auth'
import Button from 'components/MaterialKitReact/CustomButtons/Button'
import CustomDropdown from 'components/MaterialKitReact/CustomDropdown/CustomDropdown'
import React from 'react'

import { Auth0User } from '../Auth/authContext'

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
      backgroundColor: 'rgba(255, 255, 255, 0.15)'
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
        background: 'rgba(200, 200, 200, 0.2)'
      },
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 30px)',
        marginBottom: '8px',
        marginTop: '8px',
        textAlign: 'left',
        '& > span:first-child': {
          justifyContent: 'flex-start'
        }
      }
    },
    email: {
      textTransform: 'none',
      padding: 15
    }
  })
)

type ProfileImage = {
  user: Auth0User
}

const ProfileImage: React.FC<ProfileImage> = ({ user }) => {
  if (user.picture) {
    return <Avatar src={user.picture} />
  } else {
    const initials = user.nickname ? user.nickname[0] : '...'
    return <Avatar>{initials}</Avatar>
  }
}

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
  return (
    <ApolloConsumer>
      {client => (
        <AuthConsumer>
          {({ authenticated, user, initiateLogin, logout }) =>
            authenticated ? (
              <CustomDropdown
                right
                caret={false}
                hoverColor='black'
                buttonText={<MenuButton small={small} user={user!} />}
                buttonProps={{
                  className: classes.navLink,
                  color: 'transparent'
                }}
                dropdownList={[MENU_ITEM_SIGN_OUT]}
                onClick={(prop: string) => {
                  if (prop === MENU_ITEM_SIGN_OUT) {
                    client.resetStore()
                    logout()
                  }
                }}
              />
            ) : (
              <Button className={classes.loginNavLink} onClick={initiateLogin} color='transparent'>
                Login
              </Button>
            )
          }
        </AuthConsumer>
      )}
    </ApolloConsumer>
  )
}
