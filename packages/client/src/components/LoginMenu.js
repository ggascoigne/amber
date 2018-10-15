import React from 'react'

import { AuthConsumer } from '../authContext'

const LoggedInContent = ({ user, logout }) => {
  return (
    <div className='topbar__acnw_login' onClick={logout}>
      {user.email}
    </div>
  )
}

const LoggedOutContent = ({ initiateLogin }) => {
  return (
    <div className='topbar__acnw_login' onClick={initiateLogin}>
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
