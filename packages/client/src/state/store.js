import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable'
import thunkMiddleware from 'redux-thunk'
import { isDev } from '../utils/globals'
import rootEpic from './epic'
import rootReducer from './reducer'

const epicMiddleware = createEpicMiddleware()
const loggerMiddleware = createLogger({ collapsed: true })

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

const middleware = [
  thunkMiddleware, // permit dispatched actions to be functions, returning action POJOs later
  epicMiddleware,
  routerMiddleware(history)
]

if (isDev) {
  // The logger is noisy and mainly just useful for developers
  middleware.push(loggerMiddleware)
  // Throw errors if any state modifications show up in render or dispatch methods
  middleware.push(require('redux-immutable-state-invariant').default())
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))

if (module.hot) {
  module.hot.accept('./epic', () => epicMiddleware.replaceEpic(require('./epic').default))
}

epicMiddleware.run(rootEpic)

export default store
