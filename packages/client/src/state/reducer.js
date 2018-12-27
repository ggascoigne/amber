import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

const reducers = history =>
  combineReducers({
    form,
    router: connectRouter(history)
  })

export default reducers
