///<reference types="webpack-env" />
import 'assets/scss/material-kit-react.css?v=1.3.0'
import 'react-app-polyfill/ie11'

import { ApolloProvider } from '@apollo/react-hooks'
import client from 'client/client'
import { Auth0Provider } from 'components/Acnw'
import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import registerServiceWorker from './utils/registerServiceWorker'

const rootElement = document.getElementById('root')

const RootComponent = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <Auth0Provider>
        <App />
      </Auth0Provider>
    </ApolloProvider>
  </BrowserRouter>
)

const WrappedRootComponents = process.env.NODE_ENV === 'development' ? hot(RootComponent) : RootComponent

ReactDOM.render(<WrappedRootComponents />, rootElement)

registerServiceWorker()
