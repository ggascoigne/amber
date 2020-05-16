///<reference types="webpack-env" />
import 'assets/scss/material-kit-react.scss?v=1.8.0'
import 'react-app-polyfill/ie11'

import { ApolloProvider } from '@apollo/react-hooks'
import client from 'client/client'
import { Auth0Consumer, Auth0Provider } from 'components/Acnw'
import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import registerServiceWorker from './utils/registerServiceWorker'

// if (process.env.NODE_ENV === 'development') {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   })
// }

const rootElement = document.getElementById('root')

const RootComponent = () => (
  <BrowserRouter>
    <Auth0Provider>
      <Auth0Consumer>
        {(authProps) => (
          <ApolloProvider client={client(authProps)}>
            <App />
          </ApolloProvider>
        )}
      </Auth0Consumer>
    </Auth0Provider>
  </BrowserRouter>
)

const WrappedRootComponents = process.env.NODE_ENV === 'development' ? hot(RootComponent) : RootComponent

ReactDOM.render(<WrappedRootComponents />, rootElement)

registerServiceWorker()
