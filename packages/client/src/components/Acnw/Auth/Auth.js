import auth0 from 'auth0-js'
import React, { Component } from 'react'
import { toSnakeCase } from 'utils/object'

import { AUTH_CONFIG } from '../../../auth0-variables'
import { AuthProvider } from './authContext'

const authExpirationKey = 'acnw:login:expiresAt'

const options = {
  domain: AUTH_CONFIG.domain,
  clientID: AUTH_CONFIG.clientId,
  redirectUri: AUTH_CONFIG.callbackUrl,
  audience: `https://${AUTH_CONFIG.domain}/userinfo`,
  responseType: 'token id_token'
}

const auth = new auth0.WebAuth(options)

const defaultState = {
  authenticated: false,
  user: {
    role: 'visitor'
  },
  accessToken: '',
  idToken: '',
  expiresAt: null,
  tokenRenewalTimeout: 0
}

class Auth extends Component {
  state = { ...defaultState }

  constructor(props) {
    super(props)
    const expiresAt = localStorage.getItem(authExpirationKey)
    if (expiresAt) {
      const timeout = expiresAt - Date.now()
      if (timeout > 0) {
        this.renewSession()
      }
    }
  }

  initiateLogin = () => {
    auth.popup.authorize({ owp: true }, (error, authResult) => {
      if (error) {
        console.log(error)
        console.log(`Error ${error.error} occurred`)
        return
      }

      auth.validateAuthenticationResponse(options, toSnakeCase(authResult), this.handleAuthenticationResponse)
    })
  }

  logout = () => {
    clearTimeout(this.state.tokenRenewalTimeout)
    this.setState({ ...defaultState })
    localStorage.setItem(authExpirationKey, undefined)
    auth.logout({
      returnTo: AUTH_CONFIG.logoutUrl,
      clientID: AUTH_CONFIG.clientId
    })
  }

  handleAuthenticationResponse = (error, authResult) => {
    if (error) {
      console.log(error)
      console.log(`Error ${error.error} occurred`)
      return
    }

    this.setSession(authResult)
  }

  scheduleRenewal() {
    const expiresAt = this.state.expiresAt
    localStorage.setItem(authExpirationKey, expiresAt)
    const timeout = expiresAt - Date.now()
    if (timeout > 0) {
      const tokenRenewalTimeout = setTimeout(() => {
        this.renewSession()
      }, timeout)
      this.setState({ tokenRenewalTimeout })
    }
  }

  renewSession = () => {
    auth.checkSession({ scope: 'openid email profile' }, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.log(err)
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`)
      }
    })
  }

  setSession(authResult) {
    console.log(authResult)
    const { sub: id, email, nickname, name, picture } = authResult.idTokenPayload
    const user = {
      id,
      role: authResult.idTokenPayload[AUTH_CONFIG.roleUrl],
      email,
      nickname,
      name,
      picture
    }
    this.setState({
      authenticated: true,
      accessToken: authResult.accessToken,
      user,
      idToken: authResult.idToken,
      expiresAt: authResult.expiresIn * 1000 + new Date().getTime()
    })
    this.scheduleRenewal()
  }

  render() {
    const authProviderValue = {
      ...this.state,
      initiateLogin: this.initiateLogin,
      logout: this.logout
    }
    return <AuthProvider value={authProviderValue}>{this.props.children}</AuthProvider>
  }
}

export default Auth
