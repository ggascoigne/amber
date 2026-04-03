import { useEffect, useState } from 'react'
import * as React from 'react'

import { theme, createEmotionCache } from '@amber/ui'
import type { EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import debug from 'debug'
import type { AppProps } from 'next/app'

import Layout from '@/Components/Layout'
import '@/index.css'

const log = debug('app')
const queryClient = new QueryClient()
const clientSideEmotionCache = createEmotionCache()

type MyAppProps = AppProps & {
  emotionCache?: EmotionCache
  configData?: any
}

const App = (props: MyAppProps) => {
  const { Component, pageProps } = props
  const emotionCache = React.useMemo(() => props.emotionCache ?? clientSideEmotionCache, [props.emotionCache])
  const [isMswReady, setIsMswReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const initMSW = async () => {
      const { worker } = await import('@/mocks/browser')
      log('environment', process.env)
      const serviceWorkerUrl = '/mockServiceWorker.js'
      log('serviceWorkerUrl', serviceWorkerUrl)

      await worker.start({
        serviceWorker: {
          url: serviceWorkerUrl,
        },
        onUnhandledRequest: 'bypass',
      })

      if (isMounted) {
        setIsMswReady(true)
      }
      log('MSW initialized successfully')
    }

    initMSW().catch((error) => {
      console.error('Failed to initialize MSW:', error)
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AppCacheProvider emotionCache={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          {isMswReady ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) : null}
        </QueryClientProvider>
      </ThemeProvider>
    </AppCacheProvider>
  )
}

export default App
