import auth0 from 'auth0-js'
import { AUTH_CONFIG } from 'auth0-variables'
import { AuthConsumer } from 'components/Acnw/Auth'
import React from 'react'
import { Redirect } from 'react-router-dom'

const auth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  clientID: AUTH_CONFIG.clientId,
  redirectUri: AUTH_CONFIG.callbackUrl,
  audience: `https://${AUTH_CONFIG.domain}/userinfo`,
  responseType: 'token id_token'
})

export const CallbackPage = props => (
  <AuthConsumer>
    {({ handleAuthentication }) => {
      if (/access_token|id_token|error/.test(props.location.hash)) {
        handleAuthentication()
      }
      debugger
      auth.popup.callback()
      return <Redirect to='/' />
    }}
  </AuthConsumer>
)
