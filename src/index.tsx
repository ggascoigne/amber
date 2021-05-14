///<reference types="webpack-env" />
import 'assets/css/material-kit-react.css'
import 'react-app-polyfill/ie11'

import { Auth0Provider, NotificationProvider } from 'components/Acnw'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'

// import { useAxe } from './utils/useAxe'

// import registerServiceWorker from './utils/registerServiceWorker'

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     exclude: [/VerifiedUserIcon/]
//   })
// }

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')

// eslint-disable-next-line arrow-body-style
const RootComponent: React.FC = ({ children }) => {
  // useAxe()
  return (
    <HelmetProvider>
      <JotaiProvider>
        <BrowserRouter>
          <NotificationProvider>
            <Auth0Provider>
              <QueryClientProvider client={queryClient}>
                <Helmet defaultTitle='AmberCon Northwest' titleTemplate='AmberCon Northwest - %s'>
                  <html lang='en' />
                </Helmet>
                {children}
              </QueryClientProvider>
            </Auth0Provider>
          </NotificationProvider>
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
