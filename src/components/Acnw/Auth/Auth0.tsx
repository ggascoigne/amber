import createAuth0Client, {
  Auth0ClientOptions,
  GetTokenSilentlyOptions,
  GetTokenWithPopupOptions,
  IdToken,
  LogoutOptions,
  PopupLoginOptions,
  RedirectLoginOptions,
  RedirectLoginResult,
  getIdTokenClaimsOptions,
} from '@auth0/auth0-spa-js'
import JwtDecode from 'jwt-decode'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ThenArg } from 'utils'

import { checkMany } from './authUtils'
import rules, { Perms } from './PermissionRules'

const AUTH_CONFIG = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || '',
  audience: 'https://amberconnw.org',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
}

type Auth0Client = ThenArg<ReturnType<typeof createAuth0Client>>

type AccessToken = {
  iss?: string
  sub?: string
  aud?: string[]
  iat?: number
  exp?: number
  scope?: string
} & Record<string, any>

export type AuthInfo = {
  roles?: string[]
  userId?: number
}

export type Auth0User = AuthInfo & {
  email?: string
  email_verified?: boolean
  name: string
  nickname: string
  picture: string
}

interface ContextValueType {
  isAuthenticated?: boolean
  user?: Auth0User
  isInitializing?: boolean
  isPopupOpen?: boolean
  loginWithPopup?: (o?: PopupLoginOptions) => Promise<void>
  handleRedirectCallback?: () => Promise<RedirectLoginResult>
  getIdTokenClaims?: (o?: getIdTokenClaimsOptions) => Promise<IdToken>
  loginWithRedirect?: (o?: RedirectLoginOptions) => Promise<void>
  getTokenSilently?: (o?: GetTokenSilentlyOptions) => Promise<string | undefined>
  getTokenWithPopup?: (o?: GetTokenWithPopupOptions) => Promise<string | undefined>
  logout?: (o?: LogoutOptions) => void
  hasPermissions: (permission: Perms, data?: any) => boolean
}

export type Auth0ContextType = ContextValueType

const defaultContext: ContextValueType = {
  isAuthenticated: false,
  hasPermissions: () => false,
}

// create the context
export const Auth0Context = createContext<ContextValueType>(defaultContext)
export const useAuth: () => ContextValueType = () => useContext(Auth0Context)

interface Auth0ProviderOptions {
  children: React.ReactElement
  onRedirectCallback?: (result: RedirectLoginResult) => void
}

const auth0ClientConfig: Auth0ClientOptions = {
  domain: AUTH_CONFIG.domain,
  client_id: AUTH_CONFIG.clientId,
  redirect_uri: window.location.origin,
  cacheLocation: 'localstorage',
  audience: AUTH_CONFIG.audience,
  responseType: 'token id_token',
  scope: 'openid profile',
}

const onAuthRedirectCallback = (redirectResult?: RedirectLoginResult) => {
  console.log('auth0 onRedirectCallback called with redirectState %o', redirectResult)

  // Clears auth0 query string parameters from url
  const targetUrl =
    redirectResult && redirectResult.appState && redirectResult.appState.targetUrl
      ? redirectResult.appState.targetUrl
      : window.location.pathname

  window.history.replaceState({}, document.title, targetUrl)
}

export const Auth0Provider = ({ children, onRedirectCallback = onAuthRedirectCallback }: Auth0ProviderOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [user, setUser] = useState<Auth0User>()
  const [auth0Client, setAuth0Client] = useState<Auth0Client>()

  const getEnrichedUser = async (client: Auth0Client) => {
    const userProfile = await client.getUser()
    const token = await client.getTokenSilently()
    const decodedToken: AccessToken | undefined = token && JwtDecode(token)
    return decodedToken ? { ...userProfile, ...decodedToken[AUTH_CONFIG.audience] } : userProfile
  }

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(auth0ClientConfig)
      setAuth0Client(auth0FromHook)

      if (window.location.search.includes('code=')) {
        let appState: RedirectLoginResult = {}
        try {
          ;({ appState } = await auth0FromHook.handleRedirectCallback())
        } finally {
          onRedirectCallback(appState)
        }
      }

      const authed = await auth0FromHook.isAuthenticated()

      if (authed) {
        const userProfile = await getEnrichedUser(auth0FromHook)
        setUser(userProfile)
        setIsAuthenticated(true)
      }

      setIsInitializing(false)
    }

    initAuth0()
  }, [onRedirectCallback])

  const loginWithPopup = useCallback(
    async (options?: PopupLoginOptions) => {
      setIsPopupOpen(true)

      try {
        await auth0Client!.loginWithPopup(options)
      } catch (error) {
        console.error(error)
      } finally {
        setIsPopupOpen(false)
      }

      const userProfile = await getEnrichedUser(auth0Client!)
      setUser(userProfile)
      setIsAuthenticated(true)
    },
    [auth0Client]
  )

  const handleRedirectCallback = useCallback(async () => {
    setIsInitializing(true)

    const result = await auth0Client!.handleRedirectCallback()
    const userProfile = await getEnrichedUser(auth0Client!)
    setIsInitializing(false)
    setUser(userProfile)
    setIsAuthenticated(true)

    return result
  }, [auth0Client])

  const logout = useCallback(
    (options?: LogoutOptions) =>
      auth0Client!.logout({
        returnTo: window.location.origin,
        client_id: AUTH_CONFIG.clientId,
        ...options,
      }),
    [auth0Client]
  )

  const hasPermissions = useCallback(
    (permission: Perms, data?: any) => !!user && checkMany(rules, user.roles, permission, data),
    [user]
  )

  const loginWithRedirect = (options?: RedirectLoginOptions) => auth0Client!.loginWithRedirect(options)

  const getTokenSilently = (options?: GetTokenSilentlyOptions) => auth0Client!.getTokenSilently(options)

  const getIdTokenClaims = (options?: getIdTokenClaimsOptions) => auth0Client!.getIdTokenClaims(options)

  const getTokenWithPopup = (options?: GetTokenWithPopupOptions) => auth0Client!.getTokenWithPopup(options)

  return (
    <Auth0Context.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        isPopupOpen,
        loginWithPopup,
        loginWithRedirect,
        logout,
        getTokenSilently,
        handleRedirectCallback,
        getIdTokenClaims,
        getTokenWithPopup,
        hasPermissions,
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}

export const Auth0Consumer = Auth0Context.Consumer
