import 'react-app-polyfill/ie11'

///<reference types="webpack-env" />
import './wdyr' // <--- first import

import LuxonUtils from '@date-io/luxon'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { Auth0Provider } from './components/Auth'
import { NotificationProvider } from './components/Notifications'

// Usage
// window.toggleDevtools(true)

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('react-query/devtools/development').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

// import { useAxe } from './utils/useAxe'

// import registerServiceWorker from './utils/registerServiceWorker'

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')

const RootComponent: React.FC = ({ children }) => {
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
          <MuiPickersUtilsProvider utils={LuxonUtils}>
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
          </MuiPickersUtilsProvider>
        </BrowserRouter>
      </JotaiProvider>
    </HelmetProvider>
  )
}

const render = (Component: React.ComponentType) =>
  ReactDOM.render(
    <RootComponent>
      <Component />
    </RootComponent>,
    rootElement
  )

render(App)

// registerServiceWorker()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)
