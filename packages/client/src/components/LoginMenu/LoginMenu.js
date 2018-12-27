import { withStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import { AuthConsumer } from 'components/Auth/authContext'
import Button from 'components/CustomButtons/Button.jsx'
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.jsx'
import * as PropTypes from 'prop-types'
import React from 'react'

const MENU_ITEM_SIGN_OUT = 'Sign out'

const styles = theme => ({
  loginNavLink: {
    position: 'relative',
    fontWeight: '400',
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
    fontWeight: '400',
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

const ProfileImage = ({ user }) => {
  if (user.picture) {
    return <Avatar src={user.picture} />
  } else {
    const initials = user.nickname ? user.nickname[0] : '...'
    return <Avatar>{initials}</Avatar>
  }
}

const MenuButton = ({ classes, small, user }) => {
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

const LoginMenu = ({ classes, small }) => (
  <AuthConsumer>
    {({ authenticated, user, initiateLogin, logout }) =>
      authenticated ? (
        <CustomDropdown
          right
          caret={false}
          hoverColor='black'
          buttonText={<MenuButton classes={classes} small={small} user={user} />}
          buttonProps={{
            className: classes.navLink,
            color: 'transparent'
          }}
          dropdownList={[MENU_ITEM_SIGN_OUT]}
          onClick={prop => {
            if (prop === MENU_ITEM_SIGN_OUT) {
              logout()
            }
          }}
        />
      ) : (
        <Button className={classes.loginNavLink} onClick={initiateLogin} color='transparent' round>
          Login
        </Button>
      )
    }
  </AuthConsumer>
)

LoginMenu.propTypes = { classes: PropTypes.any }

export default withStyles(styles, { withTheme: true })(LoginMenu)
