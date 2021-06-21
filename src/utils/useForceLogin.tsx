import { RedirectLoginOptions } from '@auth0/auth0-spa-js'
import { useAuth } from 'components/Auth'
import { useCallback } from 'react'

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
