import { useEffect } from 'react'

import { theme } from '@amber/ui'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import debug from 'debug'
import type { AppProps } from 'next/app'

import Layout from '@/Components/Layout'
import '@/index.css'

const log = debug('app')
const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition='bottom-left' />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
