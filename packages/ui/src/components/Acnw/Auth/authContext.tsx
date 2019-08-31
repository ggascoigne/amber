import * as React from 'react'

export type Auth0User = {
  id: string
  role: string
  email?: string
  name: string
  nickname: string
  picture: string
}

type AuthBaseAuthenticated = {
  authenticated: true
  user: Auth0User
}
type AuthBaseNotAuthenticated = {
  authenticated: false
  user?: Auth0User
}

export type AuthConsumer = (AuthBaseAuthenticated | AuthBaseNotAuthenticated) & {
  accessToken: string
  initiateLogin: () => void
  logout: () => void
  handleAuthentication?: () => void
}

const authContext = React.createContext<AuthConsumer>({
  authenticated: false, // to check if authenticated or not
  user: undefined, // store all the user details
  accessToken: '', // accessToken of user for Auth0
  initiateLogin: () => {}, // to start the login process
  // handleAuthentication: () => {}, // handle Auth0 login process
  logout: () => {} // logout the user
})

export const AuthProvider = authContext.Provider
export const AuthConsumer = authContext.Consumer
