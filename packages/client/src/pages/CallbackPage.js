import React from 'react'
import { Redirect } from 'react-router-dom'

import { AuthConsumer } from '../components/Auth/authContext'

const CallbackPage = props => (
  <AuthConsumer>
    {({ handleAuthentication }) => {
      if (/access_token|id_token|error/.test(props.location.hash)) {
        handleAuthentication()
      }
      return <Redirect to='/' />
    }}
  </AuthConsumer>
)

export default CallbackPage
