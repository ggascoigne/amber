import auth0 from 'auth0-js'
import React, { Component } from 'react'
import { toSnakeCase } from 'utils/object'
import { AUTH_CONFIG } from '../../auth0-variables'
import { AuthProvider } from './authContext'

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
  accessToken: ''
}

class Auth extends Component {
  state = { ...defaultState }

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
    this.setState({ ...defaultState })
  }

  handleAuthenticationResponse = (error, authResult) => {
    if (error) {
      console.log(error)
      console.log(`Error ${error.error} occurred`)
      return
    }

    this.setSession(authResult.idTokenPayload)
  }

  /*
    handleAuthentication = () => {
      auth.parseHash(handleAuthenticationResponse)
    }
  */

  setSession(data) {
    console.log(data)
    const user = {
      id: data.sub,
      email: data.email,
      role: data[AUTH_CONFIG.roleUrl]
    }
    this.setState({
      authenticated: true,
      accessToken: data.accessToken,
      user
    })
  }

  render() {
    const authProviderValue = {
      ...this.state,
      initiateLogin: this.initiateLogin,
      // handleAuthentication: this.handleAuthentication,
      logout: this.logout
    }
    return <AuthProvider value={authProviderValue}>{this.props.children}</AuthProvider>
  }
}

export default Auth
