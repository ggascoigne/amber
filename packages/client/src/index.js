import ApolloClient from 'apollo-boost'
import 'assets/scss/material-kit-react.css?v=1.3.0'
import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import Auth from './components/Auth/Auth'
import store, { history } from './state/store'
import registerServiceWorker from './utils/registerServiceWorker'

const client = new ApolloClient()
const rootElement = document.getElementById('root')

const render = Component => {
  return ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Auth>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </Auth>
      </ApolloProvider>
    </Provider>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp, rootElement)
  })
}

registerServiceWorker()
