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
import type { History } from 'history'
import JwtDecode from 'jwt-decode'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ThenArg, isDev, useLocalStorage } from 'utils'

import { useNotification } from '../Notifications'
import { checkMany } from './authUtils'
import rules, { Perms } from './PermissionRules'
import { useAuthOverride } from './useAuthOverride'

const AUTH_CONFIG = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN ?? '',
  audience: 'https://amberconnw.org',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID ?? '',
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
  sub: string
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
  onRedirectCallback?: (history: History<any>, result?: RedirectLoginResult) => void
}

const auth0ClientConfig: Auth0ClientOptions = {
  domain: AUTH_CONFIG.domain,
  client_id: AUTH_CONFIG.clientId,
  redirect_uri: window.location.origin,
  cacheLocation: 'localstorage',
  audience: AUTH_CONFIG.audience,
  responseType: 'token id_token',
  scope: 'openid profile email',
}

const onAuthRedirectCallback = (history: History<any>, redirectResult?: RedirectLoginResult) => {
  // Clears auth0 query string parameters from url
  const targetUrl =
    redirectResult && redirectResult.appState && redirectResult.appState.targetUrl
      ? redirectResult.appState.targetUrl
      : window.location.pathname

  window.history.replaceState({}, document.title, targetUrl)
  history.replace(targetUrl)
}

export const Auth0Provider = ({ children, onRedirectCallback = onAuthRedirectCallback }: Auth0ProviderOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [user, setUser] = useState<Auth0User>()
  const [auth0Client, setAuth0Client] = useState<Auth0Client>()
  const [notify] = useNotification()
  const [showVerifyEmailMessage, setShowVerifyEmailMessage] = useLocalStorage<boolean>('showVerifyEmailMessage', false)
  const roleOverride: string | undefined = useAuthOverride((state) => state.roleOverride)
  const history = useHistory()

  const getEnrichedUser = async (client: Auth0Client) => {
    const userProfile = await client.getUser()
    const token = await client.getTokenSilently()
    const decodedToken: AccessToken | undefined = token && JwtDecode(token)
    return decodedToken ? { ...userProfile, ...decodedToken[AUTH_CONFIG.audience] } : userProfile
  }

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const auth0FromHook = await createAuth0Client(auth0ClientConfig)
        setAuth0Client(auth0FromHook)

        if (window.location.search.includes('code=')) {
          let redirectResult: RedirectLoginResult = {}
          try {
            redirectResult = await auth0FromHook.handleRedirectCallback()
          } finally {
            // @ts-ignore
            onRedirectCallback(history, redirectResult)
          }
        }

        const authed = await auth0FromHook.isAuthenticated()

        if (authed) {
          const userProfile = await getEnrichedUser(auth0FromHook)
          setUser(userProfile)
          setIsAuthenticated(true)
        }

        setIsInitializing(false)
      } catch (error) {
        if (isDev) {
          // note that the only way I've every reached this point is when trying to look at
          // my dev server on my local network. It barfs because it's not https.
          console.log(error)
        } else {
          throw error
        }
      }
    }

    initAuth0().then()
  }, [history, onRedirectCallback])

  const loginWithPopup = useCallback(
    async (options?: PopupLoginOptions) => {
      setIsPopupOpen(true)

      try {
        await auth0Client!.loginWithPopup(options, { timeoutInSeconds: 300 })
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

  useEffect(() => {
    if (user && !user.email_verified) {
      console.log('email not verified so logging out')
      setShowVerifyEmailMessage(true)
      logout()
    }
  }, [logout, setShowVerifyEmailMessage, user])

  useEffect(() => {
    if (!user && showVerifyEmailMessage) {
      notify({
        text: 'Please verify your email and try to login again',
        variant: 'success',
      })
      setShowVerifyEmailMessage(false)
    }
  }, [user, notify, setShowVerifyEmailMessage, showVerifyEmailMessage])

  const hasPermissions = useCallback(
    (permission: Perms, data?: any) => !!user && checkMany(rules, user.roles, permission, roleOverride, data),
    [roleOverride, user]
  )

  const loginWithRedirect = useCallback((options?: RedirectLoginOptions) => auth0Client!.loginWithRedirect(options), [
    auth0Client,
  ])

  const getTokenSilently = useCallback((options?: GetTokenSilentlyOptions) => auth0Client!.getTokenSilently(options), [
    auth0Client,
  ])

  const getIdTokenClaims = useCallback((options?: getIdTokenClaimsOptions) => auth0Client!.getIdTokenClaims(options), [
    auth0Client,
  ])

  const getTokenWithPopup = useCallback(
    (options?: GetTokenWithPopupOptions) => auth0Client!.getTokenWithPopup(options),
    [auth0Client]
  )

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

export const useToken = () => {
  const { isAuthenticated, getTokenSilently } = useAuth()
  const [jwtToken, setJwtToken] = useState<string | undefined>()

  useEffect(() => {
    isAuthenticated && getTokenSilently && getTokenSilently().then((t) => setJwtToken(t))
  }, [getTokenSilently, isAuthenticated])

  return [jwtToken]
}
