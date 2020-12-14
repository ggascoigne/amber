///<reference types="webpack-env" />
import 'assets/css/material-kit-react.css'
import 'react-app-polyfill/ie11'

import { ApolloProvider } from '@apollo/client'
import client from 'client/client'
import { Auth0Provider, NotificationProvider } from 'components/Acnw'
import { useAuth } from 'components/Acnw/Auth/Auth0'
import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'

// import registerServiceWorker from './utils/registerServiceWorker'

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     exclude: [/VerifiedUserIcon/]
//   })
// }

const rootElement = document.getElementById('root')

const ApolloWrapper: React.FC = ({ children }) => {
  const authProps = useAuth()
  // console.log(`ApolloWrapper = ${JSON.stringify({isAuthenticated: authProps.isAuthenticated, user: authProps.user}, null, 2)}`)
  return <ApolloProvider client={client(authProps)}>{children}</ApolloProvider>
}
const RootComponent: React.FC = ({ children }) => (
  <JotaiProvider>
    <BrowserRouter>
      <NotificationProvider>
        <Auth0Provider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </Auth0Provider>
      </NotificationProvider>
    </BrowserRouter>
  </JotaiProvider>
)

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
