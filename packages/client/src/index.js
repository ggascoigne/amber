import React from 'react'
import 'react-app-polyfill/ie11'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import App from './App'
import Auth from './components/Auth/Auth'
import store, { history } from './state/store'
import registerServiceWorker from './utils/registerServiceWorker'

const rootElement = document.getElementById('root')

const render = Component => {
  return ReactDOM.render(
    <Provider store={store}>
      <Auth>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Auth>
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
