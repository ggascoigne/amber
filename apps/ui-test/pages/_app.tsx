import { useEffect } from 'react'
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

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
}

const App = (props: MyAppProps) => {
  const { Component, pageProps } = props
  const emotionCache = React.useMemo(() => props.emotionCache ?? clientSideEmotionCache, [props.emotionCache])

  useEffect(() => {
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

      log('MSW initialized successfully')
    }

    initMSW().catch((error) => {
      console.error('Failed to initialize MSW:', error)
    })
  }, [])

  return (
    <AppCacheProvider emotionCache={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </AppCacheProvider>
  )
}

export default App
