import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ThemeProvider } from '@mui/material/styles'
import { AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Provider as JotaiProvider } from 'jotai'
import { createEmotionCache, NotificationProvider, theme } from 'ui'
import { Layout } from 'amber/components/Layout'
import { CustomLuxonUtils } from 'amber/utils/luxonUtils'
import { rootRoutes } from '../views/Routes'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

const queryClient = new QueryClient()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const { user } = pageProps
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <>
      <JotaiProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>AmberCon Northwest</title>
            <meta
              name='viewport'
              content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <LocalizationProvider dateAdapter={CustomLuxonUtils}>
              <NotificationProvider>
                <UserProvider user={user}>
                  <QueryClientProvider client={queryClient}>
                    <Layout rootRoutes={rootRoutes} title='AmberCon Northwest'>
                      <Component {...pageProps} />
                      <ReactQueryDevtools />
                      {showDevtools ? (
                        <React.Suspense fallback={null}>
                          <ReactQueryDevtoolsProduction />
                        </React.Suspense>
                      ) : null}
                    </Layout>
                  </QueryClientProvider>
                </UserProvider>
              </NotificationProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
      </JotaiProvider>
    </>
  )
}
