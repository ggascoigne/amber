///<reference types="webpack-env" />
import 'assets/scss/material-kit-react.css?v=1.3.0'
import 'react-app-polyfill/ie11'

import { ApolloProvider } from '@apollo/react-hooks'
import client from 'client/client'
import { Auth } from 'components/Acnw/Auth'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import registerServiceWorker from './utils/registerServiceWorker'

const rootElement = document.getElementById('root')

const render = (Component: React.ComponentType) =>
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Auth>
          <Component />
        </Auth>
      </ApolloProvider>
    </BrowserRouter>,
    rootElement
  )

render(App)

if ((module as NodeModule).hot) {
  ;(module as NodeModule).hot!.accept('./App', () => render(require('./App').default))
}

registerServiceWorker()
