import 'assets/scss/material-kit-react.css?v=1.3.0'
import 'react-app-polyfill/ie11'

import client from 'client/client'
import { Auth } from 'components/Acnw/Auth'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import registerServiceWorker from './utils/registerServiceWorker'

const rootElement = document.getElementById('root')

const render = (Component: React.ComponentType) => {
  return ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Auth>
            <Component />
          </Auth>
        </ApolloHooksProvider>
      </ApolloProvider>
    </BrowserRouter>,
    rootElement
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => render(require('./App').default))
}

registerServiceWorker()
