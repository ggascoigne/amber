import React from 'react'

import { AuthConsumer } from './Auth/authContext'

const LoggedInContent = ({ user, logout }) => {
  return (
    <div className='topbar__acnw_login' tabIndex={0} role='button' onClick={logout} onKeyPress={logout}>
      {user.email}
    </div>
  )
}

const LoggedOutContent = ({ initiateLogin }) => {
  return (
    <div className='topbar__acnw_login' tabIndex={0} role='button' onClick={initiateLogin} onKeyPress={initiateLogin}>
      login
    </div>
  )
}

const LoginMenu = () => (
  <AuthConsumer>
    {({ authenticated, user, initiateLogin, logout }) => {
      if (authenticated) {
        return <LoggedInContent user={user} logout={logout} />
      } else {
        return <LoggedOutContent initiateLogin={initiateLogin} />
      }
    }}
  </AuthConsumer>
)

export default LoginMenu
