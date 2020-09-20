import { RedirectLoginOptions } from '@auth0/auth0-spa-js'
import { useCallback } from 'react'

import { useAuth } from '../components/Acnw/Auth/Auth0'

export const useForceLogin = () => {
  const { loginWithRedirect, isAuthenticated, isInitializing } = useAuth()

  return useCallback(
    async (options?: RedirectLoginOptions) => {
      if (!isInitializing && !isAuthenticated) {
        loginWithRedirect && (await loginWithRedirect(options))
      }
    },
    [isAuthenticated, isInitializing, loginWithRedirect]
  )
}
