import * as React from 'react'
import { useMemo } from 'react'

import { UserProvider } from '@auth0/nextjs-auth0/client'
import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
// see https://github.com/mui/mui-x/issues/12640
import type {} from '@mui/x-date-pickers/AdapterLuxon'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { createEmotionCache, NotificationProvider, theme } from 'ui'

import { RouteGuard } from './Auth'
import { Layout } from './Layout'
import { RootRoutes } from './Navigation'

import { ConfigProvider, Configuration, getSettingsObject, useConfiguration, useInitializeStripe } from '../utils'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface RootComponentProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
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
            <UserProvider user={user}>
              <Layout rootRoutes={routes} title={title} banner={banner}>
                <RouteGuard routes={routes}>
                  <Component {...pageProps} />
                </RouteGuard>
                <ReactQueryDevtools buttonPosition='bottom-left' />
              </Layout>
            </UserProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default function RootComponent(props: RootComponentProps) {
  const {
    pageProps: { dehydratedState, configData },
  } = props

  const [queryClient] = React.useState(() => new QueryClient())
  const { config } = getSettingsObject(configData)

  return config ? (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <ConfigProvider value={config}>
          <JotaiProvider>
            <RootInner {...props} />
          </JotaiProvider>
        </ConfigProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  ) : null
}
