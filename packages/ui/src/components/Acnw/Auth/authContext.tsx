import * as React from 'react'

export interface IAuth0User {
  id: string
  role: string
  email?: string
  name: string
  nickname: string
  picture: string
}

export interface IAuthConsumer {
  authenticated: boolean
  user: IAuth0User
  accessToken: string
  initiateLogin: () => void
  logout: () => void
}

const authContext = React.createContext<IAuthConsumer>({
  authenticated: false, // to check if authenticated or not
  user: undefined, // store all the user details
  accessToken: '', // accessToken of user for Auth0
  initiateLogin: () => {}, // to start the login process
  // handleAuthentication: () => {}, // handle Auth0 login process
  logout: () => {} // logout the user
})

export const AuthProvider = authContext.Provider
export const AuthConsumer = authContext.Consumer
