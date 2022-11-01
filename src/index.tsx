import 'react-app-polyfill/ie11'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Provider as JotaiProvider } from 'jotai'
import React, { PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { Auth0Provider } from './components/Auth'
import { NotificationProvider } from './components/Notifications'
import { theme } from './components/Theme'
// import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { CustomLuxonUtils } from './utils/luxonUtils'

// Usage
// window.toggleDevtools(true)
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

// import { useAxe } from './utils/useAxe'

// import registerServiceWorker from './utils/registerServiceWorker'

const queryClient = new QueryClient()

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
})

const rootElement = document.getElementById('root')

const RootComponent: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  // useAxe()
  return (
    <HelmetProvider>
      <JotaiProvider>
        <BrowserRouter>
          <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LocalizationProvider dateAdapter={CustomLuxonUtils}>
                <NotificationProvider>
                  <Auth0Provider>
                    <QueryClientProvider client={queryClient}>
                      <Helmet defaultTitle='AmberCon Northwest' titleTemplate='AmberCon Northwest - %s'>
                        <html lang='en' />
                      </Helmet>
                      {children}
                      <ReactQueryDevtools />
                      {showDevtools ? (
                        <React.Suspense fallback={null}>
                          <ReactQueryDevtoolsProduction />
                        </React.Suspense>
                      ) : null}
                    </QueryClientProvider>
                  </Auth0Provider>
                </NotificationProvider>
              </LocalizationProvider>
            </ThemeProvider>
          </CacheProvider>
        </BrowserRouter>
      </JotaiProvider>
    </HelmetProvider>
  )
}

const root = createRoot(rootElement!)

root.render(
  <RootComponent>
    <App />
  </RootComponent>
)

// registerServiceWorker()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
