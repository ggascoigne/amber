import React from 'react'
import ReactDOM from 'react-dom'
import wrapInApollo from 'utils/wrapInApollo'
import wrapInRouter from 'utils/wrapInRouter'

import { App } from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(wrapInApollo(wrapInRouter(<App />)), div)
  ReactDOM.unmountComponentAtNode(div)
})
