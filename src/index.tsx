///<reference types="webpack-env" />
import 'assets/scss/material-kit-react.scss?v=1.8.0'
import 'react-app-polyfill/ie11'

import { ApolloProvider } from '@apollo/client'
import client from 'client/client'
import { Auth0Provider } from 'components/Acnw'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { useAuth } from './components/Acnw/Auth/Auth0'
import { NotificationProvider } from './components/Acnw/Notifications'
import registerServiceWorker from './utils/registerServiceWorker'

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   })
// }

const rootElement = document.getElementById('root')

const ApolloWrapper: React.FC = ({ children }) => {
  const authProps = useAuth()
  // console.log(`ApolloWrapper = ${JSON.stringify({isAuthenticated: authProps.isAuthenticated, user: authProps.user}, null, 2)}`)
  return <ApolloProvider client={client(authProps)}>{children}</ApolloProvider>
}
const RootComponent: React.FC = ({ children }) => (
  <BrowserRouter>
    <NotificationProvider>
      <Auth0Provider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </Auth0Provider>
    </NotificationProvider>
  </BrowserRouter>
)

const render = (Component: React.ComponentType) =>
  ReactDOM.render(
    <RootComponent>
      <Component />
    </RootComponent>,
    rootElement
  )

render(App)

if ((module as NodeModule).hot) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ;(module as NodeModule).hot!.accept('./App', () => render(require('./App').default))
}

registerServiceWorker()
