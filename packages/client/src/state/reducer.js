import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

const reducers = combineReducers({
  form,
  router
})

export default reducers
