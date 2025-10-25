import * as React from 'react'
import { useMemo } from 'react'

import { useTRPC } from '@amber/client'
import { createEmotionCache, NotificationProvider, theme } from '@amber/ui'
import { Auth0Provider } from '@auth0/nextjs-auth0'
import type { EmotionCache } from '@emotion/react'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
// see https://github.com/mui/mui-x/issues/12640
// oxlint-disable-next-line no-duplicates
import type {} from '@mui/x-date-pickers/AdapterLuxon'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { RouteGuard } from './Auth'
import { Layout } from './Layout'
import type { RootRoutes } from './Navigation'
import { TRPCReactProvider } from './TRPCReactProvider'

import type { Configuration } from '../utils'
import { ConfigProvider, getSettingsObject, useConfiguration, useInitializeStripe } from '../utils'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const ReactQueryDevtoolsProduction = React.lazy(() =>
  // older envs might need to import from '@tanstack/react-query-devtools/build/modern/production.js'
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
)
interface RootComponentProps extends AppProps {
  emotionCache?: EmotionCache
  rootRoutes: (configuration: Configuration) => RootRoutes
  title: string
  banner: React.ReactNode
}

const RootInner = (props: RootComponentProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, rootRoutes, banner, title } = props
  const { user } = pageProps
  const configuration = useConfiguration()
  const routes = useMemo(() => rootRoutes(configuration), [configuration, rootRoutes])
  useInitializeStripe()
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{title}</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <NotificationProvider>
            <Auth0Provider user={user}>
              <Layout rootRoutes={routes} title={title} banner={banner}>
                <RouteGuard routes={routes}>
                  <Component {...pageProps} />
                </RouteGuard>
                <ReactQueryDevtools buttonPosition='bottom-left' />
                {showDevtools && (
                  <React.Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction buttonPosition='bottom-left' />
                  </React.Suspense>
                )}
              </Layout>
            </Auth0Provider>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
const ConfigLoader = (props: RootComponentProps) => {
  const trpc = useTRPC()
  const { data: configData } = useQuery(trpc.settings.getSettings.queryOptions())
  const { config } = getSettingsObject(configData)
  return config ? (
    <ConfigProvider value={config}>
      <RootInner {...props} />
    </ConfigProvider>
  ) : null
}

export default function RootComponent(props: RootComponentProps) {
  return (
    <TRPCReactProvider pageProps={props.pageProps}>
      <JotaiProvider>
        <ConfigLoader {...props} />
      </JotaiProvider>
    </TRPCReactProvider>
  )
}
